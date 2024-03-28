import {
    collection,
    doc,
    getDocs,
    limit,
    orderBy,
    query,
    setDoc,
    where,
    FirestoreError,
    deleteDoc,
} from 'firebase/firestore'
import type { DocumentSnapshot } from 'firebase/firestore'

import db from './firebaseInitializer.service'
import { getOrderDTO, loginStockago, postOrderToStockago } from './stockago.service'
import { getTimeInmilliseconds } from '../_helpers/timeUtils';
import type { OrderStored, ShopifyOrderPayload } from '../_interfaces/orders'
import type { TimeInterval } from '../_interfaces/time'

export default class StoreFailOrdersService {
    /*
    The max number of times that the application will try to sync the order
    */
    private MAX_NUMBER_ATTEMPS: number;
    private MAX_TIME_OUT: number;
    private NUM_ORDERS_PER_RETRY = 10
    
    private intervalId: NodeJS.Timeout | null = null;
    private db = db;

    constructor (maxNumberAttemps?: number, maxTimeOut?: number) {
        this.MAX_NUMBER_ATTEMPS = maxNumberAttemps ?? 25
        this.MAX_TIME_OUT = maxTimeOut ?? 3000

        this.storeFailSyncOrder = this.storeFailSyncOrder.bind(this)
        this.activateFetchOrdersTask = this.activateFetchOrdersTask.bind(this)
        this.deactivateFetchOrdersTask = this.deactivateFetchOrdersTask.bind(this)
        this.deleteOrdersSuccess = this.deleteOrdersSuccess.bind(this)
        this.getAllPendingOrders = this.getAllPendingOrders.bind(this)
        this.retrySentOrders = this.retrySentOrders.bind(this)
        this.scheduleFetchOrders = this.scheduleFetchOrders.bind(this)
        this.updateOrdersFailed = this.updateOrdersFailed.bind(this)
    }

    /**
     * Store a order in case of fail in Stockago submission
     */
    async storeFailSyncOrder (shopifyOrder: ShopifyOrderPayload, errorMsg: string = ''): Promise<boolean> {
        try {
            const shopifyOrderId = shopifyOrder.webhook_origin_payload.id
            const orderRef = doc(this.db, 'orders', shopifyOrderId + '')
    
            const orderData: OrderStored = {
                id: shopifyOrderId.toString(),
                content: JSON.stringify(shopifyOrder),
                last_tried: new Date(),
                uploaded_at: new Date(),
                retries_count: 0,
                retry: true,
                status: 'failed',
                error_msg: errorMsg
            }
    
            await Promise.race([
                setDoc(orderRef, orderData),
                new Promise((resolve) => setTimeout(resolve, this.MAX_TIME_OUT))
            ]);

            return true
        } catch (error) {
            if (error instanceof FirestoreError) {
                console.error('Error while saving the order in Firestore:', error)
            } else {
                console.log('Unknown error while saving the order:', error)
            }
            return false
        }
    }
    
    /**
     * Retrieve all pending orders for process by prioritizing the older orders
     * The less retries_count attribute be, the less the priority
     */
    private async getAllPendingOrders (): Promise<OrderStored[]> {
        try {
            const ordersQuery = query(
                collection(this.db, 'orders'),
                where('retry', '==', true),
                orderBy('retries_count', 'desc'),
                limit(this.NUM_ORDERS_PER_RETRY)
            );
            const querySnapshot = await getDocs(ordersQuery);
            
            const orderList: OrderStored[] = querySnapshot.docs.map((doc: DocumentSnapshot) => doc.data() as OrderStored);
    
            return orderList;
        } catch (error) {
            console.error('Error when retrieving pending orders:', error);
            throw error;
        }
    }

    /**
     * Try to sync the orders with Stockago again
     */
    private async retrySentOrders () {
        const ordersProcessed = new Array<OrderStored>
    
        try {
            const ordersForSend = await this.getAllPendingOrders();

            if (ordersForSend.length === 0) {
                /*
                We deactivate the cheduled task here because of performance. When there is no more failed orders for retry,
                it's not necessary to keep looking for it, until the task be activated again
                */
                this.deactivateFetchOrdersTask()
                return
            }

            const stockagoCredentials = await loginStockago()
            if (!stockagoCredentials) return
    
            for (const order of ordersForSend) {
    
                const shopifyOrder: ShopifyOrderPayload = JSON.parse(order.content)
    
                const orderDTO = getOrderDTO(shopifyOrder)
                order.status = 'failed'
    
                if (orderDTO) {
                    const response = await postOrderToStockago(orderDTO, stockagoCredentials)
                    if (response) {
                        order.error_msg = response.msg
                        order.status = response.status? 'success' : 'failed'
                    }
                    ordersProcessed.push(order)
                }
            }
    
        } catch (error) {
            console.log('There was an error when resyncing the orders: ', error)
        }
    
        /*
        Given the case in which, for any reason, the process failed and part of the orders
        could not be reached, these orders should not be modified in storage, since they weren't even
        attemped to send. That orders will not in orderProcessed
        */
        this.updateOrdersFailed(ordersProcessed.filter(order => order.status == 'failed'))
        this.deleteOrdersSuccess(ordersProcessed.filter(order => order.status == 'success'))
    }

    /**
     * Update the failed orders
     */
    private async updateOrdersFailed(orders: OrderStored[]) {
        orders.forEach(order => {
            order.last_tried = new Date()
            order.retries_count++
            order.retry = order.retries_count > this.MAX_NUMBER_ATTEMPS? false : true;
    
            if (!order.id) return
            
            try {
                const orderRef = doc(this.db, 'orders', order.id)
    
                setDoc(orderRef, order).then(() => {
                    console.log('Order with ID', order.id, 'updated successfully in firebase.');
                })
            } catch (error) {
                console.log('There was an error updating the order with id:', order.id)
            }
        })
    }

    /**
     * Delete the orders that were sync to Stockago successfully
     */
    private async deleteOrdersSuccess(orders: OrderStored[]) {
        for (const order of orders) {
            if (!order.id) return
    
            try {
                const orderRef = doc(this.db, 'orders', order.id)
    
                await deleteDoc(orderRef)
                console.log('Order with ID', order.id, 'updated deleted from firebase.')
            } catch (error) {
                console.log('There was an error deleting the orders:', error);
            }
        }
    }

    /**
     * Allows  retry to send the orders to Stockago every so often
     * @returns {Promise<NodeJS.Timeout>} - SetInterval ID
     */
    private async scheduleFetchOrders (timeAmount: number, timeUnit: TimeInterval): Promise<NodeJS.Timeout> {
        if (!Number.isInteger(timeAmount)) {
            timeAmount = Math.round(timeAmount);
        }
    
        const timeInMilliseconds = getTimeInmilliseconds(timeAmount, timeUnit)
        console.log(timeInMilliseconds)
    
        return setInterval(this.retrySentOrders, timeInMilliseconds);
    }

    /**
     * @param {number} timeAmount - Time number for execute the orders fetching from storage to Stockago
     * @param {TimeInterval} [timeUnit='h'] - Unit of time for using with timeAmount. Can be 's', 'mi', 'h', 'd', 'w' or 'm'
     */
    async activateFetchOrdersTask(timeAmount: number, timeUnit: TimeInterval = 'h'): Promise<void> {
        if (this.intervalId !== null) {
            console.warn('Task is already active');
            return;
        }
    
        this.intervalId = await this.scheduleFetchOrders(timeAmount, timeUnit);
        console.assert('Task scheduled')
    }

    /**
     * Stop the scheduled task for orders fetching
     */
    deactivateFetchOrdersTask(): void {
        if (this.intervalId === null) {
            console.warn('Task is already active');
            return;
        }
    
        clearInterval(this.intervalId);
        this.intervalId = null;
        console.assert('Task deactivated');
    }

}