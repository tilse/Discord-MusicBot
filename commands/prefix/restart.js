const execSync = require("child_process").execSync;

async function commandHandler(client, message, query) {
	
  let out = execSync("git pull", { encoding: "utf-8" });
  console.log("Output was:\n", out);

  console.log("initiating restart...");
  out = execSync("pm2 restart music", { encoding: "utf-8" });
  }
  module.exports = commandHandler;