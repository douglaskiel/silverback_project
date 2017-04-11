(function(window, angular, undefined) {
	angular.module('app')
		.controller('loginCtrl', ['$scope', '$state', '$http', 'userSvc', function($scope, $state, $http, userSvc) {
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
				user = {
					to: user.email,
					urlBase: window.location.origin
				};
				console.log(window.location.origin);
				$http.post('api/user/password_request', user)
					.then(function(response) {
						$scope.sent = true;
					}, function(err) {
						console.log(err);
						$scope.sent = true;
					});
			};
		}]);
})(window, window.angular);