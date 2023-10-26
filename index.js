const mysql = require("mysql2");
const inquirer = require("inquirer");

let employees = {};

// connect to database

const db = mysql.createConnection(
  {
    host: "localhost",
    user: "root",
    password: "2515",
    database: "employees_db",
  },
  console.log(`Connected to the employees_db database.`)
);

//builds main menu; for display options sends mysql query param to display();
//for other choices starts the specific function

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
    .then(async (answers) => {
      switch (answers.choice) {
        case "Display Departments":
          console.log("before display");
          await display(
            `SELECT department.id 'ID', department.department 'Department' FROM department;`
          );
          mainMenu();
          break;
        case "Display Roles":
          await display(
            `SELECT roles.id 'ID', roles.roles 'Title', department.department 'Department', roles.salary 'Salary' FROM department JOIN roles ON department.id = roles.department_id ORDER BY roles.id ASC;`
          );
          mainMenu();
          break;
        case "Display Employees":
          await display(
            `SELECT e.id 'ID', CONCAT_WS(', ', e.last_name, e.first_name) 'Name', roles.roles 'Title', department.department 'Department', roles.salary 'Salary', CONCAT_WS(', ', m.last_name, m.first_name) 'Manager' FROM employee AS e LEFT JOIN roles ON roles.id = e.roles_id LEFT JOIN department ON department.id = roles.department_id LEFT JOIN employee as m ON m.id = e.manager_id;`
          );
          mainMenu();
          break;
        case "Add Department":
          addDepartment();
          break;
        case "Add Role":
          addRole();
          break;
        case "Add Employee":
          addEmployee();
          break;
        case "Update Employee":
          updateEmployee();
          break;
        case "Delete Menu":
          deleteMenu();
          break;
        default:
          console.log("goodbye");
          process.exit();
      }
    });
};

//displays the table of the mysql param sent to it

const display = (data) => {
  return new Promise((resolve, reject) => {
    db.query(data, (err, results) => {
      if (err) {
        reject(err);
      }
      console.log("\n");
      resolve(console.table(results));
    });
  });
};

//builds an array of the department names to be used by inquirer

const departmentChoiceArray = () => {
  const tempArray = [];
  return new Promise((resolve, reject) => {
    db.query(`SELECT * FROM department;`, (err, results) => {
      if (err) {
        reject(err);
      } else {
        for (const element of results) {
          tempArray.push(element.department);
        }
        resolve(tempArray);
      }
    });
  });
};

//builds an array of the employee names to be used by inquirer; adds None to array so
//one can chose none for manager; sends the results to employees array so that getting
//the employee ID is easier later

const employeeChoiceArray = () => {
  const tempArray = [];
  return new Promise((resolve, reject) => {
    db.query(
      `SELECT id 'ID', CONCAT_WS(', ', last_name, first_name) 'Name' FROM employee;`,
      (err, results) => {
        if (err) {
          reject(err);
        } else {
          employees = results;
          for (const element of results) {
            tempArray.push(element.Name);
          }
          tempArray.push("None");
          resolve(tempArray);
        }
      }
    );
  });
};

//builds an array of role names to be used by inquirer

const rolesArray = () => {
  const tempArray = [];
  return new Promise((resolve, reject) => {
    db.query(`SELECT * FROM roles;`, (err, results) => {
      if (err) {
        reject(err);
      } else {
        for (const element of results) {
          tempArray.push(element.roles);
        }
        resolve(tempArray);
      }
    });
  });
};

//gets ID for item in either department or roles table

const getId = (table, data) => {
  return new Promise((resolve, reject) => {
    db.query(
      `SELECT id FROM ${table} WHERE ${table} = "${data}";`,
      (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results[0].id);
        }
      }
    );
  });
};

//gets ID for item in employee table or null if none was chosen from list (for manager)

const getEmployeeId = (data) => {
  return new Promise((resolve, reject) => {
    for (i = 0; i < employees.length; i++) {
      if (employees[i].Name === data) {
        resolve(employees[i].ID);
      }
    }
    resolve(null);
  });
};

//Adds a new department

function addDepartment() {
  inquirer
    .prompt([
      {
        name: "name",
        type: "input",
        message: "What do you want to name the new department:",
      },
    ])
    .then((answers) => {
      const query = `INSERT INTO department (department) VALUES (?);`;
      db.query(query, answers.name, (err, results) => {
        if (err) {
          console.log(err);
        } else {
          mainMenu();
        }
      });
    });
}

//Adds a new role

async function addRole() {
  inquirer
    .prompt([
      {
        name: "name",
        type: "input",
        message: "What is the name of the role:",
      },
      {
        name: "salary",
        type: "number",
        message: "What is the salary of the role:",
      },
      {
        name: "department",
        type: "list",
        message: "Which department does the role belong to:",
        choices: await departmentChoiceArray(),
      },
    ])
    .then(async (answers) => {
      db.query(
        `INSERT INTO roles (roles, salary, department_id) VALUES (?,?,?)`,
        [
          `${answers.name}`,
          `${answers.salary}`,
          `${await getId("department", answers.department)}`,
        ],
        (err, results) => {
          if (err) {
            console.log(err);
          } else {
            mainMenu();
          }
        }
      );
    });
}

//Adds a new employee

async function addEmployee() {
  inquirer
    .prompt([
      {
        name: "firstname",
        type: "input",
        message: "What is the employee's first name:",
      },
      {
        name: "lastname",
        type: "input",
        message: "What is the employee's last name:",
      },
      {
        name: "role",
        type: "list",
        message: "What is the employee's role?",
        choices: await rolesArray(),
      },
      {
        name: "manager",
        type: "list",
        message: "Who is the employee's manager?",
        choices: await employeeChoiceArray(),
      },
    ])
    .then(async (answers) => {
      db.query(
        `INSERT INTO employee (first_name, last_name, roles_id, manager_id) VALUES (?,?,?,?)`,
        [
          `${answers.firstname}`,
          `${answers.lastname}`,
          await getId("roles", answers.role),
          await getEmployeeId(answers.manager),
        ],
        (err, results) => {
          if (err) {
            console.log(err);
          } else {
            mainMenu();
          }
        }
      );
    });
}

//updates role for a specific employee

async function updateRole(id) {
  inquirer
    .prompt([
      {
        name: "role",
        type: "list",
        message: "Which role do you want to assign:",
        choices: await rolesArray(),
      },
    ])
    .then(async (answers) => {
      const query = "UPDATE employee SET roles_id=? WHERE id=?";
      db.query(query, [await getId("roles", answers.role), id], (err, data) => {
        if (err) {
          console.log(err);
        } else {
          updateMenu(id);
        }
      });
    });
}

//updates manager for a specific employee

async function updateManager(id) {
  inquirer
    .prompt([
      {
        name: "manager",
        type: "list",
        message: "Which manager do you want to assign:",
        choices: await employeeChoiceArray(),
      },
    ])
    .then(async (answers) => {
      const query = "UPDATE employee SET manager_id=? WHERE id=?";
      db.query(
        query,
        [await getEmployeeId(answers.manager), id],
        (err, data) => {
          if (err) {
            console.log(err);
          } else {
            updateMenu(id);
          }
        }
      );
    });
}

//displays chosen employee then detrmines what the user wants to change

async function updateMenu(id) {
  await display(
    `SELECT e.id 'ID', CONCAT_WS(', ', e.last_name, e.first_name) 'Name', roles.roles 'Title', department.department 'Department', roles.salary 'Salary', CONCAT_WS(', ', m.last_name, m.first_name) 'Manager' FROM employee AS e LEFT JOIN roles ON roles.id = e.roles_id LEFT JOIN department ON department.id = roles.department_id LEFT JOIN employee as m ON m.id = e.manager_id WHERE e.id = ${id};`
  );
  inquirer
    .prompt([
      {
        name: "choice",
        type: "list",
        message: "What do you want to update:",
        choices: ["Update Role", "Update Manager", "Back"],
      },
    ])
    .then((answers) => {
      switch (answers.choice) {
        case "Update Role":
          updateRole(id);
          break;
        case "Update Manager":
          updateManager(id);
          break;
        default:
          mainMenu();
          break;
      }
    });
}

//determines which employee the user wants to update

async function updateEmployee() {
  inquirer
    .prompt([
      {
        name: "employee",
        type: "list",
        message: "Which employee do you want to update:",
        choices: await employeeChoiceArray(),
      },
    ])
    .then(async (answers) => {
      updateMenu(await getEmployeeId(answers.employee));
    });
}

//larger function that handles three posibilities; first it builds an array to be used
//by inquirer; then it exits if back was chosen or gets the ID of the chosen item
//then deletes it

async function deleteThing(choice) {
  let list = "";
  if (choice === "department") {
    list = await departmentChoiceArray();
  } else if (choice === "roles") {
    list = await rolesArray();
  } else {
    list = await employeeChoiceArray();
  }
  list.push("Back");
  inquirer
    .prompt([
      {
        name: "choice",
        type: "list",
        message: "Which do you want to delete:",
        choices: list,
      },
    ])
    .then(async (answers) => {
      let id;
      if (answers.choice === "Back") {
        deleteMenu();
      } else {
        if (choice === "department") {
          id = await getId(choice, answers.choice);
        } else if (choice === "roles") {
          id = await getId(choice, answers.choice);
        } else if (choice === "employee") {
          id = await getEmployeeId(answers.choice);
        }
        db.query(`DELETE FROM ${choice} WHERE id=?`, id, (err, data) => {
          if (err) {
            console.log(err);
          } else {
            deleteMenu();
          }
        });
      }
    });
}

//menu of choices for deleting things

function deleteMenu() {
  inquirer
    .prompt([
      {
        name: "choice",
        type: "list",
        message: "What would you like to delete:",
        choices: ["Department", "Role", "Employee", "Back"],
      },
    ])
    .then(async (answers) => {
      switch (answers.choice) {
        case "Department":
          deleteThing("department");
          break;
        case "Role":
          deleteThing("roles");
          break;
        case "Employee":
          deleteThing("employee");
          break;
        default:
          mainMenu();
      }
    });
}

//starts it all

mainMenu();