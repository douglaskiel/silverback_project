(function(window, angular, undefined) {
	angular.module('app')
		.service('regionSvc', ['$http', '$q', '$state', function($http, $q, $state) {
			var vm = this;

			var allRegions = [];


			vm.getRegion = function(config, callback) {
				var deferred = $q.defer();
				$http.get('/secure-api/region/get_region', config)
					.then(function(response) {
						allRegions = response.data.data;
						for (var i in allRegions) {
							allRegions[i].region = undoCleanEntry(allRegions[i].region);
						}
						deferred.resolve(allRegions);
					})
					.catch(function(e) {
						deferred.reject(e);
						$state.go('login');
					});
				return deferred.promise;
			};

			vm.sumbitRegion = function(region, config, callback) {
				var deferred = $q.defer();
				$http.post('/secure-api/region/insert_region', region, config)
					.then(function(response) {
						console.log('Region Submitted');
						$state.reload();
					})
					.catch(function(e) {
						deferred.reject(e);
					});
			};

			vm.updateRegion = function(region, config, callback) {
				var deferred = $q.defer();
				$http.put('/secure-api/region/update_region', region, config)
					.then(function(response) {
						console.log('Region Updated');
					})
					.catch(function(e) {
						deferred.reject(e);
					});
			};

			vm.deleteRegion = function(request, config, callback) {
				var deferred = $q.defer();
				$http.delete(request, config)
					.then(function(response) {
						console.log('Region Removed');
						deferred.resolve(response);
					})
					.catch(function(e) {
						deferred.reject(e);
					});
			};

		}]);
})(window, window.angular);