(function(window, angular, undefined) {
	angular.module('app')
		.controller('carrierCtrl', ['$scope', '$state', '$http', 'userSvc', 'carrierSvc', function($scope, $state, $http, userSvc, carrierSvc) {

			var config = {
				headers: {
					'auth-token': userSvc.token
				}
			};

			$scope.newCarrier = {};
			$scope.allCarriers = [];
			$scope.getCarriers = function(config) {
				carrierSvc
					.getCarriers(config)
					.then(function(message) {
						$scope.allCarriers = message;
					});
			};
			$scope.getCarriers(config);


			$scope.submitCarrier = function(submittedCarrier) {
				submittedCarrier.carrier_name = cleanEntry(submittedCarrier.carrier_name);

					if (submittedCarrier.carrier_id) {
						carrierSvc.updateCarriers(submittedCarrier, config);
					} else {
						carrierSvc.sumbitCarriers(submittedCarrier, config);
						$scope.newCarrier = {};
					}
			};

			$scope.deleteCarrier = function(carrierID) {
				var r = confirm("Are you sure you want to delete this Carrier?");
				if (r) {
					request = '/secure-api/carrier/delete_carrier/?' + carrierID;
					carrierSvc.deleteCarriers(request, config);
					for (var i in $scope.allCarriers) {
						if ($scope.allCarriers[i].carrier_id === carrierID) {
							$scope.allCarriers.splice(i, 1);
						}
					}
				}
			};

		}]);
})(window, window.angular);