import axios from "axios";

import type { OrderDTO } from "../_interfaces/orders";
import type { StockagoCredentials, StockagoResponse } from "../_interfaces/stockago"
import { routes } from "./config.service";
import { _DropiServices } from "./dropi.service";

export async function postOrderToStockago(order: OrderDTO, credentials: StockagoCredentials): Promise<StockagoResponse | null>{
    try {
        const response = await axios.post(routes.ORDERS_CREATE, order, {
            headers: {
                "Content-Type": "application/json",
                "Auth-user": credentials.auth_user,
                "Auth-token": credentials.auth_token,
            },
        });

        return response.data
    } catch (error) {
        return null
    }
}

export function getOrderDTO(shopifyOrder: any): OrderDTO | null {
    const setBlankValue = (value: any, defaultValue: any = '') => value || defaultValue
    try {
        const shopifyOrderPayload = shopifyOrder['webhook_origin_payload']

        const shopInfo = shopifyOrder['query_shop']
        const customerData = shopifyOrderPayload['customer']
        const shipingData = shopifyOrderPayload['shipping_address']
        const lineItems = shopifyOrderPayload['line_items']
    
        const orderObject: OrderDTO = {
            name: `${setBlankValue(shipingData['first_name'])} ${setBlankValue(shipingData['last_name'])}`,
            address: setBlankValue(shipingData['address1']),
            address_2: setBlankValue(shipingData['address2']),
            city: setBlankValue(shipingData['city']),
            zip: setBlankValue(shipingData['zip']),
            province: setBlankValue(shipingData['province']),
            country_code: setBlankValue(shipingData['country_code']),
            email: setBlankValue(customerData['email'], null),
            phone: setBlankValue(shipingData['phone']),
            // TODO: Preguntar si es precio total o la suma de los pedidos
            total: shopifyOrderPayload['payment_gateway_names'][0] == "Cash on Delivery (COD)"? 0 : +setBlankValue(shopifyOrder['total_price'], 0),
            carrier_observations: '',
            ip: shopifyOrderPayload['client_details']['browser_ip'],
            latitude: setBlankValue(shipingData['latitude']),
            longitude: setBlankValue(shipingData['longitude']),
            id: shopifyOrderPayload['id'],
            order_details: lineItems.map((item: any) => {
                return {
                    name: item['name'],
                    sku: item['sku'],
                    quantity: item['quantity']
                }
            }),
            store_id: shopInfo['shop_id'],
            confirm_order: 1,
        }
        return orderObject
    } catch (error) {
        console.log('There was an error parsing the data: ', error)
        return null
    }
}

export async function loginStockago(): Promise<StockagoCredentials | null> {
    try {
        let dropiService = new _DropiServices();
        return dropiService.login();
        /*

        let resp = await axios.post(
            routes.login,
            {
                email: process.env.AUTH_STOKAGO_EMAIL,
                password: process.env.AUTH_STOKAGO_PASSWORD,
            },
            {
                headers: {
                    "Content-Type": "application/json",
                },
            },
        );
        if (resp && resp.data && resp.data.login) {
            const data = resp.data;
            return {
                auth_user: data.auth_user,
                auth_token: data.auth_token,
            };
        }
        */
    } catch (err) {
        console.log("There was an error while login");
    }

    return null;
  }