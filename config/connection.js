

//  === Dependencies ===
const mysql = require('mysql2');



const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1234592',
    database: 'employee_trackerdb'

});



module.exports = connection;



