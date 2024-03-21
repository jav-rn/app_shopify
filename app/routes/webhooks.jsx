import { authenticate, apiVersion } from "../shopify.server";
import db from "../db.server";
import { _DropiServices } from "../../_services/dropi.services";
import { _DropiModelOrder } from "../../_models/_DropiModelOrder";
import { _DropiModelShop } from "../../_models/_DropiModelShop";
// https://community.shopify.com/c/shopify-apps/you-do-not-have-permission-to-create-webhooks-with-orders-create/m-p/1919485



const dropiServices = new _DropiServices();
const dropiModelOrder = new _DropiModelOrder();
const dropiModelShop = new _DropiModelShop();

export const action = async ({ request }) => {

  const { topic, shop, session, admin, payload } =
    await authenticate.webhook(request);

  if (!admin) {
    // The admin context isn't returned if the webhook fired after a shop was uninstalled.
    throw new Response();
  }


  let send_payload = {};
  let result = {};
  let variables = {};

  send_payload = {
    "webhook": topic,
    "webhook_origin_payload": payload,
  }
  switch (topic) {
    case "APP_UNINSTALLED":
      if (session) {
        await db.session.deleteMany({ where: { shop } });
      }
      break;

    case "ORDERS_CREATE":
      dropiServices.console_msg(topic, 0)
      variables = { orderId: "gid://shopify/Order/" + payload.id };
      result.order = await dropiModelOrder.queryProductByOrder(admin, variables, 'order')
      result.shop = await dropiModelShop.queryGetShop(session, variables, 'shop')
      result.shop_id = dropiModelShop.parseIntId(result.shop, 'shop');

      send_payload = {
        "webhook": topic,
        "webhook_origin_payload": payload,
        "query_order": result.order,
        "query_shop": { "shop_id": result.shop_id, "url": shop, "shop": result.shop }
      }

      result.response_stockago = await dropiServices.SEND_ORDERS_CREATE(send_payload);
      dropiServices.console_msg(topic)
      break;

    case "DRAFT_ORDERS_CREATE":
      dropiServices.console_msg(topic, 0)
      // console.log(send_payload)
      dropiServices.SEND_DRAFT_ORDERS_CREATE(send_payload)
      dropiServices.console_msg(topic)
      break;

    case "ORDER_TRANSACTIONS_CREATE":
      dropiServices.console_msg(topic, 0)
      variables = { orderId: "gid://shopify/Order/" + payload.order_id };
      result.order = await dropiModelOrder.queryProductByOrder(admin, variables, 'order')
      result.shop = await dropiModelShop.queryGetShop(session, variables, 'shop')
      result.shop_id = dropiModelShop.parseIntId(result.shop, 'shop');

      send_payload = {
        "webhook": topic,
        "webhook_origin_payload": payload,
        "query_order": result.order,
        "query_shop": { "shop_id": result.shop_id, "url": shop, "shop": result.shop }
      }
      // console.log(send_payload)

      //dropiServices.console_msg(topic)

      if (result.order) {
        dropiServices.SEND_ORDER_TRANSACTIONS_CREATE(send_payload)
      } else {
        // console.log("error al consultar order")
      }
      break;

    case "ORDERS_EDITED":
      dropiServices.console_msg(topic, 0)
      // console.log(send_payload)
      dropiServices.SEND_ORDERS_EDITED(send_payload);
      dropiServices.console_msg(topic)
      break;

    case "ORDERS_DELETE":
      dropiServices.console_msg(topic, 0)
      // console.log(send_payload)
      dropiServices.SEND_ORDERS_DELETE(send_payload);
      dropiServices.console_msg(topic)
      break;

    case "ORDERS_CANCELLED":
      dropiServices.console_msg(topic, 0)
      // console.log(send_payload)
      dropiServices.SEND_ORDERS_CANCELLED(send_payload);
      dropiServices.console_msg(topic)
      break;

    case "PRODUCTS_CREATE":
      dropiServices.console_msg(topic, 0)
      // console.log(send_payload)
      dropiServices.SEND_PRODUCTS_CREATE(send_payload);
      dropiServices.console_msg(topic)
      break;

    case "PRODUCTS_UPDATE":
      dropiServices.console_msg(topic, 0)
      // console.log(send_payload)
      dropiServices.SEND_PRODUCTS_UPDATE(send_payload);
      dropiServices.console_msg(topic)
      break;

    case "CUSTOMERS_DATA_REQUEST":
    case "CUSTOMERS_REDACT":
    case "SHOP_REDACT":
    default:
      throw new Response("Unhandled webhook topic", { status: 404 });
  }

  throw new Response();
};