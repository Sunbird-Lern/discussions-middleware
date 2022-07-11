
const audit = require('../../helpers/auditEvent');
const sinon = require("sinon");
const { expect } = require("chai");
const CONSTANT  = require('../../helpers/constant.json')
const mock = require('./mock.data.spec')

describe("Audit Event Unit Tests", function () {

  const req = {
    headers: {
      'x-request-id': 'f5db7376-265c-a244-952b-86672b05e070',
      'x-channel-id': 'f5db7376-265c-a244-952b-86672b05e070',
      'x-app-id': 'staging.sunbird.portal',
    },
    body: {
      test: '123'
    }
  };

    it("should set data to mid", async function () {
      const ref = CONSTANT['/discussion/v2/topics']
      const res =  audit.auditEventData(ref, mock.topicCreateResponse, req);
      expect(res.edata.state).to.equal('topic-created');
      expect(res.edata.props[0]).to.equal('test');
    });

    it("should call getEdataType", async function () {
      const vote = audit.auditEventObject.getEdataType('/discussion/v2/posts/:pid/vote');
      const topicCreate = audit.auditEventObject.getEdataType('/discussion/v2/topics')
      const topicReply = audit.auditEventObject.getEdataType('/discussion/v2/topics/:tid')
      const enableDf = audit.auditEventObject.getEdataType('/discussion/forum/v3/create')
      expect(vote.name).to.equal('Voted');
      expect(topicCreate.name).to.equal('Topic created');
      expect(topicReply.name).to.equal('Topic replied');
      expect(enableDf.name).to.equal('Enable Discussions');
    });

    it("should set data to reqData", async function () {
      audit.auditEventObject.reqData = req;
      expect(audit.auditEventObject._channel).to.equal('f5db7376-265c-a244-952b-86672b05e070');
      expect(audit.auditEventObject._mid).to.equal('f5db7376-265c-a244-952b-86672b05e070');
      expect(audit.auditEventObject._pdata.id).to.equal('staging.sunbird.portal');
    });

    it("should set data to mid", async function () {
      audit.auditEventObject.mid = req;
      expect(audit.auditEventObject.mid).to.equal('f5db7376-265c-a244-952b-86672b05e070');
    });

    it("should set data to pdata", async function () {
      audit.auditEventObject.pdata = req;
      expect(audit.auditEventObject._pdata.pid).to.equal('staging.sunbird.portal');
      expect(audit.auditEventObject._pdata.id).to.equal('discussion-middleware');
      expect(audit.auditEventObject._pdata.ver).to.equal('4.6.0');
    });

});
