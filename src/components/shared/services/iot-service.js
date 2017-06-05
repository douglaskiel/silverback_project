(function(window, angular, undefined) {
	angular.module('app')
		.service('iotSvc', ['$http', '$q', '$state', function($http, $q, $state) {
			var vm = this;

			var allIOT = [];


			vm.getIOT = function(config, callback) {
				var deferred = $q.defer();
				$http.get('/secure-api/iot/get_iot', config)
					.then(function(response) {
						allIOT = response.data.data;
						for (var i in allIOT) {
							allIOT[i].delivery_type = cleanEntry(allIOT[i].delivery_type);
						}
						deferred.resolve(allIOT);
					})
					.catch(function(e) {
						deferred.reject(e);
						$state.go('login');
					});
				return deferred.promise;
			};

			vm.sumbitIOT = function(iot, config, callback) {
				var deferred = $q.defer();
				$http.post('/secure-api/iot/insert_IOT', iot, config)
					.then(function(response) {
						console.log('IOT Submitted');
						$state.reload();
					})
					.catch(function(e) {
						deferred.reject(e);
					});
			};

			vm.updateIOT = function(iot, config, callback) {
				var deferred = $q.defer();
				$http.put('/secure-api/iot/update_iot', iot, config)
					.then(function(response) {
						console.log('IOT Updated');
					})
					.catch(function(e) {
						deferred.reject(e);
					});
			};

			vm.deleteIOT = function(request, config, callback) {
				var deferred = $q.defer();
				$http.delete(request, config)
					.then(function(response) {
						console.log('IOT Removed');
						deferred.resolve(response);
					})
					.catch(function(e) {
						deferred.reject(e);
					});
			};

		}]);
})(window, window.angular);