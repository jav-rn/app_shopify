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
  public endpoint: any
  private auth_user: any
  private auth_token: any
  public entity: any

  constructor() {
    this.endpoint = routes
    this.login();
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
      const response = await axios.post(this.endpoint.ORDERS_CREATE,
        body
        , {
          headers: {
            "Content-Type": "application/json",
            "Auth-user": this.auth_user,
            "Auth-token": this.auth_token
          }
        });

      if (response.data.status) {
        console.log('response_order_create->', response.data, 'token->', this.auth_token)
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
    try {
      console.log("url--login-->", this.endpoint.login)
      let resp = await axios.post(this.endpoint.login,
        {
          "email": process.env.AUTH_STOKAGO_EMAIL,
          "password": process.env.AUTH_STOKAGO_PASSWORD
        }
        , {
          headers: {
            "Content-Type": "application/json"
          }
        });
      if (resp && resp.data && resp.data.login) {
        resp            = resp.data;
        this.auth_token = resp.token;
        this.auth_user  = resp.hashed_email;
        this.entity     = resp.user;
      }

      console.log("resp->login->", resp);

    } catch (err) {
      console.log("error request login--->>>", err)
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
        "Auth-user": this.auth_user,
        "Auth-token": this.auth_token
      }
    });
  }

  /**
   * Send order to stockago
   */
  async postOrderToStockago(order: OrderDTO): Promise<boolean> {
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