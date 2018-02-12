const childProcess = require('child_process');

module.exports = () => {
  childProcess.exec('git branch | grep -v "master" | xargs git branch -D', {}, () => {
    console.log('=> Removed all branches except \'master\':'); // eslint-disable-line no-console
  });
};
