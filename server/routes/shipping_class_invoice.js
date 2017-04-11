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

router.get('/get_shipping_class_invoice', function(req, res) {
	var query = "SELECT * FROM shipping_class_invoice";
	db.query(query).spread(function(result, metadata) {
		res.json({
			data: result
		});
	}).catch(function(err) {
		res.status(500).send(err);
	});
});

router.post('/insert_shipping_class_invoice', function(req, res) {
	if (req.user_role === 'Admin' || req.user_role === 'Editor') {
		var query = "WITH ins1 AS (INSERT INTO shipping_class_invoice (weight, classification, invoice_number) VALUES ('" + req.body.weight + "', '" + req.body.classification + "', '" + req.body.invoice_number + "')) UPDATE invoices SET billed_weight = " + req.body.billed_weight + " WHERE invoice_number = '" + req.body.invoice_number + "'";
		db.query(query).spread(function(result, metadata) {
			res.status(200).send('Associated Cost Added!');
		}).catch(function(err) {
			res.status(500).send(err);
		});
	} else {
		res.status(401).send('You are unauthorized to take this action');
	}
});

router.put('/update_shipping_class_invoice', function(req, res) {
	if (req.user_role === 'Admin' || req.user_role === 'Editor') {
		var query = "WITH update1 AS (UPDATE shipping_class_invoice SET weight = " + req.body.weight + ", classification='" + req.body.classification + "' WHERE item_id=" + req.body.item_id + ") UPDATE invoices SET billed_weight = " + req.body.billed_weight + " WHERE invoice_number ='" + req.body.invoice_number + "'";
		db.query(query).spread(function(result, metadata) {
			res.status(200).send('Associated Cost Updated!');
		}).catch(function(err) {
			res.status(500).send(err);
		});
	} else {
		res.status(401).send('You are unauthorized to take this action');
	}
});

router.delete('/delete_shipping_class_invoice', function(req, res) {
	if (req.user_role === 'Admin' || req.user_role === 'Editor') {
		var indexLine = req._parsedUrl.query.indexOf("|");
		var indexSlash = req._parsedUrl.query.indexOf("/");
		var deleteItem = req._parsedUrl.query.slice(0, indexSlash);
		var newWeight = req._parsedUrl.query.slice(indexSlash + 1, indexLine);
		var invoiceNumber = req._parsedUrl.query.slice(indexLine + 1);

		var query = "WITH delete1 AS (DELETE FROM shipping_class_invoice WHERE item_id=" + deleteItem + ") UPDATE invoices SET billed_weight = " + newWeight + " WHERE invoice_number ='" + invoiceNumber + "'";

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