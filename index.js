const core = require('@actions/core');
const github = require('@actions/github');
const pull = require("./pull");
const { createTask } = require('./asana');


async function run() {
    try {
        let pullRequestInfoArray = await pull.getFilesWithTodoComments();

        let newTaskUrls = await makeAsanaTasks(pullRequestInfoArray);

        if(newTaskUrls.length > 0) {
            pull.postComment(`New Tasks:\n${newTaskUrls.join('\n')}`);
        }
    } catch (error) {
        core.setFailed(error.message);
    }
}

/**
 * 
 * https://developers.asana.com/docs/rich-text
 * 
 * @param {Object} pullRequestInfoArray 
 * @returns 
 */
async function makeAsanaTasks(pullRequestInfoArray) {
    let newTaskUrls = [];

    for await (const pullRequestInfo of pullRequestInfoArray) {
        let fileName = pullRequestInfo.fileName;
        let pullRequestUrl = pullRequestInfo.pullRequestUrl;
        let index = 1;
        for await (const codeBlock of pullRequestInfo.codeBlocks) {
            let taskName = `${fileName}: ${index} (${new Date().toLocaleDateString()})`;
            let pullRequestNote = `<a href="${pullRequestUrl}">Pull Request</a>`;
            let codeBlockNote = `<code>${codeBlock}</code>`;
            let taskNote = `<body>${pullRequestNote}\n\n${codeBlockNote}\n</body>`;
            let taskUrl = await createTask(taskName, taskNote);
            newTaskUrls.push(taskUrl);
            index = index++;
        }
    }

    return newTaskUrls;
}

run();