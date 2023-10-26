USE company;

-- DROP TABLE IF EXISTS department;
INSERT INTO department (name)
VALUES ('Maintenance'),
    ('Leasing Office'),
    ('Operations');

-- DROP TABLE IF EXISTS role;
INSERT INTO role (title, salary, department_id)
VALUES
    ('Maintenace Tech', '30000', 1),
    ('Office Staff', '32000', 2),
    ('Community Manager', '40000', 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
    ('John', 'Dawson', 1, 3),
    ('Whitney', 'Hart', 2, 3),
    ('Billy', 'Johnson', 2, NULL); -- Set manager_id to NULL for Billy Johnson
