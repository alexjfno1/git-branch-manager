var childProcess = require('child_process');

module.exports = (branchName) => {
  childProcess.exec('git checkout ' + branchName, {}, (_, stdout, stderr) => {
    console.log('\n', stdout, stderr);
  });
};