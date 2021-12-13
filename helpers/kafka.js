var kafka = require('node-rdkafka');
let env = require('./environmentVariablesHelper');
let topics = {};

const kafkaService = {
    createTopic: (topicName) => {
         topics[topicName] = kafka.Producer.createWriteStream({
            "metadata.broker.list": env.kafka_server_url
        }, {}, {topic: topicName});
    },
    sendMessage: (data, topicName) => {
        const stream = topics[topicName];
        const result = stream.write(data);
        return result;
    }
}

module.exports = kafkaService;
