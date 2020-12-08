'use strict'
const env = process.env
const __envIn = 'dev';

let devEnvVariables = {
    DISCUSSION_FORUM: env.sunbird_discussion_forum || 'https://dev.sunbirded.org/discussions/api', // 'http://nodebb-service:4567/api',
    Authorization:  '9c1adb65-14a9-421d-be75-6006f49c85b6',
    MONGODB_CONNECTION_URL: env.mongodb_connection_url || 'mongodb://11.2.3.75:27017/'
}

module.exports = devEnvVariables;