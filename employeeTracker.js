var mysql = require("mysql");
var inquirer = require("inquirer");
var util = require("util");
require("console.table");
require('dotenv').config()

// create the connection information for the sql database
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
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
        choices: ["View All Employees", "Add Employee", "View All Roles", "Add Role", 
            "View All Departments", "Add Department", "Exit"]
        })
    .then(function(answer) {
    switch (answer.action) {
        case "View All Employees":
            viewEmployees();
            break;
        case "Add Employee":
            addEmployee();
            break;
        case "View All Roles":
            viewRoles();
            break;
        case "Add Role":
            addRole();
            break;
        case "View All Departments":
            viewDepartments();
            break;
        case "Add Department":
            addDepartment();
            break;
        case "Exit":
            console.log("Goodbye");
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

    manager = await connection.query("SELECT * FROM employeeTrackerDB.Employee;")
    console.table(manager);
    var managerRes = manager.map(manager => {
        return {
            value: manager.id,
            name: manager.last_name
        };
    });

    managerRes.unshift({
        name: "No Manager",
        value: null
    });

    const empManager = await inquirer
    .prompt({
        name: "manager",
        type: "list",
        message: "Who is this employees manager?",
        choices: managerRes
    });

    const empRole = await inquirer
    .prompt({
        name: "role",
        type: "list",
        message: "What is this employees role?",
        choices: roleRes
    });
    
    const empName = await inquirer
    .prompt([{
        name: "first",
        message: "What is this employees first name?",
    },
        {
        name: "last",
        message: "What is this employees last name?"
        }]);
    insertEmployee();

        async function insertEmployee() {
            
            let query = connection.query(
              "INSERT INTO Employee SET ?",
              {
                first_name: empName.first,
                Last_name: empName.last,
                role_id: empRole.role,
                manager_id: manager.id
              },
            await function(err, res) {
                if (err) throw err;
                console.log("Your employee was added successfully!");
            });  
        };
    start();     
};     
   
    async function viewRoles() {
        var query = "SELECT title AS Roles FROM Role;"
        var roleResponse = await connection.query(query);
        console.table(roleResponse);
        start();
    };

    async function addRole() {
        const roleName = await inquirer
        .prompt([{
            name: "newRole",
            message: "What role would you like to add?",
            },
        ]);
        let query = connection.query(
            "INSERT INTO Role SET ?",
            {
              name: roleName.newRole
            },
          await function(err, res) {
              if (err) throw err;
              console.log("A new role was added successfully!");
              start();
          }); 
    };

    async function addDepartment() {
        const deptName = await inquirer
        .prompt([{
            name: "department",
            message: "What is name of the Department you'd like to add?",
            },
        ]);
        let query = connection.query(
            "INSERT INTO Department SET ?",
            {
              name: deptName.department
            },
          await function(err, res) {
              if (err) throw err;
              console.log("Your department was added successfully!");
              start();
          }); 
    };

    async function viewDepartments() {
        var query = "SELECT name AS Departments FROM Department;"
        var deptResponse = await connection.query(query);
        console.table(deptResponse);
        start();
    };
        