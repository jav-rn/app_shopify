
const  base_url = [
    "http://127.0.0.1:8000/",
    "https://solucionesintegralesmallorca.com/portafoliojav/",
    "https://stockago.com/", // produccion OJO actualizar al endpoint de orders stockago
    "https://error.test/",
];
let envNumber = 0;

export const routes = {
    DRAFT_ORDERS_CREATE       : base_url[envNumber]+"test_stock_ago/",
    ORDER_TRANSACTIONS_CREATE : base_url[envNumber]+"test_stock_ago/", 
    ORDERS_CREATE             : base_url[envNumber]+"api/orders/create_shopify/",
    ORDERS_EDITED             : base_url[envNumber]+"test_stock_ago/", 
    ORDERS_UPDATED            : base_url[envNumber]+"test_stock_ago/", 
    ORDERS_DELETE             : base_url[envNumber]+"test_stock_ago/", 
    ORDERS_CANCELLED          : base_url[envNumber]+"test_stock_ago/", 
    PRODUCTS_UPDATE           : base_url[envNumber]+"test_stock_ago/", 
    PRODUCTS_CREATE           : base_url[envNumber]+"test_stock_ago/",
    login                     : base_url[envNumber]+"api/login-api/",
    receiveProducts           : base_url[envNumber]+"test_stock_ago_products/",
    TEST_URL                  : 'https://solucionesintegralesmallorca.com/portafoliojav/test_stock_ago/'
}