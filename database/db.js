const mysql = require('mysql2');
require('dotenv').config();

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});


// Optional: Test the connection
db.getConnection((err, connection) => {
  if (err) {
    console.error('MySQL connection error:', err.message);
  } else {
    console.log('MySQL Connected...');
    connection.release(); 
  }
});

module.exports = db;