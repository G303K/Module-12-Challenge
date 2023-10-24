const mysql = require("mysql2");
const inquirer = require("inquirer");
const cTable = require("console.table");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "p@ssword",
  database: "employees_db",
});

db.connect((err) => {
  if (err) throw err;
  mainMenu();
});

const mainMenu = () => {
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
        case "Display Roles":
          display("SELECT roles.id 'ID', roles.roles 'Title', department.department 'Department', roles.salary 'Salary' FROM department JOIN roles ON department.id = roles.department_id ORDER BY roles.id ASC;");
          break;
        case "Quit":
          process.exit();
          break;
      }
    });
};

const display = (query) => {
  db.query(query, (err, results) => {
    if (err) throw err;
    console.log("\n");
    console.table(results);
    mainMenu();
  });
};


mainMenu();
