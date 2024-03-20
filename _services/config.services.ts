const base_url = "https://solucionesintegralesmallorca.com/portafoliojav/";
const base_url_local = "http://127.0.0.1:8000/";
export const routes = {
    DRAFT_ORDERS_CREATE       : base_url+"test_stock_ago/",// OJO actualizar al endpoint de orders stockago
    ORDER_TRANSACTIONS_CREATE : base_url+"test_stock_ago/", // OJO actualizar al endpoint de orders stockago
    ORDERS_CREATE             : base_url_local+"api/test/", // OJO actualizar al endpoint de orders stockago
    ORDERS_EDITED             : base_url+"test_stock_ago/", // OJO actualizar al endpoint de orders stockago
    ORDERS_UPDATED            : base_url+"test_stock_ago/", // OJO actualizar al endpoint de orders stockago
    ORDERS_DELETE             : base_url+"test_stock_ago/", // OJO actualizar al endpoint de orders stockago
    ORDERS_CANCELLED          : base_url+"test_stock_ago/", // OJO actualizar al endpoint de orders stockago
    PRODUCTS_UPDATE           : base_url+"test_stock_ago/", // OJO actualizar al endpoint de orders stockago
    PRODUCTS_CREATE           : base_url+"test_stock_ago/", // OJO actualizar al endpoint de orders stockago
    login : 'definir',
    receiveProducts           : base_url+"test_stock_ago_products/"
}