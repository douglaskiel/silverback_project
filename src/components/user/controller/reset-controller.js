(function(window, angular, undefined) {
	angular.module('app')
		.controller('pswdCtrl', ['$scope', '$state', '$http', '$stateParams', 'userSvc', function($scope, $state, $http, $stateParams, userSvc) {

			$scope.state = $state.current;
			$scope.params = $stateParams;
			$scope.resetCode = $scope.params.resetCode;
			$scope.user_id = $scope.params.userID;

			$scope.submitPassword = function(submitPassword) {
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
			};

		}]);
})(window, window.angular);