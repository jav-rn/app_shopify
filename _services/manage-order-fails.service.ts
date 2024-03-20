import { collection, getDocs } from 'firebase/firestore/lite'
import { getDatabase, ref, set } from "firebase/database";

import db from '../app/utils/firebase.server'

export async function storeOrders (order) {
    // Store a order in case of fail in Stockago submission
    const db = getDatabase()
    set(ref(db, 'orders'), {
        content: JSON.stringify(order),
        last_tried: new Date(),
        uploaded_at: new Date()
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