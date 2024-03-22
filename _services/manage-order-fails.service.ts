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
    DocumentSnapshot,
} from 'firebase/firestore'

import { update } from 'firebase/database'

import db from '../app/utils/firebase.server'
import { _DropiServices, ShopifyOrderPayload } from './dropi.services';

interface OrderStored {
    content: string,
    last_tried: Date,
    uploaded_at: Date,
    retries_count: number,
    retry: boolean,
    status?: 'success' | 'failed'
}

/**
 * The max number of times that the application will try to sync the order
 */
const MAX_NUMBER_ATTEMPS = 10;

/**
 * Store a order in case of fail in Stockago submission
 */
export async function storeFailSyncOrders (shopifyOrder: ShopifyOrderPayload): Promise<boolean> {
    try {
        const orderRef = doc(db, 'orders', shopifyOrder.webhook_origin_payload.id + '');

        const orderData: OrderStored = {
            content: JSON.stringify(shopifyOrder),
            last_tried: new Date(),
            uploaded_at: new Date(),
            retries_count: 0,
            retry: true,
            status: 'failed'
        }

        await setDoc(orderRef, orderData)
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
export async function getAllPendingOrders (): Promise<OrderStored[]> {
    try {
        const ordersQuery = query(
            collection(db, 'orders'),
            where('retry', '==', true),
            orderBy('retries_count', 'desc'),
            limit(10)
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
export async function retrySentOrders (orders: OrderStored[]) {
    const ordersProcessed = new Array<OrderStored>

    try {
        const dropiService = new _DropiServices()
        const ordersForSend = await getAllPendingOrders();

        ordersForSend.forEach(order => {
            let orderStored = false;

            const shopifyOrder: ShopifyOrderPayload = JSON.parse(order.content)

            dropiService.postOrderToStockago(
                dropiService.getOrderDTO(shopifyOrder)
            )
            .then((response) => {
                if (response) {
                    orderStored = true
                }
            })

            order.status = orderStored? 'success' : 'failed'

            ordersProcessed.push(order)

        })

    } catch (error) {
        console.log('There was an error when resyncing the orders: ', error)
    }

    /*
    Given the case in which, for any reason, the process failed and part of the orders
    could not be reached, these orders should not be modified in storage, since they weren't even
    attemped to send. That orders will not in orderProcessed
    */
    updateOrdersFailed(ordersProcessed.filter(order => order.status == 'failed'))
    deleteOrdersSuccess(ordersProcessed.filter(order => order.status == 'success'))
}

/**
 * Update the failed orders
 */
async function updateOrdersFailed(orders: OrderStored[]) {
    try {
        orders.forEach(order => {
            order.last_tried = new Date()
            order.retries_count++
            order.retry = order.retries_count > MAX_NUMBER_ATTEMPS?? false
            // TODO

        })


    } catch (error) {
        console.log('There was an error updating the orders:', error)
    }
}

/**
 * Delete the orders that were sync to Stockago successfully
 */
async function deleteOrdersSuccess(orders: OrderStored[]) {
    try {
        orders.forEach(async (order) => {
            // TODO
        });
    } catch (error) {
        console.log('There was an error deleting the orders:', error);
    }
}