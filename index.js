// code works until it hits the generation portion. Need to fix
var fs = require("fs")
var inquirer = require("inquirer")
var path = require("path")
var util = require("util")
var axios = require("axios")
// problem area
var writeToFile = util.promisify(fs.writeFile)
// prompts user responses
const promptUser = () => {

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
const checkuser = async (username) =>{
    try {
        return axios.get(`http://api.github.com/users/${username}?client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}`)
        .catch(function (error) {
            // handle error
            if(error.response.status == 404){
                console.log("user does nit exist")
            }
        })
    }
    catch(err) {
        return err;
        // here there is an error, you can choose to handle this error as you'd like 

    }
}
async function init(){
    try { 
        const answers = await promptUser();
        // console.log(answers);
        // process.exit();
        const readMe = genReadMe(answers);
        console.log(readMe)
        await writeReadme("README.md", readMe)
    }catch (err){
        console.log(err)
    }
}

init();

// used functions down here
const genReadMe = (answers) => {
    return `
    ------${ answers.project }------
    Project license is ${makeBadge( answers.license, answers.username, answers.project )}
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
    ${answers.username}
    `;
}
function makeBadge(license,username,project){
    checkuser(username).then(function(license,username,project){
        return `Github license is: ([![GitHub](https://img.shields.io/github/license/${license}/?style=for-the-badge)](http://github.com/${username}/${project}))`
    }) 
}

// -------------Possible ignore area----------
function writeReadme(filename, answers) {
    return writeToFile(path.join(process.cwd(), filename), answers)
}
// end used functions
