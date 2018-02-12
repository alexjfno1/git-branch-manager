const childProcess = require('child_process');

module.exports = (branchName) => {
  childProcess.exec(`git checkout -b ${branchName}`, {}, (_, stdout, stderr) => {
    console.log('\n', stdout, stderr); // eslint-disable-line no-console
  });
};
