var express = require('express');
var router = express.Router();
var db = require('../database/database');
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var salt = bcrypt.genSaltSync(12);
var Checker = require('password-checker');
var checker = new Checker();
checker.min_length = 14;
checker.requireLetters(true);
checker.requireNumbers(true);
checker.requireSymbols(true);
checker.disallowNames(true);

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
	extended: true
}));

router.use(function(req, res, next) {
	var token = req.headers['auth-token'];
	jwt.verify(token, process.env.SECRET, function(err, decoded) {
		if (err) {
			res.status(400).send('Invalid Token');
		} else {
			req.user_id = decoded.user.id;
			req.user_role = decoded.user.role;
			next();
		}
	});
});

router.get('/get_users', function(req, res) {
	if (req.user_role === "Admin") {
		var query = "SELECT * FROM users";
		db.query(query).spread(function(result, metadata) {
			for (var i in result) {
				delete result[i].user_password;
			}
			res.json({
				data: result
			});
		}).catch(function(err) {
			res.status(500).send(err);
		});
	} else {
		res.status(401).send('You are not authorized to access this page');
	}
});


router.get('/get_unapproved_users', function(req, res) {
	if (req.user_role === "Admin") {
		var query = "SELECT * FROM unapproved_users";
		db.query(query).spread(function(result, metadata) {
			for (var i in result) {
				delete result[i].user_password;
			}
			res.json({
				data: result
			});
		}).catch(function(err) {
			res.status(500).send(err);
		});
	} else {
		res.status(401).send('You are not authorized to access this page');
	}
});

router.get('/get_user', function(req, res) {
	var query = "SELECT * FROM users WHERE username = '" + req._parsedUrl.query + "'";
	db.query(query).spread(function(result, metadata) {
		for (var i in result) {
			delete result[i].user_password;
		}
		res.json({
			data: result
		});
	}).catch(function(err) {
		res.status(500).send(err);
	});
});

router.post('/approve_user', function(req, res) {
	if (req.user_role === "Admin") {
		var user = req.body;
		var query1 = "SELECT * FROM unapproved_users where unapproved_user_id =" + req.body.unapproved_user_id;
		db.query(query1).spread(function(result, metadata) {
			var query = "WITH approve AS (INSERT INTO users (username, user_password, email, created_timestamp, login_attempts, last_login_attempt, first_name, last_name, role, permissions) VALUES ('" + user.username + "', '" + result[0].user_password + "', '" + user.email + "', CURRENT_DATE, 0 , '" + user.last_login_attempt + "', '" + user.first_name + "', '" + user.last_name + "', '" + user.role + "', null)) DELETE FROM unapproved_users WHERE unapproved_user_id = " + user.unapproved_user_id;
			db.query(query).spread(function(result, metadata) {
				res.status(200).send('User Approved!');
			}).catch(function(err) {
				res.status(500).send(err);
			});
		}).catch(function(err) {
			res.status(500).send(err);
		});
	} else {
		res.status(401).send('You are not authorized to access this page');
	}
});

router.put('/update_user', function(req, res) {
	if (req.user_id != req.body.id) {
		res.status(500).send('Please make any changes to your account at your account page');
	} else {
		if (req.user_role === "Admin") {
			var query = "UPDATE users SET username = '" + req.body.username + "', email = '" + req.body.email + "', login_attempts = '" + req.body.login_attempts + "', first_name ='" + req.body.first_name + "', last_name = '" + req.body.last_name + "', role = '" + req.body.role + "', permissions = null WHERE id=" + req.body.id;
			db.query(query).spread(function(result, metadata) {
				res.status(200).send('User Updated!');
			}).catch(function(err) {
				res.status(500).send(err);
			});
		} else {
			res.status(401).send('You are not authorized to access this page');
		}
	}
});

router.put('/change_password', function(req, res) {
	var oldPassword = req.body.old_password;
	var newPassword = req.body.new_password;
	var searchQuery = "SELECT * FROM users WHERE id =" + req.user_id;
	db.query(searchQuery).spread(function(result, metadata) {
			var isVerified = bcrypt.compareSync(oldPassword, result[0].user_password);
			if (isVerified) {
				if (checker.check(newPassword)) {
					var password = bcrypt.hashSync(newPassword, salt);

					var query = "UPDATE users SET user_password ='" + password + "' WHERE  id=" + req.user_id;
					db.query(query).spread(function(result, metadata) {
						res.status(200).send('User Updated!');
					}).catch(function(err) {
						res.status(500).send(err);
					});
				} else {
					checker.check(newPassword);
					var passError = checker.errors;
					var errorArry = [];
					for (var i = 0; i < passError.length; i++) {
						errorString = passError[i].toString();
						errorArry.push(errorString);
					}
					res.status(500).send(errorArry);
				}
		} else {
			res.status(500).send('You have entered the wrong password, try again.');
		}
	}).catch(function(err) {
	res.status(500).send(err);
});
});

router.put('/update_profile', function(req, res) {
	var query = "UPDATE users SET username = '" + req.body.username + "', email = '" + req.body.email + "', first_name ='" + req.body.first_name + "', last_name = '" + req.body.last_name + "' WHERE id=" + req.body.id;
	db.query(query).spread(function(result, metadata) {
		res.status(200).send('User Updated!');
	}).catch(function(err) {
		res.status(500).send(err);
	});
});

router.delete('/delete_profile', function(req, res) {
	if (req.user_id === req._parsedUrl) {
		var query = "DELETE FROM users WHERE id=" + req._parsedUrl.query;
		db.query(query).spread(function(result, metadata) {
			res.status(200).send('User Deleted');
		}).catch(function(err) {
			res.status(500).send(err);
		});
	} else {
		res.status(401).send('User ID did not match');
	}
});

router.delete('/delete_user', function(req, res) {
	if (req.user_role === "Admin") {
		var query = "DELETE FROM users WHERE id=" + req._parsedUrl.query;
		db.query(query).spread(function(result, metadata) {
			res.status(200).send('User Deleted');
		}).catch(function(err) {
			res.status(500).send(err);
		});
	} else {
		res.status(401).send('You are not authorized to access this page');
	}
});

router.delete('/delete_unapproved_user', function(req, res) {
	if (req.user_role === "Admin") {
		var query = "DELETE FROM unapproved_users WHERE unapproved_user_id = " + req._parsedUrl.query;
		db.query(query).spread(function(result, metadata) {
			res.status(200).send('User Deleted');
		}).catch(function(err) {
			res.status(500).send(err);
		});
	} else {
		res.status(401).send('You are not authorized to access this page');
	}
});

module.exports = router;