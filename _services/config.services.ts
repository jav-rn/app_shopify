//const base_url = "https://solucionesintegralesmallorca.com/portafoliojav/";

const  base_url = [
    "http://127.0.0.1:8000/",
    "https://solucionesintegralesmallorca.com/portafoliojav/",
    "https://stockago.com/", // produccion
    "https://error.test/",
];
let envNumber = 0;

export const routes = {
    DRAFT_ORDERS_CREATE       : base_url[envNumber]+"test_stock_ago/",// OJO actualizar al endpoint de orders stockago
    ORDER_TRANSACTIONS_CREATE : base_url[envNumber]+"test_stock_ago/", // OJO actualizar al endpoint de orders stockago
    ORDERS_CREATE             : base_url[envNumber]+"api/orders/create_shopify/", // OJO actualizar al endpoint de orders stockago
    ORDERS_EDITED             : base_url[envNumber]+"test_stock_ago/", // OJO actualizar al endpoint de orders stockago
    ORDERS_UPDATED            : base_url[envNumber]+"test_stock_ago/", // OJO actualizar al endpoint de orders stockago
    ORDERS_DELETE             : base_url[envNumber]+"test_stock_ago/", // OJO actualizar al endpoint de orders stockago
    ORDERS_CANCELLED          : base_url[envNumber]+"test_stock_ago/", // OJO actualizar al endpoint de orders stockago
    PRODUCTS_UPDATE           : base_url[envNumber]+"test_stock_ago/", // OJO actualizar al endpoint de orders stockago
    PRODUCTS_CREATE           : base_url[envNumber]+"test_stock_ago/", // OJO actualizar al endpoint de orders stockago
    login                     : base_url[envNumber]+"api/login-api/",
    receiveProducts           : base_url[envNumber]+"test_stock_ago_products/",
    TEST_URL                  : 'https://solucionesintegralesmallorca.com/portafoliojav/test_stock_ago/'
}