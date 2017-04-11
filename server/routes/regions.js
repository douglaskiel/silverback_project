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
			//req.user_permission.view_regions = decoded.user.permissions.view_regions;
			//req.user_permission.edit_regions = decoded.user.permissions.edit_regions
			req.user_role = decoded.user.role;
			next();
		}
	});
});

router.get('/get_region', function(req, res) {
	var query = "SELECT * FROM state_regions r, states s WHERE r.state_id = s.state_id";
	db.query(query).spread(function(result, metadata) {
		res.json({
			data: result
		});
	}).catch(function(err) {
		res.status(500).send(err);
	});
});

router.post('/insert_region', function(req, res) {
	if (req.user_role === 'Admin' || req.user_role === 'Editor') {
		var query = "INSERT INTO state_regions (state_id, region) VALUES ('" + req.body.state_id + "', '" + req.body.region + "')";
		db.query(query).spread(function(result, metadata) {
			res.status(200).send('Region Added!');
		}).catch(function(err) {
			res.status(500).send(err);
		});
	} else {
		res.status(401).send('You are unauthorized to take this action');
	}
});

router.put('/update_region', function(req, res) {
	if (req.user_role === 'Admin' || req.user_role === 'Editor') {
		var query = "UPDATE state_regions SET state_id = '" + req.body.state_id + "', region='" + req.body.region + "' WHERE state_region_id=" + req.body.state_region_id;
		db.query(query).spread(function(result, metadata) {
			res.status(200).send('Region Updated!');
		}).catch(function(err) {
			res.status(500).send(err);
		});
	} else {
		res.status(401).send('You are unauthorized to take this action');
	}
});

router.delete('/delete_region', function(req, res) {
	if (req.user_role === 'Admin' || req.user_role === 'Editor') {
		var query = "DELETE FROM state_regions WHERE state_region_id=" + req._parsedUrl.query;
		db.query(query).spread(function(result, metadata) {
			res.status(200).send('Region Deleted');
		}).catch(function(err) {
			res.status(500).send(err);
		});
	} else {
		res.status(401).send('You are unauthorized to take this action');
	}
});

module.exports = router;