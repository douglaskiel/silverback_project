(function(window, angular, undefined) {
	angular.module('app')
		.service('invoiceSaiaSvc', ['$http', '$q', '$state', function($http, $q, $state) {
			var vm = this;

			var allInvoices = [];
			var specificInvoice = [];

			vm.getPriceSavingsInvoicesSaia = function(saiaIDs, config, callback) {
				var deferred = $q.defer();
				$http.get('/secure-api/saia/get_saia_invoices_price_savings?' + saiaIDs, config)
					.then(function(response) {
						priceSavingsInvoicesSaia = response.data.data;
						for (var i in priceSavingsInvoicesSaia) {
							for (var j in priceSavingsInvoicesSaia[i]) {
								if (typeof priceSavingsInvoicesSaia[i][j] === 'string') {
									priceSavingsInvoicesSaia[i][j] = undoCleanEntry(priceSavingsInvoicesSaia[i][j]);
								}
								if (isNumber(priceSavingsInvoicesSaia[i][j])) {
									priceSavingsInvoicesSaia[i][j] = parseFloat(priceSavingsInvoicesSaia[i][j]);

								}
							}
							priceSavingsInvoicesSaia[i].invoice_number = priceSavingsInvoicesSaia[i].pro_number;
							priceSavingsInvoicesSaia[i].discount_percent = Math.round(priceSavingsInvoicesSaia[i].discount_percent * 10000) / 100;
							priceSavingsInvoicesSaia[i].process_date = date_parse(priceSavingsInvoicesSaia[i].process_date);
							priceSavingsInvoicesSaia[i].ship_date = date_parse(priceSavingsInvoicesSaia[i].ship_date);
						}
						deferred.resolve(priceSavingsInvoicesSaia);
					})
					.catch(function(e) {
						deferred.reject(e);
						$state.go('login');
					});
				return deferred.promise;

			};
		}]);
})(window, window.angular);