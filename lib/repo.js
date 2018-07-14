const _ = require('lodash');
const fs = require('fs');
const git = require('simple-git')();
const CLI = require('clui');
const Spinner = CLI.Spinner;

const inquirer = require('./inquirer');
const gh = require('./github');

module.exports = {
    // Create remote repository
    createRemoteRepo: async () => {
        const github = gh.getInstance()
        const answers = await inquirer.askRepoDetails()

        const data = {
            name: answers.name,
            description: answers.description,
            private: (answers.visibility === 'private')
        }

        const status = new Spinner('Creating remote repository...')
        status.start()

        try {
            const response = await github.repos.create(data)
            return response.data.https_url
        }
        catch(err) {
            throw err
        }
        finally {
            status.stop()
        }
    },

    // Create a .gitignore file
    createGitIgnore: async () => {
        const filelist = _.without(fs.readdirSync('.'), '.git', '.gitignore')
        if(filelist.length) {
            const answers = await inquirer.askIgnoreFiles(filelist)
            if(answers.ignore.length) {
                fs.writeFileSync('.gitignore', answers.ignore.join('\n'))
            }
            else {
                touch('.gitignore')
            }
        }
        else {
            touch('gitignore')
        }
    },

    // Setup local git repo
    setupRepo: async () => {
        const status = new Spinner('Initializing local repository and pushing to remote...')
        status.start()
        try {
            await git
                .init()
                .add('.gitignore')
                .add('./*')
                .commit('Initial commit')
                .addRemote('origin', url)
                .push('origin', 'master')
            return true
        }
        catch(err) {
            throw err
        }
        finally {
            status.stop()
        }
    }
}
