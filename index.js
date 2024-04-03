const core = require('@actions/core');
const github = require('@actions/github');

try {
    testing();
} catch (error) {
    core.setFailed(error.message);
}

function testing() {
    const context = github.context;
    console.log(context);
}