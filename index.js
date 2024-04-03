const core = require('@actions/core');
const github = require('@actions/github');
const pull = require("./pull");

try {
    pull.testing();
} catch (error) {
    core.setFailed(error.message);
}