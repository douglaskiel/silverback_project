var assert = require('assert');


var Sequelize = require('sequelize');

var connection = new Sequelize(process.env.DB, process.env.DBUser, process.env.DBPass, {
	dialect: 'postgres',
	dialectOptions: {
		// ssl: {
		// 	require: true
		// }
	}
});

module.exports = connection;