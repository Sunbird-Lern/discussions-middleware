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
    moderation_flag: env.moderation_flag || 'false',
    moderation_type: env.moderation_type || 'pre-moderation',
    moderation_id: env.moderation_id || 'GEbX4X0B9pbA_yqYBUtM',
    moderation_flag_by: env.moderation_flag_by || 'system_flagged',
    moderation_platform: env.moderation_platform || 'Sunbird',
    moderation_category: env.moderation_category || 'discussions',
    moderation_contentId: env.moderation_contentId || '1112223332552',
    moderation_email: env.moderation_email || 'test@tarento.com',
    moderation_email_subject: env.moderation_email_subject || 'Sunbird Discussion  Moderation',
    moderation_course: env.moderation_course || 'Sunbird training',
    LEARNER_SERVICE_URL: env.learner_service_url || 'https://igot-dev.in',
    SB_API_KEY: env.SB_API_KEY || 'bearer abc',
    enable_audit_event: env.enable_audit_event || 'true'
}

module.exports = devEnvVariables;