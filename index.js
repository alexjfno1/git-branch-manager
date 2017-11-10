#!/usr/bin/env node

var inquirer = require('inquirer');
var childProcess = require('child_process');

const initialQuestion = {
  type: 'list',
  name: 'selectedOption',
  message: 'What would you like to do?',
  choices: [
    new inquirer.Separator(),
    { name: 'Checkout a local branch', value: 'checkoutLocal' },
    { name: 'Checkout a remote branch', value: 'checkoutRemote' },
    { name: 'Prune remote branches', value: 'prune' },
    { name: 'Tidy up branches', value: 'tidy' },
    { name: 'Remove all branches (except master)', value: 'delete' },
    new inquirer.Separator()
  ]
};

const checkoutBranchQuestion = branches => {
  return {
    type: 'list',
    name: 'branchToCheckout',
    message: 'Which branch would you like tp checkout?',
    choices: [
      new inquirer.Separator(),
      ...branches
        .filter(branch => !branch.startsWith('*'))
        .map(branch => ({ name: branch, value: branch })),
      new inquirer.Separator()
    ]
  };
};

const removeBranchQuestions = branches => {
  return branches
    .filter(branch => !branch.startsWith('*'))
    .map(branch => ({
      type: 'list',
      name: branch,
      message: 'Remove "' + branch + '" branch?',
      choices: [
        new inquirer.Separator(),
        { name: 'No', value: false },
        { name: 'Yes', value: true },
        new inquirer.Separator()
      ]
    }));
};

const removeAllBranchesQuestion = {
  type: 'list',
  name: 'removeAllBranches',
  message: 'Are you sure you want to remove all branches except \'master\'?',
  choices: [
    new inquirer.Separator(),
    { name: 'No', value: false },
    { name: 'Yes', value: true },
    new inquirer.Separator()
  ]
};

inquirer.prompt([initialQuestion]).then(answer => {
  switch (answer.selectedOption) {
    case 'checkoutLocal': {
      childProcess.exec('git branch', {}, (err, stdout) => {
        const branches = stdout
          .replace(/\n/g, '/-/')
          .replace(/\s/g, '')
          .split('/-/')
          .filter(branch => branch.length > 0);

        inquirer.prompt(checkoutBranchQuestion(branches)).then(answer => {
          childProcess.exec('git checkout ' + answer.branchToCheckout, {}, (_, stdout, stderr) => {
            console.log('\n', stdout, stderr);
          });
        });
      });
      break;
    }
    case 'checkoutRemote': {
      childProcess.exec('git branch -r', {}, (err, stdout) => {
        const branches = stdout
          .replace(/\n/g, '/-/')
          .replace(/\s/g, '')
          .split('/-/')
          .filter(branch => branch.length > 0)
          .map(branch => branch.replace('origin/', ''));

        inquirer.prompt(checkoutBranchQuestion(branches)).then(answer => {
          childProcess.exec('git checkout ' + answer.branchToCheckout, {}, (_, stdout, stderr) => {
            console.log('\n', stdout, stderr);
          });
        });
      });
      break;
    }
    case 'prune': {
      console.log('=> Pruning remote branches');
      childProcess.exec('git prune remote origin', {}, () => {
        console.log('=> Done Pruning remote branches');
      });
      break;
    }
    case 'tidy': {
      childProcess.exec('git branch | grep -v "master"', {}, (err, stdout) => {
        const branches = stdout
          .replace(/\n/g, '/-/')
          .replace(/\s/g, '')
          .split('/-/')
          .filter(branch => branch.length > 0);

        inquirer.prompt(removeBranchQuestions(branches)).then(answers => {
          Object.keys(answers).forEach(branchName => {
            if (answers[branchName]) {
              childProcess.exec('git branch -D ' + branchName, {}, () => {
                console.log('=> Removed branch:', branchName);
              });
            }
          });
        });
      });
      break;
    }
    case 'delete': {
      inquirer.prompt([removeAllBranchesQuestion]).then(answer => {
        if (answer.removeAllBranches) {
          childProcess.exec('git branch | grep -v "master" | xargs git branch -D', {}, () => {
            console.log('=> Removed all branches except \'master\':');
          });
        }
      });
      break;
    }
  }
});