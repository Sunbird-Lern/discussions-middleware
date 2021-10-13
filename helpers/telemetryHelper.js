const Telemetry = require('sb_telemetry_util')
const telemetry = new Telemetry()
const _ = require('lodash')
const fs = require('fs')
const path = require('path');
const pdata = { id: 'discussion-middleware', pid: '', ver: '1.0.0' }

const telemtryEventConfig = JSON.parse(fs.readFileSync(path.join(__dirname, './telemetryEventConfig.json')))


module.exports = {

  /**
   * @description - To log the API Error event
   * @param  {} req
   * @param  {} res
   * @param  {} data
   * @param  {} proxyResData
   * @param  {} proxyRes
   * @param  {} resCode
   * @param  {} env
   */
  logTelemetryErrorEvent: function (req, res, data, proxyResData, proxyRes, resCode, env) {
    let telemetryObj = this.getTelemetryObject(proxyRes, data, proxyResData, resCode);
    const option = telemetry.getTelemetryAPIError(telemetryObj, proxyRes, env);
    if (option) {
      let object = telemetryObj.obj || {}
      let channel = _.get(req.headers, 'x-channel-id') || ''
      const context = {
        channel: channel,
        env: env,
        cdata: [],
        pdata: pdata,
        did: _.get(req.headers, 'x-device-id') || '',
        sid: _.get(req.headers, 'x-session-id') || ''
      }
      context.pdata.pid = _.get(req.headers, 'x-app-id') || '';
      const actor = {
        id: req.headers['x-consumer-id'] || telemtryEventConfig.default_userid,
        type: req.headers['x-consumer-username'] || telemtryEventConfig.default_username
      }
      telemetry.error({
        edata: option.edata,
        context: _.pickBy(context, value => !_.isEmpty(value)),
        object: _.pickBy(object, value => !_.isEmpty(value)),
        actor: _.pickBy(actor, value => !_.isEmpty(value))
      })
    }
  },

  /**
   * This function helps to log API entry event
   */
  logAPIEvent: function (req, uri) {
    const apiConfig = telemtryEventConfig.URL[uri] || {}
    if (req) {
      params = this.getParamsData(req, '', {}, uri)
    }
    const edata = telemetry.logEventData('api_call', 'TRACE', apiConfig.message, JSON.stringify(params))
    edata.message = JSON.stringify({ title: 'API Log', url: req.path })
    let object = {}
    let channel = _.get(req.headers, 'x-channel-id') || ''
    const context = {
      channel: channel,
      env: 'discussion-middleware',
      cdata: [],
      pdata: pdata,
      did: _.get(req.headers, 'x-device-id') || '',
      sid: _.get(req.headers, 'X-Session-Id') || _.get(req.headers, 'x-session-id') || ''
    }
    context.pdata.pid = _.get(req.headers, 'x-app-id') || '';
    const actor = {
      id: req.headers['x-consumer-id'] || telemtryEventConfig.default_userid,
      type: req.headers['x-consumer-username'] || telemtryEventConfig.default_username
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
    if (req.session && req.session.userId) {
      actor.id = req.session && req.session.userId
      actor.type = 'User'
    } else {
      actor.id = req.headers['x-consumer-id'] || telemtryEventConfig.default_userid
      actor.type = req.headers['x-consumer-username'] || telemtryEventConfig.default_username
    }
    return actor
  },

  /**
   * @param  {} proxyRes
   * @param  {} data
   * @param  {} proxyResData
   * @param  {} resCode
   */
  getTelemetryObject(proxyRes, data, proxyResData, resCode) {
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
      return telemetryObj;
    }
  }
}