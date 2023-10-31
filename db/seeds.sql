-- Create the 'company' database if it doesn't exist
USE company;

-- Create the 'department' table
DROP TABLE IF EXISTS department;
CREATE TABLE department (
    name VARCHAR(255)
);

-- Insert data into the 'department' table
INSERT INTO department (name)
VALUES 
    ('Maintenance'),
    ('Leasing Office'),
    ('Operations');

-- Create the 'role' table
DROP TABLE IF EXISTS role;
CREATE TABLE role (
    title VARCHAR(255),
    salary DECIMAL(10, 2),
    department_id INT
);

-- Insert data into the 'role' table
INSERT INTO role (title, salary, department_id)
VALUES
    ('Maintenance Tech', 30000.00, 1),
    ('Office Staff', 32000.00, 2),
    ('Community Manager', 40000.00, 3);

-- Create the 'employee' table
CREATE TABLE employee (
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    role_id INT,
    manager_id INT
);

-- Insert data into the 'employee' table
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
    ('John', 'Dawson', 1, 3),
    ('Whitney', 'Hart', 2, 3),
    ('Billy', 'Johnson', 2, NULL); -- Set manager_id to NULL for Billy Johnson
