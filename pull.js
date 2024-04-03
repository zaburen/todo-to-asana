const core = require('@actions/core');
const github = require('@actions/github');

function testing() {
    const context = github.context;
    console.log(context);
}

module.exports = { testing };