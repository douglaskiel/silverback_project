(function(window, angular, undefined) {
	angular.module('app')
		.controller('fuelRatesCtrl', ['$scope', '$state', '$http', 'userSvc', function($scope, $state, $http, userSvc) {

			var config = {
				headers: {
					'auth-token': userSvc.token
				}
			};
			$scope.allFuelRates = [];
			$scope.fscs = [];
			$scope.benchmark_fscs = [];
			$scope.limit = 100;

			$scope.submitFuelRate = function(submittedFuelRate) {
				submittedFuelRate.fuel_rate_rounded = Math.floor(submittedFuelRate.fuel_rate * 100);
				for (var i in $scope.benchmark_fscs) {

					if (submittedFuelRate.fuel_rate_rounded === $scope.benchmark_fscs[i].fuel_index) {
						submittedFuelRate.benchmark_fuel_surcharge = $scope.benchmark_fscs[i].benchmark_fuel_surcharge;
					}
				}

				if (!submittedFuelRate.benchmark_fuel_surcharge) {
					submittedFuelRate.benchmark_fuel_surcharge = null;
				}

				if (submittedFuelRate.fuel_rate < 2) {
					submittedFuelRate.fuel_surcharge = 0;
				} else {
					for (var j in $scope.fscs) {
						if ($scope.fscs[j].start_rate <= submittedFuelRate.fuel_rate && submittedFuelRate.fuel_rate <= $scope.fscs[j].end_rate) {
							submittedFuelRate.fuel_surcharge = $scope.fscs[j].fuel_surcharge;
						}
					}
				}

				if (submittedFuelRate.fuel_rate_id) {
					$http.put('/secure-api/fuel_rates/update_fuel_rate', submittedFuelRate, config)
						.then(function(response) {
							console.log('Fuel Rate Updated');
							// $state.reload();
						}, function(err) {
							console.log(err);
						});
				} else {
					$http.post('/secure-api/fuel_rates/insert_fuel_rate', submittedFuelRate, config)
						.then(function(reponse) {
							console.log('Fuel Rate Added');
							$state.reload();
						}, function(err) {
							console.error(err);
						});
				}
			};

			$scope.deleteFuelRate = function(fuelRateID) {
				request = '/secure-api/fuel_rates/delete_fuel_rate/?' + fuelRateID;
				$http.delete(request, config)
					.then(function(response) {
						console.log('Fuel Rate Removed');
						$state.reload();
					}, function(err) {
						console.log(err);
					});
			};

			$scope.sortBy = function(propertyName) {
				$scope.reverse = (propertyName !== null && $scope.propertyName === propertyName) ? !$scope.reverse : false;
				$scope.propertyName = propertyName;
			};

			$http.get('/secure-api/fuel_rates/get_fuel_rates', config)
				.then(function(response) {
					$scope.allFuelRates = response.data.data;
					for (var i = 0; i < $scope.allFuelRates.length; i++) {
						console.log($scope.allFuelRates[i].fuel_date);
					}

				}, function(err) {
					console.log(err);
					if (err.data === 'Invalid Token') {
						$scope.logout();
					} else {
						$state.go('home');
					}
				});

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

			$http.get('/secure-api/benchmark_fsc/get_benchmark_fsc', config)
				.then(function(response) {
					$scope.benchmark_fscs = response.data.data;
					for (var i in $scope.benchmark_fscs) {
						$scope.benchmark_fscs[i].benchmark_fuel_surcharge_percent = Math.round($scope.benchmark_fscs[i].benchmark_fuel_surcharge * 10000) / 100 + '%';
						$scope.benchmark_fscs[i].fuel_index = parseFloat($scope.benchmark_fscs[i].fuel_index);
						$scope.benchmark_fscs[i].benchmark_fuel_surcharge = parseFloat($scope.benchmark_fscs[i].benchmark_fuel_surcharge);

					}
				}, function(err) {
					console.log(err);
					if (err.data === 'Invalid Token') {
						$scope.logout();
					} else {
						$state.go('home');
					}
				});

			$scope.increaseLimit = function() {
				$scope.limit += 100;
				console.log($scope.limit);
			};
		}]);
})(window, window.angular);