const proxyUtils = require('../proxy/proxyUtils.js')
const proxy = require('express-http-proxy');
const { NODEBB_SERVICE_URL, nodebb_api_slug } = require('../helpers/environmentVariablesHelper.js');
const { logger } = require('@project-sunbird/logger');
const BASE_REPORT_URL = "/discussion";
const express = require('express');
const app = express();
const sbLogger = require('sb_logger_util');
const request = require('request');
const Telemetry = require('../libs/sb_telemetry_util/telemetryService.js')
const telemetry = new Telemetry()
const methodSlug = '/update';
const nodebbServiceUrl = NODEBB_SERVICE_URL + nodebb_api_slug;
const _ = require('lodash')

let logObj = {
  "eid": "LOG",
  "ets": 1518460198146,
  "ver": "3.0",
  "mid": "LOG:69e9ca45-c7e2-4a94-af50-50a4ff854cc9",
  "actor": {
    "id": "discussion-forum-middleware",
    "type": "API"
  },
  "context": {},
  "edata": {}
};
const responseObj = {
  errorCode: 400,
  message: 'You are not authorized to perform this action.'
};

app.post(`${BASE_REPORT_URL}/forum/v2/read`, proxyObject());
app.post(`${BASE_REPORT_URL}/forum/v2/create`, proxyObject());
app.post(`${BASE_REPORT_URL}/forum/v2/remove`, proxyObject());
app.post(`${BASE_REPORT_URL}/forum/v3/create`, proxyObject());
app.post(`${BASE_REPORT_URL}/forum/tags`, proxyObject())
app.post(`${BASE_REPORT_URL}/privileges/v2/copy`, proxyObject());

app.post(`${BASE_REPORT_URL}/forum/v3/group/membership`, proxyObject());
app.post(`${BASE_REPORT_URL}/forum/v3/groups/users`, proxyObject());
app.post(`${BASE_REPORT_URL}/forum/v3/category/:cid/privileges`, proxyObject());

app.get(`${BASE_REPORT_URL}/tags`, proxyObject());
app.post(`${BASE_REPORT_URL}/tags/list`, proxyObject());
app.get(`${BASE_REPORT_URL}/tags/:tag`, proxyObject());
app.get(`${BASE_REPORT_URL}/categories`, proxyObject());
app.post(`${BASE_REPORT_URL}/category/list`, proxyObject());
app.get(`${BASE_REPORT_URL}/notifications`, proxyObject());

app.get(`${BASE_REPORT_URL}/user/:userslug`, proxyObject())
app.get(`${BASE_REPORT_URL}/user/:userslug/upvoted`, proxyObject())
app.get(`${BASE_REPORT_URL}/user/:userslug/downvoted`, proxyObject())
app.get(`${BASE_REPORT_URL}/user/:userslug/bookmarks`, proxyObject())
app.get(`${BASE_REPORT_URL}/user/:userslug/best`, proxyObject())
app.get(`${BASE_REPORT_URL}/user/:userslug/posts`, proxyObject())

// categories apis
app.get(`${BASE_REPORT_URL}/category/:category_id/:slug`, proxyObject());
app.get(`${BASE_REPORT_URL}/categories`, proxyObject());
app.get(`${BASE_REPORT_URL}/category/:cid`, proxyObject());
app.get(`${BASE_REPORT_URL}/categories/:cid/moderators`, proxyObject());

// topic apis
app.get(`${BASE_REPORT_URL}/unread`, proxyObject());
app.get(`${BASE_REPORT_URL}/recent`, proxyObject());
app.get(`${BASE_REPORT_URL}/popular`, proxyObject());
app.get(`${BASE_REPORT_URL}/top`, proxyObject());
app.get(`${BASE_REPORT_URL}/topic/:topic_id/:slug`, proxyObject());
app.get(`${BASE_REPORT_URL}/topic/:topic_id`, proxyObject());
app.get(`${BASE_REPORT_URL}/unread/total`, proxyObject());
app.get(`${BASE_REPORT_URL}/topic/teaser/:topic_id`, proxyObject());
app.get(`${BASE_REPORT_URL}/topic/pagination/:topic_id`, proxyObject());

// groups api
app.get(`${BASE_REPORT_URL}/groups`, proxyObject());
app.get(`${BASE_REPORT_URL}/groups/:slug`, proxyObject());
app.get(`${BASE_REPORT_URL}/groups/:slug/members`, proxyObject());

// post apis
app.get(`${BASE_REPORT_URL}/recent/posts/:day`, proxyObject());

// all admin apis
app.get(`${BASE_REPORT_URL}/user/admin/watched`, proxyObject());
app.get(`${BASE_REPORT_URL}/user/admin/info`, proxyObject());
app.get(`${BASE_REPORT_URL}/user/admin/bookmarks`, proxyObject());
app.get(`${BASE_REPORT_URL}/user/admin/posts`, proxyObject());
app.get(`${BASE_REPORT_URL}/user/admin/groups`, proxyObject());
app.get(`${BASE_REPORT_URL}/user/admin/upvoted`, proxyObject());
app.get(`${BASE_REPORT_URL}/user/admin/downvoted`, proxyObject());

// topics apis
app.post(`${BASE_REPORT_URL}/v2/topics`, proxyObject());
app.post(`${BASE_REPORT_URL}/v2/topics/:tid`, proxyObject());
app.post(`${BASE_REPORT_URL}/v2/topics/update/:tid`, proxyObjectForPutApi());
app.delete(`${BASE_REPORT_URL}/v2/topics/:tid`, proxyObject());
app.put(`${BASE_REPORT_URL}/v2/topics/:tid/state`, proxyObject());
app.put(`${BASE_REPORT_URL}/v2/topics/:tid/follow`, proxyObject());
app.delete(`${BASE_REPORT_URL}/v2/topics/:tid/follow`, proxyObject());
app.put(`${BASE_REPORT_URL}/v2/topics/:tid/tags`, proxyObject());
app.delete(`${BASE_REPORT_URL}/v2/topics/:tid/tags`, proxyObject());
app.put(`${BASE_REPORT_URL}/v2/topics/:tid/pin`, proxyObject());
app.delete(`${BASE_REPORT_URL}/v2/topics/:tid/pin`, proxyObject());

// categories apis
app.post(`${BASE_REPORT_URL}/v2/categories`, proxyObject());
app.put(`${BASE_REPORT_URL}/v2/categories/:cid`, proxyObject());
app.delete(`${BASE_REPORT_URL}/v2/categories/:cid`, proxyObject());
app.put(`${BASE_REPORT_URL}/v2/categories/:cid/state`, proxyObject());
app.delete(`${BASE_REPORT_URL}/v2/categories/:cid/state`, proxyObject());
app.put(`${BASE_REPORT_URL}/v2/categories/:cid/privileges`, proxyObject());
app.delete(`${BASE_REPORT_URL}/v2/categories/:cid/privileges`, proxyObject());

// groups apis 
app.post(`${BASE_REPORT_URL}/v2/groups`, proxyObject());
app.delete(`${BASE_REPORT_URL}/v2/groups/:slug`, proxyObject());
app.put(`${BASE_REPORT_URL}/v2/groups/:slug/membership`, proxyObject());
app.put(`${BASE_REPORT_URL}/v2/groups/:slug/membership/:uid`, proxyObject());
app.delete(`${BASE_REPORT_URL}/v2/groups/:slug/membership`, proxyObject());
app.delete(`${BASE_REPORT_URL}/v2/groups/:slug/membership/:uid`, proxyObject());


// post apis 
app.get(`${BASE_REPORT_URL}/post/pid/:pid`, proxyObject());
app.post(`${BASE_REPORT_URL}/v2/posts/:pid`, isEditablePost(), proxyObjectForPutApi());
app.delete(`${BASE_REPORT_URL}/v2/posts/:pid`, isEditablePost(), proxyObject());
app.put(`${BASE_REPORT_URL}/v2/posts/:pid/state`, proxyObject());
app.delete(`${BASE_REPORT_URL}/v2/posts/:pid/state`, proxyObject());
app.post(`${BASE_REPORT_URL}/v2/posts/:pid/vote`, proxyObject());
app.delete(`${BASE_REPORT_URL}/v2/posts/:pid/vote`, proxyObject());
app.post(`${BASE_REPORT_URL}/v2/posts/:pid/bookmark`, proxyObject());
app.delete(`${BASE_REPORT_URL}/v2/posts/:pid/bookmark`, proxyObject());

// util apis 
app.post(`${BASE_REPORT_URL}/v2/util/upload`, proxyObject());
app.post(`${BASE_REPORT_URL}/v2/util/maintenance`, proxyObject());
app.delete(`${BASE_REPORT_URL}/v2/util/maintenance`, proxyObject());

// user api
app.post(`${BASE_REPORT_URL}/v2/users`, proxyObject());
app.put(`${BASE_REPORT_URL}/v2/users/:uid`, proxyObject());
app.delete(`${BASE_REPORT_URL}/v2/users/:uid`, proxyObject());
app.put(`${BASE_REPORT_URL}/v2/users/:uid/password`, proxyObject());
app.put(`${BASE_REPORT_URL}/v2/users/:uid/follow`, proxyObject());
app.delete(`${BASE_REPORT_URL}/v2/users/:uid/follow`, proxyObject());
app.post(`${BASE_REPORT_URL}/v2/users/:uid/chats`, proxyObject());
app.put(`${BASE_REPORT_URL}/v2/users/:uid/ban`, proxyObject());
app.delete(`${BASE_REPORT_URL}/v2/users/:uid/ban`, proxyObject());
app.get(`${BASE_REPORT_URL}/v2/users/:uid/tokens`, proxyObject());
app.post(`${BASE_REPORT_URL}/v2/users/:uid/tokens`, proxyObject());
app.delete(`${BASE_REPORT_URL}/v2/users/:uid/tokens/:token`, proxyObject());
app.get(`${BASE_REPORT_URL}/user/username/:username`, proxyObject());

app.post(`${BASE_REPORT_URL}/user/v1/create`, proxyObject());
app.get(`${BASE_REPORT_URL}/user/uid/:uid`, proxyObject());

function isEditablePost() {
  logger.info({ message: "isEditablePost method called" });
  return function (req, res, next) {
    logger.info(req.body);
    const uid = parseInt(req.body.uid || req.query.uid, 10);
    const pid = parseInt(req.params.pid, 10);
    const url = `${req.protocol}://${req.get('host')}${BASE_REPORT_URL}/post/pid/${pid}`
    const options = {
      url: url,
      method: 'GET',
      json: true
    };
    logger.info(options)
    request(options, (error, response, body) => {
      if (error) {
        logger.info({ message: `Error while call the api ${options.url}` })
        logger.info({ message: `Error message:  ${error.message}` })
        next(error);
        return;
      }
      logger.info(body)
      if (body.uid === uid && body.pid === pid) {
        logger.info({ message: 'Uid got matched and the post can be deleted' })
        next();
      } else {
        logger.info({ message: 'Uid is not matched and you can not delete the post' })
        res.status(400)
        res.send(responseObj)
      }
    });
  }
}


function proxyObject() {
  return proxy(nodebbServiceUrl, {
    proxyReqOptDecorator: proxyUtils.decorateRequestHeaders(),
    proxyReqPathResolver: function (req) {
      let urlParam = req.originalUrl.replace('/discussion', '');
      logger.info({ "message": `request comming from ${req.originalUrl}` })
      let query = require('url').parse(req.url).query;
      console.log("query======>", query)
      if (query && !query.includes('_uid')) {
        return require('url').parse(nodebbServiceUrl + urlParam + '?' + query).path
      } else {
        const incomingUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
        const proxyUrl = require('url').parse(nodebbServiceUrl + urlParam);
        logger.info({ message: `Proxy req url :  ${incomingUrl}` });
        logger.info({ message: `Upstream req url :  ${proxyUrl.href}` });
        return proxyUrl.path;
      }
    },
    userResDecorator: (proxyRes, proxyResData, req, res) => {
      let edata = {
        "type": "log",
        "level": "INFO",
        "requestid": req.headers['x-request-id'] || '',
        "message": ''
      };
      try {
        logger.info({ message: `request came from ${req.originalUrl}` })
        const data = proxyResData.toString('utf8');
        if (proxyRes.statusCode === 404) {
          edata['message'] = `Request url ${req.originalUrl} not found`;
          logMessage(edata, req);
          logger.info({ message: `${req.originalUrl} Not found ${data}` })
          const resCode = proxyUtils.errorResponse(req, res, proxyRes, null);
          logTelemetryEvent(req, res, data, proxyResData, proxyRes, resCode)
          return resCode;
        } else {
          edata['message'] = `${req.originalUrl} successfull`;
          const resCode = proxyUtils.handleSessionExpiry(proxyRes, proxyResData, req, res, null)
          logTelemetryEvent(req, res, data, proxyResData, proxyRes, resCode)
          logMessage(edata, req);
          return resCode;
        }
      } catch (err) {
        console.log('catch', err)
        edata['level'] = "Error";
        edata['message'] = `Error: ${err.message}, Url:  ${req.originalUrl}`;
        logMessage(edata, req);
        logger.info({ message: `Error while htting the ${req.url}  ${err.message}` });
        return proxyUtils.handleSessionExpiry(proxyRes, proxyResData, req, res, err);
      }
    }
  })
}

function proxyObjectForPutApi() {
  return proxy(nodebbServiceUrl, {
    proxyReqOptDecorator: proxyUtils.decorateRequestHeadersForPutApi(),
    proxyReqPathResolver: function (req) {
      let urlParam = req.originalUrl.replace(BASE_REPORT_URL, '')
      if (urlParam.includes(methodSlug)) {
        urlParam = urlParam.replace(methodSlug, '');
      }
      logger.info({ "message": `request comming from ${req.originalUrl}` })
      let query = require('url').parse(req.url).query;
      if (query && !query.includes('_uid')) {
        return require('url').parse(nodebbServiceUrl + urlParam + '?' + query).path
      } else {
        const incomingUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
        const proxyUrl = require('url').parse(nodebbServiceUrl + urlParam);
        logger.info({ message: `Proxy req url :  ${incomingUrl}` });
        logger.info({ message: `Upstream req url :  ${proxyUrl.href}` });
        return proxyUrl.path;
      }
    },
    userResDecorator: (proxyRes, proxyResData, req, res) => {
      let edata = {
        "type": "log",
        "level": "INFO",
        "requestid": req.headers['x-request-id'] || '',
        "message": ''
      };
      try {
        logger.info({ message: `request came from ${req.originalUrl}` })
        const data = (proxyResData.toString('utf8'));
        if (proxyRes.statusCode === 404) {
          edata['message'] = `Request url ${req.originalUrl} not found`;
          logMessage(edata, req);
          logger.info({ message: `${req.originalUrl} Not found ${data}` })
          return proxyUtils.errorResponse(req, res, proxyRes, null);
        } else {
          edata['message'] = `${req.originalUrl} successfull`;
          logMessage(edata, req);
          return proxyUtils.handleSessionExpiry(proxyRes, proxyResData, req, res, null);
        }
      } catch (err) {
        edata['level'] = "Error";
        edata['message'] = `Error: ${err.message}, Url:  ${req.originalUrl}`;
        logMessage(edata, req);
        logger.info({ message: `Error while htting the ${req.url}  ${err.message}` });
        return proxyUtils.handleSessionExpiry(proxyRes, proxyResData, req, res, err);
      }
    }
  })
}

function logMessage(data, req) {
  logObj.context.env = req.originalUrl;
  logObj.context.did = req.headers['x-device-id'];
  logObj.context.sid = req.headers['x-session-id'];
  logObj.context.pdata = {
    "id": "org.sunbird.discussion-forum-middleware",
    "pid": "",
    "ver": ""
  };
  logObj.context.cdata = [];
  logObj.edata = data;
  sbLogger.info(logObj);
}

function logTelemetryEvent(req, res, data, proxyResData, proxyRes, resCode) {
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
  if (option) { logApiErrorEventV2(req, telemetryObj, option) }
}

function logApiErrorEventV2(req, data, option) {
  let object = data.obj || {}
  let channel = req.headers['x-channel-id']
  const context = {
    channel: channel,
    env: option.context.env,
    cdata: [],
    did: req.headers['x-device-id'],
    sid: req.headers['x-session-id']
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
}

module.exports = app;
// module.exports.logMessage = logMessage;