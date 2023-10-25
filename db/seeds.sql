USE company;

-- DROP TABLE IF EXISTS department;
INSERT INTO department (name)
VALUES ('Maintenance'),
    ('Leasing Office'),
    ('Operations');

-- DROP TABLE IF EXISTS role;
INSERT INTO role (title, salary, department_id)
VALUES
    ('Sales Lead', '100000', 1),
    ('Salesperson', '80000', 1),
    ('Software Engineer', '120000', 2);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
    ('John', 'Doe', 1, null),
    ('Whitney', 'Kropat', 2, 1),
    ('Another', 'Person', 3, 1);