(function(window, angular, undefined) {
	angular.module('app')
		.service('fuelRateService', ['$http', '$q', '$state', function($http, $q, $state) {
			var vm = this;

			var allFuelRates = [];

			vm.getFuelRate = function(config, callback) {
				var deferred = $q.defer();
				$http.get('/secure-api/fuel_rates/get_fuel_rates', config)
					.then(function(response) {
						allFuelRates = response.data.data;
						for (var i = 0; i < allFuelRates.length; i++) {
							allFuelRates[i].fuel_date = date_parse(allFuelRates[i].fuel_date);
						}
						deferred.resolve(allFuelRates);
					})
					.catch(function(e) {
						deferred.reject(e);
						$state.go('login');
					});
				return deferred.promise;
			};

			vm.sumbitFuelRate = function(fscs, config, callback) {
				var deferred = $q.defer();
				$http.post('/secure-api/fuel_rates/insert_fuel_rate', fscs, config)
					.then(function(response) {
						console.log('Fuel Surcharge Submitted');
						$state.reload();
					})
					.catch(function(e) {
						deferred.reject(e);
					});
			};

			vm.updateFuelRate = function(fscs, config, callback) {
				var deferred = $q.defer();
				$http.put('/secure-api/fuel_rates/update_fuel_rate', fscs, config)
					.then(function(response) {
						console.log('Fuel Surcharge Updated');
					})
					.catch(function(e) {
						deferred.reject(e);
					});
			};

			vm.deleteFuelRate = function(request, config, callback) {
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