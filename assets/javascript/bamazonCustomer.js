const chalkPipe = require("chalk-pipe");
const inquirer = require("inquirer");
const table = require("table");
const str = require("./strTools");

const init = function customerInit(connection) {
  return new Promise((resolve, reject) => {
    console.log("\n" + chalkPipe("blueBright")("bamazon Customer Main Menu"));
    console.log(str.separator);
    const choices = [
      "View Products for Sale",
      "Make a Purchase",
      chalkPipe("redBright")("(back)")
    ];

    inquirer
      .prompt([
        {
          type: "list",
          name: "command",
          message: "\nPlease choose an option:",
          choices: choices
        }
      ])
      .then(response1 => {
        switch (response1.command) {
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

          // * Make a Purchase
          case choices[1]: {
            connection.query("SELECT * FROM products", function(err, results) {
              if (err) {
                console.log(err);
                throw err;
              }

              const noZeroStock = results.filter(
                item => item.stock_quantity !== 0
              );
              const choices = noZeroStock.map(
                item =>
                  `${str.padEnd(item.product_name, 15)} $${str.padEnd(
                    item.price.toFixed(2),
                    8
                  )} ${str.padEnd(String(item.stock_quantity), 10)} ${
                    item.item_id
                  }`
              );

              // * Prompt to ask which product to buy
              inquirer
                .prompt([
                  {
                    type: "list",
                    name: "product",
                    message:
                      "\nWhich product would you like to buy?\n  " +
                      chalkPipe("orange.underline")(
                        `${str.padEnd("Product", 15)} ${str.padEnd(
                          "Price",
                          9
                        )} ${str.padEnd("Available", 10)} ID`
                      ),
                    choices: choices
                  }
                ])
                .then(response2 => {
                  const productID = parseInt(
                    response2.product.slice(
                      response2.product.lastIndexOf(" ") + 1
                    )
                  );
                  const chosenProduct = results.filter(
                    item => item.item_id === productID
                  )[0];
                  const productName = chosenProduct.product_name;
                  const unitPrice = chosenProduct.price;
                  const availableAmount = chosenProduct.stock_quantity;
                  const currentSales = parseFloat(chosenProduct.product_sales);

                  // * Prompt to ask how many units to buy
                  inquirer
                    .prompt([
                      {
                        type: "input",
                        name: "amount",
                        message:
                          `\n${availableAmount} unit(s) of ${productName} are available.` +
                          "\nPlease enter the amount you would like to purchase (or enter 0 to cancel):",
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
                          } else if (parseInt(maybeNumber) > availableAmount) {
                            return chalkPipe("red.bold")(
                              `Only ${availableAmount} unit(s) are available.\nPlease enter a number lower than this.`
                            );
                          }
                          return true;
                        }
                      }
                    ])
                    .then(response3 => {
                      const purchaseAmount = response3.amount;
                      if (purchaseAmount > 0) {
                        const totalPrice = (purchaseAmount * unitPrice).toFixed(
                          2
                        );

                        console.log(
                          `\nYou are buying ${purchaseAmount} unit(s) of "${productName}" for $${unitPrice.toFixed(
                            2
                          )} each.\n` +
                            "Total price: " +
                            chalkPipe("bgRed.white.underline")(
                              `$ ${totalPrice}`
                            )
                        );

                        // * Prompt to confirm purchase
                        inquirer
                          .prompt([
                            {
                              type: "confirm",
                              name: "confirmPurchase",
                              message: "\nPlease confirm."
                            }
                          ])
                          .then(response4 => {
                            if (response4.confirmPurchase) {
                              // * Making purchase...
                              connection.query(
                                "UPDATE products SET ? WHERE ?",
                                [
                                  {
                                    stock_quantity:
                                      availableAmount - purchaseAmount,
                                    product_sales:
                                      currentSales + parseFloat(totalPrice)
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
                                    "\nThank for your purchase. Returning to customer menu.\n"
                                  );
                                  resolve(true);
                                }
                              );
                            } else {
                              console.log(
                                "\nPurchase cancelled. Returning to customer menu.\n"
                              );
                              resolve(true);
                            }
                          });
                      } else {
                        console.log(
                          "\nPurchase cancelled. Returning to customer menu.\n"
                        );
                        resolve(true);
                      }
                    });
                });
            });
            break;
          }

          // * Return to Main Menu
          case choices[2]: {
            console.log("\nReturning to main menu...\n");
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
