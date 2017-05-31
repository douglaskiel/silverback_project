(function(window, angular, undefined) {
	angular.module('app')
		.service('carrierSvc', ['$http', '$q', '$state', function($http, $q, $state) {
			var vm = this;

			var allAccessorial = [];

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
		}]);
})(window, window.angular);