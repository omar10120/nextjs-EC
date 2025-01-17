


// src/lib/db.js

import mysql from 'mysql2/promise';
import runMigrations from './migrate';  // Import migration script

const connection = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'newpassword',
  database: 'NextJsItems',
});


//Checking Database if Exsits 
async function initializeDatabase() {
  const DB_NAME = 'NextJsItems';

  const [databases] = await connection.query(`SHOW DATABASES LIKE '${DB_NAME}'`);
  if (databases.length === 0) {
     runMigrations();
  }
}
initializeDatabase();


export default connection;
