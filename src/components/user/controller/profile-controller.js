(function(window, angular, undefined) {
	angular.module('app')
		.controller('profileCtrl', ['$scope', '$state', 'userSvc', function($scope, $state, userSvc) {

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

			$scope.getProfile = function(userID, config) {
				userSvc
					.getProfile(userID, config)
					.then(function(message) {
						$scope.user = message;
						$scope.user_id = $scope.user.id;
					});
			};

			$scope.getProfile(userSvc.user, config);

			$scope.submitProfile = function(user) {
				userSvc.updateProfile(user, config);
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
					userSvc.updatePassword(user,config);
				} else {
					console.log('Passwords Requirments Not Met');
					$scope.errors = true;
					$scope.errorsArry = [];
					$scope.errorsArry.push('Passwords Requirments Not Met');
				}
			};
		}]);
})(window, window.angular);