const chai = require('chai');
let chaiHttp = require('chai-http');
chai.should();
chai.use(chaiHttp);
let server = require('../../app');
const nock = require('nock');
const envData = require('../../helpers/environmentVariablesHelper');
const mockData = require('./mock.data.spec');
var expect = require('chai').expect;
const nodebbUrl = envData.NODEBB_SERVICE_URL+envData.nodebb_api_slug;
describe('Nodebb Routes', () => {
    it('it should GET all the Tags', (done) => {
        nock(nodebbUrl)
            .get('/tags')
            .reply(200, mockData.tags);
        const response = [{
            'value': 'tag1',
            'score': 1,
            'valueEscaped': 'tag1',
            'color': '',
            'bgColor': ''
        }];
        chai.request(server)
            .get('/discussion/tags')
            .end((err, res) => {
                expect(res.body).to.be.a('object');
                expect(res.body.tags).to.be.a('Array');
                expect(res.status).to.equal(200);
                expect(JSON.stringify(res.body.tags)).to.equal(JSON.stringify(response));
                done();
            });
    });

    it('it should GET all the Categories', (done) => {
        nock(nodebbUrl)
            .get('/categories')
            .reply(200, mockData.categories);

        chai.request(server)
            .get('/discussion/categories')
            .end((err, res) => {
                expect(res.body).to.be.a('object');
                expect(res.body.categories).to.be.a('Array');
                expect(res.status).to.equal(200);
                done();
            });
    });

    it('it should GET all the notifications', (done) => {
        nock(nodebbUrl)
            .get('/notifications')
            .reply(200, mockData.notifications);

        chai.request(server)
            .get('/discussion/notifications')
            .end((err, res) => {
                expect(res.body).to.be.a('object');
                expect(res.body.notifications).to.be.a('Array');
                expect(res.status).to.equal(200);
                done();
            });
    });

    it('it should GET the user details', (done) => {
        nock(nodebbUrl)
            .get('/user/ntptest102')
            .reply(200, mockData.userDetails);

        chai.request(server)
            .get('/discussion/user/ntptest102')
            .end((err, res) => {
                expect(res.body).to.be.a('object');
                expect(res.status).to.equal(200);
                expect(res.body.username).to.equal('ntptest102')
                done();
            });
    });

    it('it should not GET the user details', (done) => {
        nock(nodebbUrl)
            .get('/user/1234')
            .reply(404);

        chai.request(server)
            .get('/discussion/user/1234')
            .end((err, res) => {
                expect(res.status).to.equal(404);
                done();
            });
    });

    it('it should GET the user upvote details', (done) => {
        nock(nodebbUrl)
            .get('/user/ntptest104/upvoted')
            .reply(200, mockData.userVoteDetails);

        chai.request(server)
            .get('/discussion/user/ntptest104/upvoted')
            .end((err, res) => {
                expect(res.body).to.be.a('object');
                expect(res.status).to.equal(200);
                expect(res.body.posts[0].upvotes).to.equal(1);
                done();
            });
    });

    it('it should not GET the user upvote details', (done) => {
        nock(nodebbUrl)
            .get('/user/1111/upvoted')
            .reply(404);

        chai.request(server)
            .get('/discussion/user/1111/upvoted')
            .end((err, res) => {
                expect(res.status).to.equal(404);
                done();
            });
    });

    it('it should GET the user downvote details', (done) => {
        nock(nodebbUrl)
            .get('/user/ntptest104/downvoted')
            .reply(200, mockData.userVoteDetails);

        chai.request(server)
            .get('/discussion/user/ntptest104/downvoted')
            .end((err, res) => {
                expect(res.body).to.be.a('object');
                expect(res.status).to.equal(200);
                expect(res.body.posts[1].downvotes).to.equal(1);
                done();
            });
    });

    it('it should not GET the user downvote details', (done) => {
        nock(nodebbUrl)
            .get('/user/1111/downvoted')
            .reply(200, mockData.userVoteDetails);

        chai.request(server)
            .get('/discussion/user/1111/downvoted')
            .end((err, res) => {
                expect(res.body).to.be.a('object');
                expect(res.status).to.equal(200);
                expect(res.body.posts[1].downvotes).to.equal(1);
                done();
            });
    });

    it('it should GET the category details by category slug', (done) => {
        nock(nodebbUrl)
            .get('/category/1/announcements')
            .reply(200, mockData.categoryDetails);

        chai.request(server)
            .get('/discussion/category/1/announcements')
            .end((err, res) => {
                expect(res.body).to.be.a('object');
                expect(res.status).to.equal(200);
                expect(res.body.name).to.equal('Announcements');
                done();
            });
    });

    it('it should GET the category details by category id', (done) => {
        nock(nodebbUrl)
            .get('/category/1')
            .reply(200, mockData.categoryDetails);

        chai.request(server)
            .get('/discussion/category/1')
            .end((err, res) => {
                expect(res.body).to.be.a('object');
                expect(res.status).to.equal(200);
                expect(res.body.name).to.equal('Announcements');
                done();
            });
    });

    it('it should not GET the category details by category id', (done) => {
        nock(nodebbUrl)
            .get('/category/1234')
            .reply(404);

        chai.request(server)
            .get('/discussion/category/1234')
            .end((err, res) => {
                expect(res.status).to.equal(404);
                done();
            });
    });

    it('it should GET the unread topic details', (done) => {
        nock(nodebbUrl)
            .get('/unread')
            .reply(200, mockData.topicDetails);

        chai.request(server)
            .get('/discussion/unread')
            .end((err, res) => {
                expect(res.body).to.be.a('object');
                expect(res.status).to.equal(200);
                expect(res.body.topics).to.be.a('Array');
                done();
            });
    });

    it('it should GET the recent topic details', (done) => {
        nock(nodebbUrl)
            .get('/recent')
            .reply(200, mockData.topicDetails);

        chai.request(server)
            .get('/discussion/recent')
            .end((err, res) => {
                expect(res.body).to.be.a('object');
                expect(res.status).to.equal(200);
                expect(res.body.topics).to.be.a('Array');
                done();
            });
    });

    it('it should GET the popular topics details', (done) => {
        nock(nodebbUrl)
            .get('/popular')
            .reply(200, mockData.topicDetails);

        chai.request(server)
            .get('/discussion/popular')
            .end((err, res) => {
                expect(res.body).to.be.a('object');
                expect(res.status).to.equal(200);
                expect(res.body.topics).to.be.a('Array');
                done();
            });
    });

    it('it should GET the group details by slug', (done) => {
        nock(nodebbUrl)
            .get('/groups')
            .reply(200, mockData.groupData);

        chai.request(server)
            .get('/discussion/groups')
            .end((err, res) => {
                expect(res.body).to.be.a('object');
                expect(res.status).to.equal(200);
                expect(res.body.group).to.be.a('object');
                done();
            });
    });

    it('it should Create topic', (done) => {
        const topic = {
            cid: 1, title:"test", content: "test content"
        }
        nock(nodebbUrl)
            .post('/v2/topics', topic)
            .reply(200, mockData.topicsRes);

        chai.request(server)
            .post('/discussion/v2/topics')
            .send(topic)
            .end((err, res) => {
                expect(res.body).to.be.a('object');
                expect(res.status).to.equal(200);
                expect(res.body.code).to.equal('ok')
                done();
            });
    });

    it('it should not Create topic', (done) => {
        const topic = { };
        nock(nodebbUrl)
            .post('/v2/topics', topic)
            .reply(400, mockData.errorResponse);

        chai.request(server)
            .post('/discussion/v2/topics')
            .send(topic)
            .end((err, res) => {
                console.log(res.body)
                console.log(err)
                expect(res.body).to.be.a('object');
                expect(res.status).to.equal(400);
                expect(res.body.params.err).to.equal('DMW_TCRT08')
                done();
            });
    });

    it('it should create reply to topic', (done) => {
        const topic = {
            toPid: 1, content: "test content"
        }
        nock(nodebbUrl)
            .post('/v2/topics/1', topic)
            .reply(200, mockData.topicsRes);

        chai.request(server)
            .post('/discussion/v2/topics/1')
            .send(topic)
            .end((err, res) => {
                expect(res.body).to.be.a('object');
                expect(res.status).to.equal(200);
                expect(res.body.code).to.equal('ok')
                done();
            });
    });

    it('it should not create reply to topic', (done) => {
        const topic = {};
        nock(nodebbUrl)
            .post('/v2/topics/1', topic)
            .reply(400, mockData.errorResponse);

        chai.request(server)
            .post('/discussion/v2/topics/1')
            .send(topic)
            .end((err, res) => {
                expect(res.body).to.be.a('object');
                expect(res.status).to.equal(400);
                expect(res.body.params.err).to.equal('DMW_RCRT12')
                done();
            });
    });

    // it('it should update the topic', (done) => {
    //     const topic = {
    //         pid: 1, content: "test content"
    //     }
    //     nock(nodebbUrl)
    //         .put('/v2/topics/1', topic)
    //         .reply(200, mockData.topicsRes);

    //     chai.request(server)
    //         .put('/discussion/v2/topics/1')
    //         .send(topic)
    //         .end((err, res) => {
    //             expect(res.body).to.be.a('object');
    //             expect(res.status).to.equal(200);
    //             expect(res.body.code).to.equal('ok')
    //             done();
    //         });
    // });

    // it('it should not update the topic', (done) => {
    //     const topic = {
    //         pid: 1, content: "test content"
    //     }
    //     nock(nodebbUrl)
    //         .put('/v2/topics/123', topic)
    //         .reply(404, mockData.errorMessage);

    //     chai.request(server)
    //         .put('/discussion/v2/topics/123')
    //         .send(topic)
    //         .end((err, res) => {
    //             expect(res.body).to.be.a('object');
    //             expect(res.status).to.equal(404);
    //             expect(res.body.params.err).to.equal('DMW_TUDT14')
    //             done();
    //         });
    // });

    it('it should delete the topic', (done) => {
        nock(nodebbUrl)
            .delete('/v2/topics/1')
            .reply(200, mockData.topicsRes);

        chai.request(server)
            .delete('/discussion/v2/topics/1')
            .end((err, res) => {
                expect(res.body).to.be.a('object');
                expect(res.status).to.equal(200);
                expect(res.body.code).to.equal('ok')
                done();
            });
    });

    it('it should not delete the topic', (done) => {
        nock(nodebbUrl)
            .delete('/v2/topics/123')
            .reply(404, mockData.errorMessage);

        chai.request(server)
            .delete('/discussion/v2/topics/123')
            .end((err, res) => {
                expect(res.body).to.be.a('object');
                expect(res.status).to.equal(404);
                expect(res.body.params.err).to.equal('DMW_TDEL18')
                done();
            });
    });

    it('it should create the category', (done) => {
        const payload = {name: 'Test Category'};

        nock(nodebbUrl)
            .post('/v2/categories', payload)
            .reply(200, mockData.categoryRes);

        chai.request(server)
            .post('/discussion/v2/categories')
            .send(payload)
            .end((err, res) => {
                expect(res.body).to.be.a('object');
                expect(res.status).to.equal(200);
                expect(res.body.code).to.equal('ok')
                done();
            });
    });

    it('it should not create the category', (done) => {
        const payload = {};

        nock(nodebbUrl)
            .post('/v2/categories', payload)
            .reply(400, mockData.errorResponse);

        chai.request(server)
            .post('/discussion/v2/categories')
            .send(payload)
            .end((err, res) => {
                expect(res.body).to.be.a('object');
                expect(res.status).to.equal(400);
                expect(res.body.params.err).to.equal('DMW_CCRT09')
                done();
            });
    });
    it('it should update the category', (done) => {
        const payload = {name: 'Test Category'};

        nock(nodebbUrl)
            .put('/v2/categories/1', payload)
            .reply(200, mockData.categoryRes);

        chai.request(server)
            .put('/discussion/v2/categories/1')
            .send(payload)
            .end((err, res) => {
                expect(res.body).to.be.a('object');
                expect(res.status).to.equal(200);
                expect(res.body.code).to.equal('ok')
                done();
            });
    });

    it('it should not update the category', (done) => {
        const payload = {name: 'Test Category'};

        nock(nodebbUrl)
            .put('/v2/categories/1234', payload)
            .reply(404, mockData.errorMessage);

        chai.request(server)
            .put('/discussion/v2/categories/1234')
            .send(payload)
            .end((err, res) => {
                expect(res.body).to.be.a('object');
                expect(res.status).to.equal(404);
                expect(res.body.params.err).to.equal('DMW_CUDT11')
                done();
            });
    });

    it('it should delete the category', (done) => {
        nock(nodebbUrl)
            .delete('/v2/categories/1')
            .reply(200, mockData.categoryRes);

        chai.request(server)
            .delete('/discussion/v2/categories/1')
            .end((err, res) => {
                expect(res.body).to.be.a('object');
                expect(res.status).to.equal(200);
                expect(res.body.code).to.equal('ok')
                done();
            });
    });

    it('it should not delete the category', (done) => {
        nock(nodebbUrl)
            .delete('/v2/categories/1234')
            .reply(404, mockData.errorMessage);

        chai.request(server)
            .delete('/discussion/v2/categories/1234')
            .end((err, res) => {
                expect(res.body).to.be.a('object');
                expect(res.status).to.equal(404);
                expect(res.body.params.err).to.equal('DMW_CDEL15')
                done();
            });
    });

    it('it should create the group', (done) => {
        const payload ={name : "test group"}
        nock(nodebbUrl)
            .post('/v2/groups', payload)
            .reply(200, mockData.groupRes);

        chai.request(server)
            .post('/discussion/v2/groups')
            .send(payload)
            .end((err, res) => {
                expect(res.body).to.be.a('object');
                expect(res.status).to.equal(200);
                expect(res.body.code).to.equal('ok')
                done();
            });
    });

    // it('it should not create the group', (done) => {
    //     const payload ={}
    //     nock(nodebbUrl)
    //         .post('/v2/groups', payload)
    //         .reply(400, mockData.errorResponse);

    //     chai.request(server)
    //         .post('/discussion/v2/groups')
    //         .send(payload)
    //         .end((err, res) => {
    //             expect(res.body).to.be.a('object');
    //             expect(res.status).to.equal(400);
    //             expect(res.body.code).to.equal('params-missing')
    //             done();
    //         });
    // });

    it('it should delete the group', (done) => {
        nock(nodebbUrl)
            .delete('/v2/groups/1')
            .reply(200, mockData.groupRes);

        chai.request(server)
            .delete('/discussion/v2/groups/1')
            .end((err, res) => {
                expect(res.body).to.be.a('object');
                expect(res.status).to.equal(200);
                expect(res.body.code).to.equal('ok')
                done();
            });
    });

    // it('it should not delete the group', (done) => {
    //     nock(nodebbUrl)
    //         .delete('/v2/groups/12345')
    //         .reply(404, mockData.errorMessage);

    //     chai.request(server)
    //         .delete('/discussion/v2/groups/12345')
    //         .end((err, res) => {
    //             expect(res.body).to.be.a('object');
    //             expect(res.status).to.equal(404);
    //             expect(res.body.code).to.equal('not-found')
    //             done();
    //         });
    // });

    it('it should not create new post', (done) => {
        const payload = {uid:1}
        nock(nodebbUrl)
            .post('/v2/posts/1', payload)
            .reply(400, mockData.errorResponse);

        chai.request(server)
            .post('/discussion/v2/posts/1')
            .send(payload)
            .end((err, res) => {
                expect(res.body).to.be.a('object');
                expect(res.status).to.equal(400);
                done();
            });
    });

    it('it should not delete post', (done) => {
        nock(nodebbUrl)
            .delete('/v2/posts/1?uid=1')
            .reply(400, mockData.errorMessage);

        chai.request(server)
            .delete('/discussion/v2/posts/12345')
            .end((err, res) => {
                expect(res.body).to.be.a('object');
                expect(res.status).to.equal(400);
                done();
            });
    });
    it('it should vote the post', (done) => {
        const payload = {delta: 1};
        nock(nodebbUrl)
            .post('/v2/posts/1/vote', payload)
            .reply(200, mockData.postRes);

        chai.request(server)
            .post('/discussion/v2/posts/1/vote')
            .send(payload)
            .end((err, res) => {
                expect(res.body).to.be.a('object');
                expect(res.status).to.equal(200);
                expect(res.body.code).to.equal('ok')
                done();
            });
    });


    it('it should not vote the post', (done) => {
        const payload = {};
        nock(nodebbUrl)
            .post('/v2/posts/1/vote', payload)
            .reply(400, mockData.errorResponse);

        chai.request(server)
            .post('/discussion/v2/posts/1/vote')
            .send(payload)
            .end((err, res) => {
                expect(res.body).to.be.a('object');
                expect(res.status).to.equal(400);
                expect(res.body.params.err).to.equal('DMW_PVOT14')
                done();
            });
    });

    it('it should delete the vote to post', (done) => {
        nock(nodebbUrl)
            .delete('/v2/posts/1/vote')
            .reply(200, mockData.postRes);

        chai.request(server)
            .delete('/discussion/v2/posts/1/vote')
            .end((err, res) => {
                expect(res.body).to.be.a('object');
                expect(res.status).to.equal(200);
                expect(res.body.code).to.equal('ok')
                done();
            });
    });

    it('it should create the user', (done) => {
        const payload ={username: "test user", email: 'test@gmail.com'};
        nock(nodebbUrl)
            .post('/v2/users', payload)
            .reply(200, mockData.postRes);

        chai.request(server)
            .post('/discussion/v2/users')
            .send(payload)
            .end((err, res) => {
                expect(res.body).to.be.a('object');
                expect(res.status).to.equal(200);
                expect(res.body.code).to.equal('ok')
                done();
            });
    });


    it('it should call helth api', (done) => {
        chai.request(server)
            .get('/health')
            .end((err, res) => {
                expect(res.body).to.be.a('object');
                expect(res.status).to.equal(200);
                expect(res.body.message).to.equal('health api')
                done();
            });
    });

    it('it should give 404', (done) => {
        chai.request(server)
            .get('/test').then(res => {
                expect(res.status).to.equal(404);
                done();
            });
    });

    // it('it should GET forumId', (done) => {

    //     nock('')
    //         .post('/forumId/1', payload)
    //         .reply(200);

    //     chai.request(server)
    //         .get('/forumId/1').then(res => {
    //             expect(res.status).to.equal(200);
    //             done();
    //         });
    // });
});
