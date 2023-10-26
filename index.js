const mysql = require("mysql2");
const inquirer = require("inquirer");

// Create a MySQL connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "2515",
  database: "employees_db",
});

// Connect to the database
db.connect((err) => {
  if (err) {
    console.error("Error connecting to the database: " + err);
    return;
  }
  console.log("Connected to the employees_db database.");

  // Start the main menu
  mainMenu();
});

// Main menu function
function mainMenu() {
  inquirer
    .prompt([
      {
        name: "choice",
        type: "list",
        message: "What do you want to do:",
        choices: [
          "Display Departments",
          "Display Roles",
          "Display Employees",
          "Add Department",
          "Add Role",
          "Add Employee",
          "Update Employee",
          "Delete Menu",
          "Quit",
        ],
      },
    ])
    .then((answers) => {
      switch (answers.choice) {
        case "Display Departments":
          display("SELECT department.id 'ID', department.department 'Department' FROM department;");
          break;
        // Add other cases and their respective functions here
        default:
          console.log("Goodbye");
          db.end();
      }
    });
}

// Display function with comments
function display(query) {
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error executing query: " + err);
      return;
    }
    console.log("\n");
    console.table(results);
    mainMenu(); // Return to the main menu
  });
}
// Add other functions with comments here

// Main menu is called when the database connection is established
