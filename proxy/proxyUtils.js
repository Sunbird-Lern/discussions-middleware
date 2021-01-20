const dateFormat = require('dateformat')
const { Authorization } = require('../helpers/environmentVariablesHelper');
const { logger } = require('@project-sunbird/logger');
const sbLogger = require('sb_logger_util');
const userCreate = '/discussion/user/v1/create';
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

/**
 * adding athorization token in the headers 
*/
const decorateRequestHeaders = function () {
  return function (proxyReqOpts) {
    logger.info({message: `adding headers in the request ${proxyReqOpts.path}`});
    if (userCreate === proxyReqOpts.path) {
      proxyReqOpts.headers.Authorization = 'Bearer ' + Authorization;
    }
    return proxyReqOpts;
  }
}

const decorateRequestHeadersForPutApi = function () {
  return function (proxyReqOpts) {
    logger.info({message: `Changing the method name for the request ${proxyReqOpts.path}`});
      proxyReqOpts.method = 'PUT';
    return proxyReqOpts;
  }
}

const handleSessionExpiry = (proxyRes, proxyResData, req, res, data) => {
  let edata = {
    "type": "log",
    "level": "INFO",
    "requestid": "",
    "message": ''
  }
  if ((proxyRes.statusCode === 401)) {
    edata['message'] = `You are not authorized to access ${req.originalUrl}`;
    edata.level = "WARN";
    logger.info({message: `You are not authorized to access ${req.originalUrl}`});
    logMessage(edata, req);
    return {
      id: 'app.error',
      ver: '1.0',
      ts: dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss:lo'),
      params:
      {
        'msgid': null,
        'status': 'failed',
        'err': 'SESSION_EXPIRED',
        'errmsg': 'Session Expired'
      },
      responseCode: 'SESSION_EXPIRED',
      result: {}
    };
  } else {
    edata['message'] = `${req.originalUrl} successfull`;
    logger.info({message: `${req.originalUrl} successfull`});
    logMessage(edata, req);
    return proxyResData;
  }
}

function logMessage(data, req) {
  logObj.context.env = req.originalUrl;
  logObj.context.did = req.headers['X-Device-ID'];
  logObj.context.sid = req.headers['X-Session-ID'];
  logObj.context.pdata = {
    "id": "org.sunbird.discussion-forum-middleware",
    "pid": "",
    "ver": ""
  };
  logObj.context.cdata = [];
  logObj.edata = data;
  sbLogger.info(logObj);
}

module.exports.decorateRequestHeaders = decorateRequestHeaders
module.exports.handleSessionExpiry = handleSessionExpiry
module.exports.decorateRequestHeadersForPutApi = decorateRequestHeadersForPutApi
