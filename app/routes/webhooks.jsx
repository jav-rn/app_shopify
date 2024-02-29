import { authenticate, apiVersion } from "../shopify.server";
import db from "../db.server";
import { _DropiServices } from "../../stock_ago_services/dropi.services";
// https://community.shopify.com/c/shopify-apps/you-do-not-have-permission-to-create-webhooks-with-orders-create/m-p/1919485


const query = `
query OrderQuery($orderId: ID!) {
  order(id: $orderId) {
    id
    name
    createdAt
    lineItems(first: 250) {
      edges {
        node {
          id
          title
          sku
          variant {
            product {
              id
              title
           
            }
          }
        }
      }
    }
  }
}
`;

const dropiServices = new _DropiServices();

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
      break;
    case "ORDER_TRANSACTIONS_CREATE":
      console.log("<-----se creo orden ORDER_TRANSACTIONS_CREATE DDDDDDD------>");

      // "gid://shopify/Order/5524261765318"
      // const orderId = payload.id;  o payload.admin_graphql_api_id


      const variables = { orderId: "gid://shopify/Order/"+payload.order_id };
      console.log( "variables____>",variables);
      const { shop, accessToken } = session
      const response = await fetch(`https://${shop}/admin/api/${apiVersion}/graphql.json`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Access-Token": accessToken
        },
        body: JSON.stringify({
          query,
          variables
        })
      });
      console.log("p2");

      if (response.ok) {
        console.log("p3");
        const data = await response.json();
        console.log("Respuesta de la consulta GraphQL:", data);
        console.log(payload)
        console.log("products_order", data)
        dropiServices.SEND_ORDER_TRANSACTIONS_CREATE({ "webhook_ORDER_TRANSACTIONS_CREATE_body": payload, "products": data });
        // Aquí puedes realizar las acciones necesarias con la información obtenida
        // dropiServices.SEND_ORDER_TRANSACTIONS_CREATE(data);
      }
      console.log("p4");

      console.log("<-----end se creo orden ORDER_TRANSACTIONS_CREATE------>")
      break;

    case "ORDERS_CREATE":
      console.log("<-----se creo orden ORDERS_CREATE------>")
      console.log(payload)
      dropiServices.SEND_ORDERS_CREATE({ "webhook_ORDERS_CREATE_body": payload });
      console.log("<-----end se creo orden ORDERS_CREATE------>")
      break;

    case "ORDERS_EDITED":
      console.log("<-----se creo orden_ORDERS_EDITED------>")
      console.log(payload)
      dropiServices.SEND_ORDERS_EDITED({ "webhook_ORDERS_EDITED_body": payload });
      console.log("<-----end se creo orden------>")
      break;

    case "ORDERS_UPDATED":
      console.log("<-----ORDERS_UPDATED------>")
      dropiServices.SEND_ORDERS_UPDATED({ "webhook_ORDERS_UPDATED_create_body": payload });
      console.log("<-----ORDERS_UPDATED------>")
      break;

    case "PRODUCTS_UPDATE":
      console.log("<-----se edito producto------>")
      dropiServices.SEND_PRODUCTS_UPDATE({ "webhook_PRODUCTS_UPDATE_body": payload });
      console.log("<-----se edito producto------>")
      break;

    case "PRODUCTS_CREATE":
      console.log("<-----se edito producto------>")
      dropiServices.SEND_PRODUCTS_CREATE({ "webhook_PRODUCTS_CREATE_body": payload });
      console.log("<-----se edito producto------>")
      break;

    case "CUSTOMERS_DATA_REQUEST":
    case "CUSTOMERS_REDACT":
    case "SHOP_REDACT":
    default:
      throw new Response("Unhandled webhook topic", { status: 404 });
  }

  throw new Response();
};
