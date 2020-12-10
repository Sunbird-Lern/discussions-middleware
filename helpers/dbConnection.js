const { MONGODB_CONNECTION_URL } = require('./environmentVariablesHelper');
var MongoClient = require('mongodb').MongoClient;

module.exports = MongoClient.connect(MONGODB_CONNECTION_URL);