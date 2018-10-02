const asciiTitle = `
/$$                                                                      
| $$                                                                      
| $$$$$$$   /$$$$$$  /$$$$$$/$$$$   /$$$$$$  /$$$$$$$$  /$$$$$$  /$$$$$$$ 
| $$__  $$ |____  $$| $$_  $$_  $$ |____  $$|____ /$$/ /$$__  $$| $$__  $$
| $$  \\ $$  /$$$$$$$| $$ \\ $$ \\ $$  /$$$$$$$   /$$$$/ | $$  \\ $$| $$  \\ $$
| $$  | $$ /$$__  $$| $$ | $$ | $$ /$$__  $$  /$$__/  | $$  | $$| $$  | $$
| $$$$$$$/|  $$$$$$$| $$ | $$ | $$|  $$$$$$$ /$$$$$$$$|  $$$$$$/| $$  | $$
|_______/  \\_______/|__/ |__/ |__/ \\_______/|________/ \\______/ |__/  |__/

v1.00

(credits for ascii: patorjk.com/software/taag/)
`;
const inquirer = require("inquirer");
const chalkPipe = require("chalk-pipe");
const pool = require("./assets/javascript/connectionPool");
const str = require("./assets/javascript/strTools");
const customer = require("./assets/javascript/bamazonCustomer");
const manager = require("./assets/javascript/bamazonManager");
const supervisor = require("./assets/javascript/bamazonSupervisor");

// * Get connection from pool
pool.getConnection(function(err, connection) {
  if (err) {
    console.log(err);
    throw "Unable to connect to MySQL server. Please check your connection settings and try again.";
  } else {
    // * Connection successful
    console.log(chalkPipe("whiteBright")(asciiTitle));
    console.log("\n\nWelcome to bamazon.");
    startMain(connection);
  }
});

// * Main Menu
const startMain = function startMainMenuOfProgram(connection) {
    console.log("\nbamazon Main Menu");
    console.log(str.separator);
  const choices = [
    chalkPipe("blueBright")(str.padCenter("Customer", 12)),
    chalkPipe("green")(str.padCenter("Manager", 12)),
    chalkPipe("yellow")(str.padCenter("Supervisor", 12)),
    chalkPipe("red")(str.padCenter("(Quit)", 12))
  ];

  inquirer
    .prompt([
      {
        type: "list",
        name: "programChoice",
        message: "Please choose a program:\n",
        choices: choices
      }
    ])
    .then(response => {
      switch (response.programChoice) {
        // * Use bamazon as a customer
        case choices[0]: {
          console.log("Starting bamazon Customer...\n");

          const startCustomer = connection => {
            customer.init(connection).then(again => {
              again ? startCustomer(connection) : startMain(connection);
            });
          };

          return startCustomer(connection);
        }

        // * Use bamazon as a manager
        case choices[1]: {
          console.log("Starting bamazon Manager...\n");

          const startManager = connection => {
            manager.init(connection).then(again => {
              again ? startManager(connection) : startMain(connection);
            });
          };

          return startManager(connection);
        }

        // * Use bamazon as a supervisor
        case choices[2]: {
          console.log("Starting bamazon Supervisor...\n");

          const startSupervisor = connection => {
            supervisor.init(connection).then(again => {
              again ? startSupervisor(connection) : startMain(connection);
            });
          };

          return startSupervisor(connection);
        }

        // * Quit bamazon
        case choices[3]: {
          connection.release();

          // * End all connections
          pool.end(function(err) {
            if (err) {
              console.log(err);
              throw err;
            }
          });
          console.log("Terminating app...\nGoodbye!");
          return;
        }
      }
    })
    .catch(error => {
      if (error) {
        console.log(error);
        throw error;
      }
    });
};
