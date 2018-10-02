# bamazon

A Node application to manage your store with inventory functionality.

![bamazon functionality](bamazon.gif)

## Installation

### Prerequisites

- Node.js
- NPM
- MySQL
- MAMP (if you are running your database on your local machine)

### Steps

Clone this repo to your local machine. Then, `cd` to where you cloned bamazon and install all npm depedencies using:

```sh
$ npm install
```

NPM modules used in this app:

- Inquirer.js
- mysql
- table
- chalk-pipe (optional, to enable colors)

Before starting the app, make sure your MySQL database is up and running. If you don't have any data, you can use `schema.sql` and `seeds.sql` located in `bamazon/assets/sql` to initialize your database.

Open the file `bamazon/assets/javascript/connectionPool.js` and edit the connection settings to match your system setup. Important things to change are the `host`, `port`, `user`, `password` and `database` values.

#### Example running on your local machine:

```javascript
const mysql = require("mysql");
const pool = mysql.createPool({
  connectionLimit: 10,
  host: "localhost",
  port: 3306,
  user: "root",
  password: "root",
  database: "bamazon"
});

module.exports = pool;
```

## Usage

Navigate to the bamazon root folder and use the command:

```javascript
node index.js
```

to start up the app. If your connection was setup successfully you be prompted with options to use bamazon as a customer, manager or supervisor. Choosing an option leads to specific commands:

### bamazon Customer

- View Products for Sale
- Make a Purchase

### bamazon Manager

- View Products for Sale
- View Low Inventory (lists products with <5 units remaining)
- Add to Inventory
- Add New Product

### bamazon Supervisor

- View Product Sales by Department
- Create New Department

## Authors

- **Calvin Ho** - _Initial work_ - [h-cal](https://github.com/h-cal)

## Acknowledgments

- [faressoft](https://github.com/faressoft) for [Terminalizer](https://github.com/faressoft/terminalizer)
- [PurpleBooth](https://github.com/PurpleBooth) for the README template.
