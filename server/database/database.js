var assert = require('assert');

console.log(process.env);
var Sequelize = require('sequelize');

if (process.env.HEROKU_POSTGRESQL_CYAN_URL) {
	var connection = new Sequelize(process.env.HEROKU_POSTGRESQL_CYAN_URL);
} else if (process.env.DATABASE_URL) {
	var connection = new Sequelize(process.env.DATABASE_URL);
} else {
	var connection = new Sequelize(process.env.DB, process.env.DBUser, process.env.DBPass, {
		dialect: 'postgres'
	});
}



module.exports = connection;