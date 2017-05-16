(function(window, angular, undefined) {
	angular.module('app')
		.controller('invoiceListCtrl', ['$scope', '$state', '$http', '$stateParams', 'userSvc', function($scope, $state, $http, $stateParams, userSvc) {

			var config = {
				headers: {
					'auth-token': userSvc.token
				}
			};

			$scope.allInvoices = [];
			$scope.to = new Date(moment().day(5));
			$scope.from = new Date(moment().day(1));
			$scope.selectAll = false;
			$scope.errors = false;
			$scope.errorsArry = [];

			$scope.exportToSavings = function(invoices, xpoInvoices) {
				var submittedInvoices = [];
				var submittedXPOInvoices =[];
				for (var i in invoices) {
					if (invoices[i].selected) {
						submittedInvoices.push(invoices[i].invoice_id);
					}
				}
				for(i in xpoInvoices) {
					if(xpoInvoices[i].selected){
						submittedXPOInvoices.push(xpoInvoices[i].xpo_id);
					}
				}
				if ((submittedInvoices.length + submittedXPOInvoices.length )> 0) {
					$state.go('price-savings', {
						invoiceIDs: submittedInvoices,
						xpoIDs: submittedXPOInvoices
					});
				} else {
					console.log('Please select at least 1 invoice.');
					$scope.errors = true;
					$scope.errorsArry = [];
					$scope.errorsArry.push('Please select at least 1 invoice.');
				}
			};


			$scope.selectedAll = function() {
				if (!$scope.selectAll) {
					$scope.selectAll = true;
				} else {
					$scope.selectAll = false;
				}
				angular.forEach($scope.allInvoices, function(invoice) {
					invoice.selected = $scope.selectAll;
				});
				angular.forEach($scope.allXPOInvoices, function(xpoInvoice){
					xpoInvoice.selected = $scope.selectAll;
				});
			};

			$scope.AMCcheck = false;
			$scope.grossCheck = false;
			$scope.deficitCheck = false;
			$scope.color = '';
			$scope.rateCheck = function(invoice) {
				var AMCcheck = (invoice.rated_sum !== '0' && invoice.rated_sum !== 0);
				var grossCheck = (invoice.gross_charge !== invoice.rated_sum);
				var deficitCheck = (invoice.deficit !== invoice.deficit_rate);
				var color = '';
				if ((AMCcheck || deficitCheck) && AMCcheck) {
					color = "lightsalmon";
				} 
				// else if (invoice.rated_sum === 0 || invoice.rated_sum === '0'){
				// 	color = "LightCyan";
				// }
				return color;
			};

			$http.get('/secure-api/invoice/get_invoices_once', config)
				.then(function(response) {
					$scope.allInvoices = response.data.data;
					for (var i in $scope.allInvoices) {
						$scope.allInvoices[i].process_date = date_parse($scope.allInvoices[i].process_date);
						$scope.allInvoices[i].ship_date = date_parse($scope.allInvoices[i].ship_date);
						$scope.allInvoices[i].delivery_date = date_parse($scope.allInvoices[i].delivery_date);
						$scope.allInvoices[i].invoice_number = undoCleanEntry($scope.allInvoices[i].invoice_number);
						$scope.allInvoices[i].sender_name = undoCleanEntry($scope.allInvoices[i].sender_name);
						$scope.allInvoices[i].sender_address_1 = undoCleanEntry($scope.allInvoices[i].sender_address_1);
						$scope.allInvoices[i].sender_city = undoCleanEntry($scope.allInvoices[i].sender_city);
						$scope.allInvoices[i].sender_country = undoCleanEntry($scope.allInvoices[i].sender_country);
						$scope.allInvoices[i].receiver_name = undoCleanEntry($scope.allInvoices[i].receiver_name);
						$scope.allInvoices[i].receiver_address_1 = undoCleanEntry($scope.allInvoices[i].receiver_address_1);
						$scope.allInvoices[i].receiver_city = undoCleanEntry($scope.allInvoices[i].receiver_city);
						$scope.allInvoices[i].receiver_country = undoCleanEntry($scope.allInvoices[i].receiver_country);
						$scope.allInvoices[i].transportation_mode = undoCleanEntry($scope.allInvoices[i].transportation_mode);
						$scope.allInvoices[i].package_type = undoCleanEntry($scope.allInvoices[i].package_type);
						$scope.allInvoices[i].sender_address_2 = undoCleanEntry($scope.allInvoices[i].sender_address_2);
						$scope.allInvoices[i].receiver_address_2 = undoCleanEntry($scope.allInvoices[i].receiver_address_2);
						$scope.allInvoices[i].receiver_zip_4 = undoCleanEntry($scope.allInvoices[i].receiver_zip_4);
						$scope.allInvoices[i].receiver_zip = undoCleanEntry($scope.allInvoices[i].receiver_zip);
						$scope.allInvoices[i].sender_zip = undoCleanEntry($scope.allInvoices[i].sender_zip);
						$scope.allInvoices[i].sender_zip_4 = undoCleanEntry($scope.allInvoices[i].sender_zip_4);
					}
				}, function(err) {
					console.log(err);
					$state.go('login');
				});
			$http.get('/secure-api/xpo/get_XPO_invoices_once', config)
				.then(function(response) {
					$scope.allXPOInvoices = response.data.data;
					for (var i in $scope.allXPOInvoices) {
						$scope.allXPOInvoices[i].invoice_number = $scope.allXPOInvoices[i].pro_number;
						$scope.allXPOInvoices[i].ship_date = date_parse($scope.allXPOInvoices[i].ship_date);
						$scope.allXPOInvoices[i].process_date = date_parse($scope.allXPOInvoices[i].process_date);
					}
				}, function(err) {
					console.log(err);
					$state.go('login');
				});
		}]);
})(window, window.angular);