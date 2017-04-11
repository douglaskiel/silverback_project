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

router.get('/get_fsc', function(req, res) {
	var query = "SELECT * FROM fuel_surcharge_rates";
	db.query(query).spread(function(result, metadata) {
		res.json({
			data: result
		});
	}).catch(function(err) {
		res.status(500).send(err);
	});
});

router.post('/insert_fsc', function(req, res) {
	if (req.user_role === 'Admin' || req.user_role === 'Editor') {
		var query = "INSERT INTO fuel_surcharge_rates (start_rate, end_rate, fuel_surcharge ) VALUES ('" + req.body.start_rate + "', '" + req.body.end_rate + "', '" + req.body.fuel_surcharge + "')";
		db.query(query).spread(function(result, metadata) {
			res.status(200).send('Fuel Rate Added!');
		}).catch(function(err) {
			res.status(500).send(err);
		});
	} else {
		res.status(401).send('You are unauthorized to take this action');
	}
});

router.put('/update_fsc', function(req, res) {
	if (req.user_role === 'Admin' || req.user_role === 'Editor') {
		var query = "UPDATE fuel_surcharge_rates SET start_rate = '" + req.body.start_rate + "', end_rate='" + req.body.end_rate + "', fuel_surcharge='" + req.body.fuel_surcharge + "' WHERE fuel_surcharge_id=" + req.body.fuel_surcharge_id;
		db.query(query).spread(function(result, metadata) {
			res.status(200).send('Fuel Rate Updated!');
		}).catch(function(err) {
			res.status(500).send(err);
		});
	} else {
		res.status(401).send('You are unauthorized to take this action');
	}
});

router.delete('/delete_fsc', function(req, res) {
	if (req.user_role === 'Admin' || req.user_role === 'Editor') {
		var query = "DELETE FROM fuel_surcharge_rates WHERE fuel_surcharge_id=" + req._parsedUrl.query;
		db.query(query).spread(function(result, metadata) {
			res.status(200).send('Fuel Rate Deleted!');
		}).catch(function(err) {
			res.status(500).send(err);
		});
	} else {
		res.status(401).send('You are unauthorized to take this action');
	}
});
module.exports = router;