const cTable = require('console.table');
const inquirer = require('inquirer');
const connection = require('../config/connection');



// String validation
const stringTypeOf = async (input) => {
    // String Regular Expression
    const regex = /^[a-zA-Z]+$/;
    if (input.match(regex) && input.length > 0) {
        return true;

    }
    return 'Only string type allowed'
};


// Number validation.
const numberTypeOf = async (input) => {
    // Numeric Regular Expression
    const regex = /^[0-9]+$/
    if (input.match(regex) && input.length > 0 && input !== ' ') {
        return 'Only numbers are allowed';
    }
    return true;
};

class Queries {
    static async viewAllDeparments() {
        // https://www.npmjs.com/package/mysql2#using-promise-wrapper 
        // Promise Wrapper.
        const [rows, fields] = await connection.promise().query(`SELECT * FROM employee_trackerdb.department;`);
        console.table(rows);
    }
    static async viewAllRoles() {
        const [rows, fields] = await connection.promise().query(`SELECT role.title AS Title, role.role_id AS Role_id, department.name AS Department, role.salary AS Salary  FROM employee_trackerdb.role
        INNER JOIN employee_trackerdb.department ON role.department_id = department.department_id
        GROUP BY role.role_id
        ORDER BY role.title ASC;`
        );
        console.table(rows);
    }
    static async viewAllEmployees() {
        const [rows, fields] = await connection.promise().query(`SELECT emp1.first_name AS 'First Name', emp1.last_name AS 'Last Name', title AS 'Title', name AS 'Department', salary AS 'Salary', GROUP_CONCAT(DISTINCT emp2.first_name,' ', emp2.last_name) AS 'Manager'
        FROM employee emp1
        JOIN role ON emp1.role_id = role.role_id
        JOIN department ON role.department_id = department.department_id
        LEFT JOIN employee emp2 ON emp1.manager_id = emp2.employee_id
        GROUP BY emp1.employee_id
        ORDER BY emp1.last_name ASC;
        `);
        console.table(rows);
    }
    static async showDeparments() {
        const [rows, fields] = await connection.promise().query(`SELECT CONCAT_WS(' ',department.department_id, department.name) AS Id_Name FROM employee_trackerdb.department;`);
        console.log(rows);
        return rows;
    }
    static async showRoles() {
        const [rows, fields] = await connection.promise().query(`SELECT CONCAT_WS(' ', role.role_id, role.title) AS Id_Name FROM employee_trackerdb.role;`
        );
        return rows;
    }
    static async showEmployees() {
        const [rows, fields] = await connection.promise().query(`SELECT  CONCAT_WS(' ', employee_id, first_name, last_name) 
        AS Id_Name FROM employee_trackerdb.employee;`
        );
        return rows;
    }
    static async updateEmployee() {
        const [rows, fields] = await connection.promise().query(`SELECT CONCAT_WS(' ',first_name, last_name) AS FullName, role.title AS Title, role.role_id AS Role_id FROM employee_trackerdb.employee
        INNER JOIN employee_trackerdb.role ON employee.role_id = role.role_id
        
        `);
        return rows;
    }

    // === Add Department Function ===
    static async addDepartment() {
        const addDepartmentPrompt = await inquirer.prompt([
            {
                type: 'input',
                name: 'department',
                message: 'Write the name for this new Department',
                validate: stringTypeOf
            }
        ]);
        await connection.promise().query(`
        INSERT INTO employee_trackdb.department (name)
        VALUES (?);`, addDepartmentPrompt.department)
        console.log(`Deparment name ${addDepartmentPrompt.department} Added!`);
    };

    // === Add Role Function ===
    static async addRole() {
        // === Call the table Department as an Object ===
        const department = await this.showDeparments();
        // === Renders the object into an array to be able to use the information as list choices. ===
        const departmentChoices = department.map(department => department.Id_Name);
        // === Add Role Prompt. ===
        const addRolePrompt = await inquirer.prompt([
            {
                type: 'input',
                name: 'Title',
                message: 'Introduce the title for this role',
                validate: stringTypeOf
            },
            {
                type: 'input',
                name: 'Salary',
                message: 'Assign the salary for this role',
                validate: numberTypeOf

            },
            {
                type: 'list',
                name: 'Department',
                message: 'Assign the deparment for this role',
                choices: departmentChoices
            }
        ]);

        // === Removes the string values and only retains the ID number from the department, to use it as deparment_id value. ===
        const deparmentId = addRolePrompt.Department.replace(/\D/g, '');
        await connection.promise().query(`
        INSERT INTO employee_trackerdb.role (title, salary, department_id)
        VALUES (?,?,?);`, [addRolePrompt.Title, addRolePrompt.Salary, deparmentId]);
        console.log(`\n Role ${addRolePrompt.Title} Added!`);
    };
    static async addEmployee() {
        const getEmployee = await this.showEmployees();
        const employeeChoices = getEmployee.map(employee => employee.Id_Name);
        const getRole = await this.showRoles();
        const roleChoices = getRole.map(role => role.Id_Name);

        const addEmployeePrompt = await inquirer.prompt([
            {
                type: 'list',
                name: 'Manager',
                message: `Who will be the employee's manager?`,
                choices: employeeChoices
            },
            {
                type: 'input',
                name: 'FirstName',
                message: `Introduce employee's first name`,
                validate: stringTypeOf
            },
            {
                type: 'input',
                name: 'LastName',
                message: `Introduce employee's last name`,
                validate: stringTypeOf
            },
            {
                type: 'list',
                name: 'Role',
                message: `Choose the employee's role`,
                choices: roleChoices
            }
        ]);
        const employeeId = addEmployeePrompt.Manager.replace(/\D/g, '');
        const roleId = addEmployeePrompt.Role.replace(/\D/g, '');
        await connection.promise().query(`
        INSERT INTO employee_trackerdb.employee (first_name, last_name, role_id, manager_id)
        VALUES (?,?,?,?);`, [addEmployeePrompt.FirstName, addEmployeePrompt.LastName, roleId, employeeId]);
        console.log(`\n New employee named ${addEmployeePrompt.FirstName} Added!`);
    };

    static async updateEmployeesRole() {
        const getAllEmployees = await this.updateEmployee();
        const getRoles = await this.showRoles();
        const nameUpdateChoices = getAllEmployees.map(employees => employees.FullName);
        const roleUpdateChoices = getRoles.map(employees => employees.Id_Name)

        // === Update employee's role prompt ===
        const updateEmployeePrompt = await inquirer.prompt([
            {
                type: 'list',
                name: 'NameOptions',
                message: `Choose the employee to be relocated`,
                choices: nameUpdateChoices

            },
            {
                type: 'list',
                name: 'RoleOptions',
                message: `Choose the employee's new role`,
                choices: roleUpdateChoices

            }
        ]);
        // === Role position in the names array after the users selection. ===
        const arrayNamePosition = nameUpdateChoices.indexOf(updateEmployeePrompt.NameOptions);
        // === Role position in the role array after the users selection. ===
        const arrayRolePosition = roleUpdateChoices.indexOf(updateEmployeePrompt.RoleOptions);
        console.log(arrayRolePosition, arrayNamePosition);


        const rolePosition = updateEmployeePrompt.RoleOptions.replace(/\d/g, '');
        console.log("\n                               *******************************************************************")
        console.log("                                                                                                ")
        console.log(`                                           ${updateEmployeePrompt.NameOptions} new role is ${rolePosition}          `)
        console.log("                                                                                               ")
        console.log("                               ******************************************************************* \n\n")


        await connection.promise().query(`
        UPDATE employee
        SET role_id = '?' 
        WHERE employee_id = ?;`, [arrayRolePosition + 1, arrayNamePosition + 1]);


    };





};



module.exports = Queries;

