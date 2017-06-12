(function(window, angular, undefined) {
	angular.module('app')
		.controller('indexCtrl', ['$scope', '$state', '$http', 'userSvc', function($scope, $state, $http, userSvc) {

			$scope.approvedUser = function(){
				if(userSvc.role === "Editor" || userSvc.role === "Admin"){
					$scope.approved = true;
					return true;
				} else {
					$scope.approved = false;
					return false;
				}
			};

			$scope.isLoggedin = function() {
				if (userSvc.token) {
					$scope.username = userSvc.user;
					return true;
				} else {
					return false;
				}
			};

			$scope.isAdmin = function(){
				if(userSvc.role === "Admin"){
					return true;
				} else {
					return false;
				}
			};

			$scope.logoutConfirm = function(){
				var r = confirm("Are you sure you want to log out?");
				if (r === true) {
					$scope.logout();
				}
			};

			$scope.logout = function() {
					userSvc.token = null;
					userSvc.user = null;
					userSvc.role = null;
					$scope.username = null;
					localStorage.removeItem('token');
					localStorage.removeItem('user');
					localStorage.removeItem('role');
					$state.go('login');
			};
		}]);
})(window, window.angular);

//chris rock