const inquirer = require('inquirer');
const mysql = require('mysql2');
const cTable = require('console.table');
const connection = require('./config/connection');
const { setTimeout: setTimeoutPromiseBased } = require('timers/promises');
const Font = require('ascii-art-font');
const Queries = require('./query/queries');






// Welcome messages.
const init = async () => {
    console.log('\n ' + '='.repeat(100) + '\n');
    Font.create(' Employee TrackerDB', 'Doom', (err, result) => {
        if (err) throw err;
        console.log(result);
    });
    await setTimeoutPromiseBased(1000);
    console.log('\n ' + '='.repeat(100) + '\n');
    Font.create('                      Welcome', 'Doom', (err, result) => {
        if (err) throw err;
        console.log(result);

    });
    await setTimeoutPromiseBased(1200);
    require('child_process').execSync('cls', { stdio: 'inherit' });
    //Clears Terminal after the preview messages are shown.
    await setTimeoutPromiseBased(1400);
    console.log('\n ' + '='.repeat(100) + '\n');
    Font.create(`                      CLI Starting`, `Doom`, (err, result) => {
        if (err) throw err;
        console.log(result);
        console.log('='.repeat(100));
    });
    await setTimeoutPromiseBased(2500);
    require('child_process').execSync('cls', { stdio: 'inherit' });
    promptChoices();
}

init();
function promptChoices() {
    const userSurv = [
        {
            type: 'list',
            name: 'choices',
            message: 'What would you like to do?',
            choices: [
                'View all deparments',
                'View all roles',
                'View all employees',
                'Add a department',
                'Add a role',
                'Add an employee',
                `Update the employee's role`,
                // `Update the employee's manager`,
                // 'View employees by department',
                // 'Delete a deparment',
                // 'Delete a role',
                // 'Delete an employee',
                // 'View a deparment budget',
                'Exit'
            ]
        }
    ];
    inquirer.prompt(userSurv)
        .then(function (answer) {
            userSelection(answer);
        })
}


const userSelection = async (answer) => {

    const { choices } = answer;
    switch (choices) {
        case 'View all deparments':
            await Queries.viewAllDeparments();
            promptChoices();
            break;
        case 'View all roles':
            await Queries.viewAllRoles();
            promptChoices();
            break;
        case 'View all employees':
            await Queries.viewAllEmployees();
            promptChoices();
            break;
        case 'Add a department':
            await Queries.addDepartment();
            promptChoices();
            break;
        case 'Add a role':
            await Queries.addRole();
            promptChoices();
            break;
        case 'Add an employee':
            await Queries.addEmployee();
            promptChoices();
            break;
        case `Update the employee's role`:
            await Queries.updateEmployeesRole();
            promptChoices();
            break;
        case `Update the employee's manager`:
            await Queries();
            promptChoices();
            break;
        case 'View employees by department':
            await Queries();
            promptChoices();
            break;
        case 'Delete a deparment':
            await Queries();
            promptChoices();
            break;
        case 'Delete a role':
            await Queries();
            promptChoices();
            break;
        case 'Delete an employee':
            await Queries();
            promptChoices();
            break;
        case 'View a deparment budget':
            await Queries();
            promptChoices();
            break;
        case 'Exit':
            connection.end();
            console.log("\n                               ***********************************")
            console.log("                               *                                  *")
            console.log(`                               *      Connection Closed - ${connection.threadId}     *`)
            console.log("                               *                                  *")
            console.log("                               ***********************************\n\n")
            break;
    }
}