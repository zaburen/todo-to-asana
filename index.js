const core = require('@actions/core');
const github = require('@actions/github');
const pull = require("./pull");
const { createTask } = require('./asana');


async function run() {
    try {
        let pullRequestInfoArray = await pull.getFilesWithTodoComments();

        pullRequestInfoArray.forEach(pullRequestInfo => {
            let fileName = pullRequestInfo.fileName;
            let pullRequestUrl = pullRequestInfo.pullRequestUrl;
            pullRequestInfo.codeBlocks.forEach((codeBlock, index) => {
                let taskName = `${fileName}: ${index} (${new Date().toLocaleDateString()})`;
                let taskNote = `${pullRequestUrl}\n\n\`\`\`\n${codeBlock}\`\`\``;
                createTask(taskName, taskNote)
            });
        });
    } catch (error) {
        core.setFailed(error.message);
    }
}

run();