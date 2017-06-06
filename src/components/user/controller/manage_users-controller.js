(function(window, angular, undefined) {
	angular.module('app')
		.controller('manageUserCtrl', ['$scope', '$state', '$http', 'userSvc', function($scope, $state, $http, userSvc) {

			var config = {
				headers: {
					'auth-token': userSvc.token
				}
			};

			$scope.roles = ['User', 'Editor', 'Admin'];
			$scope.allUsers =[];
			$scope.allUnapprovedUsers =[];

			$scope.getEverything = function(config) {
				userSvc
					.getUsers(config)
					.then(function(message) {
						$scope.allUsers = message;
					});
				userSvc
					.getUnapprovedUsers(config)
					.then(function(message) {
						$scope.allUnapprovedUsers = message;
					});
			};
			$scope.getEverything(config);

			$scope.approveUser = function(approvedUser) {
				approvedUser.login_attempts = 0;
				approvedUser.last_login_attempt = Date.now();
				console.log(approvedUser);

				userSvc.approveUser(approvedUser, config);
			};

			$scope.submitUser = function(user) {
				userSvc.submitUser(user, config);
			};

			$scope.deleteUnapprovedUser = function(unuserID) {
				var r = confirm("Are you sure you want to deny this User?");
				if (r) {
					request = '/secure-api/user/delete_unapproved_user/?' + unuserID;
					userSvc.deleteUser(request, config);
					for (var i in $scope.allUnapprovedUsers) {
						if ($scope.allUnapprovedUsers[i].unapproved_user_id === unuserID) {
							$scope.allUnapprovedUsers.splice(i, 1);
						}
					}
				}
			};

			$scope.deleteUser = function(user) {
				var r = confirm("Are you sure you want to delete this User?");
				if (r && user.username != userSvc.user) {
					request = '/secure-api/user/delete_user/?' + user.id;
					userSvc.deleteUser(request, config);
					for (var i in $scope.allUsers) {
						if ($scope.allUsers[i].id === user.id) {
							$scope.allUsers.splice(i, 1);
						}
					}
				} else {
					console.log('You cant delete yourself from this screen.');
				}
			};
		}]);
})(window, window.angular);