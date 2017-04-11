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

router.get('/get_benchmark_fsc', function(req, res) {
	var query = "SELECT * FROM fuel_surcharge_benchmark";
	db.query(query).spread(function(result, metadata) {
		res.json({
			data: result
		});
	}).catch(function(err) {
		res.status(500).send(err);
	});
});

router.post('/insert_benchmark_fsc', function(req, res) {
	if (req.user_role === 'Admin' || req.user_role === 'Editor') {
		var query = "INSERT INTO fuel_surcharge_benchmark (fuel_index, benchmark_fuel_surcharge ) VALUES ('" + req.body.fuel_index + "', '" + req.body.benchmark_fuel_surcharge + "')";
		db.query(query).spread(function(result, metadata) {
			res.status(200).send('Fuel Rate Added!');
		}).catch(function(err) {
			res.status(500).send(err);
		});
	} else {
		res.status(401).send('You are not authorized to take this action');
	}
});

router.put('/update_benchmark_fsc', function(req, res) {
	if (req.user_role === 'Admin' || req.user_role === 'Editor') {
		var query = "UPDATE fuel_surcharge_benchmark SET fuel_index = '" + req.body.fuel_index + "', benchmark_fuel_surcharge='" + req.body.benchmark_fuel_surcharge + "' WHERE benchmark_fsc_id=" + req.body.benchmark_fsc_id;
		db.query(query).spread(function(result, metadata) {
			res.status(200).send('Fuel Rate Updated!');
		}).catch(function(err) {
			res.status(500).send(err);
		});
	} else {
		res.status(401).send('You are not authorized to take this action');
	}
});

router.delete('/delete_benchmark_fsc', function(req, res) {
	if (req.user_role === 'Admin' || req.user_role === 'Editor') {
		var query = "DELETE FROM fuel_surcharge_benchmark WHERE benchmark_fsc_id=" + req._parsedUrl.query;
		db.query(query).spread(function(result, metadata) {
			res.status(200).send('Fuel Rate Deleted!');
		}).catch(function(err) {
			res.status(500).send(err);
		});
	} else {
		res.status(401).send('You are not authorized to take this action');
	}
});
module.exports = router;