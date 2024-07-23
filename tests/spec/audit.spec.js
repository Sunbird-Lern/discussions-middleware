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

    it("should get reqData", async function () {
      const data = audit.auditEventObject.reqData;
      expect(audit.auditEventObject._pdata.pid).to.equal('staging.sunbird.portal');
      expect(audit.auditEventObject._pdata.id).to.equal('discussion-middleware');
      expect(audit.auditEventObject._pdata.ver).to.equal('4.6.0');
    });

    it("should set actor", async function () {
      audit.auditEventObject.actor = req;
      expect(audit.auditEventObject._actor.id).to.equal('public');
      expect(audit.auditEventObject._actor.type).to.equal('User');
    });

    it("should get actor", async function () {
      const actor = audit.auditEventObject.actor;
      expect(actor.id).to.equal('public');
      expect(actor.type).to.equal('User');
    });

    it("should set channel", async function () {
      audit.auditEventObject.channel = req;
      console.log(audit.auditEventObject)
      expect(audit.auditEventObject._channel).to.equal('f5db7376-265c-a244-952b-86672b05e070');
    });

    it("should get channel", async function () {
      const channel =  audit.auditEventObject.channel;
      expect(channel).to.equal('f5db7376-265c-a244-952b-86672b05e070');
    });

    it("should get pdata", async function () {
      const pdata = audit.auditEventObject.pdata;
      expect(pdata.pid).to.equal('staging.sunbird.portal');
      expect(pdata.id).to.equal('discussion-middleware');
      expect(pdata.ver).to.equal('4.6.0');
    });

    it("should set rollup", async function () {
      audit.auditEventObject.rollup = req;
      expect(audit.auditEventObject._rollup.l1).to.equal('f5db7376-265c-a244-952b-86672b05e070');
    });

    it("should get rollup", async function () {
      const rollup = audit.auditEventObject.rollup;
      expect(rollup.l1).to.equal('f5db7376-265c-a244-952b-86672b05e070');
    });
});