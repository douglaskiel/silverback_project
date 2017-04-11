(function(window, angular, undefined) {
	angular.module('app')
		.controller('manageUserCtrl', ['$scope', '$state', '$http', 'userSvc', function($scope, $state, $http, userSvc) {

			var config = {
				headers: {
					'auth-token': userSvc.token
				}
			};

			$scope.allRegions = [];

			$scope.roles = ['User', 'Editor', 'Admin'];

			$scope.approveUser = function(approvedUser) {
				approvedUser.login_attempts = 0;
				approvedUser.last_login_attempt = Date.now();
				console.log(approvedUser);

				$http.post('/secure-api/user/approve_user', approvedUser, config)
					.then(function(reponse) {
						console.log('User Apprvoed');
						$state.reload();
					}, function(err) {
						console.error(err);
					});

			};

			$scope.submitUser = function(user) {
				$http.put('/secure-api/user/update_user', user, config)
					.then(function(response) {
						console.log('User Updated');
						$state.reload();
					}, function(err) {
						console.log(err);
					});
			};

			$scope.deleteUnapprovedUser = function(unuserID) {
				var r = confirm("Are you sure you want to deny this User?");
				if (r) {
					request = '/secure-api/user/delete_unapproved_user/?' + unuserID;
					$http.delete(request, config)
						.then(function(response) {
							console.log('User Removed');
							$state.reload();
						}, function(err) {
							console.log(err);
						});
				}
			};

			$scope.deleteUser = function(user) {
				var r = confirm("Are you sure you want to delete this User?");
				if (r && user.username != userSvc.user) {
					request = '/secure-api/user/delete_user/?' + user.id;
					$http.delete(request, config)
						.then(function(response) {
							console.log('User Removed');
							$state.reload();
						}, function(err) {
							console.log(err);
						});
				} else {
					console.log('You cant delete yourself from this screen.');
				}
			};

			$http.get('/secure-api/user/get_users', config)
				.then(function(response) {
					$scope.allUsers = response.data.data;
				}, function(err) {
					console.log(err);
					if (err.data === 'Invalid Token') {
						$scope.logout();
					} else {
						$state.go('home');
					}
				});

			$http.get('/secure-api/user/get_unapproved_users', config)
				.then(function(response) {
					$scope.allUnapprovedUsers = response.data.data;
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