var childProcess = require('child_process');

module.exports = () => {
  childProcess.exec('git prune remote origin', {}, () => {
    console.log('=> Done Pruning remote branches');
  });
};