(function(window, angular, undefined) {
	angular.module('app')
		.controller('fscCtrl', ['$scope', '$state', '$http', 'userSvc', function($scope, $state, $http, userSvc) {

			var config = {
				headers: {
					'auth-token': userSvc.token
				}
			};
			$scope.fscs = [];

			$scope.submitFSC = function(submittedFSC) {
				var exists = false;
				if (submittedFSC.start_rate < submittedFSC.end_rate) {
					for (var i in $scope.fscs) {
						if ($scope.fscs[i].start_rate <= submittedFSC.start_rate && $scope.fscs[i].end_rate >= submittedFSC.start_rate && submittedFSC.fuel_surcharge_id !== $scope.fscs[i].fuel_surcharge_id) {
							console.log('That rate is already covered please enter a diffrent rate');
							exists = true;
							break;
						}
					}
					if (!exists) {
						submittedFSC.fuel_surcharge = sanatizePercent(submittedFSC.fuel_surcharge);
						if (submittedFSC.fuel_surcharge_id) {
							$http.put('/secure-api/fuel_surcharge_rates/update_fsc', submittedFSC, config)
								.then(function(response) {
									console.log('FSC Updated');
									$state.reload();
								}, function(err) {
									console.log(err);
								});

						} else {
							$http.post('/secure-api/fuel_surcharge_rates/insert_fsc', submittedFSC, config)
								.then(function(reponse) {
									console.log('FSC Added');
									$state.reload();
								}, function(err) {
									console.error(err);
								});
						}
					}
				} else {
					console.log('Starting Rate must be lower than ending rate');
				}
			};

			$scope.deleteFSC = function(fuelSurchargeId) {
				request = '/secure-api/fuel_surcharge_rates/delete_fsc/?' + fuelSurchargeId;
				$http.delete(request, config)
					.then(function(response) {
						console.log('FSC Removed');
						$state.reload();
					}, function(err) {
						console.log(err);
					});
			};

			$http.get('/secure-api/fuel_surcharge_rates/get_fsc', config)
				.then(function(response) {
					$scope.fscs = response.data.data;
					for (var i in $scope.fscs) {
						$scope.fscs[i].fuel_surcharge_percent = Math.round($scope.fscs[i].fuel_surcharge * 10000) / 100 + '%';
						$scope.fscs[i].start_rate = parseFloat($scope.fscs[i].start_rate);
						$scope.fscs[i].end_rate = parseFloat($scope.fscs[i].end_rate);
						$scope.fscs[i].fuel_surcharge = parseFloat($scope.fscs[i].fuel_surcharge);
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