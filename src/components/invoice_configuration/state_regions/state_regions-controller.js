(function(window, angular, undefined) {
	angular.module('app')
		.controller('stateRegionCtrl', ['$scope', '$state', '$http', 'userSvc', 'regionSvc', 'statesSvc', function($scope, $state, $http, userSvc, regionSvc, statesSvc) {

			var config = {
				headers: {
					'auth-token': userSvc.token
				}
			};

			$scope.allRegions = [];
			$scope.newRegion = {};
			$scope.allStates = [];
			$scope.newState = {};

			$scope.getEverything = function(config) {
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

			$scope.submitRegion = function(submittedRegion) {
				for (var i in $scope.allRegions) {
					if ($scope.allRegions[i].state_id === submittedRegion.state_id) {
						submittedRegion.states = $scope.allRegions[i].states;
					}
				}
				submittedRegion.region = cleanEntry(submittedRegion.region);
				if (submittedRegion.state_region_id) {
					regionSvc.updateRegion(submittedRegion, config);
				} else {
					regionSvc.sumbitRegion(submittedRegion, config);
					$scope.newRegion = {};
				}
			};

			$scope.submitState = function(submittedState) {
				submittedState.states = cleanEntry(submittedState.states);
				if (submittedState.state_id) {
					statesSvc.updateStates(submittedState, config);
				} else {
					statesSvc.sumbitStates(submittedState, config);
					$scope.newState = {};
				}
			};

			$scope.deleteRegion = function(regionID) {
				var r = confirm("Are you sure you want to delete this Region?");
				if (r) {
					request = '/secure-api/region/delete_region/?' + regionID;
					regionSvc.deleteRegion(request, config);
					for (var i in $scope.allRegions) {
						if ($scope.allRegions[i].state_region_id === regionID) {
							$scope.allRegions.splice(i, 1);
						}
					}
				}
			};

			$scope.deleteState = function(stateID) {
				var r = confirm("Are you sure you want to delete this State?");
				if (r) {
					request = '/secure-api/states/delete_state/?' + stateID;
					regionSvc.deleteRegion(request, config);
					for (var i in $scope.allStates) {
						if ($scope.allStates[i].state_id === stateID) {
							$scope.allStates.splice(i, 1);
						}
					}
				}
			};
		}]);
})(window, window.angular);