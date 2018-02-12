#!/usr/bin/env node

const inquirer = require('inquirer');

const initialQuestion = require('./questions/initial');
const branchQuestions = require('./questions/branch');

const checkoutBranch = require('./commands/checkoutBranch');
const parseBranches = require('./commands/parseBranches');
const pruneBranches = require('./commands/prune');
const deleteBranch = require('./commands/deleteBranch');
const deleteAllBranches = require('./commands/deleteAllBranches');
const newBranch = require('./commands/newBranch');

inquirer.prompt([initialQuestion]).then((options) => {
  switch (options.selectedOption) {
    case 'checkoutLocal': {
      parseBranches('git branch', (branches) => {
        inquirer.prompt(branchQuestions.checkout(branches)).then((answer) => {
          checkoutBranch(answer.branchToCheckout);
        });
      });
      break;
    }
    case 'checkoutRemote': {
      parseBranches('git branch -r', (branches) => {
        const remoteBranches = branches
          .map(branch => branch.replace('origin/', ''))
          .map(branch => branch.replace('HEAD->origin/', ''));

        inquirer
          .prompt(branchQuestions.checkout(remoteBranches))
          .then((answer) => {
            checkoutBranch(answer.branchToCheckout);
          });
      });
      break;
    }
    case 'newBranch': {
      inquirer.prompt(branchQuestions.newBranch()).then((answer) => {
        newBranch(answer.branchName);
      });
      break;
    }
    case 'prune': {
      pruneBranches();
      break;
    }
    case 'tidy': {
      parseBranches('git branch | grep -v "master"', (branches) => {
        inquirer.prompt(branchQuestions.remove(branches)).then((answers) => {
          Object.keys(answers).forEach((branchName) => {
            if (answers[branchName]) {
              deleteBranch(branchName);
            }
          });
        });
      });
      break;
    }
    case 'delete': {
      inquirer.prompt([branchQuestions.removeAll()]).then((answer) => {
        if (answer.removeAllBranches) {
          deleteAllBranches();
        }
      });
      break;
    }
    default:
  }
});
