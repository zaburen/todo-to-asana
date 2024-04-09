const core = require('@actions/core');
const github = require('@actions/github');
const pull = require("./pull");
const { createTask } = require('./asana');


async function run() {
    try {
        let pullRequestInfoArray = await pull.getFilesWithTodoComments();

        let newTaskUrls = [];
        pullRequestInfoArray.forEach(pullRequestInfo => {
            let fileName = pullRequestInfo.fileName;
            let pullRequestUrl = pullRequestInfo.pullRequestUrl;
            pullRequestInfo.codeBlocks.forEach((codeBlock, index) => {
                let taskName = `${fileName}: ${index +1} (${new Date().toLocaleDateString()})`;
                let taskNote = `${pullRequestUrl}\n\n\`\`\`\n${codeBlock}\n\`\`\``;
                let taskUrl = createTask(taskName, taskNote)
                newTaskUrls.push(taskUrl);
            });
        });
        if(newTaskUrls.length > 0) {
            pull.postComment(`New Tasks:\n${newTaskUrls.join('\n')}`);
        }
    } catch (error) {
        core.setFailed(error.message);
    }
}

run();