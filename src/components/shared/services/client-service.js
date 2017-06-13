(function(window, angular, undefined) {
	angular.module('app')
		.service('clientSvc', ['$http', '$q', '$state', function($http, $q, $state) {
			var vm = this;

			var allClients = [];

			vm.getClients = function(config, callback) {
				var deferred = $q.defer();
				$http.get('/secure-api/company/get_companies', config)
					.then(function(response) {
						allClients = response.data.data;
						for (var i in allClients) {
							allClients[i].client_address_1 = undoCleanEntry(allClients[i].client_address_1);
							allClients[i].client_city = undoCleanEntry(allClients[i].client_city);
							allClients[i].client_name = undoCleanEntry(allClients[i].client_name);
							allClients[i].client_country = undoCleanEntry(allClients[i].client_country);
							if (allClients[i].client_address_2) {
								allClients[i].client_address_2 = undoCleanEntry(allClients[i].client_address_2);
							}
						}
						deferred.resolve(allClients);
					})
					.catch(function(e) {
						deferred.reject(e);
						$state.go('login');
					});
				return deferred.promise;
			};

			vm.sumbitClients = function(companies, config, callback) {
				console.log('test');
				var deferred = $q.defer();
				$http.post('/secure-api/company/insert_company', companies, config)
					.then(function(response) {
						console.log('Client Submitted');
						$state.reload();
					})
					.catch(function(e) {
						deferred.reject(e);
					});
			};

			vm.updateClients = function(companies, config, callback) {
				console.log('test');
				var deferred = $q.defer();
				$http.put('/secure-api/company/update_company', companies, config)
					.then(function(response) {
						console.log('Client Updated');
					})
					.catch(function(e) {
						deferred.reject(e);
					});
			};

			vm.deleteClients = function(request, config, callback) {
				var deferred = $q.defer();
				$http.delete(request, config)
					.then(function(response) {
						console.log('Client Removed');
						deferred.resolve(response);
					})
					.catch(function(e) {
						deferred.reject(e);
					});
			};
		}]);
})(window, window.angular);