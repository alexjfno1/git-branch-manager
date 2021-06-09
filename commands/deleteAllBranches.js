const childProcess = require("child_process");

module.exports = () => {
  childProcess.exec(
    'git branch | grep -v "main" | xargs git branch -D',
    {},
    () => {
      console.log("=> Removed all branches except 'main':"); // eslint-disable-line no-console
    }
  );
};
