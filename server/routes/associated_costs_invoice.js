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

router.get('/get_associated_costs_invoices', function(req, res) {
	var query = "SELECT * FROM associated_costs_invoice";
	db.query(query).spread(function(result, metadata) {
		res.json({
			data: result
		});
	}).catch(function(err) {
		res.status(500).send(err);
	});
});

router.get('/get_associated_costs_invoice', function(req, res) {
	var query = "SELECT * FROM associated_costs_invoice WHERE invoice_number ='" + req._parsedUrl.query + "'";
	db.query(query).spread(function(result, metadata) {
		res.json({
			data: result
		});
	}).catch(function(err) {
		res.status(500).send(err);
	});
});

router.post('/insert_associated_costs_invoice', function(req, res) {
	if (req.user_role === 'Admin' || req.user_role === 'Editor') {
		var query = "WITH ins1 AS (INSERT INTO associated_costs_invoice (benchmark_cost, cost_code, actual_cost, invoice_number) VALUES ('" + req.body.benchmark_cost + "', '" + req.body.cost_code + "', '" + req.body.actual_cost + "','" + req.body.invoice_number + "')) UPDATE invoices SET total_associated_costs = " + req.body.total_associated_costs + ", total_benchmark = " + req.body.total_benchmark + " WHERE invoice_number = '" + req.body.invoice_number + "'";
		db.query(query).spread(function(result, metadata) {
			res.status(200).send('Associated Cost Added!');
		}).catch(function(err) {
			res.status(500).send(err);
		});
	} else {
		res.status(401).send('You are not authorized to take this action');
	}
});

router.put('/update_associated_costs_invoice', function(req, res) {
	if (req.user_role === 'Admin' || req.user_role === 'Editor') {
		var query = "WITH update1 AS (UPDATE associated_costs_invoice SET actual_cost = " + req.body.actual_cost + ", benchmark_cost = " + req.body.benchmark_cost + ", cost_code='" + req.body.cost_code + "' WHERE cost_id=" + req.body.cost_id + ") UPDATE invoices SET total_associated_costs = " + req.body.total_associated_costs + ", total_benchmark = " + req.body.total_benchmark + " WHERE invoice_number = '" + req.body.invoice_number + "'";
		db.query(query).spread(function(result, metadata) {
			res.status(200).send('Associated Cost Updated!');
		}).catch(function(err) {
			res.status(500).send(err);
		});
	} else {
		res.status(401).send('You are not authorized to take this action');
	}
});

router.delete('/delete_associated_costs_invoice', function(req, res) {
	if (req.user_role === 'Admin' || req.user_role === 'Editor') {
		var indexLine = req._parsedUrl.query.indexOf("|");
		var indexSlash = req._parsedUrl.query.indexOf("/");
		var indexAmp = req._parsedUrl.query.indexOf('&');
		var deleteCharge = req._parsedUrl.query.slice(0, indexSlash);
		var newTotalCharge = req._parsedUrl.query.slice(indexSlash + 1, indexAmp);
		var newTotalBenchmark = req._parsedUrl.query.slice(indexAmp + 1, indexLine);
		var invoiceNumber = req._parsedUrl.query.slice(indexLine + 1);

		var query = "WITH delete1 AS (DELETE FROM associated_costs_invoice WHERE cost_id=" + deleteCharge + ") UPDATE invoices SET total_associated_costs =" + newTotalCharge + ", total_benchmark =" + newTotalBenchmark + " WHERE invoice_number = '" + invoiceNumber + "'";
		db.query(query).spread(function(result, metadata) {
			res.status(200).send('Associated Cost Deleted');
		}).catch(function(err) {
			res.status(500).send(err);
		});
	} else {
		res.status(401).send('You are not authorized to take this action');
	}
});

module.exports = router;