(function(window, angular, undefined) {
	angular.module('app')
		.controller('profileCtrl', ['$scope', '$state', '$http', 'userSvc', function($scope, $state, $http, userSvc) {

			var config = {
				headers: {
					'auth-token': userSvc.token
				}
			};

			$scope.user = {};
			$scope.passLength = false;
			$scope.special = false;
			$scope.upperCase = false;
			$scope.lowerCase = false;
			$scope.number = false;
			$scope.requirements = false;
			$scope.passMatch = false;
			$scope.errors = false;
			$scope.errorsArry = [];

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
					userSvc.deleteUser(request, config);
					$scope.logout();
				}
			};

			$scope.passCheck = function(newPass, confirmPass) {
				var specialTest = /[~`!#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?]/;
				var upperCaseTest = /[A-Z]/;
				var lowerCaseTest = /[a-z]/;
				var numberTest = /\d/;

				if (newPass.length > 13) {
					$scope.passLength = true;
				} else if (newPass.length < 14) {
					$scope.passLength = false;
				}

				if (specialTest.test(newPass)) {
					$scope.special = true;
				} else {
					$scope.special = false;
				}

				if (upperCaseTest.test(newPass)) {
					$scope.upperCase = true;
				} else {
					$scope.upperCase = false;
				}

				if (lowerCaseTest.test(newPass)) {
					$scope.lowerCase = true;
				} else {
					$scope.lowerCase = false;
				}

				if (numberTest.test(newPass)) {
					$scope.number = true;
				} else {
					$scope.number = false;
				}

				if (newPass === confirmPass) {
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

			$scope.changePassword = function(user) {
				if ($scope.requirements === true) {
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
					console.log('Passwords Requirments Not Met');
					$scope.errors = true;
					$scope.errorsArry = [];
					$scope.errorsArry.push('Passwords Requirments Not Met');
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