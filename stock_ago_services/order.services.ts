import axios from 'axios';
import { routes } from './config.services';


export class _OrderServices {
    public url_order_create : any
    private accessToken : any

    constructor(){
        this.url_order_create = routes.order_create
        this.accessToken = ''; // Este debe consultar el endpoint de login
    }

    async send_create_order (body : any) : Promise<any> {
       return await axios.post(this.url_order_create, {
        body: body
        }, {
          headers: {
            "Content-Type": "application/json",
            "X-Shopify-Access-Token": this.accessToken!
          }
        });
    }


    

}