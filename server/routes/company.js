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

router.get('/get_companies', function(req, res) {
	var query = "SELECT * FROM client_information";
	db.query(query).spread(function(result, metadata) {
		res.json({
			data: result
		});
	}).catch(function(err) {
		res.status(500).send(err);
	});
});

router.post('/insert_company', function(req, res) {
	if (req.user_role === 'Admin' || req.user_role === "Editor") {
		var query = "INSERT INTO client_information(client_name, client_address_1, client_address_2, client_city, client_zip, client_zip_4, client_country, client_state) VALUES ('" + req.body.client_name + "', '" + req.body.client_address_1 + "', '" + req.body.client_address_2 + "', '" + req.body.client_city + "', '" + req.body.client_zip + "', '" + req.body.client_zip_4 + "','" + req.body.client_country + "', '" + req.body.client_state + "')";
		db.query(query).spread(function(result, metadata) {
			res.status(200).send('Company Added!');
		}).catch(function(err) {
			res.status(500).send(err);
		});
	} else {
		res.status(401).send('You are unauthorized to take this action');
	}
});

router.put('/update_company', function(req, res) {
	if (req.user_role === 'Admin' || req.user_role === "Editor") {
		var query = "UPDATE client_information SET client_name = '" + req.body.client_name + "', client_address_1='" + req.body.client_address_1 + "', client_address_2='" + req.body.client_address_2 + "', client_city='" + req.body.client_city + "', client_zip='" + req.body.client_zip + "', client_zip_4='" + req.body.client_zip_4 + "', client_country='" + req.body.client_country + "', client_state='" + req.body.client_state + "' WHERE client_id=" + req.body.client_id;
		db.query(query).spread(function(result, metadata) {
			res.status(200).send('Company Updated!');
		}).catch(function(err) {
			res.status(500).send(err);
		});
	} else {
		res.status(401).send('You are unauthorized to take this action');
	}
});

router.delete('/company_delete', function(req, res) {
	if (req.user_role === 'Admin' || req.user_role === "Editor") {
		var query = "DELETE FROM client_information WHERE client_id=" + req._parsedUrl.query;
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