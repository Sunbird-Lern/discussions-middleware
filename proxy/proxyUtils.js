const dateFormat = require('dateformat')
const { Authorization } = require('../helpers/environmentVariablesHelper');
const { logger } = require('@project-sunbird/logger');
const sbLogger = require('sb_logger_util');
const userCreate = '/discussion/user/v1/create';
const groupCreate = '/discussion/forum/v3/create';
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
const _ = require('lodash');
const errorCodes = require('../helpers/errorCodes.json');
const sbConfig = require('sb-config-util');
sbConfig.setConfig('ENABLE_LOGGING', 'true');
const defaultErrorCode = 'err_500';
const errorStatus = [400, 404, 500];
let error_obj = {
  "id": "",
  "ver": "1.0",
  "ts": "",
  "params": {
      "resmsgid": "5f36c090-2eee-11eb-80ed-6bb70096c082",
      "msgid": "",
      "status": "failed",
      "err": "",
      "errmsg": ""
  }
}

/**
 * adding athorization token in the headers 
*/
const decorateRequestHeaders = function () {
  return function (proxyReqOpts) {
    logger.info({message: `adding headers in the request ${proxyReqOpts.path}`});
      proxyReqOpts.headers.Authorization = 'Bearer ' + Authorization;
    return proxyReqOpts;
  }
}

const decorateRequestHeadersForPutApi = function () {
  return function (proxyReqOpts) {
    logger.info({message: `Changing the method name for the request ${proxyReqOpts.path}`});
      proxyReqOpts.method = 'PUT';
      proxyReqOpts.headers.Authorization = 'Bearer ' + Authorization;
    return proxyReqOpts;
  }
}

const handleSessionExpiry = (proxyRes, proxyResData, req, res, error) => {
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
        'msgid': req.headers['x-request-id'] || '',
        'status': 'failed',
        'err': 'SESSION_EXPIRED',
        'errmsg': 'Session Expired'
      },
      responseCode: 'SESSION_EXPIRED',
      result: {}
    };
  } else if(error || errorStatus.includes(proxyRes.statusCode)) {
    edata['message'] = `${req.originalUrl} failed`;
    edata.level = "ERROR";
    logger.info({message: `${req.originalUrl} failed`});
    logMessage(edata, req);
    return errorResponse(req, res,proxyRes, error);
  } else {
    edata['message'] = `${req.originalUrl} successfull`;
    logger.info({message: `${req.originalUrl} successfull`});
    logMessage(edata, req);
    return proxyResData;
  }
}

function logMessage(data, req) {
  logObj.context.env = req.originalUrl;
  logObj.context.did = req.headers['x-device-id'];
  logObj.context.sid = req.headers['x-session-id'];
  logObj.context.pdata = {
    "id": "org.sunbird.discussion-forum-middleware",
    "pid": "",
    "ver": "1.0"
  };
  logObj.context.cdata = [];
  logObj.edata = data;
  logObj.edata.msgid = req.headers['x-request-id'] || req.headers['x-msg-id'];
  sbLogger.info(logObj);
}


/***
 * This method will construct the error response 
 * 
 */
function errorResponse(req, res, proxyRes, error) {
  const errorCode = `err_${proxyRes.statusCode}`;
  const method = req.method.toLowerCase();
  const path = `${req.route.path}.${method}.errorObject`;
  const errorObj = _.get(errorCodes, `${path}.${errorCode}`) || _.get(errorCodes, `${path}.${defaultErrorCode}`);
  const id =  req.originalUrl.split('/');
  error_obj['id'] = id.join('.');
  error_obj['ts'] = dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss:lo');
  error_obj['params']['msgid'] = req.headers['x-request-id']; // TODO: replace with x-request-id;
  error_obj['params']['errmsg'] = errorObj.errMsg
  error_obj['params']['err'] = errorObj.err;
  return error_obj;
}


module.exports.decorateRequestHeaders = decorateRequestHeaders
module.exports.handleSessionExpiry = handleSessionExpiry
module.exports.errorResponse= errorResponse
module.exports.decorateRequestHeadersForPutApi = decorateRequestHeadersForPutApi
