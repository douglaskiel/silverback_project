var express = require('express');
var router = express.Router();
var db = require('../database/database');
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');
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
			req.user_id = decoded.id;
			req.user_role = decoded.user.role;
			next();
		}
	});
});

router.put('/update_carrier', function(req, res) {
	if (req.user_role === 'Admin' || req.user_role === 'Editor') {
		var query = "UPDATE carriers SET carrier_name = '" + req.body.carrier_name + "' WHERE carrier_id=" + req.body.carrier_id;
		db.query(query).spread(function(result, metadata) {
			res.status(200).send('Company Updated!');
		}).catch(function(err) {
			res.status(500).send(err);
		});
	} else {
		res.status(401).send('You are unauthorized to take this action');
	}
});

router.post('/insert_carriers', function(req, res) {
	if (req.user_role === 'Admin' || req.user_role === 'Editor') {
		var query = "INSERT INTO carriers(carrier_name) VALUES ('" + req.body.carrier_name + "')";
		db.query(query).spread(function(result, metadata) {
			res.status(200).send('Carrier Added!');
		}).catch(function(err) {
			res.status(500).send(err);
		});
	} else {
		res.status(401).send('You are unauthorized to take this action');
	}
});

router.get('/get_carriers', function(req, res) {
		var query = "SELECT * FROM carriers";
		db.query(query).spread(function(result, metadata) {
			res.json({
				data: result
			});
		}).catch(function(err) {
			res.status(500).send(err);
		});
});

router.delete('/delete_carrier', function(req, res) {
	if (req.user_role === 'Admin' || req.user_role === 'Editor') {
		var query = "DELETE FROM carriers WHERE carrier_id=" + req._parsedUrl.query;
		db.query(query).spread(function(result, metadata) {
			res.status(200).send('Company Deleted');
		}).catch(function(err) {
			res.status(500).send(err);
		});
	} else {
		res.status(401).send('You are unauthorized to take this action');
	}
});

module.exports = router;