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

router.get('/get_operational_area', function(req, res) {
	var query = "SELECT * FROM operational_area as o, carriers as c, state_regions as s  WHERE c.carrier_id = o.carrier_id AND o.state_region_id = s.state_region_id ORDER BY zip_code";
	db.query(query).spread(function(result, metadata) {
		res.json({
			data: result
		});
	}).catch(function(err) {
		res.status(500).send(err);
	});
});

router.post('/insert_operational_area', function(req, res) {
	if (req.user_role === 'Admin' || req.user_role === 'Editor') {
		var query = "INSERT INTO operational_area (zip_code, states, absolute_minimum_charge, discount, carrier_id, accelerated_charge, state_region_id, state_id) VALUES ('" + req.body.zip_code + "', '" + req.body.states + "', '" + req.body.absolute_minimum_charge + "', '" + req.body.discount + "', '" + req.body.carrier_id + "', '" + req.body.accelerated_charge + "', '" + req.body.state_region_id + "', '" + req.body.state_id + "' )";
		db.query(query).spread(function(result, metadata) {
			res.status(200).send('Operational Area Added!');
		}).catch(function(err) {
			res.status(500).send(err);
		});
	} else {
		res.status(401).send('You are unauthorized to take this action');
	}
});

router.put('/update_operational_region', function(req, res) {
	if (req.user_role === 'Admin' || req.user_role === 'Editor') {
		var query = 'UPDATE operational_area SET ';
		if (req.body.absolute_minimum_charge) {
			query += "absolute_minimum_charge =" + req.body.absolute_minimum_charge + " ";
		}
		if (req.body.discount) {
			if (req.body.absolute_minimum_charge) {
				query += ",";
			}
			query += "discount =" + req.body.discount + " ";
		}
		console.log(req.body.absolute_minimum_charge || req.body.discount);
		if (req.body.accelerated_charge) {
			if (req.body.absolute_minimum_charge || req.body.discount) {
				query += ",";
			}
			query += " accelerated_charge =" + req.body.accelerated_charge + " ";
		}
		query += "WHERE carrier_id =" + req.body.carrier_id + " ";
		if (req.body.state_region_id != '*') {
			query += "AND state_region_id =" + req.body.state_region_id;
		}
		console.log(query);
		db.query(query).spread(function(result, metadata) {
			res.status(200).send('Operational Region Updated!');
		}).catch(function(err) {
			res.status(500).send(err);
		});
	} else {
		res.status(401).send('You are unauthorized to take this action');
	}
});

router.put('/update_operational_area', function(req, res) {
	if (req.user_role === 'Admin' || req.user_role === 'Editor') {
		var query = "UPDATE operational_area SET zip_code = '" + req.body.zip_code + "', states='" + req.body.states + "', absolute_minimum_charge ='" + req.body.absolute_minimum_charge + "', discount = '" + req.body.discount + "', carrier_id = '" + req.body.carrier_id + "' WHERE operation_id=" + req.body.operation_id;
		db.query(query).spread(function(result, metadata) {
			res.status(200).send('Operational Area Updated!');
		}).catch(function(err) {
			res.status(500).send(err);
		});
	} else {
		res.status(401).send('You are unauthorized to take this action');
	}
});

router.delete('/delete_operational_area', function(req, res) {
	if (req.user_role === 'Admin' || req.user_role === 'Editor') {
		var query = "DELETE FROM operational_area WHERE operation_id=" + req._parsedUrl.query;
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