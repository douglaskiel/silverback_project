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

var client = null;

function sendData(data) {
	if (!client) {
		console.log('Connection is not established');
		return;
	}
	client.write(data, function() {
		console.log('success!');
		setTimeout(function() {
			client.destroy();
			client = null;
			console.log('Connection Destroyed');
		}, 5000);
	});
}

router.put('/test_tcp', function(req, res) {
	var HOST = process.env.MARSIP;
	var PORT = process.env.MARSPORT;
	var exampleString = req.body.rateString;
	//console.log(exampleString);
	if (client) {
		console.log("connection is already open");
		return;
	}


	client = new net.Socket();

	client.on('error', function(err) {
		client.destroy();
		client = null;
		console.log(err);
	});

	client.on('data', function(data) {
		var response = data.slice(-52, -50);
		console.log('Received:' + data);
		if (response == '00') {
			res.status(200).send(data);
		} else {
			res.status(500).send(response);
		}

	});
	//sendData(exampleString);

	client.connect(PORT, HOST, function() {
		console.log('Connection opened successfully');
		setTimeout(function() {
			sendData(exampleString);
		}, 1000);
	});
});

router.get('/get_invoices_once', function(req, res) {
	if (req.user_role === 'Admin' || req.user_role === 'Editor') {
		var query = "SELECT * FROM invoices as i, carriers as c, client_information as p, iot as t, fuel_rates as f WHERE i.carrier_id = c.carrier_id AND i.client_id = p.client_id AND i.iot_id = t.iot_id AND i.fuel_rate_id =  f.fuel_rate_id";
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

router.get('/get_invoices', function(req, res) {
	if (req.user_role === 'Admin' || req.user_role === 'Editor') {
		var query = "SELECT * FROM invoices as i, carriers as c, client_information as p, iot as t, fuel_rates as f, shipping_class_invoice as s WHERE i.carrier_id = c.carrier_id AND i.client_id = p.client_id AND i.iot_id = t.iot_id AND i.fuel_rate_id =  f.fuel_rate_id AND i.invoice_number = s.invoice_number";
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

router.get('/get_invoices_price_savings', function(req, res) {
	if (req.user_role === 'Admin' || req.user_role === 'Editor') {
		var savingsString = req._parsedUrl.query.replace(/\[/gi, "");
		savingsString = savingsString.replace(/\]/gi, "");
		savingsString = savingsString.replace(/%20/gi, "");
		var query = "SELECT * FROM invoices as i, carriers as c, client_information as p, iot as t, fuel_rates as f WHERE i.invoice_id in (" + savingsString + ") AND i.carrier_id = c.carrier_id AND i.client_id = p.client_id AND i.iot_id = t.iot_id AND i.fuel_rate_id =  f.fuel_rate_id";
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

router.get('/get_invoice', function(req, res) {
	var query = "SELECT * FROM invoices as i, carriers as c, client_information as p, iot as t, fuel_rates as f, shipping_class_invoice as s WHERE i.invoice_id = " + req._parsedUrl.query + " AND i.carrier_id = c.carrier_id AND i.client_id = p.client_id AND i.iot_id = t.iot_id AND i.fuel_rate_id =  f.fuel_rate_id AND i.invoice_number = s.invoice_number";
	db.query(query).spread(function(result, metadata) {
		res.json({
			data: result
		});
	}).catch(function(err) {
		res.status(500).send(err);
	});
});

router.post('/insert_invoice', function(req, res) {
	if (req.user_role === 'Admin' || req.user_role === 'Editor') {
		var query = "WITH ins1 AS (INSERT INTO invoices (sender_name, sender_address_1, sender_address_2, sender_city, sender_state, sender_country, sender_zip, sender_zip_4, receiver_name, receiver_address_1, receiver_address_2, receiver_city, receiver_state, receiver_country, receiver_zip, receiver_zip_4, carrier_id, client_id, iot_id, transportation_mode, package_type, fuel_rate_id, invoice_number, process_date, ship_date, delivery_date, billed_weight, total_associated_costs, gross_charge, total_benchmark, carrier_discount, absolute_min_charge, accelerated_service, accelerated_charge, rated_sum, rated_total_charge ) VALUES ('" + req.body.invoice.sender_name + "', '" + req.body.invoice.sender_address_1 + "', '" + req.body.invoice.sender_address_2 + "', '" + req.body.invoice.sender_city + "', '" + req.body.invoice.sender_state + "', '" + req.body.invoice.sender_country + "', '" + req.body.invoice.sender_zip + "', '" + req.body.invoice.sender_zip_4 + "', '" + req.body.invoice.receiver_name + "', '" + req.body.invoice.receiver_address_1 + "', '" + req.body.invoice.receiver_address_2 + "', '" + req.body.invoice.receiver_city + "', '" + req.body.invoice.receiver_state + "', '" + req.body.invoice.receiver_country + "', '" + req.body.invoice.receiver_zip + "', '" + req.body.invoice.receiver_zip_4 + "', '" + req.body.invoice.carrier_id + "', '" + req.body.invoice.client_id + "', '" + req.body.invoice.iot_id + "', '" + req.body.invoice.transportation_mode + "', '" + req.body.invoice.package_type + "', '" + req.body.invoice.fuel_rate_id + "', '" + req.body.invoice.invoice_number + "', '" + req.body.invoice.process_date + "', '" + req.body.invoice.ship_date + "', '" + req.body.invoice.delivery_date + "', '" + req.body.invoice.billed_weight + "', '" + req.body.invoice.total_associated_costs + "', " + req.body.invoice.gross_charge + ", '" + req.body.invoice.total_benchmark + "', '" + req.body.invoice.carrier_discount + "', '" + req.body.invoice.absolute_min_charge + "', " + req.body.invoice.accelerated_service + ", " + req.body.invoice.accelerated_charge + ", " + req.body.invoice.rated_sum + ", " + req.body.invoice.rated_total_charge + ")), ins2 AS (INSERT INTO shipping_class_invoice SELECT invoice_number, classification, weight, rate, charge FROM json_populate_recordset(NULL::shipping_class_invoice, '" + JSON.stringify(req.body.shippedItems) + "')) INSERT INTO associated_costs_invoice SELECT benchmark_cost, cost_code, actual_cost, invoice_number FROM json_populate_recordset(NULL::associated_costs_invoice, '" + JSON.stringify(req.body.accessorialCharges) + "')";
		db.query(query).spread(function(result, metadata) {
			res.status(200).send('Invoice Added!');
		}).catch(function(err) {
			res.status(500).send(err);
		});
	} else {
		res.status(401).send('You are unauthorized to take this action');
	}
});

router.put('/update_invoice', function(req, res) {
	var i;
	if (req.user_role === 'Admin' || req.user_role === 'Editor') {
		var query = "";
		if (req.body.shippedItems.length > 0) {
			query = query + ' WITH';
			for (i in req.body.shippedItems) {
				if (req.body.shippedItems[i].item_id) {
					query = query + " itemupdt" + i + " AS (UPDATE shipping_class_invoice SET weight = " + req.body.shippedItems[i].weight + ", classification='" + req.body.shippedItems[i].classification + "', rate ='" + req.body.shippedItems[i].rate + "', charge ='" + req.body.shippedItems[i].charge + "' WHERE item_id=" + req.body.shippedItems[i].item_id + "),";
				} else {
					query = query + " itemins" + i + " AS (INSERT INTO shipping_class_invoice (weight, classification, invoice_number, rate, charge) VALUES ('" + req.body.shippedItems[i].weight + "', '" + req.body.shippedItems[i].classification + "', '" + req.body.shippedItems[i].invoice_number + "', '" + req.body.shippedItems[i].rate + "', '" + req.body.shippedItems[i].charge + "')),";
				}
			}
		}
		if (req.body.accessorialCharges.length > 0) {
			for (i in req.body.accessorialCharges) {
				if (req.body.accessorialCharges[i].cost_id) {
					query = query + " chgupdt" + i + " AS (UPDATE associated_costs_invoice SET actual_cost = " + req.body.accessorialCharges[i].actual_cost + ", benchmark_cost = " + req.body.accessorialCharges[i].benchmark_cost + ", cost_code='" + req.body.accessorialCharges[i].cost_code + "' WHERE cost_id=" + req.body.accessorialCharges[i].cost_id + "),";
				} else {
					query = query + " chgins" + i + " AS (INSERT INTO associated_costs_invoice (benchmark_cost, cost_code, actual_cost, invoice_number) VALUES ('" + req.body.accessorialCharges[i].benchmark_cost + "', '" + req.body.accessorialCharges[i].cost_code + "', '" + req.body.accessorialCharges[i].actual_cost + "','" + req.body.accessorialCharges[i].invoice_number + "'))";
				}
			}
		}
		query = query.replace(/,\s*$/, "");
		query = query + " UPDATE invoices SET sender_name='" + req.body.invoice.sender_name + "', sender_address_1='" + req.body.invoice.sender_address_1 + "', sender_address_2='" + req.body.invoice.sender_address_2 + "', sender_city='" + req.body.invoice.sender_city + "', sender_state='" + req.body.invoice.sender_state + "', sender_country='" + req.body.invoice.sender_country + "', sender_zip='" + req.body.invoice.sender_zip + "', sender_zip_4='" + req.body.invoice.sender_zip_4 + "', receiver_name='" + req.body.invoice.receiver_name + "', receiver_address_1='" + req.body.invoice.receiver_address_1 + "', receiver_address_2='" + req.body.invoice.receiver_address_2 + "', receiver_city='" + req.body.invoice.receiver_city + "', receiver_state='" + req.body.invoice.receiver_state + "', receiver_country='" + req.body.invoice.receiver_country + "', receiver_zip='" + req.body.invoice.receiver_zip + "', receiver_zip_4='" + req.body.invoice.receiver_zip_4 + "', carrier_id='" + req.body.invoice.carrier_id + "', client_id='" + req.body.invoice.client_id + "', iot_id='" + req.body.invoice.iot_id + "', transportation_mode='" + req.body.invoice.transportation_mode + "', package_type='" + req.body.invoice.package_type + "', fuel_rate_id='" + req.body.invoice.fuel_rate_id + "', invoice_number='" + req.body.invoice.invoice_number + "', process_date='" + req.body.invoice.process_date + "', ship_date='" + req.body.invoice.ship_date + "', delivery_date='" + req.body.invoice.delivery_date + "', billed_weight='" + req.body.invoice.billed_weight + "', total_associated_costs='" + req.body.invoice.total_associated_costs + "', total_benchmark='" + req.body.invoice.total_benchmark + "', gross_charge='" + req.body.invoice.gross_charge + "', absolute_min_charge='" + req.body.invoice.absolute_min_charge + "', carrier_discount='" + req.body.invoice.carrier_discount + "', accelerated_service= " + req.body.invoice.accelerated_service + ", accelerated_charge = " + req.body.invoice.accelerated_charge + ", rated_sum =" + req.body.invoice.rated_sum + ", rated_total_charge =" + req.body.invoice.rated_total_charge + " WHERE invoice_id=" + req.body.invoice.invoice_id;
		console.log(query);
		db.query(query).spread(function(result, metadata) {
			res.status(200).send('Invoice Updated!');
		}).catch(function(err) {
			res.status(500).send(err);
		});
	} else {
		res.status(401).send('You are unauthorized to take this action');
	}
});

router.delete('/delete_invoice', function(req, res) {
	if (req.user_role === 'Admin' || req.user_role === 'Editor') {
		var query = "DELETE FROM invoices WHERE invoice_id=" + req._parsedUrl.query;
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