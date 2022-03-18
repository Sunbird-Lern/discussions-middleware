const axios = require('axios')
const { NODEBB_SERVICE_URL, nodebb_api_slug, Authorization, LEARNER_SERVICE_URL, SB_API_KEY } = require('../helpers/environmentVariablesHelper.js');
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
        const response = await axios.post(`${nodebbServiceUrl}/v2/topics?_uid=${body._uid}`,body, {
            headers: { 'Authorization': 'Bearer ' + Authorization },
        })
        console.log(response)
    } catch (err) {
        console.log(err)

    }
}

exports.sendNotification = async (req) => {
    try {
        // console.log(body)
        let body = {
            "request": {
                "name": "Arun",
                "subject": "test email",
                "body": "Hello Arun.",
                "downloadUrl": "https://www.google.com/",
                "mode": "email",
                "recipientEmails": [
                    "arunkumar.pilli@tarento.com",
                    "amit1.kumar@tarento.com"
                ],
                "recipientUserIds": [
                    "arunsix_ie7x"
                ],
            }
        }
        const response = await axios.post(`${LEARNER_SERVICE_URL}/v1/notification/email`, body, {
            headers: { 'Authorization': SB_API_KEY },
        })
        console.log(JSON.stringify(response.data))
    } catch (err) {
        console.log(err)

    }
}