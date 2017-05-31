(function(window, angular, undefined) {
	angular.module('app')
		.service('operationAreaSvc', ['$http', '$q', '$state', function($http, $q, $state) {
			var vm = this;

			var allOperations = [];

			vm.getOperationalArea = function(config, callback) {
				var deferred = $q.defer();
				$http.get('/secure-api/operational_area/get_operational_area', config)
					.then(function(response) {
						allOperations = response.data.data;
						for (var i = 0; i < allOperations.length; i++) {
							allOperations[i].absolute_minimum_charge = parseFloat(allOperations[i].absolute_minimum_charge);
							if (allOperations[i].accelerated_charge) {
								allOperations[i].accelerated_charge = parseFloat(allOperations[i].accelerated_charge);
							}
							if (allOperations[i].zip_code) {
								allOperations[i].zip_code = undoCleanEntry(allOperations[i].zip_code);
							}
							allOperations[i].region = undoCleanEntry(allOperations[i].region);
							allOperations[i].carrier_name = undoCleanEntry(allOperations[i].carrier_name);
						}
						deferred.resolve(allOperations);
					})
					.catch(function(e) {
						deferred.reject(e);
						$state.go('login');
					});
				return deferred.promise;
			};

			vm.sumbitOperationalArea = function(operational_area, config, callback) {
				var deferred = $q.defer();
				$http.post('/secure-api/operational_area/insert_operational_area', operational_area, config)
					.then(function(response) {
						console.log('Operational Area Submitted');
						$state.reload();
					})
					.catch(function(e) {
						deferred.reject(e);
					});
			};

			vm.updateOperationalArea = function(operational_area, config, callback) {
				var deferred = $q.defer();
				$http.put('/secure-api/operational_area/update_operational_area', operational_area, config)
					.then(function(response) {
						console.log('Operational Area Updated');
					})
					.catch(function(e) {
						deferred.reject(e);
					});
			};

			vm.updateMass = function(updateCriteria, config, callback) {
				var deferred = $q.defer();
				$http.put('/secure-api/operational_area/update_operational_region', updateCriteria, config)
					.then(function(response) {
						console.log('Operational Area Updated');
					})
					.catch(function(e) {
						deferred.reject(e);
					});
			};

			vm.deleteOperationalArea = function(request, config, callback) {
				var deferred = $q.defer();
				$http.delete(request, config)
					.then(function(response) {
						console.log('Operational Area Removed');
						deferred.resolve(response);
					})
					.catch(function(e) {
						deferred.reject(e);
					});
			};

		}]);
})(window, window.angular);