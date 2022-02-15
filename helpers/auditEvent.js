const dateFormat = require('dateformat');
const _ = require('lodash');
const telemetry = require('./telemetryHelper');
const package_data = require('../package.json');

let auditEventObject = {
    _eid: 'AUDIT',
    _ets: '',
    _ver: '3.0',
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
            id: _.get(req.headers, 'x-app-id') || '', 
            pid:  'discussion-middleware',
            ver: _.get(package_data, 'version')
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
            ets: Date.now(),
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

function deepMap(obj, mapfn) {
    function recurse(obj) {
        let res = {}
        for (const key in obj) {
            const value = obj[key];
            if (value && typeof value === 'object') {
                res[key] = recurse(value);
            } else if (value && Array.isArray(value)) {
                value.forEach(loopObj => {
                    res[key] = recurse(loopObj);
                })
            } else {
                res[key] = mapfn(value);
            }
        }
        return res
    }
    return recurse(obj);
}

function getValue(resp, val) {
    const objectVal = _.get(resp, String(val));
    if (typeof objectVal === 'object') {
        return true
    }
    return objectVal;
}

function auditEventData(refObject, resp, req) {
    return deepMap(refObject.audit, (val) => {
        let isExpression = (val.indexOf("?") > 0) ? true : false;
        let isFunction = (val.indexOf("#") > 0) ? true : false;
        let keyVal;
        if (isExpression) {
            let exprKey =  val.substr(0, val.length - 1);
            let expr = getValue(resp, exprKey) + refObject.expression[exprKey];
            keyVal = eval(expr);
        } else if (isFunction) {
            let exprKey =  val.substr(0, val.length - 1);
            const expr = refObject.expression[exprKey];
            keyVal = eval(expr)(_.get(req, exprKey));
        } else {
            keyVal = getValue(resp, val) || val;
        }
        return keyVal;
    })
}

function cdataArray(rawCdata) {
    if (rawCdata) {
        return rawCdata.map(cdata => {
            return {
                type: cdata.type.charAt(0).toUpperCase() + cdata.type.slice(1),
                id: cdata.id
            }
        })
    } else {
        return [];
    }
}

  module.exports = {auditEventObject, auditEventData, cdataArray, deepMap};
