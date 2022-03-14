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

exports.createTopic = async (body) => {
    try {
        console.log(body)
        const response = await axios.post(`${nodebbServiceUrl}/v2/topics?_uid=${body.response._uid}`,body, {
            headers: { 'Authorization': 'Bearer ' + Authorization },
        })
        console.log(response)
    } catch (err) {
        console.log(err)

    }
}