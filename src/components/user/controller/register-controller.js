(function(window, angular, undefined) {
	angular.module('app')
		.controller('registerCtrl', ['$scope', '$state', '$http', 'userSvc', function($scope, $state, $http, userSvc) {

			$scope.passLength = false;
			$scope.special = false;
			$scope.upperCase = false;
			$scope.lowerCase = false;
			$scope.number = false;
			$scope.requirements = false;
			$scope.passMatch = false;

			$scope.formChange = function(user) {
				var specialTest = /[~`!#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?]/;
				var upperCaseTest = /[A-Z]/;
				var lowerCaseTest = /[a-z]/;
				var numberTest = /\d/;

				if (user.user_password.length > 13) {
					$scope.passLength = true;
				} else if (user.user_password.length < 14) {
					$scope.passLength = false;
				}

				if (specialTest.test(user.user_password)) {
					$scope.special = true;
				} else {
					$scope.special = false;
				}

				if (upperCaseTest.test(user.user_password)) {
					$scope.upperCase = true;
				} else {
					$scope.upperCase = false;
				}

				if (lowerCaseTest.test(user.user_password)) {
					$scope.lowerCase = true;
				} else {
					$scope.lowerCase = false;
				}

				if (numberTest.test(user.user_password)) {
					$scope.number = true;
				} else {
					$scope.number = false;
				}

				if (user.user_password === user.password_check) {
					$scope.passMatch = true;
				} else {
					$scope.passMatch = false;
				}

				if ($scope.passMatch === true && $scope.passLength === true && $scope.special === true && $scope.upperCase === true && $scope.lowerCase === true && $scope.number === true) {
					$scope.requirements = true;
				} else {
					$scope.requirements = false;
				}

			};

			$scope.createUser = function(user) {
				if ($scope.requirements === true) {
					$('#password_Error').empty();
					$('#login_error').empty();
					if (user.user_password === user.password_check) {
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
					} else {
						$('#password_Error').empty();
						$('#password_Error').append('<p class="alert alert-danger"> Passwords do not match, please make sure that they are the same <p>');
					}
				} else {
					$('#password_Error').empty();
					$('#password_Error').append('<p class="alert alert-danger"> Please make sure you\'re password meets the requirements<p>');
				}
			};
		}]);
})(window, window.angular);