const inquirer = require("inquirer");
const mysql = require("mysql2");

// Create a database connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "2515",
  database: "company",
});

// Connect to the database
db.connect((err) => {
  if (err) {
    console.error("Error connecting to the database: " + err.stack);
    return;
  }
  console.log("Connected to company database");
  start();
});

// Command-line interface for the application
const start = () => {
  inquirer
    .prompt({
      type: "list",
      name: "action",
      message: "What would you like to do?",
      choices: [
        "View all departments",
        "View all roles",
        "View all employees",
        "Add a department",
        "Add a role",
        "Add an employee",
        "Update employee role",
        "Quit",
      ],
    })
    .then((data) => {
      switch (data.action) {
        case "View all departments":
          viewData("department");
          break;
        case "View all roles":
          viewRoles();
          break;
        case "View all employees":
          viewEmployees();
          break;
        case "Add a department":
          addData("department", "name");
          break;
        case "Add a role":
          addRole();
          break;
        case "Add an employee":
          addEmployee();
          break;
        case "Update employee role":
          updateEmployeeRole();
          break;
        default:
          console.log("Bye!");
          db.end(); // Close the database connection
          process.exit();
      }
    });
};

// View data from a table
const viewData = (table) => {
  db.query(`SELECT * FROM ${table};`, (err, res) => {
    if (err) {
      console.error(err);
    }
    console.log("\n");
    console.table(res);
    start();
  });
};

// View roles and their departments
const viewRoles = () => {
  db.query(
    "SELECT role.id, title, department.name AS department, salary FROM role JOIN department ON role.department_id = department.id;",
    (err, res) => {
      if (err) {
        console.error(err);
      }
      console.log("\n");
      console.table(res);
      start();
    }
  );
};

// View employees and their details
const viewEmployees = () => {
  db.query(
    'SELECT T1.id, T1.first_name, T1.last_name, role.title, department.name AS department, role.salary, CONCAT(T2.first_name, " ", T2.last_name) AS manager FROM ((employee T1 LEFT JOIN employee T2 ON T1.manager_id = T2.id) JOIN role ON T1.role_id = role.id) JOIN department ON department_id = department.id;',
    (err, res) => {
      if (err) {
        console.error(err);
      }
      console.log("\n");
      console.table(res);
      start();
    }
  );
};

// Add data to a table
const addData = (table, columnName) => {
  inquirer
    .prompt({
      type: "input",
      name: "data",
      message: `Enter the ${columnName}:`,
    })
    .then((answer) => {
      db.query(
        `INSERT INTO ${table} (${columnName}) VALUES (?)`,
        answer.data,
        (err, res) => {
          if (err) {
            console.error(err);
          }
          console.log("\nAdded to the database");
          start();
        }
      );
    });
};

// Add a role with department
const addRole = () => {};

// Add an employee
const addEmployee = () => {};

// Update an employee's role
const updateEmployeeRole = () => {};

start();
