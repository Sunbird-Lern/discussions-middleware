const proxyUtils = require('../proxy/proxyUtils.js')
const proxy = require('express-http-proxy');
const { NODEBB_SERVICE_URL, nodebb_api_slug, moderation_type } = require('../helpers/environmentVariablesHelper.js');
let {  moderation_flag } = require('../helpers/environmentVariablesHelper.js');
moderation_flag = moderation_flag === 'true' ? true : false;

const { logger } = require('@project-sunbird/logger');
const BASE_REPORT_URL = "/discussion";
const express = require('express');
const app = express();
const sbLogger = require('sb_logger_util');
const request = require('request');
const telemetryHelper = require('../helpers/telemetryHelper.js')

const methodSlug = '/update';
const nodebbServiceUrl = NODEBB_SERVICE_URL + nodebb_api_slug;
const _ = require('lodash')

var kafka;
if(moderation_flag) {
   kafka = require('./kafka');
}

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

const premoderation = function (req, res, next) {
  if (moderation_flag) {
    const body = req.body
    console.log(req.path)
    let url = '/discussion/v2/topics'
    let incomingUrl = req.path
    console.log(url.indexOf(incomingUrl))
    console.log('headers====', req.headers)
    if ( moderation_type === 'pre-moderation' && Object.keys(body) != 0 && url.indexOf(incomingUrl) != -1) {
      kafka.produce(req, res)
    } else {
      next()
    }
  } else {
    next()
  }
  
}
app.use(premoderation)

app.post(`${BASE_REPORT_URL}/forum/v2/read`, proxyObject());
app.post(`${BASE_REPORT_URL}/forum/v2/create`, proxyObject());
app.post(`${BASE_REPORT_URL}/forum/v2/remove`, proxyObject());
app.post(`${BASE_REPORT_URL}/forum/v3/create`, proxyObject());
app.post(`${BASE_REPORT_URL}/forum/tags`, proxyObject());
app.post(`${BASE_REPORT_URL}/privileges/v2/copy`, proxyObject());
app.post(`${BASE_REPORT_URL}/forum/v3/user/profile`, proxyObject());

app.post(`${BASE_REPORT_URL}/forum/v2/users/details`, proxyObject());

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
app.get(`${BASE_REPORT_URL}/post/pid/:pid`, proxyObjectWithoutAuth()); // DEPRECATE-V1.16.0: This api used for nodebb version v1.16.0 and will be deprecated in the next upgrade.
app.get(`${BASE_REPORT_URL}/v3/posts/:pid`, proxyObjectWithoutAuth()); // INFO: This api used for nodebb version v1.18.6
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
app.post(`${BASE_REPORT_URL}/moderation/producer`, function (req, res) { kafkaProducer(req, res) })
app.get(`${BASE_REPORT_URL}/moderation/consumer`, function (req, res) { kafkaConsumer(req, res) })

function kafkaProducer(req, res) {
  return kafka.produce(req, res)
}

if (moderation_flag) {
  kafka.consume()
}



function isEditablePost() {
  logger.info({ message: "isEditablePost method called" });
  return async function (req, res, next) {
    logger.info(req.body);
    const uid = parseInt(req.body.uid || req.query.uid, 10);
    const pid = parseInt(req.params.pid, 10);
    let baseUrl = `${req.protocol}://${req.get('host')}${BASE_REPORT_URL}`;

    let options = {
      url: '',
      method: 'GET',
      json: true
    };
    let response;
    try {
      // INFO: This will support nodebb version v1.18.6.
      options.url = baseUrl + `/v3/posts/${pid}`;
      response = await getPostDetails(options);
    } catch (error) {
      if (error.statusCode === 404) {
        //  DEPRECATE-V1.16.0: This api will support only for nodebb version v1.16.0 and can be removed once nodebb updated to latest version.
        logger.info({ "message": 'Old nodebb V.1.16 is used.' });
        options.url = baseUrl + `/post/pid/${pid}`;
        response = await getPostDetails(options);
      } else {
        next(error);
      }
    };

    logger.info({ message: `Getting Post details using: ${options.url} ` });
    if (response.uid === uid && response.pid === pid) {
      logger.info({ message: 'Uid got matched and the post can be deleted' })
      next();
    } else {
      logger.info({ message: 'Uid is not matched and you can not delete the post' })
      res.status(400)
      res.send(responseObj)
    }
  }
}

function getPostDetails(options) {
  if (options) {
    return new Promise((resolve, reject) => {
      request(options, (error, response, body) => {
        if (error || response.statusCode === 404) {
          logger.info({ message: `Error while call the api ${options.url}` })
          logger.info({ message: `Error message:  ${error}` })
          reject(response);
          return;
        }
        const result = _.get(body, 'response') || body;
        resolve(result);
      });
    });
  }
}

function proxyObject() {
  return proxy(nodebbServiceUrl, {
    proxyReqOptDecorator: proxyUtils.decorateRequestHeaders(),
    proxyReqPathResolver: function (req) {
      let urlParam = req.originalUrl.replace(BASE_REPORT_URL, '');
      logger.info({ "message": `request comming from ${req.originalUrl}` })
      let query = require('url').parse(req.url).query;
      // logging the Entry events
      telemetryHelper.logAPIEvent(req, 'discussion-middleware');
      if (query) {
        return require('url').parse(nodebbServiceUrl + urlParam).path
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
          return resCode;
        } else {
          edata['message'] = `${req.originalUrl} successfull`;
          const resCode = proxyUtils.handleSessionExpiry(proxyRes, proxyResData, req, res, null)
          telemetryHelper.logTelemetryErrorEvent(req, data, proxyResData, proxyRes, resCode)
          logMessage(edata, req);
          if (moderation_flag && moderation_type === 'post-moderation') {
            kafka.produce(req, data)
          }
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
      // logging the Entry events
      telemetryHelper.logAPIEvent(req, 'discussion-middleware');
      if (query) {
        return require('url').parse(nodebbServiceUrl + urlParam).path
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
          const resCode = proxyUtils.errorResponse(req, res, proxyRes, null);
          // logging the Error events
          telemetryHelper.logTelemetryErrorEvent(req, data, proxyResData, proxyRes, resCode)
          return proxyUtils.errorResponse(req, res, proxyRes, null);
        } else {
          edata['message'] = `${req.originalUrl} successfull`;
          logMessage(edata, req);
          return proxyUtils.handleSessionExpiry(proxyRes, proxyResData, req, res, null, data);
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

function proxyObjectWithoutAuth() {
  return proxy(nodebbServiceUrl, {
    proxyReqPathResolver: function (req) {
      let urlParam = req.originalUrl.replace(BASE_REPORT_URL, '');
      logger.info({ "message": `request comming from ${req.originalUrl}` })
      let query = require('url').parse(req.url).query;
      if (query) {
        return require('url').parse(nodebbServiceUrl + urlParam).path
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
          return resCode;
        } else {
          edata['message'] = `${req.originalUrl} successfull`;
          const resCode = proxyUtils.handleSessionExpiry(proxyRes, proxyResData, req, res, null)
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

module.exports = app;
// module.exports.logMessage = logMessage;