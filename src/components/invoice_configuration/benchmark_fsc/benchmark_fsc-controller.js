(function(window, angular, undefined) {
	angular.module('app')
		.controller('benchmarkFSCCtrl', ['$scope', '$state', 'userSvc', 'benchmarkSvc', function($scope, $state, userSvc, benchmarkSvc) {

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
						benchmarkSvc.updateBenchmark(submittedBenchmarkFSC, config);
					} else {
						benchmarkSvc.sumbitBenchmark(submittedBenchmarkFSC, config);
						$scope.newCarrier = {};
					}
				}
			};

			$scope.deleteBenchmarkFSC = function(benchmarkFuelSurchargeID) {
				var r = confirm("Are you sure you want to delete this Benchmark?");
				if (r) {
					request = '/secure-api/benchmark_fsc/delete_benchmark_fsc/?' + benchmarkFuelSurchargeID;
					benchmarkSvc.deleteBenchmark(request, config);
					for (var i in $scope.allBenchmarkFSC) {
						if ($scope.allBenchmarkFSC[i].benchmark_fsc_id === benchmarkFuelSurchargeID) {
							$scope.allBenchmarkFSC.splice(i, 1);
						}
					}
				}
			};
		}]);
})(window, window.angular);