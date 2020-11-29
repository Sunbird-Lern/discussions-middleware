const dateFormat = require('dateformat')
const { Authorization } = require('../helpers/environmentVariablesHelper');
const { logger } = require('@project-sunbird/logger');

/**
 * adding athorization token in the headers 
*/
const decorateRequestHeaders = function () {
  return function (proxyReqOpts) {
    logger.info({message: 'adding headers in the request'});
    proxyReqOpts.headers.Authorization = 'Bearer ' + Authorization;
    return proxyReqOpts;
  }
}

const handleSessionExpiry = (proxyRes, proxyResData, req, res, data) => {
  if ((proxyRes.statusCode === 401)) {
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
    return proxyResData;
  }
}

module.exports.decorateRequestHeaders = decorateRequestHeaders
module.exports.handleSessionExpiry = handleSessionExpiry
