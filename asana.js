
const Asana = require('asana');
const core = require('@actions/core');

/**
 * 
 * @param {String} name Task name
 * @param {String} notes Notes to add to the ticket
 * @returns String, url of created task
 */
async function createTask(name, notes) {
    let client = Asana.ApiClient.instance;
    let token = client.authentications['token'];
    let accessToken = core.getInput('asana-pat');
    if (accessToken === null) {
        throw new Error('Asana PAT has not been set! Please set the PAT in your YAML file.');
    }
    token.accessToken = accessToken;
    console.log(`accessToken: ${token.accessToken}, length ${token.accessToken.length}`);
    
    let asanaProjects = core.getInput('asana-projects');
    if (asanaProjects === null) {
        throw new Error('Asana project ids have not been set! Please set the project ids in your YAML file.');
    }
    console.log(`asanaProjects: ${asanaProjects}, length ${asanaProjects.length}`);

    let tasksApiInstance = new Asana.TasksApi();
    let body = {
        "data": {
            "name": name,
            "notes": notes,
            "projects": asanaProjects, // needs to be string array
            "completed": false,
        },
    };
    let opts = {};


    let resultUrl = '';
    // POST - Create a task
    await tasksApiInstance.createTask(body, opts).then((result) => {
        console.log('API called successfully. Returned data: ' + JSON.stringify(result.data, null, 2));
        resultUrl = result.data.permalink_url;
    }, (error) => {
        console.error(error.response.body);
    });

    return resultUrl;
}


module.exports = { createTask };