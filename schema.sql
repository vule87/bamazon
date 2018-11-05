DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;

USE bamazon;

DROP TABLE IF EXISTS products;

CREATE TABLE products (
	item_id INT NOT NULL AUTO_INCREMENT,
    product_name VARCHAR(100),
    department_name VARCHAR(100),
    price DECIMAL (10,2),
    stock_quantity INT(10),
    PRIMARY KEY (item_id)
);

INSERT INTO products 
	(product_name, department_name, price, stock_quantity)
VALUES
	('lemon', 'grocery', 1.99, 100),
    ('strawberry', 'grocery', 3.99, 100),
    ('battery', 'supply', 4.99, 100),
    ('tooth_paste', 'hygiene', 2.99, 100),
    ('tooth_brush', 'hygiene', 1.99, 100),
    ('water', 'daily_essentials', 4.99, 100),
    ('tires', 'car_products', 60.97, 100),
    ('car_battery', 'car_products', 100.00, 100),
    ('nike', 'shoes', 119.99, 100),
    ('adidas', 'shoes', 89.99, 100);
    
CREATE TABLE customer_products (
	item_id INT NOT NULL AUTO_INCREMENT,
    product_name VARCHAR(100),
    price DECIMAL (10,2),
    PRIMARY KEY (item_id)
);

INSERT INTO customer_products
	(item_id, product_name, price)
SELECT item_id, product_name, price
FROM products;


SELECT * FROM customer_products;