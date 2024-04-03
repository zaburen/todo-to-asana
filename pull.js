const core = require('@actions/core');
const github = require('@actions/github');

function testing() {
    const context = github.context;
    console.log(context);
}

async function getPullRequestInfo() {
    const context = github.context;
    console.log(context);

    const repository = context.payload.repository;
    if (repository == null) {
        throw new Error('Payload does not have repository value. Check workflow trigger.');
    }
    const ownerName = repository.owner.login;
    const repoName = repository.name;
    
    const pullRequest = context.payload.pull_request;
    if (pullRequest == null) {
        throw new Error('Payload does not have pull_request value. Check workflow trigger.');
    }
    const pullRequestNumber = pullRequest.number;

    console.log(`ownerName: ${ownerName}, repoName: ${repoName}, pullRequestNumber: ${pullRequestNumber}`);
}


module.exports = { testing, getPullRequestInfo };