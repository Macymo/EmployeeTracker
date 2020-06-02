var mysql = require("mysql");
var inquirer = require("inquirer");
var util = require("util");
require("console.table");
require('dotenv').config()

// create the connection information for the sql database
var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: process.env.myPassword,
  database: "employeeTrackerDB"
});

connection.query = util.promisify(connection.query);

// connect to the mysql server and sql database
connection.connect(function(err) {
  if (err) throw err;
  console.log("Connected as ID " + connection.threadId);
  // run the start function after the connection is made to prompt the user
  start();
});

    // function which prompts the user for what action they should take
    function start() {
    inquirer
        .prompt({
            name: "action",
            type: "list",
            message: "What would you like to do?",
            choices: ["View All Employees", "Add Employee", "Remove Employee", "Update Employee Roles",
            "View All Roles", "Add Role", "Remove Role", "View All Departments", "Add Department", "Remove Department"]
        })
        .then(function(answer) {
        switch (answer.action) {
            case "View All Employees":
                viewEmployees();
                break;
            case "Add Employee":
                addEmployee();
                break;
            case "Remove Employee":
                remvEmployee();
                break;
            case "Update Employee Roles":
                updtEmployeeRoles();
                break;
            case "View All Roles":
                viewRoles();
                break;
            case "Add Role":
                addRole();
                break;
            case "Remove Role":
                remvRole();
                break;
            case "View All Departments":
                viewDepartments();
                break;
            case "Add Department":
                addDepartment();
                break;
            case "Remove Department":
                remvDepartment();
                break;
        };
        });
    };

    async function viewEmployees() {
        var query = "SELECT Employee.first_name AS FirstName, Employee.last_name AS LastName, Role.title AS Title, Department.name AS Department, Role.salary AS Salary, CONCAT(manager.first_name, ' ', manager.last_name) AS Manager FROM Employee LEFT JOIN Role ON Role.id = Employee.role_id LEFT JOIN Department ON Role.department_id = Department.id LEFT JOIN Employee manager ON Employee.manager_id = manager.id;"
        var res = await connection.query(query);
        console.table(res);
        start();
    };

    async function addEmployee() {
        var query = "SELECT id,title FROM Role;"
        var rolesResponse = await connection.query(query);
        var roleRes = rolesResponse.map(role => {
            return {
                value: role.id,
                name: role.title
            };
        });

        //Manager
            // User choice in the query to post new employee to DB 
        // before user choices 
        // managerRes.unshift({
        //     name: "no Manager",
        //     value: null

        var userChoices = await inquirer
        .prompt({
            name: "role",
            type: "list",
            message: "What is this employees role?",
            choices: roleRes
        });

    };


// function remvEmployee() {
//   // query the database for all items being auctioned
//   connection.query("SELECT * FROM auctions", function(err, results) {
//     if (err) throw err;
//     // once you have the items, prompt the user for which they'd like to bid on
//     inquirer
//       .prompt([
//         {
//           name: "choice",
//           type: "rawlist",
//           choices: function() {
//             var choiceArray = [];
//             for (var i = 0; i < results.length; i++) {
//               choiceArray.push(results[i].item_name);
//             }
//             return choiceArray;
//           },
//           message: "What auction would you like to place a bid in?"
//         },
//       .then(function(answer) {
//         // get the information of the chosen item
//         var chosenItem;
//         for (var i = 0; i < results.length; i++) {
//           if (results[i].item_name === answer.choice) {
//             chosenItem = results[i];
//           }
//         }
//           );
//         }
//         else {
//           // bid wasn't high enough, so apologize and start over
//           console.log("Your bid was too low. Try again...");
//           start();
//         }
//       });
//   });
// }