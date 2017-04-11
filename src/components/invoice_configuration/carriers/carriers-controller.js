(function(window, angular, undefined) {
	angular.module('app')
		.controller('carrierCtrl', ['$scope', '$state', '$http', 'userSvc', function($scope, $state, $http, userSvc) {
			$scope.allCarriers = [];

			var config = {
				headers: {
					'auth-token': userSvc.token
				}
			};

			$scope.submitCarrier = function(submittedCarrier) {
				submittedCarrier.carrier_name = cleanEntry(submittedCarrier.carrier_name);

				if (submittedCarrier.carrier_id) {
					$http.put('/secure-api/carrier/update_carrier', submittedCarrier, config)
						.then(function(response) {
							console.log('Carrier Updated');
							$state.reload();
						}, function(err) {
							console.log(err);
						});
				} else {
					$http.post('/secure-api/carrier/insert_carriers', submittedCarrier, config)
						.then(function(reponse) {
							console.log('New Carrier Added');
							$state.reload();
						}, function(err) {
							console.error(err);
						});
				}
			};

			$scope.deleteCarrier = function(carrierID) {
				var r = confirm("Are you sure you want to delete this Carrier?");
				if (r) {
					request = '/secure-api/carrier/delete_carrier/?' + carrierID;
					$http.delete(request, config)
						.then(function(response) {
							console.log('Carrier Removed');
							$state.reload();
						}, function(err) {
							console.log(err);
						});
				}
			};

			$http.get('/secure-api/carrier/get_carriers', config)
				.then(function(response) {
					$scope.allCarriers = response.data.data;
					for (var i in $scope.allCarriers) {
						$scope.allCarriers[i].carrier_name = undoCleanEntry($scope.allCarriers[i].carrier_name);
					}
				}, function(err) {
					console.log(err);
					if (err.data === 'Invalid Token') {
						$scope.logout();
					} else {
						$state.go('home');
					}
				});
		}]);
})(window, window.angular);