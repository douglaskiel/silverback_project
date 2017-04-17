(function(window, angular, undefined) {
	angular.module('app')
		.service('userSvc', [function() {
			var vm = this;
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
				newDate = moment(newDate);
				day = newDate.day();
				console.log(day);
				console.log(newDate);
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