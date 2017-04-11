(function(window, angular, undefined) {
	angular.module('app')
		.controller('companyCtrl', ['$scope', '$state', '$http', 'userSvc', function($scope, $state, $http, userSvc) {
			$scope.allCompanies = [];

			var config = {
				headers: {
					'auth-token': userSvc.token
				}
			};

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
					$http.put('/secure-api/company/update_company', submmitedCompany, config)
						.then(function(response) {
							console.log('Company Updated');
							$state.reload();
						}, function(err) {
							console.log(err);
						});
				} else {
					$http.post('/secure-api/company/insert_company', submmitedCompany, config)
						.then(function(reponse) {
							console.log('New Company Added');
							$state.reload();
						}, function(err) {
							console.error(err);
						});
				}

			};

			$scope.deleteCompany = function(clientID) {
				var r = confirm("Are you sure you want to delete this Client?");
				if (r === true) {
					request = '/secure-api/company/company_delete/?' + clientID;
					$http.delete(request, config)
						.then(function(response) {
							console.log('Company Removed');
							$state.reload();
						}, function(err) {
							console.log(err);
						});
				}

			};

			$http.get('/secure-api/company/get_companies', config).then(function(response) {
				$scope.allCompanies = response.data.data;
				for (var i in $scope.allCompanies) {
					$scope.allCompanies[i].client_address_1 = undoCleanEntry($scope.allCompanies[i].client_address_1);
					$scope.allCompanies[i].client_city = undoCleanEntry($scope.allCompanies[i].client_city);
					$scope.allCompanies[i].client_name = undoCleanEntry($scope.allCompanies[i].client_name);
					$scope.allCompanies[i].client_country = undoCleanEntry($scope.allCompanies[i].client_country);
					if ($scope.allCompanies[i].client_address_2) {
						$scope.allCompanies[i].client_address_2 = undoCleanEntry($scope.allCompanies[i].client_address_2);
					}
				}
			}, function(err) {
				console.log(err);
				$state.go('login');
			});

		}]);
})(window, window.angular);