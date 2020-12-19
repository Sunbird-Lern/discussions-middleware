'use strict'
const env = process.env
const __envIn = 'dev';

let devEnvVariables = {
    NODEBB_SERVICE_URL:  'https://dev.sunbirded.org/discussions/api',
    Authorization:   '9c1adb65-14a9-421d-be75-6006f49c85b6',
    MONGODB_CONNECTION_URL: env.mongodb_connection_url
}

module.exports = devEnvVariables;