(function(window, angular, undefined) {
	angular.module('app')
		.controller('iotCtrl', ['$scope', '$state', 'userSvc', 'iotSvc', function($scope, $state, userSvc, iotSvc) {

			var config = {
				headers: {
					'auth-token': userSvc.token
				}
			};

			$scope.allIOT = [];
			$scope.newIOT = {};
			$scope.getEverything = function(config) {
				iotSvc
					.getIOT(config)
					.then(function(message) {
						$scope.allIOT = message;
					});
			};
			$scope.getEverything(config);

			$scope.submitIOT = function(submittedIOT) {
				submittedIOT.delivery_type = cleanEntry(submittedIOT.delivery_type);
				submittedIOT.discount = sanatizePercent(submittedIOT.discount);
				submittedIOT.fsc_factor = sanatizePercent(submittedIOT.fsc_factor);
				if (submittedIOT.iot_id) {
					iotSvc.updateIOT(submittedIOT, config);
				} else {
					iotSvc.sumbitIOT(submittedIOT, config);
					$scope.newIOT = {};
				}
			};

			$scope.deleteIOT = function(iotID) {
				var r = confirm("Are you sure you want to delete this IOT?");
				if (r) {
					request = '/secure-api/iot/delete_iot/?' + iotID;
					iotSvc.deleteIOT(request, config);
					for (var i in $scope.allIOT) {
						if ($scope.allIOT[i].iot_id === iotID) {
							$scope.allIOT.splice(i, 1);
						}
					}
				}
			};
		}]);
})(window, window.angular);