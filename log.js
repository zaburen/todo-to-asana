const core = require('@actions/core');

function log(anything) {
    if(core.isDebug) {
        console.log(anything);
    }
}


module.exports = { log }