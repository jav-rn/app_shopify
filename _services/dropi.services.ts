import axios from 'axios';
import { routes } from './config.services';


export class _DropiServices {
  public url_order_create: any
  public url_update_product: any
  private accessToken: any
  private endpoint: any
  private headers: any

  constructor() {
    this.accessToken = ''; // Este debe consultar el endpoint de login
    this.endpoint = routes
    this.headers = {
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": this.get_token
      }
    }
  }

  async SEND_DRAFT_ORDERS_CREATE(body: any): Promise<any> {
    return await axios.post(this.endpoint.DRAFT_ORDERS_CREATE, {
      body: body
    }, {
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": this.accessToken!
      }
    });
  }

  async SEND_ORDER_TRANSACTIONS_CREATE(body: any): Promise<any> {
    return await axios.post(this.endpoint.ORDER_TRANSACTIONS_CREATE, {
      body: body
    }, {
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": this.accessToken!
      }
    });
  }

  async SEND_ORDERS_CREATE(body: any): Promise<any> {
    return await axios.post(this.endpoint.ORDERS_CREATE, {
      body: body
    }, {
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": this.accessToken!
      }
    });
  }

  async SEND_ORDERS_EDITED(body: any): Promise<any> {
    return await axios.post(this.endpoint.ORDERS_DELETE, {
      body: body
    }, {
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": this.accessToken!
      }
    });
  }


  async SEND_ORDERS_CANCELLED(body: any): Promise<any> {
    return await axios.post(this.endpoint.ORDERS_CANCELLED, {
      body: body
    }, {
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": this.accessToken!
      }
    });
  }

  async SEND_ORDERS_DELETE(body: any): Promise<any> {
    return await axios.post(this.endpoint.ORDERS_DELETE, {
      body: body
    }, {
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": this.accessToken!
      }
    });
  }

  async SEND_ORDERS_UPDATED(body: any): Promise<any> {
    return await axios.post(this.endpoint.ORDERS_UPDATED, {
      body: body
    }, {
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": this.accessToken!
      }
    });
  }


  async SEND_PRODUCTS_UPDATE(body: any): Promise<any> {
    return await axios.post(this.endpoint.PRODUCTS_UPDATE, {
      body: body
    }, {
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": this.accessToken!
      }
    });
  }


  async SEND_PRODUCTS_CREATE(body: any): Promise<any> {
    return await axios.post(this.endpoint.PRODUCTS_CREATE, {
      body: body
    }, {
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": this.accessToken!
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
        "X-Shopify-Access-Token": ""
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



}