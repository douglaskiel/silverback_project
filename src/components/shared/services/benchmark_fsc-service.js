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

			vm.sumbitBenchmark = function(benchmark_fsc, config, callback) {
				var deferred = $q.defer();
				$http.post('/secure-api/benchmark_fsc/insert_benchmark_fsc', benchmark_fsc, config)
					.then(function(response) {
						console.log('Fuel Surcharge Submitted');
						$state.reload();
					})
					.catch(function(e) {
						deferred.reject(e);
					});
			};

			vm.updateBenchmark = function(benchmark_fsc, config, callback) {
				var deferred = $q.defer();
				$http.put('/secure-api/benchmark_fsc/update_benchmark_fsc', benchmark_fsc, config)
					.then(function(response) {
						console.log('Fuel Surcharge Updated');
					})
					.catch(function(e) {
						deferred.reject(e);
					});
			};

			vm.deleteBenchmark = function(request, config, callback) {
				var deferred = $q.defer();
				$http.delete(request, config)
					.then(function(response) {
						console.log('Benchmark FSC Removed');
						deferred.resolve(response);
					})
					.catch(function(e) {
						deferred.reject(e);
					});
			};

		}]);
})(window, window.angular);