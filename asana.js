
const Asana = require('asana');

/**
 * 
 * @param {String} accessToken Asana PAT
 * @param {String} name Task name
 * @param {String} notes Notes to add to the ticket
 * @param {String array} projects Projects to add the task to
 * @returns String, url of created task
 */
async function createTask(accessToken, name, notes, projects) {
    let client = Asana.ApiClient.instance;
    let token = client.authentications['token'];
    token.accessToken = accessToken;
    
    let tasksApiInstance = new Asana.TasksApi();
    let body = {
        "data": {
            "name": name,
            "notes": notes,
            "projects": projects, // needs to be string array
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