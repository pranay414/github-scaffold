# github-scaffold
A CLI to initialise git repository.

## Motivation
We know that `git init` initialises a git repository in the current folder. However, there are lot of steps involved in that:
* Initialise the local repository by running `git init`
* Create remote repository
* Add the remote
* Create .gitignore
* And many more...
I do this thing almost 10 times a day and I wanted to automate this task.
P.S I'm a lazy person too.

## How to run locally
This package(`github-scaffold`) is not published on `npm`. If you want to try then follow these steps:
* Clone this repository using `git clone https://github.com/pranay414/github-scaffold.git`
* Install the dependencies using `npm install`
* Run `npm install -g`, to make it globally accessible