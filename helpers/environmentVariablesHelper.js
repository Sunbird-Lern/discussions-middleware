'use strict'
const env = process.env
const __envIn = 'dev';

let devEnvVariables = {
    DISCUSSION_FORUM: env.sunbird_discussion_forum || 'https://dev.sunbirded.org/discussions/api',
    Authorization:  env.authorization_token,
    MONGODB_CONNECTION_URL: env.mongodb_connection_url
}

module.exports = devEnvVariables;