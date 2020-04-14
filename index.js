// code works until it hits the generation portion. Need to fix
var fs = require("fs")
var inquirer = require("inquirer")
var path = require("path")
var util = require("util")
var axios = require("axios")
var writeToFile = util.promisify(fs.writeToFile)
// prompts user responses
let promptUser = () => {
    return inquirer.prompt([{
            type: "input",
            message: "what is your github username?",
            name: "username"
        },
        {
            type: "input",
            message: "What is the name of your project?",
            name: "project"
        },
        {
            type: "input",
            message: "What does your project do?",
            name: "summary"
        },
        {
            type: "list",
            name:"license",
            message: "What license does the project have?",
            choices: ["MIT", "wtfpl", "afl-3.0", "None"]
        },
        {
            type: "input",
            name: "install",
            message: "What is the command to install these?",
            default: "npm i"
        },
        {
            type: "input",
            name: "test",
            message: "What is the command for testing?",
            default: "npm test"
        },
        {
            type: "input",
            message: "What is the common knowledge you need for using repositories?",
            name: "knowledge"
        },
        {
            type: "input",
            message: "What do you need to know to push code to a repository?",
            name: "code"
        }
    ])
}

promptUser();
function init(){
    try { 
        checkuser(username);
        const answers = await promptUser();
        const readMe = genReadMe(answers);
        await writeToFile("README.md", readMe)
    }catch (err){
        console.log(err)
    }
}

init();

// used functions down here
const genReadMe = (answers) => {
    return `
    ------${answers.project}------
    
    Project license is ${makeBadge(answers.license, answers.username, answers.project)}

    -----Summary-----

    ${answers.summary}

    -----Installation------

    To install the item use the following command in node
    ${answers.install}

    ----Usage----
    ${answers.knowledge}
    ${answers.license}
    
    ----Testing----
    To run any test please use the following
    ${answers.test}

    -----Contact-----
    For any inquiry into the project contact me at:



    `;
}

//    should check username responses responses
function checkuser(username){
return axios.get(`http://api.github.com/users/${username}?client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}`)
    .catch(err => {
        return err;

    })
}

function makeBadge(license,username,project){
    return `Github license is: ([![GitHub](https://img.shields.io/github/license/${license}/?style=for-the-badge)](http://github.com/${username}/${project}))`
}

function writeToFile(filename, answers ) {
    return fs.writeToFileSync(path.join(process.cwd(), filename), answers)
}

// end used functions
