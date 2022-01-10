const _ = require('lodash')
const request = require('request');
const notificationJSON = require('../helpers/constant.json');

const notificationObj = async (req, data) => {
  if (data) {
    const res = JSON.parse(data);
    const notificationRef = notificationJSON[req.route.path]
    const fromUid = _.get(res, notificationRef.fromUid);
    const toUid = _.get(res, notificationRef.toUid);
    const userDetails = await getUserObject(req, fromUid, toUid);
    res.payload['userDetails'] = userDetails;
    res.payload['headers'] = req.headers;

    let result = deepMap(notificationRef.notificationObj, (val) => {
      // Check whether the value is an expression or not
      let isExpression = (val.indexOf("?") > 0) ? true : false;
      let keyVal;
      if (isExpression) {
        // If val is expression, then get the key of the expression
        let exprKey = val.substr(0, val.length - 1);

        // Construct the ternory opreation to evaluate the expression(only suppports ternary operations now)
        let expression = getValue(res, exprKey) + notificationRef.expr[exprKey];
        keyVal = eval(expression);
      } else if (_.includes(val, '_.')) {
        keyVal = eval(val);
      } else {
        keyVal = getValue(res, val) || val;
      }
      return keyVal;
    })
    console.log('notification 0bj for Reply-----------', JSON.stringify(result))
  }
}

function getValue(resp, val) {
  const objectVal = _.get(resp, String(val));
  if (typeof objectVal === 'object') {
    return true
  }
  console.log('getvalue===', val);
  return objectVal;
}

function deepMap(obj, mapfn) {
  function recurse(obj) {
    let res = {}
    for (const key in obj) {
      const value = obj[key];
      if (value && typeof value === 'object') {
        res[key] = recurse(value);
      } else {
        res[key] = mapfn(value);
      }
    }
    return res
  }
  return recurse(obj);
}

async function getUserObject(req, fromUid, toUid) {
  const sbUserData = await getSunbirdIds(req, [fromUid, toUid]);
  return {
    createdBy: sbUserData.find(user => user.uid === fromUid),
    ids: sbUserData.filter(user => user.uid !== fromUid).map(x => x['sunbird-oidcId']),
  }
}

function getSunbirdIds(req, uids) {
  const url = `${req.protocol}://${req.get('host')}/discussion/forum/v2/sunbird/uids`;
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
      resolve(body.result);
    });
  })
}

module.exports.notificationObj = notificationObj;