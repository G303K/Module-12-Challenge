const inquirer = require('inquirer');
const mysql = require('mysql2');
const cTable = require('console.table');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '2515',
    database: 'company'
});

// Function to display a menu and handle user choices
const start = () => {
    inquirer.prompt({
        type: 'list',
        name: 'choice',
        message: 'What would you like to do?',
        choices: ['View departments', 'View roles', 'View employees', 'Add department', 'Add role', 'Add employee', 'Update employee role', 'Quit']
    }).then(({ choice }) => {
        switch (choice) {
            case 'View departments':
                viewData('department');
                break;
            case 'View roles':
                viewRoles();
                break;
            case 'View employees':
                viewData('employee');
                break;
            case 'Add department':
                addData('department', 'name');
                break;
            case 'Add role':
                addRole();
                break;
            case 'Add employee':
                addEmployee();
                break;
            case 'Update employee role':
                updateEmployee();
                break;
            default:
                console.log('Goodbye! See you again soon.');
                process.exit();
        }
    });
};

// Function to view data in a table
const viewData = (table) => {
    const query = `SELECT * FROM ${table};`;
    db.query(query, (err, res) => {
        if (err) {
            console.error(err);
        }
        console.log('\n');
        console.table(res);
        start();
    });
};

// Function to add data to a table
const addData = (table, columnName) => {
    inquirer.prompt({
        type: 'input',
        name: 'value',
        message: `What is the ${columnName}?`
    }).then(({ value }) => {
        const query = `INSERT INTO ${table} (${columnName}) VALUES (?);`;
        db.query(query, value, (err, res) => {
            if (err) {
                console.error(err);
            }
            console.log('\nAdded to the database');
            start();
        });
    });
};

// Function to view roles with department names
const viewRoles = () => {
    const query = `SELECT role.id, title, department.name AS department, salary FROM role JOIN department ON role.department_id = department.id;`;
    db.query(query, (err, res) => {
        if (err) {
            console.error(err);
        }
        console.log('\n');
        console.table(res);
        start();
    });
};

start(); 
