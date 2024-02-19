//import { connection } from "./db.server.mysql.js"; 

const mysql = require('mysql2');

// Configuración de la conexión a MySQL
const connection = mysql.createConnection({
    host: 'b4qlhpendfkxoin7dohh-mysql.services.clever-cloud.com',
    user: 'uw47ohbu63avvj7m', // Cambia esto por tu nombre de usuario de MySQL
    password: 'uyAF7byvud1LeDkySb4S', // Cambia esto por tu contraseña de MySQL
    database: 'b4qlhpendfkxoin7dohh' // Cambia esto por el nombre de tu base de datos
});

// Conectar a la base de datos MySQL
connection.connect((error) => {
    if (error) {
        console.error('Error al conectar a MySQL:', error);
        throw error;
    }
    console.log('Conexión a MySQL establecida correctamente.');
});

 

function createTableProdctsOnSale(){
        connection.query(`
        CREATE TABLE IF NOT EXISTS shopify_products_on_sale (
            id INT AUTO_INCREMENT PRIMARY KEY,
            product_shopify_id VARCHAR(255),
            sku VARCHAR(255),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `, (error, results) => {
        if (error) {
            console.error('Error al crear la tabla selected_products:', error);
            throw error;
        }
        console.log('Tabla selected_products creada correctamente.');
    });
}

function prodctsOnSaleSave(product_shopify_id, sku){
    connection.query(`
    INSERT INTO shopify_products_on_sale
     SET
     product_shopify_id = "`+ product_shopify_id +`",
     sku = "`+ sku +`"
     `, (error, results) => {
        if (error) {
            console.error('Error al crear la tabla selected_products:', error);
            throw error;
        }
        console.log('Error al insertar');
    });
}

export { createTableProdctsOnSale, prodctsOnSaleSave }; 