// src/lib/migrate.js

const mysql = require('mysql2/promise');

const DB_NAME = 'NextJsItems';

async function runMigrations() {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      // password: 'root',
    });

    const [databases] = await connection.query(`SHOW DATABASES LIKE '${DB_NAME}'`);
    if (databases.length === 0) {
      await connection.query(`CREATE DATABASE ${DB_NAME}`);
      console.log(`Database "${DB_NAME}" created.`);
    } else {
      console.log(`Database "${DB_NAME}" already exists.`);
    }

    await connection.query(`USE ${DB_NAME}`);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS products (
        id INT NOT NULL AUTO_INCREMENT,
        name VARCHAR(255) NOT NULL,
        price FLOAT NOT NULL,
        description TEXT NULL,
        category VARCHAR(255) NULL,
        PRIMARY KEY (id)
      )
    `);

 

    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT NOT NULL AUTO_INCREMENT,
        Email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NULL,
        role ENUM('admin', 'user') NOT NULL DEFAULT 'user',
        PRIMARY KEY (id)
      )
    `);

    


    await connection.query(`
      CREATE TABLE IF NOT EXISTS orders (
      id INT NOT NULL AUTO_INCREMENT,
      user_id INT NOT NULL,
      total_price FLOAT NOT NULL,
      order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    
    await connection.query(`
      CREATE TABLE IF NOT EXISTS order_items  (
      id INT NOT NULL AUTO_INCREMENT,
      order_id INT NOT NULL,
      product_id INT NOT NULL,
      quantity INT NOT NULL DEFAULT 1,
      PRIMARY KEY (id),
      FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
      )
    `);

    console.log("Migrations completed successfully.");
    await connection.end();
  } catch (error) {
    console.error("Error running migrations:", error);
  }
}

runMigrations();
