'use strict'
const env = process.env
const __envIn = 'dev';

let devEnvVariables = {
    DISCUSSION_FORUM: env.sunbird_discussion_forum || 'http://nodebb-service:4567/api',
    Authorization: 'a4838b88-6a04-4293-a504-245862cad404',
    MONGODB_CONNECTION_URL: env.mongodb_connection_url || 'mongodb://localhost:27017/'
}

module.exports = devEnvVariables;