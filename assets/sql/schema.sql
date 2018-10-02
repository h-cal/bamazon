DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;
USE bamazon;

DROP TABLE IF EXISTS products, departments;

CREATE TABLE products (
    item_id INT AUTO_INCREMENT,
    product_name VARCHAR(255) NOT NULL,
    department_name VARCHAR(255) DEFAULT "unassigned",
    price DECIMAL(13,4) DEFAULT 1.00,
    stock_quantity INT DEFAULT 1,
    product_sales DECIMAL(13,4) DEFAULT 0.00,
    PRIMARY KEY (item_id)
);

CREATE TABLE departments (
    department_id INT AUTO_INCREMENT,
    department_name VARCHAR(255) NOT NULL,
    over_head_costs DECIMAL(13,4) DEFAULT 10000.00,
    PRIMARY KEY (department_id),
    CONSTRAINT UC_department UNIQUE (department_name)
);