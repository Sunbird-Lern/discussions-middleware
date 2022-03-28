'use strict'
const env = process.env
const __envIn = 'dev';

let devEnvVariables = {
    NODEBB_SERVICE_URL: env.nodebb_service_url || 'https://dev.sunbirded.org', //'http://nodebb-service:4567/api',
    Authorization:  env.authorization_token || 'd8402b15-1d5f-4d84-9fae-595ef805f287', // '9c1adb65-14a9-421d-be75-6006f49c85b6',
    nodebb_api_slug: env.nodebb_api_slug || '/discussions/api',
    moderation_flag: env.moderation_flag || true,
    moderation_type: env.moderation_type || 'pre-moderation',
    LEARNER_SERVICE_URL: env.learner_service_url || 'https://igot-dev.in',
    SB_API_KEY: env.SB_API_KEY || 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJRekw4VVA1dUtqUFdaZVpMd1ZtTFJvNHdqWTg2a2FrcSJ9.TPjV0xLacSbp3FbJ7XeqHoKFN35Rl4YHx3DZNN9pm0o',

}

module.exports = devEnvVariables;