(function(window, angular, undefined) {
	angular.module('app')
		.controller('benchmarkFSCCtrl', ['$scope', '$state', '$http', 'userSvc', 'benchmarkSvc', function($scope, $state, $http, userSvc, benchmarkSvc) {

			var config = {
				headers: {
					'auth-token': userSvc.token
				}
			};
			$scope.allBenchmarkFSC = [];
			$scope.getEverything = function(config) {
				benchmarkSvc
					.getBenchmark(config)
					.then(function(message) {
						$scope.allBenchmarkFSC = message;
					});
			};
			$scope.getEverything(config);

			$scope.submitBenchmarkFSC = function(submittedBenchmarkFSC) {
				var exists = false;
				for (var i in $scope.allBenchmarkFSC) {
					if ($scope.allBenchmarkFSC[i].fuel_index === submittedBenchmarkFSC.fuel_index && submittedBenchmarkFSC.benchmark_fsc_id !== $scope.allBenchmarkFSC[i].benchmark_fsc_id) {
						console.log('That rate is already covered please enter a diffrent rate');
						exists = true;
						break;
					}
				}
				if (!exists) {
					submittedBenchmarkFSC.benchmark_fuel_surcharge = sanatizePercent(submittedBenchmarkFSC.benchmark_fuel_surcharge);
					if (submittedBenchmarkFSC.benchmark_fsc_id) {
						$http.put('/secure-api/benchmark_fsc/update_benchmark_fsc', submittedBenchmarkFSC, config)
							.then(function(response) {
								console.log('FSC Updated');
								$state.reload();
							}, function(err) {
								console.log(err);
							});

					} else {
						$http.post('/secure-api/benchmark_fsc/insert_benchmark_fsc', submittedBenchmarkFSC, config)
							.then(function(reponse) {
								console.log('FSC Added');
								$state.reload();
							}, function(err) {
								console.error(err);
							});
					}
				}
			};

			$scope.deleteBenchmarkFSC = function(benchmarkFuelSurchargeID) {
				request = '/secure-api/benchmark_fsc/delete_benchmark_fsc/?' + benchmarkFuelSurchargeID;
				$http.delete(request, config)
					.then(function(response) {
						console.log('FSC Removed');
						$state.reload();
					}, function(err) {
						console.log(err);
					});
			};

		}]);
})(window, window.angular);