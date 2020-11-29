const mock = require('mock-require');
const httpMocks = require('node-mocks-http');
const res = httpMocks.createResponse({
    eventEmitter: require('events').EventEmitter
});
const request = httpMocks.createRequest({
    rspObj: {
        apiId: 'apiId'
    }
});
const mockEnv = {
    DISCUSSION_FORUM: 'mock-url',
    Authorization: 'token'
};
const { expect } = require('chai');
const proxyUtils = require('../../../proxy/proxyUtils');

describe('ProxyUtils add the headers', function () {

    beforeEach(function () {
        mock('../../../helpers/environmentVariablesHelper', mockEnv);
    });

    it('should add the authorization token in the request headers', function (done) {
        const req = proxyUtils.decorateRequestHeaders()(request);
        console.log(req)
        const isContainsAuth = req.headers.hasOwnProperty('Authorization')
        expect(isContainsAuth).to.eql(true);
        done();
    });

    it('should call handleSessionExpiry with error', function (done) {
        const proxyRes = {
            statusCode: 401
        };
        const ERROR = {
            'msgid': null,
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

    afterEach(function () {
        mock.stop('../../../helpers/environmentVariablesHelper');
    });

});
