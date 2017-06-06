(function(window, angular, undefined) {
	angular.module('app')
		.service('userSvc', ['$http', '$q', '$state', function($http, $q, $state) {
			var vm = this;

			var allUsers = [];
			var allUnapprovedUsers = [];

			vm.passwordRequest = function(user, callback) {
				var deferred = $q.defer();
				$http.post('api/user/password_request', user)
					.then(function(response) {
						console.log('Request Submitted');
					})
					.catch(function(e) {
						console.log('Request Submitted');
					});
			};

			vm.approveUser = function(user, config, callback) {
				var deferred = $q.defer();
				$http.post('/secure-api/user/approve_user', user, config)
					.then(function(response) {
						console.log('User Approved');
						$state.reload();
					})
					.catch(function(e) {
						deferred.reject(e);
					});
			};

			vm.submitUser = function(user, config, callback) {
				var deferred = $q.defer();
				$http.put('/secure-api/user/update_user', user, config)
					.then(function(response) {
						console.log('User Updated');
						$state.reload();
					})
					.catch(function(e) {
						deferred.reject(e);
					});
			};

			vm.deleteUser = function(request, config, callback){
				var deferred = $q.defer();
				$http.delete(request, config)
					.then(function(response) {
						console.log('User Removed');
						deferred.resolve(response);
					})
					.catch(function(e) {
						deferred.reject(e);
					});
			};

			vm.getUsers = function(config, callback) {
				var deferred = $q.defer();
				$http.get('/secure-api/user/get_users', config)
					.then(function(response) {
						allUsers = response.data.data;
						deferred.resolve(allUsers);
					})
					.catch(function(e) {
						deferred.reject(e);
						$state.go('login');
					});
				return deferred.promise;
			};

			vm.getUnapprovedUsers = function(config, callback) {
				var deferred = $q.defer();
				$http.get('/secure-api/user/get_unapproved_users', config)
					.then(function(response) {
						allUnapprovedUsers = response.data.data;
						deferred.resolve(allUnapprovedUsers);
					})
					.catch(function(e) {
						deferred.reject(e);
						$state.go('login');
					});
				return deferred.promise;
			};

			vm.getProfile = function(userId, config,callback){
				var deferred = $q.defer();
				$http.get('/secure-api/user/get_user?' + userId, config)
					.then(function(response) {
						user = response.data.data[0];
						deferred.resolve(user);
					})
					.catch(function(e) {
						deferred.reject(e);
						$state.go('login');
					});
				return deferred.promise;
			};

			vm.token = undefined;
			vm.user = undefined;
			vm.role = undefined;

			var cachedToken = localStorage.getItem('token');
			var cachedUser = localStorage.getItem('user');
			var cachedRole;

			if (localStorage.getItem('role') === '"Admin"' || localStorage.getItem('role') === '"Editor"') {
				cachedRole = localStorage.getItem('role');
			}

			if (cachedToken) {
				vm.token = JSON.parse(cachedToken);
				vm.user = JSON.parse(cachedUser);
				if (cachedRole === '"Admin"' || cachedRole === '"Editor"') {
					vm.role = JSON.parse(cachedRole);
				}
			}

			date_parse = function(newDate) {
				newDate = newDate.toString();
				newDate = moment.utc(newDate).add('12', 'hours').format();
				newDate = moment.utc(newDate).toDate();
				return newDate;
			};

			padding_right = function(s, c, n) {
				if (!s || !c || s.length >= n) {
					return s;
				}
				var max = (n - s.length) / c.length;
				for (var i = 0; i < max; i++) {
					s += c;
				}
				return s;
			};

			padding_left = function(s, c, n) {
				if (!s || !c || s.length >= n) {
					return s;
				}
				var max = (n - s.length) / c.length;
				for (var i = 0; i < max; i++) {
					s = c + s;
				}
				return s;
			};

			cleanEntry = function(text) {
				return text
					.replace(/~/g, "&tilde;")
					.replace(/`/g, "&grave;")
					.replace(/!/g, "&excl;")
					.replace(/@/g, "&commat;")
					.replace(/#/g, "&num;")
					.replace(/\$/g, "&dollar;")
					.replace(/%/g, "&percnt;")
					.replace(/\^/g, "&Hat;")
					.replace(/\*/g, "&ast;")
					.replace(/\(/g, "&lpar;")
					.replace(/\)/g, "&rpar;")
					.replace(/-/g, "&hyphen;")
					.replace(/_/g, "&lowbar;")
					.replace(/\+/g, "&plus;")
					.replace(/=/g, "&equals;")
					.replace(/{/g, "&lbrace;")
					.replace(/}/g, "&rbrace;")
					.replace(/]/g, "&rbrack;")
					.replace(/\[/g, "&lbrack;")
					.replace(/:/g, "&colon;")
					.replace(/'/g, "&apos;")
					.replace(/"/g, "&quot;")
					.replace(/,/g, "&comma;")
					.replace(/</g, "&lt;")
					.replace(/\./g, "&period;")
					.replace(/>/g, "&gt;")
					.replace(/\?/g, "&quest;")
					.replace(/\//g, "&sol;")
					.replace(/\|/g, "&vert;");
			};

			undoCleanEntry = function(text) {
				return text
					.replace(/&tilde;/g, "~")
					.replace(/&grave;/g, "`")
					.replace(/&excl;/g, "!")
					.replace(/&commat;/g, "@")
					.replace(/&num;/g, "#")
					.replace(/&dollar;/g, "$")
					.replace(/&percnt;/g, "%")
					.replace(/&Hat;/g, "^")
					.replace(/&ast;/g, "*")
					.replace(/&lpar;/g, "(")
					.replace(/&rpar;/g, ")")
					.replace(/&hyphen;/g, "-")
					.replace(/&lowbar;/g, "_")
					.replace(/&plus;/g, "+")
					.replace(/&equals;/g, "=")
					.replace(/&lbrace;/g, "{")
					.replace(/&rbrace;/g, "}")
					.replace(/&rbrack;/g, "]")
					.replace(/&lbrack;/g, "[")
					.replace(/&colon;/g, ":")
					.replace(/&apos;/g, "'")
					.replace(/&quot;/g, '"')
					.replace(/&comma;/g, ",")
					.replace(/&lt;/g, "<")
					.replace(/&period;/g, ".")
					.replace(/&gt;/g, ">")
					.replace(/&quest;/g, "?")
					.replace(/&sol;/g, "/")
					.replace(/&vert;/g, "|");
			};
			sanatizePercent = function(number) {
				var numberStore = String(number);
				var numberIndex = numberStore.indexOf('.');
				if (numberIndex == -1) {
					if (numberStore >= 1 && numberStore < 100) {
						numberStore = numberStore / 100;
					} else {
						numberStore = '.' + numberStore;
					}
				} else if (numberStore > 1 && numberStore < 10) {
					numberStore = numberStore / 100;
				} else if (numberStore < 1) {
					numberStore = numberStore.replace(".", "");
					numberStore = '.' + numberStore;
					numberStore = numberStore * 10;
				} else {
					numberStore = numberStore.replace(".", "");
					numberStore = '.' + numberStore;
				}
				numberStore = parseFloat(numberStore);
				return Math.round(numberStore * 10000) / 10000;
			};
		}])
		.filter('dateRange', function() {
			return function(records, dateKey, from, to) {
				return records.filter(function(record) {
					return !moment(record[dateKey], 'YYYY-MM-DD').isBefore(moment(from)) && !moment(record[dateKey], 'YYYY-MM-DD').isAfter(moment(to));
				});
			};
		});
})(window, window.angular);