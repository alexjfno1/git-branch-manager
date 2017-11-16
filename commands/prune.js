var childProcess = require("child_process");

module.exports = () => {
  childProcess.exec("git remote prune origin", {}, (_, stdout, stderr) => {
    console.log("=> Done Pruning remote branches");
    console.log("\n", stdout, stderr);
  });
};
