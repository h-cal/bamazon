const chalkPipe = require("chalk-pipe");
const inquirer = require("inquirer");
const table = require("table");
const str = require("./strTools");

const init = function managerInit(connection) {
  return new Promise(resolve => {
    console.log("\n" + chalkPipe("green")("bamazon Manager Main Menu"));
    console.log(str.separator);
    const choices = [
      "View Products for Sale",
      "View Low Inventory",
      "Add to Inventory",
      "Add New Product",
      chalkPipe("redBright")("(back)")
    ];

    inquirer
      .prompt([
        {
          type: "list",
          name: "command",
          message: "Please choose an option:",
          choices: choices
        }
      ])
      .then(response => {
        switch (response.command) {
          // * View Products for Sale
          case choices[0]: {
            connection.query("SELECT * FROM products", function(err, results) {
              if (err) {
                console.log(err);
                throw err;
              }

              const dataTable = [
                [
                  "item_id",
                  "product_name",
                  "department_name",
                  "price",
                  "stock_quantity"
                ]
              ];

              results.forEach(item => {
                dataTable.push([
                  item.item_id,
                  item.product_name,
                  item.department_name,
                  item.price.toFixed(2),
                  item.stock_quantity
                ]);
              });

              const tableConfig = {
                border: table.getBorderCharacters("honeywell")
              };

              const resultsTable = table.table(dataTable, tableConfig);
              console.log(resultsTable);
              resolve(true);
            });
            break;
          }

          // * View Low Inventory
          case choices[1]: {
            connection.query(
              "SELECT * FROM products WHERE stock_quantity < 5",
              function(err, results) {
                if (err) {
                  console.log(err);
                  throw err;
                }

                if (results.length === 0) {
                  console.log("\nNo products with low inventory.\n");
                  resolve(true);
                } else {
                  const dataTable = [
                    [
                      "item_id",
                      "product_name",
                      "department_name",
                      "price",
                      "stock_quantity"
                    ]
                  ];

                  results.forEach(item => {
                    dataTable.push([
                      item.item_id,
                      item.product_name,
                      item.department_name,
                      item.price.toFixed(2),
                      item.stock_quantity
                    ]);
                  });

                  const tableConfig = {
                    border: table.getBorderCharacters("honeywell")
                  };

                  const resultsTable = table.table(dataTable, tableConfig);
                  console.log(resultsTable);
                  resolve(true);
                }
              }
            );
            break;
          }

          // * Add to Inventory (existing product)
          case choices[2]: {
            connection.query("SELECT * FROM products", function(err, results) {
              if (err) {
                console.log(err);
                throw err;
              }

              const choices = results.map(
                item =>
                  `${str.padEnd(item.product_name, 15)} ${str.padEnd(
                    String(item.stock_quantity),
                    12
                  )} ${item.item_id}`
              );

              // * Prompt to select product
              inquirer
                .prompt([
                  {
                    type: "list",
                    name: "product",
                    message:
                      "\nWhich product would you add to?\n  " +
                      chalkPipe("orange.underline")(
                        `${str.padEnd("Product", 15)} ${str.padEnd(
                          "Existing",
                          12
                        )} ID`
                      ),
                    choices: choices
                  }
                ])
                .then(responseProduct => {
                  const productID = parseInt(
                    responseProduct.product.slice(
                      responseProduct.product.lastIndexOf(" ") + 1
                    )
                  );
                  const chosenProduct = results.filter(
                    item => item.item_id === productID
                  )[0];
                  const productName = chosenProduct.product_name;
                  const availableAmount = chosenProduct.stock_quantity;

                  // * Prompt to ask how many units to add
                  inquirer
                    .prompt([
                      {
                        type: "input",
                        name: "addQuantity",
                        message:
                          `${availableAmount} unit(s) of ${availableAmount} available in existing stock.` +
                          "\nPlease enter the amount of additional stock you would like to add (or enter 0 to cancel):",
                        validate: function validateInput(input) {
                          const maybeNumber = input.trim();
                          if (
                            maybeNumber === "" ||
                            maybeNumber < 0 ||
                            Number.isNaN(Number(maybeNumber)) ||
                            !Number.isInteger(parseFloat(maybeNumber))
                          ) {
                            return chalkPipe("red.bold")(
                              "Please enter a positive integer (or enter 0 to cancel)."
                            );
                          }
                          return true;
                        }
                      }
                    ])
                    .then(response2 => {
                      const additionalQuantity = parseInt(
                        response2.addQuantity
                      );
                      const newStockQuantity =
                        availableAmount + additionalQuantity;

                      if (additionalQuantity < 1) {
                        console.log(
                          "\nAdd new stock cancelled. Returning to manager menu.\n"
                        );
                        resolve(true);
                      } else {
                        // * Prompt to confirm adding additional stock
                        inquirer
                          .prompt([
                            {
                              type: "confirm",
                              name: "confirmAddStock",
                              message:
                                `You are adding ${additionalQuantity} unit(s) of ${productName} to stock.` +
                                "\nPlease confirm."
                            }
                          ])
                          .then(responseConfirm => {
                            if (responseConfirm.confirmAddStock) {
                              // * Adding more stock...
                              connection.query(
                                "UPDATE products SET ? WHERE ?",
                                [
                                  {
                                    stock_quantity: newStockQuantity
                                  },
                                  {
                                    item_id: productID
                                  }
                                ],
                                function(err) {
                                  if (err) {
                                    console.log(err);
                                    throw err;
                                  }
                                  console.log(
                                    `\nSuccessfully added ${additionalQuantity} unit(s) of ${productName} to stock.\n` +
                                      `New stock level = ${newStockQuantity}\n` +
                                      "Returning to manager menu.\n"
                                  );
                                  resolve(true);
                                }
                              );
                            } else {
                              console.log(
                                "\nAdd new stock cancelled. Returning to manager menu.\n"
                              );
                              resolve(true);
                            }
                          });
                      }
                    });
                });
            });
            break;
          }

          // * Add New Product
          case choices[3]: {
            inquirer
              .prompt([
                {
                  type: "input",
                  name: "product_name",
                  message: "Enter new product name:",
                  validate: function validateInput(input) {
                    const name = input.trim();
                    if (name.length === 0) {
                      return chalkPipe("red.bold")(
                        "Please enter a product name."
                      );
                    }
                    return true;
                  }
                },
                {
                  type: "input",
                  name: "department_name",
                  message: "Enter the department for the new product:",
                  default: "unassigned",
                  validate: function validateInput(input) {
                    const dept = input.trim();
                    if (dept.length === 0) {
                      return chalkPipe("red.bold")(
                        "Please enter a department."
                      );
                    }
                    return true;
                  }
                },
                {
                  type: "input",
                  name: "price",
                  message: "Enter a price for the new product (default = 1):",
                  default: "0",
                  validate: function validateInput(input) {
                    const maybeNumber = input.trim();
                    if (
                      maybeNumber === "" ||
                      maybeNumber === "0" ||
                      maybeNumber < 0 ||
                      Number.isNaN(Number(maybeNumber))
                    ) {
                      return chalkPipe("red.bold")(
                        "Please enter only positive numbers."
                      );
                    }
                    return true;
                  }
                },
                {
                  type: "input",
                  name: "stock_quantity",
                  message: "Enter initial stock quantity (default = 1):",
                  default: "1",
                  validate: function validateInput(input) {
                    const maybeNumber = input.trim();
                    if (
                      maybeNumber === "" ||
                      maybeNumber === "0" ||
                      maybeNumber < 0 ||
                      Number.isNaN(Number(maybeNumber)) ||
                      !Number.isInteger(parseFloat(maybeNumber))
                    ) {
                      return chalkPipe("red.bold")(
                        "Please enter only positive integers."
                      );
                    }
                    return true;
                  }
                }
              ])
              .then(newProduct => {
                const {
                  product_name,
                  department_name,
                  price,
                  stock_quantity
                } = newProduct;

                // * Confirm adding new product
                inquirer
                  .prompt([
                    {
                      type: "confirm",
                      name: "confirmNewProduct",
                      message:
                        "You are adding a new product with the following details:\n" +
                        `
                        Name:           ${product_name}
                        Department:     ${department_name}
                        Price:          $${price}
                        Initial Stock:  ${stock_quantity} unit(s)
                            ` +
                        "\nPlease confirm."
                    }
                  ])
                  .then(responseConfirm => {
                    if (responseConfirm.confirmNewProduct) {
                      connection.query(
                        "INSERT INTO products SET ?",
                        newProduct,
                        function(err) {
                          if (err) {
                            console.log(err);
                            throw err;
                          }
                          console.log(
                            "\nAdd new product successful. Returning to manager menu.\n"
                          );
                          resolve(true);
                        }
                      );
                    } else {
                      console.log(
                        "\nAdd new product cancelled. Returning to manager menu.\n"
                      );
                      resolve(true);
                    }
                  });
              });
            break;
          }

          // * Return to Main Menu
          case choices[4]: {
            resolve(false);
            break;
          }
        }
      });
  });
};

module.exports = {
  init: init
};
