var assert = require('assert');

if(!process.env.HEROKU_POSTGRESQL_CYAN_URL){
var env = require('node-env-file');
env('../.env');
}

var Sequelize = require('sequelize');
var connection;

if (process.env.HEROKU_POSTGRESQL_CYAN_URL) {
	connection = new Sequelize(process.env.HEROKU_POSTGRESQL_CYAN_URL);
} else if (process.env.DATABASE_URL) {
	connection = new Sequelize(process.env.DATABASE_URL);
} else {
	connection = new Sequelize(process.env.DB, process.env.DBUser, process.env.DBPass, {
		dialect: 'postgres'
	});
}

module.exports = connection;