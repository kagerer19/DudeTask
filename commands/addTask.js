import inquirer from "inquirer";
import chalk from "chalk";
import Todos from "../schema/TodoSchema.js";
import {connectDB, disconnectDB} from "../db/connectDB.js";
import ora from "ora";

async function input() {
    return await inquirer.prompt([
        {name: 'name', message: chalk.redBright.italic('What needs to get done Captain?'), type: 'input'},
        {name: 'detail', message: chalk.cyanBright.italic('Put a status on it already!!..'), type: 'input'},
    ])
}

const askQuestions = async () => {

    const todoArray = []
    let loop = false

    do {
        const userRes = await input()
        todoArray.push(userRes)
        const confirmQ = await inquirer.prompt([{
            name: 'confirm',
            message: 'Is that all?',
            type: 'confirm'
        }])
        loop = !!confirmQ.confirm;
    } while (!loop)

    return todoArray
}

export default async function addTask() {
    try {
        const userResponse = await askQuestions()
        await connectDB();
        let spinner = ora('Stashing...').start()

        for(let i=0; i<userResponse.length; i++){
            const response = userResponse[i]
            await Todos.create(response)
        }
        spinner.stop()
        console.log(
            chalk.greenBright('Stashed that shit..')
        )
        await disconnectDB()
    } catch (error) {
        console.log('GLITCHED OUT, probs a dev error', error)
        process.exit(1)
    }
}