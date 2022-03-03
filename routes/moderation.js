const axios = require('axios')
const { NODEBB_SERVICE_URL, nodebb_api_slug, Authorization } = require('../helpers/environmentVariablesHelper.js');
const nodebbServiceUrl = NODEBB_SERVICE_URL + nodebb_api_slug;

exports.deleteTopic = async (body) => {
    try {
        console.log(body, body.response)
        const response = await axios.delete(`${nodebbServiceUrl}/v2/topics/${body.response}?_uid=1`, {
            headers: { 'Authorization': 'Bearer ' + Authorization },
        })
        console.log(response)
    } catch (err) {
        console.log(err)

    }
}