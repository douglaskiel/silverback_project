(function(window, angular, undefined) {
	angular.module('app')
		.controller('ediCtrl', ['$scope', '$state', '$http', 'userSvc', function($scope, $state, $http, userSvc) {
			$scope.allCarriers = [];

			var config = {
				headers: {
					'auth-token': userSvc.token
				}
			};
			console.log('test');

			var textSplit = text.split('*');
			
		}]);
})(window, window.angular);