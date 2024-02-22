import { authenticate } from "../shopify.server";
import db from "../db.server";
//import { _OrderServices } from "../stock_ago_services/order.services";
import {_OrderServices} from "../../stock_ago_services/order.services";


const orderServices = new _OrderServices();
export const action = async ({ request }) => {
  //const orderServives = new _OrderServives(); 
  const { topic, shop, session, admin, payload } =
    await authenticate.webhook(request);

  if (!admin) {
    // The admin context isn't returned if the webhook fired after a shop was uninstalled.
    throw new Response();
  }

  switch (topic) {
    case "APP_UNINSTALLED":
      if (session) {
        await db.session.deleteMany({ where: { shop } });
      }

    case "ORDERS_CREATE":

      console.log("<-----se creo orden------>")
      orderServices.send_create_order({"payload_ORDERS_CREATE_ok": payload})
      console.log(payload)
      //orderServives.send_create_order({"test_body": payload});
      console.log("<-----end se creo orden------>")
      break;
    case "CUSTOMERS_DATA_REQUEST":
    case "CUSTOMERS_REDACT":
    case "SHOP_REDACT":
    default:
      throw new Response("Unhandled webhook topic", { status: 404 });
  }

  throw new Response();
};
