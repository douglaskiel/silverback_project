(function(window, angular, undefined) {
	angular.module('app')
		.controller('viewSaiaInvoice', ['$scope', '$state', '$http', '$stateParams', 'userSvc', function($scope, $state, $http, $stateParams, userSvc) {

			var config = {
				headers: {
					'auth-token': userSvc.token
				}
			};
			$scope.state = $state.current;
			$scope.params = $stateParams;
			$scope.saiaInvoice ={};

			$scope.deleteSaiaInvoice = function(saiaID){
				var r = confirm("Are you sure you want to delete this Invoice?");
				if (r === true) {
					request = '/secure-api/saia/delete_saia_invoice?' + saiaID;
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

			$http.get('/secure-api/saia/get_saia_invoice?' + $scope.params.invoiceID, config)
				.then(function(response) {
					$scope.saiaInvoice = response.data.data;
					$scope.saiaInvoice[0].ship_date = date_parse($scope.saiaInvoice[0].ship_date);
					$scope.saiaInvoice[0].process_date = date_parse($scope.saiaInvoice[0].process_date);
					$scope.saiaInvoice[0].discount_percent = sanatizePercent($scope.saiaInvoice[0].discount_percent);
				}, function(err) {
					console.log(err);
					$state.go('login');
				});

		}]);
})(window, window.angular);