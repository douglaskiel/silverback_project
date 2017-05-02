(function(window, angular, undefined) {
	angular.module('app')
		.controller('viewXPOInvoice', ['$scope', '$state', '$http', '$stateParams', 'userSvc', function($scope, $state, $http, $stateParams, userSvc) {

			var config = {
				headers: {
					'auth-token': userSvc.token
				}
			};
			$scope.state = $state.current;
			$scope.params = $stateParams;
			$scope.xpoInvoice ={};

			$scope.deleteXPOInvoice = function(xpoID){
				var r = confirm("Are you sure you want to delete this Invoice?");
				if (r === true) {
					request = '/secure-api/xpo/delete_xpo_invoice?' + xpoID;
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

			$http.get('/secure-api/xpo/get_xpo_invoice?' + $scope.params.invoiceID, config)
				.then(function(response) {
					$scope.xpoInvoice = response.data.data;
					$scope.xpoInvoice[0].ship_date = date_parse($scope.xpoInvoice[0].ship_date);
					$scope.xpoInvoice[0].process_date = date_parse($scope.xpoInvoice[0].process_date);
				}, function(err) {
					console.log(err);
					$state.go('login');
				});

		}]);
})(window, window.angular);