(function(window, angular, undefined) {
	angular.module('app')
		.controller('companyCtrl', ['$scope', '$state', '$http', 'userSvc', 'clientSvc', function($scope, $state, $http, userSvc, clientSvc) {
			
			var config = {
				headers: {
					'auth-token': userSvc.token
				}
			};

			$scope.allCompanies = [];

			$scope.getClients = function(config) {
				clientSvc
					.getClients(config)
					.then(function(message) {
						$scope.allCompanies = message;
					});
			};
			$scope.getClients(config);

			$scope.submitCompany = function(submmitedCompany) {
				if (!submmitedCompany.hasOwnProperty('client_address_2')) {
					submmitedCompany.client_address_2 = "";
				} else {
					submmitedCompany.client_address_2 = cleanEntry(submmitedCompany.client_address_2);
				}
				if (!submmitedCompany.hasOwnProperty('client_zip_4')) {
					submmitedCompany.client_zip_4 = "";
				}
				submmitedCompany.client_address_1 = cleanEntry(submmitedCompany.client_address_1);
				submmitedCompany.client_city = cleanEntry(submmitedCompany.client_city);
				submmitedCompany.client_country = cleanEntry(submmitedCompany.client_country);
				submmitedCompany.client_name = cleanEntry(submmitedCompany.client_name);

				if (submmitedCompany.client_id) {
					clientSvc.updateClients(submmitedCompany, config);
				} else {
					clientSvc.sumbitClients(submmitedCompany, config);
				}

			};

			$scope.deleteCompany = function(clientID) {
				var r = confirm("Are you sure you want to delete this Client?");
				if (r === true) {
					request = '/secure-api/company/company_delete/?' + clientID;
					clientSvc.deleteClients(request, config);
					for (var i in $scope.allCompanies) {
						if ($scope.allCompanies[i].client_id === clientID) {
							$scope.allCompanies.splice(i, 1);
						}
					}
				}

			};

		}]);
})(window, window.angular);