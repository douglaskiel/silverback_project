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
router.get('/get_prebuilt_associated_costs', function(req, res) {
	var query = "SELECT * FROM associated_costs";
	db.query(query).spread(function(result, metadata) {
		res.json({
			data: result
		});
	}).catch(function(err) {
		res.status(500).send(err);
	});
});

router.post('/insert_prebuilt_associated_costs', function(req, res) {
	if (req.user_role === 'Admin' || req.user_role === 'Editor') {
		var query = "INSERT INTO associated_costs (benchmark_cost, cost_code, description) VALUES (" + req.body.benchmark_cost + ", '" + req.body.cost_code + "', '" + req.body.description + "')";
		db.query(query).spread(function(result, metadata) {
			res.status(200).send('Associated Cost Added!');
		}).catch(function(err) {
			res.status(500).send(err);
		});
	} else {
		res.status(401).send('You are unauthorized to take this action');
	}
});

router.put('/update_prebuilt_associated_costs', function(req, res) {
	if (req.user_role === 'Admin' || req.user_role === 'Editor') {
		var query = "UPDATE associated_costs SET benchmark_cost = " + req.body.benchmark_cost + ", cost_code='" + req.body.cost_code + "', description='" + req.body.description + "' WHERE prebuilt_cost_id=" + req.body.prebuilt_cost_id;
		db.query(query).spread(function(result, metadata) {
			res.status(200).send('Associated Cost Updated!');
		}).catch(function(err) {
			res.status(500).send(err);
		});
	} else {
		res.status(401).send('You are unauthorized to take this action');
	}
});

router.delete('/delete_prebuilt_associated_costs', function(req, res) {
	if (req.user_role === 'Admin' || req.user_role === 'Editor') {
		var query = "DELETE FROM associated_costs WHERE prebuilt_cost_id=" + req._parsedUrl.query;
		db.query(query).spread(function(result, metadata) {
			res.status(200).send('Associated Cost Deleted');
		}).catch(function(err) {
			res.status(500).send(err);
		});
	} else {
		res.status(401).send('You are unauthorized to take this action');
	}
});

module.exports = router;