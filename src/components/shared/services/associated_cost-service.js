(function(window, angular, undefined) {
	angular.module('app')
		.service('accessSvc', ['$http', '$q', '$state', function($http, $q, $state) {
			var vm = this;

			var allAccessorial = [];

			vm.getAccess = function(config, callback) {
				var deferred = $q.defer();
				$http.get('/secure-api/accessorial_cost/get_prebuilt_associated_costs', config)
					.then(function(response) {
						allAccessorial = response.data.data;
						for (var i in allAccessorial) {
							allAccessorial[i].benchmark_cost = parseFloat(allAccessorial[i].benchmark_cost);
							allAccessorial[i].description = undoCleanEntry(allAccessorial[i].description);
							allAccessorial[i].cost_code = undoCleanEntry(allAccessorial[i].cost_code);
						}
						deferred.resolve(allAccessorial);
					})
					.catch(function(e) {
						deferred.reject(e);
						$state.go('login');
					});
				return deferred.promise;
			};

			vm.sumbitAccess = function(accessorial_cost, config, callback) {
				var deferred = $q.defer();
				$http.post('/secure-api/accessorial_cost/insert_prebuilt_associated_costs', accessorial_cost, config)
					.then(function(response) {
						console.log('Prebuilt Accessorial Submitted');
						$state.reload();
					})
					.catch(function(e) {
						deferred.reject(e);
					});
			};

			vm.updateAccess = function(accessorial_cost, config, callback) {
				var deferred = $q.defer();
				$http.put('/secure-api/accessorial_cost/update_prebuilt_associated_costs', accessorial_cost, config)
					.then(function(response) {
						console.log('Prebuilt Accessorial Updated');
					})
					.catch(function(e) {
						deferred.reject(e);
					});
			};

			vm.deleteAccess = function(request, config, callback) {
				var deferred = $q.defer();
				$http.delete(request, config)
					.then(function(response) {
						console.log('Prebuilt Accessorial Removed');
						deferred.resolve(response);
					})
					.catch(function(e) {
						deferred.reject(e);
					});
			};

		}]);
})(window, window.angular);