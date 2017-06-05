(function(window, angular, undefined) {
	angular.module('app')
		.service('fscsSvc', ['$http', '$q', '$state', function($http, $q, $state) {
			var vm = this;

			var allFscs = [];

			vm.getFscs = function(config, callback) {
				var deferred = $q.defer();
				$http.get('/secure-api/fuel_surcharge_rates/get_fsc', config)
					.then(function(response) {
						allFscs = response.data.data;
						for (var i in allFscs) {
							allFscs[i].fuel_surcharge_percent = Math.round(allFscs[i].fuel_surcharge * 10000) / 100 + '%';
							allFscs[i].start_rate = parseFloat(allFscs[i].start_rate);
							allFscs[i].end_rate = parseFloat(allFscs[i].end_rate);
							allFscs[i].fuel_surcharge = parseFloat(allFscs[i].fuel_surcharge);
						}
						deferred.resolve(allFscs);
					})
					.catch(function(e) {
						deferred.reject(e);
						$state.go('login');
					});
				return deferred.promise;
			};

			vm.sumbitFscs = function(fscs, config, callback) {
				var deferred = $q.defer();
				$http.post('/secure-api/fuel_surcharge_rates/insert_fsc', fscs, config)
					.then(function(response) {
						console.log('Fuel Surcharge Submitted');
						$state.reload();
					})
					.catch(function(e) {
						deferred.reject(e);
					});
			};

			vm.updateFscs = function(fscs, config, callback) {
				var deferred = $q.defer();
				$http.put('/secure-api/fuel_surcharge_rates/update_fsc', fscs, config)
					.then(function(response) {
						console.log('Fuel Surcharge Updated');
					})
					.catch(function(e) {
						deferred.reject(e);
					});
			};

			vm.deleteFscs = function(request, config, callback) {
				var deferred = $q.defer();
				$http.delete(request, config)
					.then(function(response) {
						console.log('Fuel Surcharge Removed');
						deferred.resolve(response);
					})
					.catch(function(e) {
						deferred.reject(e);
					});
			};

		}]);
})(window, window.angular);