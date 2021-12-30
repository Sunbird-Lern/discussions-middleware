const dateFormat = require('dateformat');
const _ = require('lodash');
const telemetry = require('./telemetryHelper');

let auditEventObject = {
    _eid: 'AUDIT',
    _ets: '',
    _ver: '1.0',
    _mid: '',
    _actor: {},
    _context: {},
    _channel: '',
    _pdata: {},
    _env: 'discussion-forum',
    _cdata: [],
    _rollup: {},
    _object: {},
    _edata: {},
    _reqData: {},
    _auditEventObj:{},
    
    getEdataType (url) {
        switch (url) {
            case '/discussion/v2/posts/:pid/vote': 
                return { type: 'vote',name: 'Voted', };
            case '/discussion/v2/topics': 
                return { type: 'topicCreate',name: 'Topic created'};
            case '/discussion/v2/topics/:tid':
                return { type: 'topicReply',name: 'Topic replied'};
            case '/discussion/forum/v3/create':
                    return { type: 'enableDf', name: 'Enable Discussions'};       
        }
    },
    set reqData (req) {
        this._mid = req.headers['x-request-id'];
        this._actor = telemetry.getTelemetryActorData(req);
        this._channel = _.get(req.headers, 'x-channel-id') || '';
        this._rollup = { l1: _.get(req.headers, 'x-channel-id') || '' };
        const obj = {
            id: 'discussion-middleware',
            pid:  _.get(req.headers, 'x-app-id') || '',
            ver: '4.6.0'
        };
        this._pdata = obj;
    },
    get reqData() {
        return this._reqData;
    },
    set mid (req) {
        this._mid = req.headers['x-request-id'];
    },
    get mid () {
        return this._mid;
    },
    set actor(req) {
       this._actor = telemetry.getTelemetryActorData(req);
    },
    get actor() {
        return this._actor;
    },
    set channel(req) {
        this._channel = _.get(req.headers, 'x-channel-id') || '';
    },
    get channel() {
        return this._channel;
    },
    set pdata (req) {
        const obj = {
            id: 'discussion-middleware',
            pid:  _.get(req.headers, 'x-app-id') || '',
            ver: '4.6.0'
        };
        this._pdata = obj;
    },
    get pdata() {
        return this._pdata;
    },
    set cdata (data) {
        this._cdata = data;
    },
    get cdata() {
        return this._cdata;
    },
    set rollup(req) {
        this._rollup = { l1: _.get(req.headers, 'x-channel-id') || '' }
    },
    get rollup() {
        return this._rollup;
    },
    set object(obj) {
        this._object = obj;
    },
    get object() {
        return this._object;
    },
    set edata (data) {
        this._edata = data;
    },
    get edata() {
        return this._edata;
    },
    get auditEventObj() {
        const data = {
            eid: this._eid,
            ets: dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss:lo'),
            ver: this._ver,
            mid: this._mid,
            actor: this._actor,
            context: {
                channel: this._channel,
                pdata: this._pdata,
                env: this._env,
                cdata: this._cdata,
                rollup: this._rollup
            },
            object: this._object,
            edata: this._edata
        };
        return data;
    }
  }


function auditeventForDF(req, data, ref) {
    const responseObject = _.get(data, ref.response);
    const isTypeConst = _.get(ref, 'isTypeConst');
    let cdata = {};
    const objType = isTypeConst ? _.get(ref, 'obj.type') : _.get(responseObject, ref.obj.type) ? _.get(ref, ref.obj.type) : _.get(ref, 'default')
    const obj = {
        id: _.get(responseObject, ref.obj.id),
        type: objType,
        version: _.get(ref, 'obj.version')
      };

      const edata = {
        type: isTypeConst ? _.get(ref, 'edata.type') : objType,
        props: Object.keys(_.get(req, ref.edata.props))
      }
      if (_.get(ref, 'cdata')) {
        cdata = {
            type: _.get(responseObject, ref.cdata.type),
            id: _.get(responseObject, ref.cdata.id)
        }
      }
      return {obj, edata, cdata};
}
  module.exports = {auditEventObject, auditeventForDF};