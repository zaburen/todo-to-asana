const core = require('@actions/core');
const github = require('@actions/github');
const { getFileAndCodeChunkArrayFromDiff } = require('./util-diff');

async function getPullRequestInfo() {
    const requestParams = getRequestParams();
    const pullRequest = getPullRequestInfoFromBackend(requestParams.ownerName, requestParams.repoName, requestParams.pullRequestNumber);
    
}

function getRequestParams() {
    const context = github.context;

    const repository = context.payload.repository;
    if (repository == null) {
        throw new Error('Payload does not have repository value. Check workflow trigger. (https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions#on)');
    }

    const pullRequest = context.payload.pull_request;
    if (pullRequest == null) {
        throw new Error('Payload does not have pull_request value. Check workflow trigger. (https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions#on)');
    }

    const ownerName = repository.owner.login;
    const repoName = repository.name;
    const pullRequestNumber = pullRequest.number;

    console.log(`ownerName: ${ownerName}, repoName: ${repoName}, pullRequestNumber: ${pullRequestNumber}`);
    return { ownerName: ownerName, repoName: repoName, pullRequestNumber: pullRequestNumber};
}

async function getPullRequestInfoFromBackend(ownerName, repoName, pullRequestNumber) {
    const githubToken = core.getInput('github-token');
    const octokit = github.getOctokit(githubToken)

    const { data: pullRequest } = await octokit.rest.pulls.get({
        owner: ownerName,
        repo: repoName,
        pull_number: pullRequestNumber,
    });

    const { data: diff } = await octokit.rest.pulls.get({
        owner: ownerName,
        repo: repoName,
        pull_number: pullRequestNumber,
        mediaType: {
          format: 'diff'
        }
    });


    console.log(pullRequest);
    console.log('--------------------------------');
    console.log(diff);
    console.log('--------------------------------');
    console.log(getFileAndCodeChunkArrayFromDiff(diff));
}

function logContext() {
    const context = github.context;
    console.log(context);
}


module.exports = { getPullRequestInfo };