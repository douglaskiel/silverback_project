(function(window, angular, undefined) {
	angular.module('app')
		.controller('homeCtrl', ['$scope', '$state', '$http', 'userSvc', function($scope, $state, $http, userSvc) {
			$scope.allCompanies = [];

			var config = {
				headers: {
					'auth-token': userSvc.token
				}
			};

		}]);
})(window, window.angular);