const core = require('@actions/core');
const github = require('@actions/github');
const pull = require("./pull");

try {
    pull.getPullRequestInfo();
} catch (error) {
    core.setFailed(error.message);
}