'use strict'
const env = process.env
const __envIn = 'dev';
// const __envIn = 'staging';
// const __envIn = 'preprod';

let devEnvVariables = {
    DISCUSSION_FORUM: env.sunbird_discussion_forum || 'http://localhost:4567/api',
    Authorization: env.authorization_token || 'a4838b88-6a04-4293-a504-245862cad404',
}

let stagingEnvVariables = {
    DISCUSSION_FORUM: env.sunbird_discussion_forum || 'http://localhost:4567/api',
}

let preprodEnvVariables = {
    DISCUSSION_FORUM: env.sunbird_discussion_forum || 'http://localhost:4567/api',
}


if (__envIn == 'dev') {
    module.exports = devEnvVariables
} else if (__envIn == 'staging') {
    module.exports = stagingEnvVariables
} else if (__envIn == 'preprod') {
    module.exports = preprodEnvVariables
}