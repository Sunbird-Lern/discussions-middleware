'use strict'
const env = process.env
const __envIn = 'dev';

let devEnvVariables = {
    NODEBB_SERVICE_URL: env.nodebb_service_url || 'https://dev.sunbirded.org',
    Authorization:  env.authorization_token || 'd8402b15-1d5f-4d84-9fae-595ef805f287',
    nodebb_api_slug: env.nodebb_api_slug || '/discussions/api',
    enable_notifications: env.enable_notifications || true,
    PORTAL_API_AUTH_TOKEN: env.PORTAL_API_AUTH_TOKEN || '',
    TELEMETRY_SERVICE_LOCAL_URL: env.TELEMETRY_SERVICE_LOCAL_URL || 'https://dev.sunbirded.org',
    TELEMETRY_SERVICE_BATCH_SIZE: env.TELEMETRY_SERVICE_BATCH_SIZE || 1
}

module.exports = devEnvVariables;