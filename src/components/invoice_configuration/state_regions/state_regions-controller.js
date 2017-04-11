(function(window, angular, undefined) {
	angular.module('app')
		.controller('stateRegionCtrl', ['$scope', '$state', '$http', 'userSvc', function($scope, $state, $http, userSvc) {

			var config = {
				headers: {
					'auth-token': userSvc.token
				}
			};

			$scope.allRegions = [];

			$scope.submitRegion = function(submittedRegion) {
				submittedRegion.region = cleanEntry(submittedRegion.region);
				if (submittedRegion.state_region_id) {
					$http.put('/secure-api/region/update_region', submittedRegion, config)
						.then(function(response) {
							console.log('Region Updated');
							$state.reload();
						}, function(err) {
							console.log(err);
						});
				} else {
					$http.post('/secure-api/region/insert_region', submittedRegion, config)
						.then(function(reponse) {
							console.log('IOT Added');
							$state.reload();
						}, function(err) {
							console.error(err);
						});
				}
			};

			$scope.deleteRegion = function(regionID) {
				var r = confirm("Are you sure you want to delete this Region?");
				if (r) {
					request = '/secure-api/region/delete_region/?' + regionID;
					$http.delete(request, config)
						.then(function(response) {
							console.log('Region Removed');
							$state.reload();
						}, function(err) {
							console.log(err);
						});
				}
			};

			$scope.submitState = function(submittedState) {
				submittedState.states = cleanEntry(submittedState.states);
				if (submittedState.state_region_id) {
					$http.put('/secure-api/states/update_state', submittedState, config)
						.then(function(response) {
							console.log('State Updated');
							$state.reload();
						}, function(err) {
							console.log(err);
						});
				} else {
					$http.post('/secure-api/states/insert_state', submittedState, config)
						.then(function(reponse) {
							console.log('State Added');
							$state.reload();
						}, function(err) {
							console.error(err);
						});
				}
			};

			$scope.deleteState = function(stateID) {
				var r = confirm("Are you sure you want to delete this State?");
				if (r) {
					request = '/secure-api/states/delete_state/?' + stateID;
					$http.delete(request, config)
						.then(function(response) {
							console.log('Region Removed');
							$state.reload();
						}, function(err) {
							console.log(err);
						});
				}
			};

			$http.get('/secure-api/states/get_state', config)
				.then(function(response) {
					$scope.allStates = response.data.data;
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
				}, function(err) {
					console.log(err);
					if (err.data === 'Invalid Token') {
						$scope.logout();
					} else {
						$state.go('home');
					}
				});
		}]);
})(window, window.angular);