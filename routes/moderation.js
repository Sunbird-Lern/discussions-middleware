import axios from 'axios'
const { NODEBB_SERVICE_URL, nodebb_api_slug } = require('../helpers/environmentVariablesHelper.js');
const nodebbServiceUrl = NODEBB_SERVICE_URL + nodebb_api_slug;

exports.deleteTopic = async (body) => {
    const response = await axios.delete(`${nodebbServiceUrl}/v2/topics/${body.tid}`, body, {
        headers: { rootOrg },
    })
}