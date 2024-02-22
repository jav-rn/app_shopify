
import { ActionFunction } from "@remix-run/node";
import { Layout, Page, Card } from "@shopify/polaris";
import type { LoaderFunction } from "@remix-run/node";

import React from "react"; 
import { authenticate } from "~/shopify.server";


import { _OrderServices } from "stock_ago_services/order.services";

type Props = {};

/*
export const loader: LoaderFunction = async ({ request }) => {
    const { session } = await authenticate.admin(request)
    const { shop, accessToken } = session;
    console.log('shop',shop); 
    console.log('accessToken',accessToken); 
    return null
}
*/


const orderServices = new _OrderServices();
export const action: ActionFunction = async ({ request }) =>{
    // TRGGER WEBHOOK
    const {admin, session} = await authenticate.admin(request)
    const { shop, accessToken } = session
    console.log(shop, accessToken);

    const webhook = new admin.rest.resources.Webhook({session: session})

    if(webhook){
        console.log(webhook, 'webhook order created-------')
        
        orderServices.send_create_order({"creacion 1 desde webhook":"dddd"});
        webhook.address = "pubsub://projectName:topicName" 
        webhook.topic   = "orders/create"
        webhook.format = "json"
        console.log( 'webhook order created-------')
        await webhook.save({update:true})
    }

    return null

}

// https://www.youtube.com/watch?v=N5Wb_Zn091s 31:13
const AutomationsPage = (props: Props) => {
    return (
        <div>Pagina Automatización</div>
    );
}

export default AutomationsPage;

