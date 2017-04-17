(function(window, angular, undefined) {
	angular.module('app')
		.controller('invoiceViewCtrl', ['$scope', '$state', '$http', '$stateParams', 'userSvc', function($scope, $state, $http, $stateParams, userSvc) {

			var config = {
				headers: {
					'auth-token': userSvc.token
				}
			};

			$scope.specificInvoice = [];
			$scope.associatedCosts = [];
			$scope.state = $state.current;
			$scope.params = $stateParams;

			$http.get('/secure-api/invoice/get_invoice?' + $scope.params.invoiceID, config)
				.then(function(response) {
					$scope.specificInvoice = response.data.data;
					for (var i = 0; i < $scope.specificInvoice.length; i++) {
						$scope.specificInvoice[i].process_date = date_parse($scope.specificInvoice[i].process_date);
						$scope.specificInvoice[i].ship_date = date_parse($scope.specificInvoice[i].ship_date);
						$scope.specificInvoice[i].delivery_date = date_parse($scope.specificInvoice[i].delivery_date);
						$scope.specificInvoice[i].carrier_discount = Math.round($scope.specificInvoice[i].carrier_discount * 100);
						$scope.specificInvoice[i].invoice_number = undoCleanEntry($scope.specificInvoice[i].invoice_number);
						$scope.specificInvoice[i].sender_name = undoCleanEntry($scope.specificInvoice[i].sender_name);
						$scope.specificInvoice[i].sender_address_1 = undoCleanEntry($scope.specificInvoice[i].sender_address_1);
						$scope.specificInvoice[i].sender_city = undoCleanEntry($scope.specificInvoice[i].sender_city);
						$scope.specificInvoice[i].sender_country = undoCleanEntry($scope.specificInvoice[i].sender_country);
						$scope.specificInvoice[i].receiver_name = undoCleanEntry($scope.specificInvoice[i].receiver_name);
						$scope.specificInvoice[i].receiver_address_1 = undoCleanEntry($scope.specificInvoice[i].receiver_address_1);
						$scope.specificInvoice[i].receiver_city = undoCleanEntry($scope.specificInvoice[i].receiver_city);
						$scope.specificInvoice[i].receiver_country = undoCleanEntry($scope.specificInvoice[i].receiver_country);
						$scope.specificInvoice[i].transportation_mode = undoCleanEntry($scope.specificInvoice[i].transportation_mode);
						$scope.specificInvoice[i].package_type = undoCleanEntry($scope.specificInvoice[i].package_type);
						$scope.specificInvoice[i].sender_address_2 = undoCleanEntry($scope.specificInvoice[i].sender_address_2);
						$scope.specificInvoice[i].receiver_address_2 = undoCleanEntry($scope.specificInvoice[i].receiver_address_2);
						$scope.specificInvoice[i].receiver_zip_4 = undoCleanEntry($scope.specificInvoice[i].receiver_zip_4);
						$scope.specificInvoice[i].receiver_zip = undoCleanEntry($scope.specificInvoice[i].receiver_zip);
						$scope.specificInvoice[i].sender_zip = undoCleanEntry($scope.specificInvoice[i].sender_zip);
						$scope.specificInvoice[i].sender_zip_4 = undoCleanEntry($scope.specificInvoice[i].sender_zip_4);
					}
					$scope.items = $scope.specificInvoice;
					$http.get('/secure-api/accessorial_cost_invoice/get_associated_costs_invoice?' + $scope.specificInvoice[0].invoice_number, config)
						.then(function(response) {
							$scope.associatedCosts = response.data.data;
						}, function(err) {
							console.log(err);
						});
				}, function(err) {
					console.log(err);
					$state.go('login');
				});

			$scope.deleteInvoice = function(invoiceID) {
				var r = confirm("Are you sure you want to delete this Invoice?");
				if (r === true) {
					request = '/secure-api/invoice/delete_invoice?' + invoiceID;

					$http.delete(request, config)
						.then(function(response) {
							console.log('Invoice Removed');
							$state.go('list-invoice');
						}, function(err) {
							console.log(err);
							$state.go('login');
						});
				}
			};
		}]);
})(window, window.angular);