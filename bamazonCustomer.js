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
    // console.log(`connected as id ${connection.threadId}`);
    availableItems();
    start();
});

function availableItems() {
    connection.query("SELECT * FROM customer_products", function (err, results) {
        if (err) throw err;
        console.table(results);
    });
};

function start() {
    connection.query("SELECT * FROM products", function (err, results) {
        if (err) throw err;
        inquirer
            .prompt([
                {
                    name: "choice",
                    type: "list",
                    choices: function () {
                        var choiceArray = [];
                        for (var i = 0; i < results.length; i++) {
                            choiceArray.push(results[i].product_name);
                        }
                        return choiceArray;
                    },
                    message: "What would you like to buy?"
                },
                {
                    name: "buy",
                    type: "input",
                    message: "How many would you like to buy?"
                }
            ])
            .then(function (answer) {
                var chosenItem;
                for (var i = 0; i < results.length; i++) {
                    if (results[i].product_name === answer.choice) {
                        chosenItem = results[i];
                    }
                }

                if (chosenItem.stock_quantity > parseInt(answer.buy)) {
                    connection.query(
                        "UPDATE products SET ? WHERE ?",
                        [
                            {
                                stock_quantity: chosenItem.stock_quantity - answer.buy
                            },
                            {
                                item_id: chosenItem.item_id
                            }
                        ],
                        function (error) {
                            if (error) throw err;
                            console.log("Purchased was a success!");
                            console.log("Item Name: " + chosenItem.product_name);
                            console.log("Item Count: " + parseInt(answer.buy));
                            console.log("Total: " + "$" + (chosenItem.price * (parseInt(answer.buy)).toFixed(2)));
                            // start();
                        }
                    );
                }
                else {
                    // bid wasn't high enough, so apologize and start over
                    console.log("Insufficient quantity!");
                }
            });
    });
}



function addProduct() {
    console.log("Adding a new product...\n");
    var query = connection.query(
        "INSERT INTO products SET ?",
        {
            product_name: "",
            price: 1.99,
            stock_quantity: 10
        },
        function (err, res) {
            console.log(res.affectedRows + " product inserted!\n");
            // Call updateProduct AFTER the INSERT completes
            readProducts();
        }
    );

    // logs the actual query being run
    console.log(query.sql);
}

function updateProduct() {
    console.log("Updating all Rocky Road quantities...\n");
    var query = connection.query(
        "UPDATE products SET ? WHERE ?",
        [
            {
                stock_quantity: 100
            },
            {
                product_name: ""
            }
        ],
        function (err, res) {
            console.log(res.affectedRows + " products updated!\n");
            // Call deleteProduct AFTER the UPDATE completes
        }
    );

    // logs the actual query being run
    console.log(query.sql);
}

function deleteProduct() {
    console.log("Deleting all strawberry icecream...\n");
    connection.query(
        "DELETE FROM products WHERE ?",
        {
            product_name: ""
        },
        function (err, res) {
            console.log(res.affectedRows + " products deleted!\n");
            // Call readProducts AFTER the DELETE completes
            readProducts();
        }
    );
}

function readProducts() {
    console.log("Selecting all products...\n");
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        // Log all results of the SELECT statement
        console.log(res);
        connection.end();
    });
}