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

export default connection;
