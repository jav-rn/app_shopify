import axios from "axios";

import StoreFailOrdersService from "./manageOrdersFailure.service";
import { routes } from "./config.service";
import {
    getOrderDTO,
    loginStockago,
    postOrderToStockago,
} from "./stockago.service";
import type { OrderDTO } from "../_interfaces/orders";

export class _DropiServices {
    public url_order_create: any;
    public url_update_product: any;
    public endpoint: any;
    private auth_user: any;
    private auth_token: any;
    public entity: any;

    private storeFailOrdersService: StoreFailOrdersService;

    constructor() {
        this.endpoint = routes;
        this.storeFailOrdersService = new StoreFailOrdersService();
    }

    async SEND_DRAFT_ORDERS_CREATE(body: any): Promise<any> {
        return await axios.post(this.endpoint.DRAFT_ORDERS_CREATE, body, {
            headers: {
                "Content-Type": "application/json",
                "Auth-user": this.auth_user,
                "Auth-token": this.auth_token,
            },
        });
    }

    async SEND_ORDER_TRANSACTIONS_CREATE(body: any): Promise<any> {
        return await axios.post(this.endpoint.ORDER_TRANSACTIONS_CREATE, body, {
            headers: {
                "Content-Type": "application/json",
                "Auth-user": this.auth_user,
                "Auth-token": this.auth_token,
            },
        });
    }

    async SEND_ORDERS_CREATE(body: any): Promise<any> {
        this.sendOrdersCreate(body);
    }

    async SEND_ORDERS_EDITED(body: any): Promise<any> {
        return await axios.post(this.endpoint.ORDERS_DELETE, body, {
            headers: {
                "Content-Type": "application/json",
                "Auth-user": this.auth_user,
                "Auth-token": this.auth_token,
            },
        });
    }

    async SEND_ORDERS_CANCELLED(body: any): Promise<any> {
        return await axios.post(this.endpoint.ORDERS_CANCELLED, body, {
            headers: {
                "Content-Type": "application/json",
                "Auth-user": this.auth_user,
                "Auth-token": this.auth_token,
            },
        });
    }

    async SEND_ORDERS_DELETE(body: any): Promise<any> {
        return await axios.post(this.endpoint.ORDERS_DELETE, body, {
            headers: {
                "Content-Type": "application/json",
                "Auth-user": this.auth_user,
                "Auth-token": this.auth_token,
            },
        });
    }

    async SEND_ORDERS_UPDATED(body: any): Promise<any> {
        return await axios.post(this.endpoint.ORDERS_UPDATED, body, {
            headers: {
                "Content-Type": "application/json",
                "Auth-user": this.auth_user,
                "Auth-token": this.auth_token,
            },
        });
    }

    async SEND_PRODUCTS_UPDATE(body: any): Promise<any> {
        return await axios.post(this.endpoint.PRODUCTS_UPDATE, body, {
            headers: {
                "Content-Type": "application/json",
                "Auth-user": this.auth_user,
                "Auth-token": this.auth_token,
            },
        });
    }

    async SEND_PRODUCTS_CREATE(body: any): Promise<any> {
        return await axios.post(this.endpoint.PRODUCTS_CREATE, body, {
            headers: {
                "Content-Type": "application/json",
                "Auth-user": this.auth_user,
                "Auth-token": this.auth_token,
            },
        });
    }

    console_msg(topic: any, end = true) {
        if (end) {
            console.log("< END >");
            console.log("<--------------" + topic + "-------------->");
        } else {
            console.log("<--------------" + topic + "-------------->");
            console.log("< INI >");
        }
    }

    async getproductsStockAgo(): Promise<any> {
        return await axios.post(
            this.endpoint.receiveProducts,
            {
                body: {
                    user: "test",
                    password: "password",
                },
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    "Auth-user": this.auth_user,
                    "Auth-token": this.auth_token,
                },
            },
        );
    }

    /**
     * Send order to stockago
     */
    async postOrderToStockago(order: OrderDTO): Promise<boolean> {
        // TODO complete function
        try {
            console.log();
        } catch (e) {
            console.log(e);
        }
        return false;
    }

    async sendOrdersCreate(body: any): Promise<boolean> {
        let err = true;
        let errorMsg = "";

        try {
            const payload = getOrderDTO(body);
            if (!payload) throw new Error("The body has an incorrect format");

            const credentials = await loginStockago();

            if (!credentials) throw new Error("Invalid credentials");

            const stockagoResponse = await postOrderToStockago(
                payload,
                credentials,
            );
            if (!stockagoResponse)
                throw new Error("Error in Stockago response");

            if (stockagoResponse.status) {
                console.log("Order synchronized");
                err = false;
            } else {
                errorMsg = stockagoResponse.msg;
            }
        } catch (error) {
            errorMsg =
                error instanceof Error
                    ? error.message
                    : "There was a error sending data to Stockago";
        }

        if (err) {
            /*
            Store the order for trying later
            */
            this.storeFailOrdersService
                .storeFailSyncOrder(body, errorMsg)
                .then((response) => {
                    console.log("Response from firebase -->>", response);
                    process.exit();
                });

            /*
            Schedule task for retry to send orders. It's activated here because of the performance, this is:
            There is no way to know if there is pending orders more that looking for stored fail orders,
            but it's sure that the application have to retry if there is a non saved order
            */
            await this.storeFailOrdersService.activateFetchOrdersTask(10, "m");

            return false;
        }

        return true;
    }
}
