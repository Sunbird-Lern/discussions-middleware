const notification = require('../../helpers/notification');
const { expect } = require("chai");
const mock = require('./mock.data.spec')
const nodebbUrl = 'https://staging.sunbirded.org/discussion';
const nock = require('nock');
const chai = require('chai');
let chaiHttp = require('chai-http');
chai.should();
chai.use(chaiHttp);
let server = require('../../app');

describe("Notification helper Unit Tests", function () {
    const payload = {
        "request": {
            "uids": [10, 3]
        }
    };
    const request = chai.request(server);
    request.route = { path: '/discussion/v2/posts/:pid/vote' };
    request.protocol = 'https';
    request.host = "staging.sunbirded.org";
    request.body = payload;
    request.headers = {
        'x-request-id': 'f5db7376-265c-a244-952b-86672b05e070',
        'x-channel-id': 'f5db7376-265c-a244-952b-86672b05e070',
        'x-app-id': 'staging.sunbird.portal',
        'x-session-id': 'eMoOr4TgLbHX8cknf3j_VL_AQfM83Ph5'
    };

    it("should call notificationObj function and set notification data", async function () {

        nock(nodebbUrl)
            .post('/forum/v2/users/details', payload)
            .reply(200, mock.forumUserDetails);

        const result = await notification.notificationObj(request, mock.userVoteRes);
        expect(result.headers.sid).to.equal('eMoOr4TgLbHX8cknf3j_VL_AQfM83Ph5');
        expect(result.headers.traceID).to.equal('f5db7376-265c-a244-952b-86672b05e070');
        expect(result.notificationData.ids[0]).to.equal('4cd4c690-eab6-4938-855a-447c7b1b8ea9')

    });
});