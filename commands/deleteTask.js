// Importing packages and functions
import inquirer from "inquirer";
import Todos from '../schema/TodoSchema.js'
import {connectDB, disconnectDB} from '../db/connectDB.js'
import ora from "ora";
import chalk from "chalk";

export async function getTaskCode(){
    try {
        const answers = await inquirer.prompt([
            {name: 'code', 'message': 'Enter todo code: ', type: 'input'},
        ])
        answers.code = answers.code.trim()
        return answers
    } catch (error) {
        console.log('Something glitched dude...\n', error)
    }
}

export default async function deleteTask(){
    try {
        // Obtaining the todo code provided by user
        const userCode = await getTaskCode()

        await connectDB()

        const spinner = ora('Finding it, give me a sec...').start()
        const response = await Todos.deleteOne({code: userCode.code})

        spinner.stop()

        if(response.deletedCount === 0){
            console.log(chalk.redBright('No clue what you talking about dude! double check maybe....'))
        } else {
            console.log(chalk.greenBright('....and in the trash! gone...forever!'))
        }

        await disconnectDB()
    } catch (error) {
        console.log('Something glitched dude..., Error:', error)
        process.exit(1)
    }
}