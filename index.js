const core = require('@actions/core');
const github = require('@actions/github');
const pull = require("./pull");
const { createTask } = require('./asana');


async function run() {
    try {
        let pullRequestInfoArray = await pull.getFilesWithTodoComments();

        pullRequestInfoArray.forEach(pullRequestInfo => {
            let fileName = pullRequestInfo.fileName;
            pullRequestInfo.codeBlocks.forEach((codeBlock, index) => {
                createTask(
                    `${fileName}: ${index} (${new Date().toLocaleDateString()})`,
                    codeBlock,
                )
            });
        });
    } catch (error) {
        core.setFailed(error.message);
    }
}

run();