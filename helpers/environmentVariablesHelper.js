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
    TELEMETRY_EVENTS_BATCH_SIZE: env.TELEMETRY_EVENTS_BATCH_SIZE || 1,
    moderation_flag: env.moderation_flag || true,
    moderation_type: env.moderation_type || 'pre-moderation',
    LEARNER_SERVICE_URL: env.learner_service_url || 'https://igot-dev.in',
    SB_API_KEY: env.SB_API_KEY || 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJRekw4VVA1dUtqUFdaZVpMd1ZtTFJvNHdqWTg2a2FrcSJ9.TPjV0xLacSbp3FbJ7XeqHoKFN35Rl4YHx3DZNN9pm0o',
    enable_audit_event: env.enable_audit_event || true
}

module.exports = devEnvVariables;