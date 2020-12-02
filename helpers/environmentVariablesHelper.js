'use strict'
const env = process.env
const __envIn = 'dev';

let devEnvVariables = {
    DISCUSSION_FORUM: env.sunbird_discussion_forum || 'http://nodebb-service:4567',
    Authorization: 'a4838b88-6a04-4293-a504-245862cad404',
}

module.exports = devEnvVariables;