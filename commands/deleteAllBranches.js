const childProcess = require("child_process");

module.exports = () => {
  childProcess.exec(
    'git branch | grep -v "main\|master" | xargs git branch -D',
    {},
    () => {
      console.log("=> Removed all branches except 'main' or 'master':"); // eslint-disable-line no-console
    }
  );
};
