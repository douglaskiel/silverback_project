(function(window, angular, undefined) {
	angular.module('app')
		.controller('fuelRatesCtrl', ['$scope', '$state', '$http', 'userSvc', 'benchmarkSvc', 'fscsSvc', 'fuelRateService', function($scope, $state, $http, userSvc, benchmarkSvc, fscsSvc, fuelRateService) {

			var config = {
				headers: {
					'auth-token': userSvc.token
				}
			};
			
			$scope.allFuelRates = [];
			$scope.allFscs = [];
			$scope.limit = 100;


			$scope.allBenchmarkFSC = [];
			$scope.getEverything = function(config) {
				benchmarkSvc
					.getBenchmark(config)
					.then(function(message) {
						$scope.allBenchmarkFSC = message;
					});
				fscsSvc
					.getFscs(config)
					.then(function(message) {
						$scope.allFscs = message;
					});
				fuelRateService
					.getFuelRate(config)
					.then(function(message) {
						$scope.allFuelRates = message;
					});
			};
			$scope.getEverything(config);

			$scope.submitFuelRate = function(submittedFuelRate) {
				submittedFuelRate.fuel_rate_rounded = Math.floor(submittedFuelRate.fuel_rate * 100);
				for (var i in $scope.allBenchmarkFSC) {

					if (submittedFuelRate.fuel_rate_rounded === $scope.allBenchmarkFSC[i].fuel_index) {
						submittedFuelRate.benchmark_fuel_surcharge = $scope.allBenchmarkFSC[i].benchmark_fuel_surcharge;
					}
				}

				if (!submittedFuelRate.benchmark_fuel_surcharge) {
					submittedFuelRate.benchmark_fuel_surcharge = null;
				}

				if (submittedFuelRate.fuel_rate < 2) {
					submittedFuelRate.fuel_surcharge = 0;
				} else {
					for (var j in $scope.allFscs) {
						if ($scope.allFscs[j].start_rate <= submittedFuelRate.fuel_rate && submittedFuelRate.fuel_rate <= $scope.allFscs[j].end_rate) {
							submittedFuelRate.fuel_surcharge = $scope.allFscs[j].fuel_surcharge;
						}
					}
				}

				if (submittedFuelRate.fuel_rate_id) {
					fuelRateService.updateFuelRate(submittedFuelRate, config);
						} else {
					fuelRateService.sumbitFuelRate(submittedFuelRate, config);
					$scope.newFSC = {};
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

			$scope.increaseLimit = function() {
				$scope.limit += 100;
				console.log($scope.limit);
			};
		}]);
})(window, window.angular);