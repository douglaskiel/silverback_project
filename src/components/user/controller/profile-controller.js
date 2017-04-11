(function(window, angular, undefined) {
	angular.module('app')
		.controller('profileCtrl', ['$scope', '$state', '$http', 'userSvc', function($scope, $state, $http, userSvc) {

			var config = {
				headers: {
					'auth-token': userSvc.token
				}
			};

			$scope.user = {};

			$scope.submitProfile = function(user) {
				$http.put('/secure-api/user/update_profile', user, config)
					.then(function(response) {
						console.log('User Updated');
						$state.reload();
					}, function(err) {
						console.log(err);
					});
			};

			$scope.deleteProfile = function(userID) {
				var r = confirm("Are you sure you want to delete your account? This CANNOT be undone.");
				if (r && $scope.user_id === userID) {
					request = '/secure-api/user/delete_profile/?' + userID;
					$http.delete(request, config)
						.then(function(response) {
							$scope.logout();
							console.log('Profile Deleted');
						}, function(err) {
							console.log(err);
						});
				}
			};

			$scope.changePassword = function(user) {
				if (user.new_password === user.confirm_password) {
					$http.put('/secure-api/user/change_password', user, config)
						.then(function(response) {
							console.log('User Updated');
							$state.reload();
						}, function(err) {
							console.log(err);
							$('#password_Error').empty();
							for (var i = 0; i < err.data.length; i++) {
								$('#password_Error').append('<p class="alert alert-danger">' + err.data[i] + "<p>");
							}
						});
				} else {
					console.log('Passwords Do Not Match');
				}
			};

			$http.get('/secure-api/user/get_user?' + userSvc.user, config)
				.then(function(response) {
					$scope.user = response.data.data[0];
					$scope.user_id = $scope.user.id;
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