(function(window, angular, undefined) {
	angular.module('app')
		.controller('fscCtrl', ['$scope', '$state', 'userSvc', 'fscsSvc', function($scope, $state, userSvc, fscsSvc) {

			var config = {
				headers: {
					'auth-token': userSvc.token
				}
			};
			$scope.allFscs = [];
			$scope.newFSC = {};

			$scope.getEverything = function(config) {
				fscsSvc
					.getFscs(config)
					.then(function(message) {
						$scope.allFscs = message;
					});
			};
			$scope.getEverything(config);

			$scope.submitFSC = function(submittedFSC) {
				var exists = false;
				if (submittedFSC.start_rate < submittedFSC.end_rate) {
					for (var i in $scope.allFscs) {
						if ($scope.allFscs[i].start_rate <= submittedFSC.start_rate && $scope.allFscs[i].end_rate >= submittedFSC.start_rate && submittedFSC.fuel_surcharge_id !== $scope.allFscs[i].fuel_surcharge_id) {
							console.log('That rate is already covered please enter a diffrent rate');
							exists = true;
							break;
						}
					}
					if (!exists) {
						submittedFSC.fuel_surcharge = sanatizePercent(submittedFSC.fuel_surcharge);
						if (submittedFSC.fuel_surcharge_id) {
							fscsSvc.updateFscs(submittedFSC, config);
						} else {
							fscsSvc.sumbitFscs(submittedFSC, config);
							$scope.newFSC = {};
						}
					}
				} else {
					console.log('Starting Rate must be lower than ending rate');
				}
			};

			$scope.deleteFSC = function(fuelSurchargeId) {
				var r = confirm("Are you sure you want to delete this Fuel Surcharge?");
				if (r) {
					request = '/secure-api/fuel_surcharge_rates/delete_fsc/?' + fuelSurchargeId;
					fscsSvc.deleteFscs(request, config);
					for (var i in $scope.allFscs) {
						if ($scope.allFscs[i].fuel_surcharge_id === fuelSurchargeId) {
							$scope.allFscs.splice(i, 1);
						}
					}
				}
			};
		}]);
})(window, window.angular);