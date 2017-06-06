(function(window, angular, undefined) {
	angular.module('app')
		.controller('accessorialCtrl', ['$scope', '$state', 'userSvc', 'accessSvc', function($scope, $state, userSvc, accessSvc) {
			
			var config = {
				headers: {
					'auth-token': userSvc.token
				}
			};

			$scope.newAccessorialCharge = {};
			$scope.allAccessorial = [];
			$scope.getAccess = function(config){
				accessSvc
					.getAccess(config)
					.then(function(message){
						$scope.allAccessorial = message;
					});
			};
			$scope.getAccess(config);

			$scope.submitAccessorialCharge = function(submittedAccessorialCharge) {
				submittedAccessorialCharge.description = cleanEntry(submittedAccessorialCharge.description);
				submittedAccessorialCharge.cost_code = cleanEntry(submittedAccessorialCharge.cost_code);
				if (submittedAccessorialCharge.prebuilt_cost_id) {
					accessSvc.updateAccess(submittedAccessorialCharge, config);
				} else {
					accessSvc.sumbitAccess(submittedAccessorialCharge, config);
					$scope.newAccessorialCharge = {};
				}
			};

			$scope.deleteAccessorialCharge = function(accessorialChargeID) {
				var r = confirm("Are you sure you want to delete this State?");
				if (r) {
					request = '/secure-api/accessorial_cost/delete_prebuilt_associated_costs/?' + accessorialChargeID;
					accessSvc.deleteAccess(request, config);
					for (var i in $scope.allAccessorial) {
						if ($scope.allAccessorial[i].prebuilt_cost_id === accessorialChargeID) {
							$scope.allAccessorial.splice(i, 1);
						}
					}
				}
			};

		}]);
})(window, window.angular);