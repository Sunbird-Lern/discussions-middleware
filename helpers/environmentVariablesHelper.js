'use strict'
const env = process.env
const __envIn = 'dev';

let devEnvVariables = {
    NODEBB_SERVICE_URL: 'https://dev.sunbirded.org/discussions/api', //'http://nodebb-service:4567/api',
    Authorization:  '9c1adb65-14a9-421d-be75-6006f49c85b6'
}

module.exports = devEnvVariables;