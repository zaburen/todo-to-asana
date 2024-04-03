const core = require('@actions/core');
const github = require('@actions/github');

function testing() {
    console.log('testing from pull.js')
}


module.exports = { testing };