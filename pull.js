const core = require('@actions/core');
const github = require('@actions/github');
const { getFileAndCodeChunkArrayFromDiff } = require('./util-diff');
const { doChangedLinesHaveTodoComments } = require('./todo-checker');
const { log } = require('./log');


/**
 * Get Array for with custom Objects holding 
 * file name, array of blocks of code with new todo comments, and url for pull request
 * @returns Array [ { fileName: String, codeBlocks: [String, String, ...], pullRequestUrl: String} ]
 */
async function getFilesWithTodoComments() {
    const requestParams = getRequestParams();
    const pullRequestInfo = await getPullRequestInfo(
        requestParams.ownerName, 
        requestParams.repoName, 
        requestParams.pullRequestNumber
        );
    return pullRequestInfo;
}

/**
 * Get parameters need to make a request for Pull Request info.
 * 
 * @returns Object { ownerName: String, repoName: String, pullRequestNumber: String }
 */
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
    return { ownerName: ownerName, repoName: repoName, pullRequestNumber: pullRequestNumber };
}

/**
 * 
 * @param {String} ownerName 
 * @param {String} repoName 
 * @param {String} pullRequestNumber 
 * @returns Array [ { fileName: String, codeBlocks: [String, String, ...], pullRequestUrl: String} ]
 */
async function getPullRequestInfo(ownerName, repoName, pullRequestNumber) {
    const githubToken = core.getInput('github-token');
    const octokit = github.getOctokit(githubToken)

    const { data: pullRequest } = await octokit.rest.pulls.get({
        owner: ownerName,
        repo: repoName,
        pull_number: pullRequestNumber,
    });

    log(`pullRequest data: \n${pullRequest}`);

    let language = pullRequest.head.repo.language;
    let pullRequestUrl = pullRequest.html_url;

    const { data: diff } = await octokit.rest.pulls.get({
        owner: ownerName,
        repo: repoName,
        pull_number: pullRequestNumber,
        mediaType: {
          format: 'diff'
        }
    });

    log(`diff data: \n${diff}`)

    let fileAndChunks = getFileAndCodeChunkArrayFromDiff(diff)

    // make return array with custom objects
    let returnInfo = [];
    fileAndChunks.forEach(fileAndChunk => {
        let codeBlocksWithTodo = fileAndChunk.codeChunks
            .filter(chunk => doChangedLinesHaveTodoComments(chunk.changedLines, language))
            .map(chunk => chunk.codeChunk); // only need the code chunk not lines
        if (codeBlocksWithTodo.length <= 0) {
            log(`${fileAndChunk.fileName} had no new TODO comments`);
            return;
        }
        let obj = {
            fileName: fileAndChunk.fileName,
            codeBlocks: codeBlocksWithTodo,
            pullRequestUrl: pullRequestUrl,
        };
        returnInfo.push(obj);
    })

    return returnInfo;
}

module.exports = { getFilesWithTodoComments };