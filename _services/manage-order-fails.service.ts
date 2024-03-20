import { collection, getDocs } from 'firebase/firestore/lite'
import { doc, setDoc } from 'firebase/firestore'
import { getDatabase, ref, set } from "firebase/database";

import db from '../app/utils/firebase.server'

export async function storeOrders (order) {
    // Store a order in case of fail in Stockago submission
    const orderRef = doc(db, 'orders', order['webhook_origin_payload']['id'] + '');

    return await setDoc(orderRef, {
        content: JSON.stringify(order),
        last_tried: new Date(),
        uploaded_at: new Date(),
        //status: 1, // [1 => pendiente por reintento, 2 => excedió límite de intentos]
        //retries: 0,
    })
}

export async function getAllOrders () {
    // Recover the orders stored
    const ordersCol = collection(db, 'orders');
    const dataSnapShot = await getDocs(ordersCol);
    const orderList = dataSnapShot.docs.map(doc => doc.data())
    return orderList
}

export async function trySentOrdersAgain () {
    // Try to resend the fail orders
}