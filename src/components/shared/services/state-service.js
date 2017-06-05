(function(window, angular, undefined) {
	angular.module('app')
		.service('statesSvc', ['$http', '$q', '$state', function($http, $q, $state) {
			var vm = this;

			var allStates = [];


			vm.getStates = function(config, callback) {
				var deferred = $q.defer();
				$http.get('/secure-api/states/get_state', config)
					.then(function(response) {
						allStates = response.data.data;
						deferred.resolve(allStates);
					})
					.catch(function(e) {
						deferred.reject(e);
						$state.go('login');
					});
				return deferred.promise;
			};

			vm.sumbitStates = function(states, config, callback) {
				var deferred = $q.defer();
				$http.post('/secure-api/states/insert_state', states, config)
					.then(function(response) {
						console.log('State Submitted');
						$state.reload();
					})
					.catch(function(e) {
						deferred.reject(e);
					});
			};

			vm.updateStates = function(states, config, callback) {
				var deferred = $q.defer();
				$http.put('/secure-api/states/update_state', states, config)
					.then(function(response) {
						console.log('State Updated');
					})
					.catch(function(e) {
						deferred.reject(e);
					});
			};

			vm.deleteStates = function(request, config, callback) {
				var deferred = $q.defer();
				$http.delete(request, config)
					.then(function(response) {
						console.log('State Removed');
						deferred.resolve(response);
					})
					.catch(function(e) {
						deferred.reject(e);
					});
			};

		}]);
})(window, window.angular);