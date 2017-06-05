(function(window, angular, undefined) {
	angular.module('app')
		.controller('carrierCtrl', ['$scope', '$state', '$http', 'userSvc', 'carrierSvc', function($scope, $state, $http, userSvc, carrierSvc) {
			
			var config = {
				headers: {
					'auth-token': userSvc.token
				}
			};

			$scope.allCarriers = [];
			$scope.getCarriers = function(config){
				carrierSvc
					.getCarriers(config)
					.then(function(message){
						$scope.allCarriers = message;
					});
			};
			$scope.getCarriers(config);


			$scope.submitCarrier = function(submittedCarrier) {
				submittedCarrier.carrier_name = cleanEntry(submittedCarrier.carrier_name);

				if (submittedCarrier.carrier_id) {
					$http.put('/secure-api/carrier/update_carrier', submittedCarrier, config)
						.then(function(response) {
							console.log('Carrier Updated');
							$state.reload();
						}, function(err) {
							console.log(err);
						});
				} else {
					$http.post('/secure-api/carrier/insert_carriers', submittedCarrier, config)
						.then(function(reponse) {
							console.log('New Carrier Added');
							$state.reload();
						}, function(err) {
							console.error(err);
						});
				}
			};

			$scope.deleteCarrier = function(carrierID) {
				var r = confirm("Are you sure you want to delete this Carrier?");
				if (r) {
					request = '/secure-api/carrier/delete_carrier/?' + carrierID;
					$http.delete(request, config)
						.then(function(response) {
							console.log('Carrier Removed');
							$state.reload();
						}, function(err) {
							console.log(err);
						});
				}
			};
			
		}]);
})(window, window.angular);