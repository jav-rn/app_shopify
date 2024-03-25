export interface OrderDTO {
    name: string; // nombre completo del cliente
    address: string; // dirección de entrega del pedido
    address_2?: string; // segunda línea de dirección (para detalles adicionales)
    city: string; // ciudad de entrega del pedido
    zip: string; // código postal del pedido
    province: string; // provincia del pedido
    country_code?: string; // código del país de 2 dígitos (ISO 3166-1)
    email?: string; // correo electrónico del cliente
    phone: string; // número de teléfono del cliente
    total: number; // importe total a reembolsar del pedido. Si el pedido no es COD, total=0
    carrier_observations?: string; // observaciones para la empresa transportadora
    ip?: string; // dirección IP del cliente que ha realizado el pedido
    latitude?: string; // latitud de la dirección del pedido
    longitude?: string; // longitud de la dirección del pedido
    id?: number; // id del pedido interno del usuario (ya sea Shopify, WooCommerce, etc.). Sirve para mantener una relación entre pedidos a futuro
    order_details: OrderDetail[]; // JSON que contiene los detalles del pedido. Cada detalle corresponde a una línea de pedido
    store_id?: number; // id de la tienda (creada previamente en StockAgo)
    confirm_order?: number; // Booleano para indicar si se quiere confirmar automáticamente el pedido (Valor 1 para confirmarlo)
}
  
export interface OrderDetail {
    sku: string; // SKU del producto en StockAgo
    name: string; // nombre del producto puesto en la tienda
    quantity: number; // cantidad
}
  
export interface ShopifyOrderPayload {
    // TODO fill with current properties
    webhook_origin_payload: {
      id: string
    }
}

export interface OrderStored {
    id: string,
    content: string,
    retries_count: number,
    retry: boolean,
    last_tried: Date,
    uploaded_at: Date,
    error_msg?: string
    status?: 'success' | 'failed'
}