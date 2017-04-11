(function(window, angular, undefined) {
	angular.module('app')
		.controller('accessorialCtrl', ['$scope', '$state', '$http', 'userSvc', function($scope, $state, $http, userSvc) {
			$scope.allAccessorial = [];

			var config = {
				headers: {
					'auth-token': userSvc.token
				}
			};

			$scope.submitAccessorialCharge = function(submittedAccessorialCharge) {
				submittedAccessorialCharge.description = cleanEntry(submittedAccessorialCharge.description);
				submittedAccessorialCharge.cost_code = cleanEntry(submittedAccessorialCharge.cost_code);
				if (submittedAccessorialCharge.prebuilt_cost_id) {
					$http.put('/secure-api/accessorial_cost/update_prebuilt_associated_costs', submittedAccessorialCharge, config)
						.then(function(response) {
							console.log('Operational Area Updated');
							$state.reload();
						}, function(err) {
							console.log(err);
						});
				} else {
					$http.post('/secure-api/accessorial_cost/insert_prebuilt_associated_costs', submittedAccessorialCharge, config)
						.then(function(reponse) {
							console.log('Operational Area Added');
							$state.reload();
						}, function(err) {
							console.log(err);
						});
				}
			};

			$scope.deleteAccessorialCharge = function(accessorialChargeID) {
				request = '/secure-api/accessorial_cost/delete_prebuilt_associated_costs/?' + accessorialChargeID;
				$http.delete(request, config)
					.then(function(response) {
						console.log('Operational Area Removed');
						$state.reload();
					}, function(err) {
						console.log(err);
					});
			};

			$http.get('/secure-api/accessorial_cost/get_prebuilt_associated_costs', config)
				.then(function(response) {
					$scope.allAccessorial = response.data.data;

					for (var i in $scope.allAccessorial) {
						$scope.allAccessorial[i].benchmark_cost = parseFloat($scope.allAccessorial[i].benchmark_cost);
						$scope.allAccessorial[i].description = undoCleanEntry($scope.allAccessorial[i].description);
						$scope.allAccessorial[i].cost_code = undoCleanEntry($scope.allAccessorial[i].cost_code);
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