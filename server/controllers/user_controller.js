var db = require('../database/database');
var bcrypt = require('bcryptjs');
var salt = bcrypt.genSaltSync(12);
var jwt = require('jsonwebtoken');
var Checker = require('password-checker');
var checker = new Checker();
checker.min_length = 14;
checker.requireLetters(true);
checker.requireNumbers(true);
checker.requireSymbols(true);
checker.disallowNames(true);
// checker.disallowWords(true, true);
// checker.disallowPasswords(true, true, 3);
var nodemailer = require("nodemailer");

function makeid() {
	var text = "";
	var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

	for (var i = 0; i < 40; i++)
		text += possible.charAt(Math.floor(Math.random() * possible.length));

	return text;
}

module.exports.passwordReset = function(req, res) {
	console.log(req.body);
	var tokenCheck = req.body.reset_code;
	var timeDiffrence;
	var isVerified;
	var currentDate = Date.now();
	var selected;
	var password = req.body.user_password;
	var userID = req.body.user_id;
	db.query('SELECT * FROM recovery WHERE user_id =' + userID)
		.spread(function(result, metadata) {
			for (var i in result) {
				isVerified = bcrypt.compareSync(tokenCheck, result[i].token);
				timeDiffrence = (currentDate - result[i].date) / 3600000;
				if (isVerified && timeDiffrence) {
					selected = result[i];
				}
			}
			if (selected) {
				//console.log(checker.check(password));
				//if (checker.check(password)) {
				console.log(req.body);
				var newPassword = bcrypt.hashSync(req.body.enter, salt);
				db.query("UPDATE users SET user_password='" + newPassword + "' WHERE id=" + userID)
					.spread(function(result, metadata) {
						db.query('DELETE FROM recovery WHERE user_id =' + userID)
							.spread(function(result, metadata) {
								res.status(200).send('Account password changed, All requests have been closed.');
							});
					});
				// } else {
				// 	checker.check(password);
				// 	var passError = checker.errors;
				// 	console.log(passError);
				// 	// var errorArry = [];
				// 	// for (i = 0; i < passError.length; i++) {
				// 	// 	errorString = passError[i].toString();
				// 	// 	errorArry.push(errorString);
				// 	// }
				// 	// res.status(500).send(errorArry);
				// }
			} else {
				res.status(500).send('Unable to update password.');
			}
		});

};

module.exports.passwordRequest = function(req, res) {
	var emailRecover = req.body.to;
	var url = req.body.urlBase + '/#!/reset_password/';
	db.query("SELECT * FROM users WHERE email = '" + emailRecover + "'")
		.spread(function(result, metadata) {
			if (result.length > 0) {
				var firstName = result[0].first_name;
				var userID = result[0].id;
				var smtpTransport = nodemailer.createTransport({
					host: process.env.EMAIL_HOST, // hostname
					secureConnection: false, // TLS requires secureConnection to be false
					port: 587, // port for secure SMTP
					tls: {
						ciphers: 'SSLv3'
					},
					auth: {
						user: process.env.NOREPLY,
						pass: process.env.EMAIL
					},
				});
				var token = makeid();
				var hashedToken = bcrypt.hashSync(token, salt);
				var currentDate = Date.now();
				db.query("INSERT INTO recovery (email, token, date, user_id) VALUES ('" + emailRecover + "', '" + hashedToken + "', " + currentDate + ", " + userID + ")")
					.spread(function(result, metadata) {
						var mailOptions = {
							from: process.env.NOREPLY,
							to: emailRecover,
							subject: 'Silverback LTL Application - Forgotten Password',
							text: 'Hello ' + firstName + ', You recently request a password reset on your account. Please visit: ' + url + userID + '/' + token + ' and enter your new password. If this was not you feel free to ignore this message, you\'re request token will expire in 1 hour.'
						};
						console.log(mailOptions);

						smtpTransport.sendMail(mailOptions, function(error, response) {
							if (error) {
								console.log(error);
								res.status(500).send("error");
							} else {
								console.log("Message sent: " + response.response);
								res.status(200).send("sent");
							}
						});
					});
			} else {
				res.status(500).send('Error Sending Email, please try again or contact the system administrator');
			}
		});
};

module.exports.createUser = function(req, res) {
	db.query("SELECT * FROM users WHERE username = '" + req.body.username + "' or email = '" + req.body.email + "'")
		.spread(function(result, metadata) {
			if (result.length < 1) {
				db.query("SELECT * FROM unapproved_users WHERE username = '" + req.body.username + "' or email = '" + req.body.email + "'")
					.spread(function(result, metadata) {
						if (result.length < 1) {
							if (checker.check(req.body.user_password)) {
							var password = bcrypt.hashSync(req.body.user_password, salt);
							var currentDate = Date.now();
							//var query = "INSERT INTO users (username, user_password, email, first_name, last_name, created_timestamp, last_login_attempt) VALUES ('" + req.body.username + "', '" + password + "', '" + req.body.email + "', '" + req.body.first_name + "', '" + req.body.last_name + "', CURRENT_TIMESTAMP, '" + currentDate + "' )";
							var query = "INSERT INTO unapproved_users (username, user_password, email, first_name, last_name) VALUES ('" + req.body.username + "', '" + password + "', '" + req.body.email + "', '" + req.body.first_name + "', '" + req.body.last_name + "')";
							db.query(query).spread(function(results, metadata) {
								res.status(200).send("User Created, You will be unable to log in until your account has been approved");
							}).catch(function(err) {
								console.log(err);
								res.status(500).send("User was not created");
							});
							} else {
								checker.check(req.body.user_password);
								var passError = checker.errors;
								var errorArry = [];
								for (var i = 0; i < passError.length; i++) {
									errorString = passError[i].toString();
									errorArry.push(errorString);
								}
								res.status(500).send(errorArry);
							}
						} else {
							res.status(500).send('User was not created');
						}
					});
			} else {
				res.status(500).send('User was not created');
			}
		});
};

module.exports.login = function(req, res) {
	var submittedPassword = req.body.password;

	var query = "SELECT * FROM users WHERE username = '" + req.body.loginName + "' or email = '" + req.body.loginName + "'";
	db.query(query).spread(function(result, metadata) {
		var delay = Math.floor(Math.random() * (1030 - 971 + 1) + 971);
		if (result.length > 0) {
			var userData = result[0];
			var lastLogin = userData.last_login_attempt;
			var currentDate = Date.now();
			var loginAttempts = userData.login_attempts;
			var timeDiffrence = ((currentDate - lastLogin) / 3600000);
			if (((loginAttempts < 10) || (timeDiffrence > 1)) && (lastLogin > 1484900000000)) {
				if (timeDiffrence > 1) {
					db.query("UPDATE users SET login_attempts = 1, last_login_attempt = " + currentDate + " WHERE username = '" + userData.username + "'");
				} else {
					db.query("UPDATE users SET login_attempts = login_attempts + 1, last_login_attempt = " + currentDate + " WHERE username = '" + userData.username + "'");
				}
				var isVerified = bcrypt.compareSync(submittedPassword, userData.user_password);
				if (isVerified) {
					delete userData.user_password;
					delete userData.last_login_attempt;
					delete userData.login_attempts;
					db.query("UPDATE users SET login_attempts = 0 WHERE username = '" + userData.username + "'");
					//user authenticated
					var token = jwt.sign({
						user: userData
					}, process.env.SECRET, {
						expiresIn: 28800
					});
					res.json({
						user: userData,
						token: token
					});
				} else {
					res.status(400).send("Incorrect Username/Email and Password Combination.");
				}
			} else if (loginAttempts > 9) {
				setTimeout(function() {
					res.status(500).send('Unable to process your request.');
				}, delay);
			} else if (lastLogin < 1484900000000) {
				setTimeout(function() {
					res.status(500).send('Unable to process your request.');
				}, delay);
			}
		} else {
			setTimeout(function() {
				res.status(400).send("Incorrect Username/Email and Password Combination.");
			}, delay);
		}
	}).catch(function(err) {
		res.status(500).send('Unable to process your request.');
	});
};