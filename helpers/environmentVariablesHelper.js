'use strict'
const env = process.env
const __envIn = 'dev';

let devEnvVariables = {
    NODEBB_SERVICE_URL: env.nodebb_service_url || 'http://nodebb-service:4567/api',
    Authorization:  env.authorization_token,
    MONGODB_CONNECTION_URL: env.mongodb_connection_url
}

module.exports = devEnvVariables;