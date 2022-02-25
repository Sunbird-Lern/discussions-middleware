// import the `Kafka` instance from the kafkajs library
const { json } = require("express")
const { Kafka } = require("kafkajs")

// the client ID lets kafka know who's producing the messages
const clientId = "f23f0a0351e5"
// we can define the list of brokers in the cluster
const brokers = ["10.0.0.5:9092", "localhost:9092"]
// this is the topic to which we want to write messages
const topic = "flagged"

// initialize a new kafka client and initialize a producer from it
const kafka = new Kafka({ clientId, brokers })
const producer = kafka.producer()

// we define an async function that writes a new message each second
exports.produce = async (req, res) => {
    await producer.connect()

    // // after the produce has connected, we start an interval timer
    // setInterval(async () => {
    try {
        // send a message to the configured topic with
        // the key and value formed from the current value of `i`
        let body = JSON.stringify(req.body)
        await producer.send({ topic, messages: [{ key: "125", value: body }] })
        //  consume()
        // if the message is written successfully, log it and increment `i`
        console.log("writes: ", req.body)
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

exports.consume = async (req, res) => {
    // first, we wait for the client to connect and subscribe to the given topic
    await consumer.connect()
    await consumer.subscribe({ topic })
    await consumer.run({
        // this function is called every time the consumer gets a new message
        eachMessage: ({ message }) => {
            // here, we just log the message to the standard output
            return res.send(message.value)
        },
    })
}


