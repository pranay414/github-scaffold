#!/usr/bin/env node
const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');

const files = require('./lib/files');
const repo = require('./lib/repo');
const github = require('./lib/github')

// Clear console and print `GitScaffold`
// banner in yellow
clear();
console.log(
    chalk.yellow(
        figlet.textSync('GitScaffold', { horizontalLayout: 'full'})
    )
);

// Check if the working directory is already
// a git repository
if(files.directoryExists('.git')) {
    console.log(
        chalk.red('Already a git repository!')
    )
    process.exit()
}

const getGithubToken = async () => {
    // Fetch token from config store
    let token = github.getStoredGithubToken()
    if(token) {
        return token
    }

    // No token found, use credentials to access to access Github account
    await github.setGithubCredentials()

    // Register new token
    token = await github.registerNewToken()

    return token
}

// Ask for user's Github credentials
const run = async () => {
    
    try {
        // Retrieve & set auth token
        const token = await getGithubToken()
        github.githubAuth(token)

        // Create remote repo
        const url = await repo.createRemoteRepo()

        // Create .gitignore file
        await repo.createGitIgnore()

        // Set up local repository and push to remote
        const done = await repo.setupRepo(url)

        if(done) {
            console.log(chalk.green('All done!'))
        }
    }
    catch(err) {
        if(err) {
            switch(err.code) {
                case 401:
                    console.log(chalk.red('Couldn\'t log you in. Please provide correct credentials/token.'))
                    break;
                case 422:
                    console.log(chalk.red('There already exists a remote repository with the same name'))
                    break;
                default:
                    console.log(err)
            }
        }
    }
}
run();