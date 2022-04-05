const axios = require('axios')
const { NODEBB_SERVICE_URL, nodebb_api_slug, Authorization, LEARNER_SERVICE_URL, SB_API_KEY, moderation_flag } = require('../helpers/environmentVariablesHelper.js');
const nodebbServiceUrl = NODEBB_SERVICE_URL + nodebb_api_slug;

exports.deleteTopic = async (req, body) => {
    try {
        console.log(body, body.response)
        const response = await axios.delete(`${nodebbServiceUrl}/v2/topics/${body.response}?_uid=1`, {
            headers: { 'Authorization': 'Bearer ' + Authorization },
        })
        console.log(response.body)
        sendNotification(req, body)
    } catch (err) {
        console.log(err)

    }
}

exports.createTopic = async (req, body) => {
    try {
        console.log(body)
        const response = await axios.post(`${nodebbServiceUrl}/v2/topics?_uid=${body._uid}`, body, {
            headers: { 'Authorization': 'Bearer ' + Authorization },
        })
        console.log(response.body)
    } catch (err) {
        console.log(err)

    }
}

exports.sendNotification = (req, raw) => {
    try {
        let message
        if (moderation_flag === 'pre-moderation') {
            message = `your post is not approved due to  reason: ${req.classification}`
        } else if (moderation_flag === 'post-moderation') {
            message = `your post is deleted  due to  reason: ${req.classification}`

        }
        // console.log(body)
        let body = {
            "id": "notification.message.send",
            "ver": "1.0",
            "ets": "11234",
            "params": {
                "did": "",
                "key": "",
                "msgid": ""
            },
            "request": {
                "notifications": [{
                    "mode": "email",
                    "deliveryType": "message",
                    "config": {
                        "sender": "pritha.chattopadhyay@tarento.com",
                        "subject": "Sunbird Discussion  Moderation"
                    },
                    "ids": [raw.email],
                    "template": {
                        "data": message,
                        "params": {
                            "courseName": "Sunbird training"
                        }
                    }
                }]
            }
        }
        const response = await axios.post(`${LEARNER_SERVICE_URL}/api/notification/v1/notification/send/sync`, body, {
            headers: {
                Authorization: SB_API_KEY
            },
        })
        console.log(JSON.stringify(response.data))
    } catch (err) {
        console.log(err)

    }
}
