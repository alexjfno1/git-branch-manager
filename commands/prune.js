const childProcess = require('child_process');

module.exports = () => {
  childProcess.exec('git remote prune origin', {}, (_, stdout, stderr) => {
    console.log('=> Done Pruning remote branches'); // eslint-disable-line no-console
    console.log('\n', stdout, stderr); // eslint-disable-line no-console
  });
};
