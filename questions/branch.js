var inquirer = require('inquirer');

const checkoutBranchQuestion = branches => {
  return {
    type: 'list',
    name: 'branchToCheckout',
    message: 'Which branch would you like to checkout?',
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

const removeAllBranchesQuestion = () => ({
  type: 'list',
  name: 'removeAllBranches',
  message: 'Are you sure you want to remove all branches except \'master\'?',
  choices: [
    new inquirer.Separator(),
    { name: 'No', value: false },
    { name: 'Yes', value: true },
    new inquirer.Separator()
  ]
});

module.exports = {
  checkout: checkoutBranchQuestion,
  remove: removeBranchQuestions,
  removeAll: removeAllBranchesQuestion
}