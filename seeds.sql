USE company;

-- DROP TABLE IF EXISTS department;
INSERT INTO department (name)
VALUES ('Service'),
    ('Sales'),
    ('Finance');

-- DROP TABLE IF EXISTS role;
INSERT INTO role (title, salary, department_id)
VALUES
    ('Service Technican', '85000', 1),
    ('Service Advisor', '55000', 1),
    ('Salesperson', '75000', 2),
    ('Sales Manager', '125000', 2),
    ('Porter', '25000', 1),
    ('Finance Manager', '80000', 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
    ('John', 'Wickham', 1, null),
    ('Thomas', 'Wayne', 2, 1),
    ('Susan', 'White', 3, 1);