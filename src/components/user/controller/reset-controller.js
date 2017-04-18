(function(window, angular, undefined) {
	angular.module('app')
		.controller('pswdCtrl', ['$scope', '$state', '$http', '$stateParams', 'userSvc', function($scope, $state, $http, $stateParams, userSvc) {

			$scope.state = $state.current;
			$scope.params = $stateParams;
			$scope.resetCode = $scope.params.resetCode;
			$scope.user_id = $scope.params.userID;

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

				if (user.enter.length > 13) {
					$scope.passLength = true;
				} else if (user.enter.length < 14) {
					$scope.passLength = false;
				}

				if (specialTest.test(user.enter)) {
					$scope.special = true;
				} else {
					$scope.special = false;
				}

				if (upperCaseTest.test(user.enter)) {
					$scope.upperCase = true;
				} else {
					$scope.upperCase = false;
				}

				if (lowerCaseTest.test(user.enter)) {
					$scope.lowerCase = true;
				} else {
					$scope.lowerCase = false;
				}

				if (numberTest.test(user.enter)) {
					$scope.number = true;
				} else {
					$scope.number = false;
				}

				if (user.enter === user.check) {
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


			$scope.submitPassword = function(submitPassword) {
				if($scope.requirements === true){
				$('#message').empty();
				if (submitPassword.check === undefined || submitPassword.enter === undefined) {
					$('#message').append('<br><p class="alert alert-danger"> Please enter a password. </p>');
				} else if (submitPassword.check != submitPassword.enter) {
					$('#message').append('<br><p class="alert alert-danger"> The entered passwords do not match. </p>');
				} else if (submitPassword.check === submitPassword.enter) {
					submitPassword.reset_code = $scope.resetCode;
					submitPassword.user_id = $scope.user_id;
					$http.post('api/user/reset_password', submitPassword);
					$state.go('login');
				}
			} else {
				$('#password_Error').append('<p class="alert alert-danger"> Please make sure you\'re password meets the requirements<p>');
			}
			};

		}]);
})(window, window.angular);