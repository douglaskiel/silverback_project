var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var db = require('./database/database');
var jwt = require('jsonwebtoken');
var path = require('path');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));

app.use('/src', express.static(path.resolve(__dirname + '/../src')));
app.use('/dist', express.static(path.resolve(__dirname + '/../dist')));
app.use(express.static(path.resolve(__dirname + '/../public')));

//Controllers
var userController = require('./controllers/user_controller');

//Routers
var secureCompanyRouter = require('./routes/company');
var secureIOTRouter = require('./routes/iot');
var secureFuelRatesRouter = require('./routes/fuel_rates');
var secureOperationalAreaRouter = require('./routes/operational_area');
var secureCarriers = require('./routes/carrier');
var secureInvoices = require('./routes/invoice');
var securePrebuiltCosts = require('./routes/prebuilt_associated_costs');
var secureAccessorialCosts = require('./routes/associated_costs_invoice');
var secureShippingClass = require('./routes/shipping_class_invoice');
var secureFSCRouter = require('./routes/fuel_surcharge_rates');
var secureBenchmarkFSCRouter = require('./routes/benchmark_fsc');
var secureRegion = require('./routes/regions');
var secureState = require('./routes/states');
var secureUser = require('./routes/user');
var secureAudit = require('./routes/audit');
var secureXPO = require('./routes/xpo_invoice');

app.use('/secure-api/company', secureCompanyRouter);
app.use('/secure-api/iot', secureIOTRouter);
app.use('/secure-api/fuel_rates', secureFuelRatesRouter);
app.use('/secure-api/operational_area', secureOperationalAreaRouter);
app.use('/secure-api/carrier', secureCarriers);
app.use('/secure-api/invoice', secureInvoices);
app.use('/secure-api/accessorial_cost', securePrebuiltCosts);
app.use('/secure-api/accessorial_cost_invoice', secureAccessorialCosts);
app.use('/secure-api/shipping_class_invoice', secureShippingClass);
app.use('/secure-api/fuel_surcharge_rates', secureFSCRouter);
app.use('/secure-api/benchmark_fsc', secureBenchmarkFSCRouter);
app.use('/secure-api/region', secureRegion);
app.use('/secure-api/states', secureState);
app.use('/secure-api/user', secureUser);
app.use('/secure-api/audit', secureAudit);
app.use('/secure-api/xpo', secureXPO);

//routes
app.get('/', function(req, res) {
	res.sendFile(path.resolve(__dirname + '/../src/index.html'));
});

app.post('/api/user/create', userController.createUser);
app.post('/api/user/login', userController.login);
app.post('/api/user/password_request', userController.passwordRequest);
app.post('/api/user/reset_password', userController.passwordReset);

var PORT = process.env.PORT || 3000;

db.sync()
	.then(function() {
		app.listen(PORT, function() {
			console.log("It's working! It's working! " + PORT);
		});
	});