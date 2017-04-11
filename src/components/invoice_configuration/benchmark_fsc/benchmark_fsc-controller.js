(function(window, angular, undefined) {
	angular.module('app')
		.controller('benchmarkFSCCtrl', ['$scope', '$state', '$http', 'userSvc', function($scope, $state, $http, userSvc) {

			var config = {
				headers: {
					'auth-token': userSvc.token
				}
			};
			$scope.benchmark_fscs = [];

			$scope.submitBenchmarkFSC = function(submittedBenchmarkFSC) {
				var exists = false;
				for (var i in $scope.benchmark_fscs) {
					if ($scope.benchmark_fscs[i].fuel_index === submittedBenchmarkFSC.fuel_index && submittedBenchmarkFSC.benchmark_fsc_id !== $scope.benchmark_fscs[i].benchmark_fsc_id) {
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

		}]);
})(window, window.angular);