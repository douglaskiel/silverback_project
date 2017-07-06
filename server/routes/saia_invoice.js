var express = require('express');
var router = express.Router();
var db = require('../database/database');
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');
var moment = require('moment');
var net = require('net');
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

router.get('/get_saia_invoice', function(req, res) {
	var query = "SELECT * FROM saia_invoices as i, carriers as c, client_information as p WHERE i.saia_id = " + req._parsedUrl.query + " AND i.carrier_id = c.carrier_id AND i.client_id = p.client_id";
	db.query(query).spread(function(result, metadata) {
		res.json({
			data: result
		});
	}).catch(function(err) {
		res.status(500).send(err);
	});
});


router.get('/get_Saia_invoices_once', function(req, res) {
	if (req.user_role === 'Admin' || req.user_role === 'Editor') {
		var query = "SELECT * FROM saia_invoices as i, carriers as c, client_information as p WHERE i.carrier_id = c.carrier_id AND i.client_id = p.client_id";
		db.query(query).spread(function(result, metadata) {
			res.json({
				data: result
			});
		}).catch(function(err) {
			res.status(500).send(err);
		});
	} else {
		res.status(401).send('You are unauthorized to take this action');
	}
});

router.get('/get_saia_invoices_price_savings', function(req, res) {
	if (req.user_role === 'Admin' || req.user_role === 'Editor') {
		var savingsString = req._parsedUrl.query.replace(/\[/gi, "");
		savingsString = savingsString.replace(/\]/gi, "");
		savingsString = savingsString.replace(/%20/gi, "");
		var query = "SELECT * FROM saia_invoices as i, carriers as c, client_information as p WHERE i.saia_id in (" + savingsString + ") AND i.carrier_id = c.carrier_id AND i.client_id = p.client_id";
		db.query(query).spread(function(result, metadata) {
			res.json({
				data: result
			});
		}).catch(function(err) {
			res.status(500).send(err);
		});
	} else {
		res.status(401).send('You are unauthorized to take this action');
	}
});

router.post('/insert_saia_invoice', function(req, res) {
	if (req.user_role === 'Admin' || req.user_role === 'Editor') {
		var query = "INSERT INTO saia_invoices (carrier_name, pro_number, sender, sender_zip, receiver, receiver_zip, client_name, ship_date, process_date, base_charge, carrier_id, discount_percent, fsc_dollar, old_cost_saia, old_fsc_dollar, old_total_cost_dollar, new_cost, new_fsc_dollar, new_total_cost_dollar, savings_dollar, client_id, discount_ammount) VALUES ('" + req.body.carrier_name + "', '" + req.body.pro_number + "', '" + req.body.sender + "', '" + req.body.sender_zip + "', '" + req.body.receiver + "', '" + req.body.receiver_zip + "', '" + req.body.client_name + "', '" + req.body.ship_date + "', '" + req.body.process_date + "', '" + req.body.base_charge + "', '" + req.body.carrier_id + "', '" + req.body.discount_percent + "', '" + req.body.fsc_dollar + "', '" + req.body.old_cost_saia + "', '" + req.body.old_fsc_dollar + "', '" + req.body.old_total_cost_dollar + "', '" + req.body.new_cost + "', '" + req.body.new_fsc_dollar + "', '" + req.body.new_total_cost_dollar + "', '" + req.body.savings_dollar + "', '" + req.body.client_id +"', '" + req.body.discount_ammount + "')";
		db.query(query).spread(function(result, metadata) {
			res.status(200).send('Saia Invoice Added!');
		}).catch(function(err) {
			res.status(500).send(err);
		});
	} else {
		res.status(401).send('You are unauthorized to take this action');
	}
});

router.put('/update_saia_invoice', function(req, res) {
	if (req.user_role === 'Admin' || req.user_role === 'Editor') {
		var query = "UPDATE saia_invoices SET carrier_name = '" + req.body.carrier_name + "', pro_number='" + req.body.pro_number + "', sender ='" + req.body.sender + "', sender_zip ='" + req.body.sender_zip + "', receiver='" + req.body.receiver + "', receiver_zip='" + req.body.receiver_zip + "', client_name='" + req.body.client_name + "', ship_date='" + req.body.ship_date + "', process_date='" + req.body.process_date + "', base_charge='" + req.body.base_charge + "', carrier_id='" + req.body.carrier_id + "', discount_percent='" + req.body.discount_percent + "', fsc_dollar='" + req.body.fsc_dollar + "', old_cost_saia='" + req.body.old_cost_saia + "', old_fsc_dollar='" + req.body.old_fsc_dollar + "', old_total_cost_dollar='" + req.body.old_total_cost_dollar + "', new_cost='" + req.body.new_cost + "', new_fsc_dollar='" + req.body.new_fsc_dollar + "', new_total_cost_dollar='" + req.body.new_total_cost_dollar + "', savings_dollar='" + req.body.savings_dollar + "', client_id='" + req.body.client_id + "', discount_ammount='" + req.body.discount_ammount + "' WHERE saia_id=" + req.body.saia_id;
		db.query(query).spread(function(result, metadata) {
			res.status(200).send('Fuel Rate Updated!');
		}).catch(function(err) {
			res.status(500).send(err);
		});
	} else {
		res.status(401).send('You are unauthorized to take this action');
	}
});

router.delete('/delete_saia_invoice', function(req, res) {
	if (req.user_role === 'Admin' || req.user_role === 'Editor') {
		var query = "DELETE FROM saia_invoices WHERE saia_id=" + req._parsedUrl.query;
		db.query(query).spread(function(result, metadata) {
			res.status(200).send('Invoice Deleted!');
		}).catch(function(err) {
			res.status(500).send(err);
		});
	} else {
		res.status(401).send('You are unauthorized to take this action');
	}
});

module.exports = router;