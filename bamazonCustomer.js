require('dotenv').config();
const mysql = require('mysql');
var inquirer = require("inquirer");

const connection = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_DATABASE || 'bamazon',
});

connection.connect((err) => {
    if (err) throw (err);
    console.log(`connected as id ${connection.threadId}`);

    connection.query('SELECT * FROM products', (err, res) => {
        if (err) throw (err);
        console.log(res);
    })
});