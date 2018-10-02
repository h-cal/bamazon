const chalkPipe = require("chalk-pipe");
const inquirer = require("inquirer");
const table = require("table");
const str = require("./strTools");

const init = function supervisorInit(connection) {
  return new Promise(resolve => {
    console.log(
      "\n" + chalkPipe("yellow")("bamazon Supervisor Main Menu")
    );
    console.log(str.separator);
    const choices = [
      "View Product Sales by Department",
      "Create New Department",
      chalkPipe("redBright")("(back)")
    ];

    inquirer
      .prompt([
        {
          type: "list",
          name: "command",
          message: "Please choose an option.",
          choices: choices
        }
      ])
      .then(response1 => {
        switch (response1.command) {
          // * View Product Sales by Department
          case choices[0]: {
            const sql =
              "SELECT d.department_id AS department_id," +
              "d.department_name AS department_name, " +
              "IFNULL(d.over_head_costs, 0) AS over_head_costs, " + // * Use IFNULL to set null values to 0
              "SUM(IFNULL(p.product_sales, 0)) AS product_sales, " +
              "SUM(IFNULL(p.product_sales, 0)) - IFNULL(d.over_head_costs, 0) AS total_profit " +
              "FROM departments d LEFT JOIN products p " + // * Use LEFT JOIN to include new departments with no products
              "ON d.department_name = p.department_name " +
              "GROUP BY department_name " +
              "ORDER BY department_id";
            connection.query(sql, function(err, results) {
              if (err) {
                console.log(err);
                throw err;
              }

              const dataTable = [
                [
                  "department_id",
                  "department_name",
                  "over_head_costs",
                  "product_sales",
                  "total_profit"
                ]
              ];

              function profitTag(strings, profitExp) {
                const lowProfitStyle = "red.underline";
                const highProfitStyle = "greenBright";
                const style = profitExp > 0 ? highProfitStyle : lowProfitStyle;
                return profitExp ? chalkPipe(style)(profitExp) : "0";
              }

              results.forEach(dept => {
                dataTable.push([
                  dept.department_id,
                  dept.department_name,
                  dept.over_head_costs,
                  dept.product_sales ? dept.product_sales : "0",
                  profitTag`${dept.total_profit}`
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

          // * Create New Department
          case choices[1]: {
            inquirer
              .prompt([
                {
                  type: "input",
                  name: "department_name",
                  message: "Enter new department name:",
                  validate: function validateInput(input) {
                    const name = input.trim();
                    if (name.length === 0) {
                      return chalkPipe("red.bold")(
                        "Please enter a department name."
                      );
                    }
                    return true;
                  }
                },
                {
                  type: "input",
                  name: "over_head_costs",
                  message:
                    "Enter the overhead costs for the new department (default = 10000):",
                  default: "10000",
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
                }
              ])
              .then(newDept => {
                const { department_name, over_head_costs } = newDept;

                // * Prompt to confirm making new department
                inquirer
                  .prompt([
                    {
                      type: "confirm",
                      name: "confirmNewDept",
                      message: `You are adding a new department "${department_name}" with overhead costs of ${over_head_costs}.\nPlease confirm.`
                    }
                  ])
                  .then(responseConfirm => {
                    if (responseConfirm.confirmNewDept) {
                      connection.query(
                        "INSERT INTO departments SET ?",
                        newDept,
                        function(err) {
                          if (err) {
                            console.log(err);
                            throw err;
                          }
                          console.log(
                            `\n${department_name} department was added successfully.\n` +
                              "Returning to supervisor menu.\n"
                          );
                          resolve(true);
                        }
                      );
                    } else {
                      console.log(
                        "\nAdd new department cancelled. Returning to supervisor menu.\n"
                      );
                      resolve(true);
                    }
                  });
              });
            break;
          }

          // * Return to Main Menu
          case choices[2]: {
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
