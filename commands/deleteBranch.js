const childProcess = require('child_process');

module.exports = (branchName) => {
  childProcess.exec(`git branch -D ${branchName}`, {}, () => {
    console.log('=> Removed branch:', branchName); // eslint-disable-line no-console
  });
};
