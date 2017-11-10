#!/usr/bin/env node

var inquirer = require('inquirer');
var childProcess = require('child_process');

var initialQuestion = require('./questions/initial');
var branchQuestions = require('./questions/branch');

var checkoutBranch = require('./commands/checkoutBranch');
var parseBranches = require('./commands/parseBranches');
var pruneBranches = require('./commands/prune');
var deleteBranch = require('./commands/deleteBranch');
var deleteAllBranches = require('./commands/deleteAllBranches');

inquirer.prompt([initialQuestion]).then(answer => {
  switch (answer.selectedOption) {
    case 'checkoutLocal': {
      parseBranches('git branch', (branches) => {
        inquirer.prompt(branchQuestions.checkout(branches)).then(answer => {
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

        inquirer.prompt(branchQuestions.checkout(remoteBranches)).then(answer => {
          checkoutBranch(answer.branchToCheckout);
        });
      });
      break;
    }
    case 'prune': {
      pruneBranches();
      break;
    }
    case 'tidy': {
      parseBranches('git branch | grep -v "master"', (branches) => {
        inquirer.prompt(branchQuestions.remove(branches)).then(answers => {
          Object.keys(answers).forEach(branchName => {
            if (answers[branchName]) {
              deleteBranch(branchName);
            }
          });
        });
      });
      break;
    }
    case 'delete': {
      inquirer.prompt([branchQuestions.removeAll()]).then(answer => {
        if (answer.removeAllBranches) {
          deleteAllBranches();
        }
      });
      break;
    }
  }
});