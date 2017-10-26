var inquirer = require('inquirer');
var childProcess = require('child_process');

const initialQuestion = {
  type: 'list',
  name: 'selectedOption',
  message: 'What would you like to do?',
  choices: [
    new inquirer.Separator(),
    { name: 'Prune remote branches', value: 'prune' },
    { name: 'Tidy up branches', value: 'tidy' },
    { name: 'Remove all branches (except master)', value: 'delete' },
    new inquirer.Separator()
  ]
};

const removeBranchQuestions = branches => {
  return branches.map(branch => ({
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

inquirer.prompt([initialQuestion]).then(answer => {
  switch (answer.selectedOption) {
    case 'prune': {
      console.log('=> Pruning remote branches');
      childProcess.exec('git prune remote origin', {}, () => {
        console.log('=> Done Pruning remote branches');
      });
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
    }
  }
});