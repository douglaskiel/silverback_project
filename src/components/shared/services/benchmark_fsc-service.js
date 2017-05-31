(function(window, angular, undefined) {
	angular.module('app')
		.service('benchmarkSvc', ['$http', '$q', '$state', function($http, $q, $state) {
			var vm = this;

			var allBenchmarkFSC = [];

			vm.getBenchmark = function(config, callback) {
				var deferred = $q.defer();
				$http.get('/secure-api/benchmark_fsc/get_benchmark_fsc', config)
					.then(function(response) {
						allBenchmarkFSC = response.data.data;
						for (var i in allBenchmarkFSC) {
							allBenchmarkFSC[i].benchmark_fuel_surcharge_percent = Math.round(allBenchmarkFSC[i].benchmark_fuel_surcharge * 10000) / 100 + '%';
							allBenchmarkFSC[i].fuel_index = parseFloat(allBenchmarkFSC[i].fuel_index);
							allBenchmarkFSC[i].benchmark_fuel_surcharge = parseFloat(allBenchmarkFSC[i].benchmark_fuel_surcharge);
						}
						deferred.resolve(allBenchmarkFSC);
					})
					.catch(function(e) {
						deferred.reject(e);
						$state.go('login');
					});
				return deferred.promise;
			};

		}]);
})(window, window.angular);