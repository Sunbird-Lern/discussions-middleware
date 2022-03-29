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
        const response = await axios.post(`${nodebbServiceUrl}/v2/topics?_uid=${body._uid}`, body, {
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
            "notifications": [
                {
                    "mode": "email",
                    "deliveryType": "message",
                    "config": {
                        "sender": "pritha.chattopadhyay@tarento.com",
                        "subject": "Email Subject"
                    },
                    "ids": [
                        "arunkumar.pilli@tarento.com",
                        "amit1.kumar@tarento.com"
                    ],
                    "template": {
                        "data": "testing moderation",
                        "id": "",
                        "params": {}
                    }
                }
            ]
        }
        const response = await axios.post(`${LEARNER_SERVICE_URL}/api/notification/v1/notification/send/sync`, body, {
            headers: {
                Authorization: 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJRekw4VVA1dUtqUFdaZVpMd1ZtTFJvNHdqWTg2a2FrcSJ9.TPjV0xLacSbp3FbJ7XeqHoKFN35Rl4YHx3DZNN9pm0o'
            },
        })
        console.log(JSON.stringify(response.data))
    } catch (err) {
        console.log(err)

    }
}
