(function(window, angular, undefined) {
	angular.module('app')
		.service('invoiceSvc', ['$http', '$q', '$state', function($http, $q, $state) {
			var vm = this;

			var allInvoices = [];
			var specificInvoice = [];

			vm.getSpecificInvoice = function(invoiceID, config, callback) {
				var deferred = $q.defer();
				$http.get('/secure-api/invoice/get_invoice?' + invoiceID, config)
					.then(function(response) {
						specificInvoice = response.data.data;
						for (var i in specificInvoice) {
							for (var j in specificInvoice[i]) {
								if (typeof specificInvoice[i][j] === 'string') {
									specificInvoice[i][j] = undoCleanEntry(specificInvoice[i][j]);
								}
								if (isNumber(specificInvoice[i][j])) {
									specificInvoice[i][j] = parseFloat(specificInvoice[i][j]);

								}
							}
							specificInvoice[i].process_date = date_parse(specificInvoice[i].process_date);
							specificInvoice[i].ship_date = date_parse(specificInvoice[i].ship_date);
							specificInvoice[i].delivery_date = date_parse(specificInvoice[i].delivery_date);
						}
						deferred.resolve(specificInvoice);
					})
					.catch(function(e) {
						deferred.reject(e);
						$state.go('login');
					});
				return deferred.promise;
			};

			vm.getPriceSavingsInvoices = function(invoiceIDs, config, callback) {
				var deferred = $q.defer();
				$http.get('/secure-api/invoice/get_invoices_price_savings?' + invoiceIDs, config)
					.then(function(response) {
						priceSavingsInvoices = response.data.data;
						for (var i in priceSavingsInvoices) {
							for (var j in priceSavingsInvoices[i]) {
								if (typeof priceSavingsInvoices[i][j] === 'string') {
									priceSavingsInvoices[i][j] = undoCleanEntry(priceSavingsInvoices[i][j]);
								}
								if (isNumber(priceSavingsInvoices[i][j])) {
									priceSavingsInvoices[i][j] = parseFloat(priceSavingsInvoices[i][j]);
								}
							}
							priceSavingsInvoices[i].process_date = date_parse(priceSavingsInvoices[i].process_date);
							priceSavingsInvoices[i].ship_date = date_parse(priceSavingsInvoices[i].ship_date);
							priceSavingsInvoices[i].delivery_date = date_parse(priceSavingsInvoices[i].delivery_date);
						}
						deferred.resolve(priceSavingsInvoices);
					})
					.catch(function(e) {
						deferred.reject(e);
						$state.go('login');
					});
				return deferred.promise;

			};
		}]);
})(window, window.angular);