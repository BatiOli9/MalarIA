import mysql from 'mysql2/promise';

// Configuración de la conexión a la base de datos
const conn = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'resumort'
});

export { conn };