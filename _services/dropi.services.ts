import axios from 'axios';
import { routes } from './config.services';
import { storeOrders, getAllOrders } from './manage-order-fails.service';

export interface ShopifyOrderPayload {
  // TODO fill with current properties
  webhook_origin_payload: {
      id: string
  }
}

interface OrderDTO {
  // TODO fill interface
}

export class _DropiServices {
  public url_order_create: any
  public url_update_product: any
  private accessToken: any
  private endpoint: any
  private headers: any
  private auth_user: any
  private auth_token: any

  constructor() {
    this.accessToken = ''; // Este debe consultar el endpoint de login
    this.endpoint = routes
    this.auth_user = process.env.AUTH_USER;
    this.auth_token = process.env.AUTH_TOKEN;
  }

  async SEND_DRAFT_ORDERS_CREATE(body: any): Promise<any> {
    return await axios.post(this.endpoint.DRAFT_ORDERS_CREATE,
      body
      , {
        headers: {
          "Content-Type": "application/json",
          "Auth-user": this.auth_user,
          "Auth-token": this.auth_token
        }
      });
  }

  async SEND_ORDER_TRANSACTIONS_CREATE(body: any): Promise<any> {
    return await axios.post(this.endpoint.ORDER_TRANSACTIONS_CREATE,
      body
      , {
        headers: {
          "Content-Type": "application/json",
          "Auth-user": this.auth_user,
          "Auth-token": this.auth_token
        }
      });
  }

  async SEND_ORDERS_CREATE(body: any): Promise<any> {
    let err = true;
    try {
      console.log('url-->>', this.endpoint.base_url_local)
      const response = await axios.post(this.endpoint.TEST_URL,
        body
        , {
          headers: {
            "Content-Type": "application/json",
            "Auth-user": this.auth_user,
            "Auth-token": this.auth_token
          }
        });

      if (response.data.status) {
        console.log(response.data)
        err = false;
      }

    } catch (err) {
      console.log(err)
    }

    if (err) {
      // Store the order(s) for trying later
      let resp = await storeOrders(body);
      console.log("response from storeOrders ------>>>>>", resp)
    }

  }

  async SEND_ORDERS_EDITED(body: any): Promise<any> {
    return await axios.post(this.endpoint.ORDERS_DELETE,
      body
      , {
        headers: {
          "Content-Type": "application/json",
          "Auth-user": this.auth_user,
          "Auth-token": this.auth_token
        }
      });
  }


  async SEND_ORDERS_CANCELLED(body: any): Promise<any> {
    return await axios.post(this.endpoint.ORDERS_CANCELLED,
      body
      , {
        headers: {
          "Content-Type": "application/json",
          "Auth-user": this.auth_user,
          "Auth-token": this.auth_token
        }
      });
  }

  async SEND_ORDERS_DELETE(body: any): Promise<any> {
    return await axios.post(this.endpoint.ORDERS_DELETE,
      body
      , {
        headers: {
          "Content-Type": "application/json",
          "Auth-user": this.auth_user,
          "Auth-token": this.auth_token
        }
      });
  }

  async SEND_ORDERS_UPDATED(body: any): Promise<any> {
    return await axios.post(this.endpoint.ORDERS_UPDATED,
      body
      , {
        headers: {
          "Content-Type": "application/json",
          "Auth-user": this.auth_user,
          "Auth-token": this.auth_token
        }
      });
  }


  async SEND_PRODUCTS_UPDATE(body: any): Promise<any> {
    return await axios.post(this.endpoint.PRODUCTS_UPDATE,
      body
      , {
        headers: {
          "Content-Type": "application/json",
          "Auth-user": this.auth_user,
          "Auth-token": this.auth_token
        }
      });
  }


  async SEND_PRODUCTS_CREATE(body: any): Promise<any> {
    return await axios.post(this.endpoint.PRODUCTS_CREATE,
      body
      , {
        headers: {
          "Content-Type": "application/json",
          "Auth-user": this.auth_user,
          "Auth-token": this.auth_token
        }
      });
  }

  async login(): Promise<any> {
    return await axios.post(this.endpoint.login, {
      body: {
        "user": "test",
        "password": "password"
      }
    }, {
      headers: {
        "Content-Type": "application/json",
        "Auth-user": this.auth_user,
        "Auth-token": this.auth_token
      }
    });
  }

  async get_token() {
    if (!this.accessToken) {
      return this.accessToken = ""
      //return this.login()
    } else {
      return this.accessToken = ""
    }
  }

  console_msg(topic: any, end = true) {
    if (end) {
      console.log("< END >")
      console.log("<--------------" + topic + "-------------->")
    } else {
      console.log("<--------------" + topic + "-------------->")
      console.log("< INI >")
    }
  }


  async getproductsStockAgo(): Promise<any> {
    return await axios.post(this.endpoint.receiveProducts, {
      body: {
        "user": "test",
        "password": "password"
      }
    }, {
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": ""
      }
    });
  }

  /**
   * Send order to stockago
   */
  async postOrderToStockago (order: OrderDTO): Promise<boolean> {
    // TODO complete function
    try {
      console.log()
    } catch (e) {
      console.log(e)
    }
    return false
  }

  /**
   * Return the data transfer object for sending to Stockago, by formatting the Shopify order
   */
  getOrderDTO(shopifyOrderPayload: ShopifyOrderPayload): OrderDTO {
    return {}
  } 

}