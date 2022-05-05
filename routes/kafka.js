// import the `Kafka` instance from the kafkajs library
const { json } = require("express")
const { Kafka } = require("kafkajs")
const { moderation_flag, moderation_type, moderation_id, moderation_flag_by, moderation_platform, moderation_category, moderation_contentId } = require('../helpers/environmentVariablesHelper.js');

// the client ID lets kafka know who's producing the messages
const clientId = "f23f0a0351e5"
// we can define the list of brokers in the cluster
const brokers = ["10.0.0.5:9092", "localhost:9092"]
// this is the topic to which we want to write messages
const topic = "flagged"

// initialize a new kafka client and initialize a producer from it
const kafka = new Kafka({ clientId, brokers })
const producer = kafka.producer()
const moderation = require('./moderation')

// we define an async function that writes a new message each second
exports.produce = async (req, res) => {
    await producer.connect()

    // // after the produce has connected, we start an interval timer
    // setInterval(async () => {
    try {
        // send a message to the configured topic with
        // the key and value formed from the current value of `i`
        let body = req.body
        if (body && Object.keys(body).length != 0) {
            if (moderation_flag && moderation_type === 'post-moderation') {
                res = JSON.parse(res)
                body.response = res.payload.topicData.tid
            }
            body = JSON.stringify(body)
            const d = new Date();
            let time = d.getTime();
            let payload = {
                "text": req.body.content,
                "heading": req.body.title,
                "raw": body,
                "type": "TEXT",
                "profaneStrings": [
                ],
                "classification": null,
                "id": moderation_id,
                "flaggedBy": moderation_flag_by,
                "url": null,
                "timestamp": time,
                "author": req.body.email,
                "feedbackOriginPlatform": moderation_platform,
                "feedbackOriginCategory": moderation_category,
                "moderationtimestamp": null,
                "comment": "some comment about comment",
                "published": false,
                "moderated": false,
                "contentId": moderation_contentId

            }

            await producer.send({ topic, messages: [{ key: "125", value: JSON.stringify(payload) }] })
            //  consume()
            // if the message is written successfully, log it and increment `i`
            if (moderation_flag && moderation_type === 'pre-moderation') {
                res.send({ code: "ok" })
            }
            console.log("writes: ", payload)
            // moderation.sendNotification(req)
        }
    } catch (err) {
        console.error("could not write message " + err)
    }
    // }, 1000)

}

// the kafka instance and configuration variables are the same as before

// create a new consumer from the kafka client, and set its group ID
// the group ID helps Kafka keep track of the messages that this client
// is yet to receive
const consumer = kafka.consumer({ groupId: clientId })

exports.consume = async () => {
    // first, we wait for the client to connect and subscribe to the given topic
    let arr = []
    await consumer.connect()
    await consumer.subscribe({ "topic": "moderated" })
    await consumer.run({
        // this function is called every time the consumer gets a new message
        eachMessage: ({ message }) => {
            // here, we just log the message to the standard output
            try {
                let val = message.value
                val = val.toString()
                val = JSON.parse(val)
                console.log(val)
                if (val.raw) {
                    let raw = val.raw
                    raw.replace(/({)([a-zA-Z0-9]+)(:)/, '$1"$2"$3')
                    console.log(raw)
                    raw = JSON.parse(raw)
                    console.log('class ===>', raw.classification)
                    if (moderation_flag && moderation_type === 'post-moderation') {
                        if (val.classification != "SFW") {
                            moderation.deleteTopic(val, raw)
                        }
                    } else if (moderation_flag && moderation_type === 'pre-moderation') {
                        if (val.classification === "SFW") {
                            moderation.createTopic(val, raw)
                        } else {
                            moderation.sendNotification(val, raw)
                        }
                    }
                }
            } catch (err) {
                console.log(err)
            }
        },
    })
}
