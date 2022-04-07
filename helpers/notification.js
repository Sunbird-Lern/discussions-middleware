const _ = require('lodash')
const request = require('request');
const evObject = require('./constant.json');
const mapfn = require('./auditEvent');

const notificationObj = async (req, resp) => {
  const refObject = _.get(evObject, req.route.path);
  const fromUid = _.get(resp, refObject.fromUid);
  const toUid = _.get(resp, refObject.toUid);
  const userDetails = await getUserObject(req, fromUid, toUid);
  resp.payload['userDetails'] = userDetails;
  resp.payload['headers'] = req.headers;
  const result = mapfn.deepMap(refObject.notificationObj, (val) => {
    let isExpression = (val.indexOf("?") > 0) ? true : false;
    let isFunction = (val.indexOf("#") > 0) ? true : false;
    let keyVal;
    let value;
    if (isExpression) {
      let exprKey = val.substr(0, val.length - 1);
      let expr = getValue(resp, exprKey) + refObject.expression[exprKey];
      keyVal = eval(expr);
    } else if (isFunction) {
      let exprKey = val.substr(0, val.length - 1);
      const expr = refObject.expression[exprKey];
      keyVal = eval(expr)(_.get(resp, exprKey));
    } else {
      keyVal = _.get(resp, String(val)) || val;
    }
    return keyVal;
  })
  console.log('notification payload-----------', JSON.stringify(result))
}

function getValue(resp, val) {
  const objectVal = _.get(resp, String(val));
    if (typeof objectVal === 'object') {
        return true
    }
    return objectVal;
}

async function getUserObject(req, fromUid, toUid) {
  const sbUserData = await getSunbirdIds(req, [fromUid, toUid]);
  return {
    createdBy: sbUserData.find(user => user.uid === fromUid),
    ids: sbUserData.filter(user => user.uid !== fromUid).map(x => x['sunbird-oidcId']),
  }
}

function getSunbirdIds(req, uids) {
  const url = `${req.protocol}://${req.get('host')}/discussion/forum/v2/users/details`;
  const payload = {
    request: {
      uids: uids
    }
  };
  const options = {
    url: url,
    method: 'POST',
    body: payload,
    json: true
  };
  return new Promise((resolve, reject) => {
    request(options, (error, response, body) => {
      if (error) {
        console.log(error);
        reject(error);
      }
      resolve(_.get(body, 'result'));
    });
  })
}

module.exports.notificationObj = notificationObj;