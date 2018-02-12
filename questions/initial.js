const inquirer = require('inquirer');

module.exports = {
  type: 'list',
  name: 'selectedOption',
  message: 'What would you like to do?',
  choices: [
    new inquirer.Separator(),
    { name: 'Checkout a local branch', value: 'checkoutLocal' },
    { name: 'Checkout a remote branch', value: 'checkoutRemote' },
    { name: 'Create new branch', value: 'newBranch' },
    { name: 'Prune remote branches', value: 'prune' },
    { name: 'Tidy up branches', value: 'tidy' },
    { name: 'Remove all branches (except master)', value: 'delete' },
    new inquirer.Separator(),
  ],
};
