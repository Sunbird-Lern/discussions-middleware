const Redis = require("ioredis");
var envHelper = require('./environmentVariablesHelper');
var session = require('express-session');
const util = require('util');
let cluster;
let memoryStore;

const redis1 = require('redis');

// const client = redis1.createClient({
//     host: 'localhost',
//     port: 6379,
//   });

// var redsearch = require('redis-search');
// const bluebird = require('bluebird');
// bluebird.promisifyAll(redis1);
// bluebird.promisifyAll(redsearch);

// let strs = [];
// strs.push('Manny is a cat');
// strs.push('Luna is a cat');
// strs.push('Tobi is a ferret');
// strs.push('Loki is a ferret');
// strs.push('Jane is a ferret');
// strs.push('Jane is funny ferret');

// (() => {
//     try {
//       client.on('ready', () => console.log('Redis client is ready!'))
//       redsearch.setClient(client);
//       redsearch.confirmModule(() => console.log('RedSearch module loaded successfully'));
//       // client.on('end', () => console.log('Tadaa! Redis connection is closed.'));
//     } catch (error) {
//       console.log(error);
//     }
//   })();

// async function testFun() {
//     try {
//       redsearch.createSearch('searchTest', {}, (err, search) => {
//         // indexing str arr
//         strs.forEach(function (str, i) {
//           search.index(str, i);
//         });
//         // search strs with str
//         search.query(argv.query).end((err, ids) => {
//           let res = ids.map((i) => strs[i]);
//           // console.log(`Search results for ${argv.query}`);
//           res.forEach((str) => {
//             console.log(`ft search result ------ ${str}`);
//           });
//         });
//         client.quit();
//       });
//     } catch (error) {
//       console.log(error);
//     }
//   }

function init () {
    try {
        cluster = new Redis(envHelper.dmw_redis_connection_string.toString());
        util.promisify(cluster.get).bind(cluster)
        // testFun();
        getMemoryStore();
    } catch (error) {
        console.log('Redis connection failed with error: ', error.message)
    }
}

function getMemoryStore () {
    const storeType = envHelper.memory_store_type;
    switch (storeType) {
        case 'in-memory':
            memoryStore = new session.MemoryStore();
            break;
        case 'redis':
            memoryStore = getRedisStoreInstance(session);
            break; 
    }
}

/**
  * @param  {Object} session - Express Session Object
  * @returns {Object} - Redis Store with configured client
  */
 /* istanbul ignore next */
 function getRedisStoreInstance (session) {
    const RedisStore = require('connect-redis')(session);
    return new RedisStore({ client: cluster });
  };


  function setObject (key, value) {
      if (key && value) {
          // cluster.set(key, JSON.stringify(value))
      }
  }

  function getObject (key) {
    if (key) {
        // cluster.get(key)
    }
}

function removeObject (key) {
    if (key) {
        // cluster.del(key)
    }
}

  // init();

  module.exports = {
    memoryStore,
    setObject,
    getObject,
    removeObject
  };