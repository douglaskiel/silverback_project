(function(window, angular, undefined) {
	angular.module('app')
		.controller('operationalAreaCtrl', ['$scope', '$state', 'userSvc', 'carrierSvc', 'operationAreaSvc', 'regionSvc', 'statesSvc', function($scope, $state, userSvc, carrierSvc, operationAreaSvc, regionSvc, statesSvc) {

			var config = {
				headers: {
					'auth-token': userSvc.token
				}
			};

			$scope.limit = 100;

			$scope.allCarriers = [];
			$scope.allOperations = [];
			$scope.allRegions = [];
			$scope.allStates = [];
			$scope.newOperationalArea = {};
			$scope.getEverything = function(config) {
				carrierSvc
					.getCarriers(config)
					.then(function(message) {
						$scope.allCarriers = message;
					});
				operationAreaSvc
					.getOperationalArea(config)
					.then(function(message) {
						$scope.allOperations = message;
					});
				regionSvc
					.getRegion(config)
					.then(function(message) {
						$scope.allRegions = message;
					});
				statesSvc
					.getStates(config)
					.then(function(message) {
						$scope.allStates = message;
					});
			};
			$scope.getEverything(config);

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
					operationAreaSvc.updateOperationalArea(submittedOperationalArea, config);
				} else {
					operationAreaSvc.sumbitOperationalArea(submittedOperationalArea, config);
					$scope.newOperationalArea = {};
				}
			};

			$scope.massUpdate = function(updateCriteria) {
				updateCriteria.discount = sanatizePercent(updateCriteria.discount);
				updateCriteria.accelerated_charge = sanatizePercent(updateCriteria.accelerated_charge);
				operationAreaSvc.updateMass(updateCriteria, config);
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

			$scope.increaseLimit = function() {
				$scope.limit += 100;
				console.log($scope.limit);
			};

			$scope.deleteOperationalArea = function(operationalAreaID) {
				var r = confirm("Are you sure you want to delete this Operational Area?");
				if (r) {
					request = '/secure-api/operational_area/delete_operational_area/?' + operationalAreaID;
					operationAreaSvc.deleteOperationalArea(request, config);
					for (var i in $scope.allOperations) {
						if ($scope.allOperations[i].operation_id === operationalAreaID) {
							$scope.allOperations.splice(i, 1);
						}
					}
				}
			};
		}]);
})(window, window.angular);