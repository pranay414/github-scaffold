const octokit = require('@octokit/rest')();
const Configstore = require('configstore');
const _ = require('lodash');
const CLI = require('clui');
const Spinner = CLI.Spinner;

const pkg = require('../package.json');
const inquirer = require('./inquirer');

const conf = new Configstore(pkg.name);

module.exports = {
    // Get octokit instance from Github API
    getInstance: () => {
        return octokit
    },

    // Access the store token
    githubAuth: (token) => {
        octokit.authenticate({
            type: 'oauth',
            token: token
        })
    },

    // Get the stored Github token 
    getStoredGithubToken: () => {
        return conf.get('github.token')
    },

    // Set Github credentials in config
    setGithubCredentials: async () => {
        const credentials = await inquirer.askGithubCredentials();
        octokit.authenticate(
            _.extend(
                {
                    type: 'basic',
                },
                credentials
            )
        )
    },

    // Register new token if token not present in config
    registerNewToken: async () => {
        const status = new Spinner('Authenticating you, please wait....')
        status.start();

        try {
            const response = await octokit.authorization.create({
                scopes: ['user', 'public_repo', 'repo', 'repo:status'],
                note: 'github-scaffold, the CLI tool for initializing Git repos'
            })

            const token = response.data.token
            if(token) {
                conf.set('github.token', token)
                return token
            }
            else {
                throw new Error('Missing Github Token', 'Github token was not found in the response')
            }
        }
        catch(err) {
            throw err
        }
        finally {
            status.stop()
        }
    }
}