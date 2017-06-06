(function(window, angular, undefined) {
	angular.module('app')
		.controller('loginCtrl', ['$scope', '$state', 'userSvc', '$http', function($scope, $state, userSvc, $http) {
			
			$scope.logUserIn = function(user) {
				$http.post('/api/user/login', user)
					.then(function(response) {
						userSvc.token = response.data.token;
						userSvc.user = response.data.user.username;

						localStorage.setItem('token', JSON.stringify(userSvc.token));
						localStorage.setItem('user', JSON.stringify(userSvc.user));

						if (response.data.user.role === "Admin" || response.data.user.role === "Editor") {
							userSvc.role = response.data.user.role;
							localStorage.setItem('role', JSON.stringify(userSvc.role));
						}

						$state.go('home');
					}, function(err) {
						console.error(err);
						if (Array.isArray(err.data)) {
							$('#password_Error').empty();
							$('#login_error').empty();
							for (var i = 0; i < err.data.length; i++) {
								$('#login_error').append('<p class="alert alert-danger">' + err.data[i] + "<p>");
							}
						} else {
							$('#password_Error').empty();
							$('#login_error').empty();
							$('#login_error').append('<p class="alert alert-danger">' + err.data + "<p>");
						}

					});
			};

			$scope.passwordRecovery = function() {
				$state.go('password_recovery');
			};

			$scope.sent = false;

			$scope.forgotPassword = function(user) {
				$scope.email = user.email;
				config = {'hello': 'hi'};
				user = {
					to: user.email,
					urlBase: window.location.origin
				};
				$scope.sent = true;
				userSvc.passwordRequest(user);
			};
		}]);
})(window, window.angular);