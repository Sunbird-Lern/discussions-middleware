const mock = require('mock-require');
const httpMocks = require('node-mocks-http');
const res = httpMocks.createResponse({
    eventEmitter: require('events').EventEmitter
});
const request = httpMocks.createRequest({
    rspObj: {
        apiId: 'apiId'
    },
    path: '/discussion/user/v1/create',
    headers: {
        'x-request-id': 'f78a6a33-4246-580c-afd5-08824c8ad506',
        'x-session-id': 'bcbxg8cz41F3OpTp62qBByavpcRcUzVg',
        'x-device-id': 'fe2b9f37c1d8b5f466d2c5fb60735cb3'
    }
});
const mockEnv = {
    NODEBB_SERVICE_URL: 'mock-url',
    Authorization: 'token'
};
const { expect } = require('chai');
const proxyUtils = require('../../proxy/proxyUtils');

describe('ProxyUtils add the headers', function () {

    beforeEach(function () {
        mock('../../../helpers/environmentVariablesHelper', mockEnv);
    });

    it('should add the authorization token in the request headers', function (done) {
        const req = proxyUtils.decorateRequestHeaders()(request);
        const isContainsAuth = req.headers.hasOwnProperty('Authorization')
        expect(isContainsAuth).to.eql(true);
        done();
    });

    it('should add the authorization token in the request headers', function (done) {
        const req = proxyUtils.decorateRequestHeadersForPutApi()(request);
        const method = req.method
        expect(method).to.eql('PUT');
        done();
    });

    it('should call handleSessionExpiry with error', function (done) {
        const proxyRes = {
            statusCode: 401
        };
        const ERROR = {
            'msgid': 'f78a6a33-4246-580c-afd5-08824c8ad506',
            'status': 'failed',
            'err': 'SESSION_EXPIRED',
            'errmsg': 'Session Expired'
        };
        const errorObj = proxyUtils.handleSessionExpiry(proxyRes, null, request, null, null);
        expect(errorObj.params).to.eql(ERROR);
        expect(errorObj.responseCode).to.eql('SESSION_EXPIRED');
        done();
    });

    it('should call handleSessionExpiry with data', function (done) {
        const proxyRes = {
            statusCode: 200
        };
        const proxyData = {
            'username': 'Test-User'
        };
        const data = proxyUtils.handleSessionExpiry(proxyRes, proxyData, request, null, null);
        expect(data).to.eql(proxyData);
        done();
    });

    it('should call handleSessionExpiry with error', function (done) {
        const proxyRes = {
            statusCode: 400
        };
        const proxyData = {
                "err": "DMW_FRED02",
                "errmsg": "Forum read failed because of request payload issue",
                "msgid": "f78a6a33-4246-580c-afd5-08824c8ad506",
                "resmsgid": "5f36c090-2eee-11eb-80ed-6bb70096c082",
                "status": "failed"
        }
        const request = httpMocks.createRequest({
            rspObj: {
                apiId: 'apiId'
            },
            path: '/discussion/forum/v2/read',
            headers: {
                'x-request-id': 'f78a6a33-4246-580c-afd5-08824c8ad506',
                'x-session-id': 'bcbxg8cz41F3OpTp62qBByavpcRcUzVg',
                'x-device-id': 'fe2b9f37c1d8b5f466d2c5fb60735cb3'
            },
            route: {
                path: '/discussion/forum/v2/read'
            },
            method: "post"
        });
        const data = proxyUtils.handleSessionExpiry(proxyRes, proxyData, request, null, null);
        expect(data.params).to.eql(proxyData);
        done();
    });

    it('should call handleSessionExpiry with unknown error', function (done) {
        const proxyRes = {
            statusCode: 504
        };
        const error = new Error("Bad Gateway");
        const proxyData = {
                "err": "DMW_FRED03",
                "errmsg": "Forum read failed",
                "msgid": "f78a6a33-4246-580c-afd5-08824c8ad506",
                "resmsgid": "5f36c090-2eee-11eb-80ed-6bb70096c082",
                "status": "failed"
        }
        const request = httpMocks.createRequest({
            rspObj: {
                apiId: 'apiId'
            },
            path: '/discussion/forum/v2/read',
            headers: {
                'x-request-id': 'f78a6a33-4246-580c-afd5-08824c8ad506',
                'x-session-id': 'bcbxg8cz41F3OpTp62qBByavpcRcUzVg',
                'x-device-id': 'fe2b9f37c1d8b5f466d2c5fb60735cb3'
            },
            route: {
                path: '/discussion/forum/v2/read'
            },
            method: "post"
        });
        const data = proxyUtils.handleSessionExpiry(proxyRes, proxyData, request, null, error);
        console.log(data)
        expect(data.params).to.eql(proxyData);
        done();
    });

    afterEach(function () {
        mock.stop('../../../helpers/environmentVariablesHelper');
    });

});
