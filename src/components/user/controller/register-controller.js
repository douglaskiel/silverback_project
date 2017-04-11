(function(window, angular, undefined) {
	angular.module('app')
		.controller('registerCtrl', ['$scope', '$state', '$http', 'userSvc', function($scope, $state, $http, userSvc) {
			$scope.createUser = function(user) {
				$('#password_Error').empty();
				$('#login_error').empty();
				$http.post('/api/user/create', user)
					.then(function(response) {
						$('#password_Error').empty();
						$('#login_error').empty();
						$state.go('home');
					}, function(err) {
						console.error(err);
						if (Array.isArray(err.data)) {
							$('#password_Error').empty();
							$('#login_error').empty();
							for (var i = 0; i < err.data.length; i++) {
								$('#password_Error').append('<p class="alert alert-danger">' + err.data[i] + "<p>");
							}
						} else {
							$('#password_Error').empty();
							$('#login_error').empty();
							$('#password_Error').append('<p class="alert alert-danger">' + err.data + "<p>");
						}
					});
			};
		}]);
})(window, window.angular);