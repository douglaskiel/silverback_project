(function(window, angular, undefined) {
	angular.module('app')
		.controller('iotCtrl', ['$scope', '$state', '$http', 'userSvc', function($scope, $state, $http, userSvc) {

			var config = {
				headers: {
					'auth-token': userSvc.token
				}
			};

			$scope.allIOT = [];

			$scope.submitIOT = function(submittedIOT) {
				submittedIOT.delivery_type = cleanEntry(submittedIOT.delivery_type);
				submittedIOT.discount = sanatizePercent(submittedIOT.discount);
				submittedIOT.fsc_factor = sanatizePercent(submittedIOT.fsc_factor);
				if (submittedIOT.iot_id) {
					$http.put('/secure-api/iot/update_iot', submittedIOT, config)
						.then(function(response) {
							console.log('IOT Updated');
							$state.reload();
						}, function(err) {
							console.log(err);
						});
				} else {
					$http.post('/secure-api/iot/insert_IOT', submittedIOT, config)
						.then(function(reponse) {
							console.log('IOT Added');
							$state.reload();
						}, function(err) {
							console.error(err);
						});
				}
			};

			$scope.deleteIOT = function(iotID) {
				var r = confirm("Are you sure you want to delete this IOT?");
				if (r) {
					request = '/secure-api/iot/delete_iot/?' + iotID;
					$http.delete(request, config)
						.then(function(response) {
							console.log('IOT Removed');
							$state.reload();
						}, function(err) {
							console.log(err);
						});
				}
			};

			$http.get('/secure-api/iot/get_iot', config)
				.then(function(response) {
					$scope.allIOT = response.data.data;
					for (var i in $scope.allIOT) {
						$scope.allIOT[i].delivery_type = cleanEntry($scope.allIOT[i].delivery_type);
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