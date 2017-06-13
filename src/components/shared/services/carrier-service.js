(function(window, angular, undefined) {
	angular.module('app')
		.service('carrierSvc', ['$http', '$q', '$state', function($http, $q, $state) {
			var vm = this;

			var allCarriers = [];

			vm.getCarriers = function(config, callback) {
					var deferred = $q.defer();
					$http.get('/secure-api/carrier/get_carriers', config)
						.then(function(response) {
							allCarriers = response.data.data;
							for (var i in allCarriers) {
								allCarriers[i].carrier_name = undoCleanEntry(allCarriers[i].carrier_name);
							}
							deferred.resolve(allCarriers);
						})
						.catch(function(e) {
							deferred.reject(e);
							$state.go('login');
						});
					return deferred.promise;
				};

			vm.sumbitCarriers = function(carrier, config, callback) {
				var deferred = $q.defer();
				$http.post('/secure-api/carrier/insert_carriers', carrier, config)
					.then(function(response) {
						console.log('Fuel Surcharge Submitted');
						$state.reload();
					})
					.catch(function(e) {
						deferred.reject(e);
					});
			};

			vm.updateCarriers = function(carrier, config, callback) {
				var deferred = $q.defer();
				$http.put('/secure-api/carrier/update_carrier', carrier, config)
					.then(function(response) {
						console.log('Fuel Surcharge Updated');
					})
					.catch(function(e) {
						deferred.reject(e);
					});
			};

			vm.deleteCarriers = function(request, config, callback) {
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