(function(window, angular, undefined) {
	angular.module('app')
		.controller('operationalAreaCtrl', ['$scope', '$state', '$http', 'userSvc', function($scope, $state, $http, userSvc) {
			$scope.allOperations = [];
			$scope.allCarriers = [];
			$scope.limit = 100;

			var config = {
				headers: {
					'auth-token': userSvc.token
				}
			};

			$scope.submitOperationalArea = function(submittedOperationalArea) {
				for (var i in $scope.allStates) {
					if ($scope.allStates[i].state_id === submittedOperationalArea.state_id) {
						submittedOperationalArea.states = $scope.allStates[i].states;
					}
				}
				if (!submittedOperationalArea.accelerated_charge) {
					submittedOperationalArea.accelerated_charge = 0;
				}
				if (submittedOperationalArea.zip_code === undefined || submittedOperationalArea.zip_code === "" || submittedOperationalArea.zip_code === null) {
					submittedOperationalArea.zip_code = "";
				}
				submittedOperationalArea.zip_code = cleanEntry(submittedOperationalArea.zip_code);
				submittedOperationalArea.discount = sanatizePercent(submittedOperationalArea.discount);
				submittedOperationalArea.accelerated_charge = sanatizePercent(submittedOperationalArea.accelerated_charge);
				if (submittedOperationalArea.operation_id) {
					$http.put('/secure-api/operational_area/update_operational_area', submittedOperationalArea, config)
						.then(function(response) {
							console.log('Operational Area  Updated');
							$state.reload();
						}, function(err) {
							console.log(err);
						});
				} else {
					$http.post('/secure-api/operational_area/insert_operational_area', submittedOperationalArea, config)
						.then(function(reponse) {
							console.log('Operational Area Added');
							$state.reload();
						}, function(err) {
							console.error(err);
						});
				}
			};

			$scope.massUpdate = function(updateCriteria) {
				updateCriteria.discount = sanatizePercent(updateCriteria.discount);
				updateCriteria.accelerated_charge = sanatizePercent(updateCriteria.accelerated_charge);

				$http.put('/secure-api/operational_area/update_operational_region', updateCriteria, config)
					.then(function(response) {
						console.log('Operational Area  Updated');
						$state.reload();
					}, function(err) {
						console.log(err);
					});
			};

			$scope.deleteOperationalArea = function(operationalAreaID) {
				request = '/secure-api/operational_area/delete_operational_area/?' + operationalAreaID;
				$http.delete(request, config)
					.then(function(response) {
						console.log('Operational Area Removed');
						$state.reload();
					}, function(err) {
						console.log(err);
					});
			};

			$scope.sortBy = function(propertyName) {
				$scope.reverse = (propertyName !== null && $scope.propertyName === propertyName) ? !$scope.reverse : false;
				$scope.propertyName = propertyName;
			};

			$scope.update_list = function(stateID) {
				$scope.selectedRegion = [];
				for (var i in $scope.allRegions) {
					if ($scope.allRegions[i].state_id === stateID) {
						$scope.selectedRegion.push($scope.allRegions[i]);
					}
				}
			};

			$http.get('/secure-api/operational_area/get_operational_area', config)
				.then(function(response) {
					$scope.allOperations = response.data.data;
					for (var i = 0; i < $scope.allOperations.length; i++) {
						$scope.allOperations[i].absolute_minimum_charge = parseFloat($scope.allOperations[i].absolute_minimum_charge);
						if ($scope.allOperations[i].accelerated_charge) {
							$scope.allOperations[i].accelerated_charge = parseFloat($scope.allOperations[i].accelerated_charge);
						}
						if ($scope.allOperations[i].zip_code) {
							$scope.allOperations[i].zip_code = undoCleanEntry($scope.allOperations[i].zip_code);
						}
						$scope.allOperations[i].region = undoCleanEntry($scope.allOperations[i].region);

						$scope.allOperations[i].carrier_name = undoCleanEntry($scope.allOperations[i].carrier_name);
					}
				}, function(err) {
					console.log(err);
					if (err.data === 'Invalid Token') {
						$scope.logout();
					} else {
						$state.go('home');
					}
				});

			$http.get('/secure-api/region/get_region', config)
				.then(function(response) {
					$scope.allRegions = response.data.data;
					for (var i in $scope.allRegions) {
						$scope.allRegions[i].region = undoCleanEntry($scope.allRegions[i].region);
					}
					$scope.updateRegions = $scope.allRegions;
					$scope.selectedRegion = $scope.allRegions;
					$scope.updateRegions.push({
						region: 'ALL REGIONS',
						state_region_id: '*'
					});

				}, function(err) {
					console.log(err);
					if (err.data === 'Invalid Token') {
						$scope.logout();
					} else {
						$state.go('home');
					}
				});

			$http.get('/secure-api/states/get_state', config)
				.then(function(response) {
					$scope.allStates = response.data.data;
					for (var i in $scope.allStates) {
						$scope.allStates[i].states = undoCleanEntry($scope.allStates[i].states);
					}
				}, function(err) {
					console.log(err);
					if (err.data === 'Invalid Token') {
						$scope.logout();
					} else {
						$state.go('home');
					}
				});

			$http.get('/secure-api/carrier/get_carriers', config)
				.then(function(response) {
					$scope.allCarriers = response.data.data;
					for (var i in $scope.allCarriers) {
						$scope.allCarriers[i].carrier_name = undoCleanEntry($scope.allCarriers[i].carrier_name);
					}
				}, function(err) {
					console.log(err);
					if (err.data === 'Invalid Token') {
						$scope.logout();
					} else {
						$state.go('home');
					}
				});

			$scope.increaseLimit = function() {
				$scope.limit += 100;
				console.log($scope.limit);
			};

		}]);
})(window, window.angular);