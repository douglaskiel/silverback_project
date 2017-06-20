(function(window, angular, undefined) {
	angular.module('app')
		.service('invoiceXPOSvc', ['$http', '$q', '$state', function($http, $q, $state) {
			var vm = this;

			var allInvoices = [];
			var specificInvoice = [];

			vm.getPriceSavingsInvoicesXPO = function(xpoIDs, config, callback) {
				var deferred = $q.defer();
				$http.get('/secure-api/xpo/get_xpo_invoices_price_savings?' + xpoIDs, config)
					.then(function(response) {
						priceSavingsInvoicesXPO = response.data.data;
						for (var i in priceSavingsInvoicesXPO) {
							for (var j in priceSavingsInvoicesXPO[i]) {
								if (typeof priceSavingsInvoicesXPO[i][j] === 'string') {
									priceSavingsInvoicesXPO[i][j] = undoCleanEntry(priceSavingsInvoicesXPO[i][j]);
								}
								if (isNumber(priceSavingsInvoicesXPO[i][j])) {
									priceSavingsInvoicesXPO[i][j] = parseFloat(priceSavingsInvoicesXPO[i][j]);

								}
							}
							priceSavingsInvoicesXPO[i].invoice_number = priceSavingsInvoicesXPO[i].pro_number;
							priceSavingsInvoicesXPO[i].discount_percent = Math.round(priceSavingsInvoicesXPO[i].discount_percent * 10000) / 100;
							priceSavingsInvoicesXPO[i].process_date = date_parse(priceSavingsInvoicesXPO[i].process_date);
							priceSavingsInvoicesXPO[i].ship_date = date_parse(priceSavingsInvoicesXPO[i].ship_date);
						}
						deferred.resolve(priceSavingsInvoicesXPO);
					})
					.catch(function(e) {
						deferred.reject(e);
						$state.go('login');
					});
				return deferred.promise;

			};
		}]);
})(window, window.angular);