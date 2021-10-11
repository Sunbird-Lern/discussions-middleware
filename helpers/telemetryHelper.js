const Telemetry = require('sb_telemetry_util')
const telemetry = new Telemetry()
const _ = require('lodash')
const fs = require('fs')
const path = require('path')
appId = 'discussionMiddleware'

const telemtryEventConfig = JSON.parse(fs.readFileSync(path.join(__dirname, './telemetryEventConfig.json')))


module.exports = {
  logTelemetryErrorEvent: function (req, res, data, proxyResData, proxyRes, resCode) {
    const context = {
      env: 'discussion-middleware'
    }
    let telemetryObj = {};
    if (proxyRes.statusCode === 404) {
      if (data !== 'Not Found' && (typeof data) !== 'string') {
        telemetryObj = JSON.parse(proxyResData.toString('utf8'));
      } else {
        telemetryObj = resCode;
      }
    } else {
      if (resCode.params) {
        telemetryObj = resCode;
      } else {
        telemetryObj = JSON.parse(proxyResData.toString('utf8'));
      }
    }
    const option = telemetry.getTelemetryAPIError(telemetryObj, proxyRes, context);
    if (option) { this.logApiErrorEventV2(req, telemetryObj, option) }
  },

  logApiErrorEventV2: function (req, data, option) {
    let object = data.obj || {}
    let channel =  _.get(req.headers,'x-channel-id')
    const context = {
      channel: channel,
      env: option.context.env,
      cdata: [],
      pdata: {id: 'discussion-middleware', pid: _.get(req.headers, 'x-app-id'), ver: '1.0.0'},
      did: _.get(req.headers, 'x-device-id'),
      sid:  _.get(req.headers,'x-session-id')
    }
    const actor = {
      id: req.userId ? req.userId.toString() : 'anonymous',
      type: 'user'
    }
    telemetry.error({
      edata: option.edata,
      context: _.pickBy(context, value => !_.isEmpty(value)),
      object: _.pickBy(object, value => !_.isEmpty(value)),
      actor: _.pickBy(actor, value => !_.isEmpty(value))
    })
  },

 /**
   * This function helps to log API access event
   */
  logAPIAccessEvent: function (req, uri) {
    req = this.getTelemetryApiData(req, uri)
    const apiConfig = telemtryEventConfig.URL[uri] || {}
    if (req.reqObj) {
      params = this.getParamsData(req.reqObj, req.statusCode, {}, uri)
    }    
    const edata = telemetry.logEventData('api_call', 'TRACE', apiConfig.message,JSON.stringify(params))
    edata.message = JSON.stringify({title: 'API Log', url: req.reqObj.path})
    let object = {}
    let channel =  _.get(req.reqObj.headers,'x-channel-id')
    const context = {
      channel: channel,
      env: 'discussion-middleware',
      cdata: [],
      pdata: {id: 'discussion-middleware', pid: _.get(req.reqObj.headers, 'x-app-id'), ver: '1.0.0'},
      did: _.get(req.reqObj.headers, 'x-device-id'),
      sid: _.get(req.reqObj.headers,'X-Session-Id') || _.get(req.reqObj.headers,'x-session-id')
    }
    const actor = {
      id:  'anonymous',
      type: 'user'
    }
    telemetry.log({
      edata: edata,
      context: _.pickBy(context, value => !_.isEmpty(value)),
      object: _.pickBy(object, value => !_.isEmpty(value)),
      actor: _.pickBy(actor, value => !_.isEmpty(value))
    })
  },
  /**
* This function helps to get params data for log event
*/
  getParamsData: function (options, statusCode, resp, uri, traceid) {
    const apiConfig = telemtryEventConfig.URL[uri]
    let params = [
      { 'title': apiConfig && apiConfig.title },
      { 'category': apiConfig && apiConfig.category },
      { 'url': options.path || apiConfig && apiConfig.url },
      { 'duration': Date.now() - new Date(options.headers.ts) },
      { 'status': statusCode },
      { 'protocol': 'https' },
      { 'method': options.method },
      { 'traceid': traceid }
    ]
    if (resp) {
      params.push(
        { rid: resp.id },
        { size: resp.toString().length }
      )
    }
    return params
  },

  /**
  * This function helps to get actor data for telemetry
  */
  getTelemetryActorData: function (req) {
    var actor = {}
    // if (req.session && req.session.userId) {
    //   actor.id = req.session && req.session.userId
    //   actor.type = 'User'
    // } else {
      actor.id = req.headers['x-consumer-id'] || telemtryEventConfig.default_userid
      actor.type = req.headers['x-consumer-username'] || telemtryEventConfig.default_username
    // }
    return actor
  },

  /**
 * This function used to generate api_call log telemetryData
 */
getTelemetryApiData: function (req, uri) {
  const telemetryData = {
    reqObj: req,
    statusCode: '200',
    uri: uri,
    channel: req.get('x-channel-id') || ''
  }
  return telemetryData;
}
}