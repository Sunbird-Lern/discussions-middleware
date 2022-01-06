const _ = require('lodash')
const request = require('request');
const response = require('../helpers/constant.json');


const notificationObj = async (req, data) => {
  if (data) {
    const res = JSON.parse(data);
    const resData = response[req.route.path].notificationObj;
    const fromUid =  _.get(res, resData.fromUid);
    const toUid = _.get(res, resData.toUid);
    const userDetails = await getUserObject(req, fromUid, toUid);
    const notificationObject = {
      headers: {
        sid: _.get(req.headers, 'X-Session-Id') || _.get(req.headers, 'x-session-id'),
        traceID: _.get(req.headers, 'x-request-id')
      },
      notifcationData: {
        ids: userDetails.ids,
        createdBy: {
          id: _.get(userDetails.createdBy, 'sunbird-oidcId'),
          name: _.get(userDetails.createdBy, 'username'),
          type: 'User'
        },
        action: {
          category: 'discussion-forum',
          type: _.get(resData, 'action-type'),
          template: {
            type: 'JSON',
            params: {
              param1: _.get(userDetails.createdBy, 'username'),
              param2: _.get(res.payload, resData.action) ? _.get(resData.actions, 'action1') : _.get(resData.actions, 'action2') ,
              param3: _.get(res.payload, resData.key) ? _.get(resData.types, 'type1') : _.get(resData.types, 'type2'),
            }
          }
        },
        additionalInfo: {
          context: { }, // once the session is implemented will get this object
          category: {
            cid:  _.get(res, resData.cid),
            title: _.get(res, resData.title),
            pid: '' // once the session is implemented will get this object
          },
          topic: {
            tid: _.get(res, resData.topic.tid),
            title: _.get(res, resData.topic.title)
          },
          post: {
            pid: _.get(res, resData.post.pid),
            title: _.get(res, resData.post.title),
          }
        }
      }
    }
    console.log('notification 0bj for Reply-----------', JSON.stringify(notificationObject))
  }
}
async function getUserObject(req, fromUid, toUid) {
  const sbUserData =  await getSunbirdIds(req, [fromUid, toUid]);
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