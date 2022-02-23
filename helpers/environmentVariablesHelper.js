'use strict'
const env = process.env
const __envIn = 'dev';

let devEnvVariables = {
    NODEBB_SERVICE_URL: env.nodebb_service_url || 'https://staging.sunbirded.org',
    Authorization:  env.authorization_token || 'fc5448c9-1816-474e-8720-19ea4e42464b',
    nodebb_api_slug: env.nodebb_api_slug || '/discussions/api',
    enable_notifications: env.enable_notifications || true,
    API_AUTH_TOKEN: env.API_AUTH_TOKEN || '',
    TELEMETRY_SERVICE_URL: env.TELEMETRY_SERVICE_URL || 'https://dev.sunbirded.org',
    TELEMETRY_SERVICE_API_SLUG: env.TELEMETRY_SERVICE_API_SLUG || '/v1/telemetry',
    TELEMETRY_EVENTS_BATCH_SIZE: env.TELEMETRY_EVENTS_BATCH_SIZE || 1
}

module.exports = devEnvVariables;