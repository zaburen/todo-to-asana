const core = require('@actions/core');

function log(anything) {
    if(core.isDebug) {
        core.debug(anything);
    }
}


module.exports = { log }