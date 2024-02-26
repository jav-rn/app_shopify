
import { ActionFunction } from "@remix-run/node";
import { Layout, Page, Card } from "@shopify/polaris";
import type { LoaderFunction } from "@remix-run/node";

import React from "react"; 
import { authenticate } from "~/shopify.server";


import { _DropiServices } from "stock_ago_services/dropi.services";

type Props = {};


export const loader: LoaderFunction = async ({ request }) => {
        const {admin, session} = await authenticate.admin(request)
    const { shop, accessToken } = session
    console.log(shop, accessToken);

    const webhook = new admin.rest.resources.Webhook({session: session})

    //if(webhook){
        console.log(webhook, 'webhook order created-------')

       // const webhook = new shopify.rest.Webhook({session: session});
        webhook.address = "https://dropi-v1.myshopify.com/admin/api/2024-01/webhooks.json";
        webhook.topic = "orders/create";
        webhook.format = "json";
        await webhook.save({
          update: true,
        });

        console.log("token", accessToken)
        console.log("END");
        

/*
    const { session } = await authenticate.admin(request)
    const { shop, accessToken } = session;

    console.log('shop',shop); 
    console.log('accessToken',accessToken); 

    */
    return null
}



const dropiServices = new _DropiServices();
export const action: ActionFunction = async ({ request }) =>{
    // TRGGER WEBHOOK
    const {admin, session} = await authenticate.admin(request)
    const { shop, accessToken } = session
    console.log(shop, accessToken);

    const webhook = new admin.rest.resources.Webhook({session: session})

    if(webhook){
        console.log(webhook, 'webhook order created-------')

       dropiServices.send_create_order({"creacion 1 desde webhook":"dddd"});
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

