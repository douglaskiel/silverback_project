(function(window, angular, undefined) {
	angular.module('app')
		.controller('priceSavingsCtrl', ['$scope', '$state', '$http', '$stateParams', 'userSvc', function($scope, $state, $http, $stateParams, userSvc) {

			var config = {
				headers: {
					'auth-token': userSvc.token
				}
			};

			$scope.exportData = function() {
				setTimeout(function() {
					var blob = new Blob([document.getElementById('savings_report').innerHTML], {
						type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
					});
					var blob2 = new Blob([document.getElementById('all_data').innerHTML], {
						type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
					});
					saveAs(blob, "Savings-Report-" + $scope.savingsInvoices[0].client_name + '-' + moment().format('YYYY/DD/MM') + ".xls");
					saveAs(blob2, "All-Data-" + $scope.savingsInvoices[0].client_name + '-' + moment().format('YYYY/DD/MM') + ".xls");
				}, 500);
			};

			$scope.savingsInvoices = [];
			$scope.associatedCosts = [];
			$scope.totalBenchmarkFrieghtCharge = 0;
			$scope.totalBenchmarkCharge = 0;
			$scope.totalBenchmarkAccessorial = 0;
			$scope.totalFuelBenchmark = 0;
			$scope.totalCharged = 0;
			$scope.totalAccesorialCharge = 0;
			$scope.totalFreightCharge = 0;
			$scope.totalFuelCharge = 0;
			$scope.state = $state.current;
			$scope.params = $stateParams;

			$scope.recalculation = function(invoice) {
				$scope.totalFuelBenchmark = 0;
				$scope.totalBenchmarkAccessorial = 0;
				$scope.totalBenchmarkFrieghtCharge = 0;
				$scope.totalBenchmarkCharge = 0;
				$scope.totalAccesorialCharge = 0;
				$scope.totalCharged = 0;
				$scope.totalFreightCharge = 0;
				$scope.totalFuelCharge = 0;
				for (var i in $scope.savingsInvoices) {
					if ($scope.savingsInvoices[i].invoice_id === invoice.invoice_id) {
						$scope.savingsInvoices[i] = invoice;
					}
					$scope.totalFuelBenchmark += $scope.savingsInvoices[i].benchmark_fuel_charge;
					$scope.totalBenchmarkAccessorial += parseFloat($scope.savingsInvoices[i].total_benchmark);
					$scope.totalBenchmarkFrieghtCharge += $scope.savingsInvoices[i].freight_charge;
					$scope.totalBenchmarkCharge += $scope.savingsInvoices[i].benchmark_charge;
					$scope.totalAccesorialCharge += parseFloat($scope.savingsInvoices[i].total_associated_costs);
					$scope.totalCharged += $scope.savingsInvoices[i].savings_total_charge;
					$scope.totalFreightCharge += $scope.savingsInvoices[i].savings_frieght_charge;
					$scope.totalFuelCharge += parseFloat($scope.savingsInvoices[i].savings_fuel_surcharge);
				}
			};

			$scope.calculation = function(savingsInvoices) {
				$scope.totalFuelBenchmark = 0;
				$scope.totalBenchmarkAccessorial = 0;
				$scope.totalBenchmarkFrieghtCharge = 0;
				$scope.totalBenchmarkCharge = 0;
				$scope.totalAccesorialCharge = 0;
				$scope.totalCharged = 0;
				$scope.totalFreightCharge = 0;
				$scope.totalFuelCharge = 0;
				for (var i = 0; i < $scope.savingsInvoices.length; i++) {
					date_parse($scope.savingsInvoices[i].process_date);
					date_parse($scope.savingsInvoices[i].ship_date);
					date_parse(	$scope.savingsInvoices[i].delivery_date);
					$scope.savingsInvoices[i].carrier_discount = Math.round($scope.savingsInvoices[i].carrier_discount * 100);
					$scope.savingsInvoices[i].discount = Math.round($scope.savingsInvoices[i].discount * 10000) / 100;
					$scope.savingsInvoices[i].gross_charge = parseFloat($scope.savingsInvoices[i].gross_charge);
					$scope.savingsInvoices[i].absolute_min_charge = parseFloat($scope.savingsInvoices[i].absolute_min_charge);
					$scope.savingsInvoices[i].fsc_factor = Math.round($scope.savingsInvoices[i].fsc_factor * 10000) / 100;
					$scope.savingsInvoices[i].bmfsc_factor = $scope.savingsInvoices[i].fsc_factor + '%';
					$scope.savingsInvoices[i].fuel_surcharge = Math.round($scope.savingsInvoices[i].fuel_surcharge * 10000) / 100;
					$scope.savingsInvoices[i].benchmark_fuel_surcharge = Math.round($scope.savingsInvoices[i].benchmark_fuel_surcharge * 10000) / 100;
					$scope.savingsInvoices[i].bfsc_percent = $scope.savingsInvoices[i].benchmark_fuel_surcharge + '%';
					$scope.savingsInvoices[i].accelerated_charge = parseFloat($scope.savingsInvoices[i].accelerated_charge);

					//benchmark
					if ((($scope.savingsInvoices[i].gross_charge * (100 - $scope.savingsInvoices[i].discount)) / 100) <= 88.39) {
						$scope.savingsInvoices[i].freight_charge = 88.39;
						$scope.savingsInvoices[i].bmdiscount = 'AMC';
					} else {
						$scope.savingsInvoices[i].bmdiscount = $scope.savingsInvoices[i].discount + '%';
						$scope.savingsInvoices[i].freight_charge = Math.round(($scope.savingsInvoices[i].gross_charge * (100 - $scope.savingsInvoices[i].discount))) / 100;
					}

					$scope.savingsInvoices[i].benchmark_fuel_charge = Math.round((($scope.savingsInvoices[i].benchmark_fuel_surcharge / 100 * $scope.savingsInvoices[i].fsc_factor / 100) * $scope.savingsInvoices[i].freight_charge) * 100) / 100;

					//savings
					if ((($scope.savingsInvoices[i].gross_charge * (100 - $scope.savingsInvoices[i].carrier_discount)) / 100) <= $scope.savingsInvoices[i].absolute_min_charge) {
						$scope.savingsInvoices[i].savings_discount = 'AMC';
						$scope.savingsInvoices[i].savings_frieght_charge = $scope.savingsInvoices[i].absolute_min_charge;
					} else {
						$scope.savingsInvoices[i].savings_discount = $scope.savingsInvoices[i].carrier_discount + '%';
						$scope.savingsInvoices[i].savings_frieght_charge = Math.round(($scope.savingsInvoices[i].gross_charge * (100 - $scope.savingsInvoices[i].carrier_discount))) / 100;
					}

					$scope.savingsInvoices[i].savings_fuel_surcharge = Math.round(($scope.savingsInvoices[i].savings_frieght_charge * ($scope.savingsInvoices[i].fuel_surcharge / 100)) * 100) / 100;

					//Accelerated Service
					if ($scope.savingsInvoices[i].accelerated_service === true) {
						$scope.savingsInvoices[i].savings_accelerated_charge = Math.round(($scope.savingsInvoices[i].savings_frieght_charge * $scope.savingsInvoices[i].accelerated_charge) * 100) / 100;

						$scope.savingsInvoices[i].benchmark_accelerated_charge = Math.round(($scope.savingsInvoices[i].freight_charge * $scope.savingsInvoices[i].accelerated_charge) * 100) / 100;

						if ($scope.savingsInvoices[i].savings_accelerated_charge < 30) {
							$scope.savingsInvoices[i].savings_accelerated_charge = 30;
							if ($scope.savingsInvoices[i].benchmark_accelerated_charge < $scope.savingsInvoices[i].savings_accelerated_charge) {
								$scope.savingsInvoices[i].benchmark_accelerated_charge = $scope.savingsInvoices[i].savings_accelerated_charge;
							}
						}
						$scope.savingsInvoices[i].total_associated_costs = parseFloat($scope.savingsInvoices[i].total_associated_costs) + $scope.savingsInvoices[i].savings_accelerated_charge;
						$scope.savingsInvoices[i].total_benchmark = parseFloat($scope.savingsInvoices[i].total_benchmark) + $scope.savingsInvoices[i].benchmark_accelerated_charge;
					} else {
						$scope.savingsInvoices[i].savings_accelerated_charge = 0;
						$scope.savingsInvoices[i].benchmark_accelerated_charge = 0;
						$scope.savingsInvoices[i].total_associated_costs = parseFloat($scope.savingsInvoices[i].total_associated_costs);
						$scope.savingsInvoices[i].total_benchmark = parseFloat($scope.savingsInvoices[i].total_benchmark);
					}

					$scope.savingsInvoices[i].savings_total_charge = Math.round((parseFloat($scope.savingsInvoices[i].savings_frieght_charge) + parseFloat($scope.savingsInvoices[i].savings_fuel_surcharge) + parseFloat($scope.savingsInvoices[i].total_associated_costs)) * 100) / 100;

					$scope.savingsInvoices[i].benchmark_charge = $scope.savingsInvoices[i].benchmark_fuel_charge + $scope.savingsInvoices[i].freight_charge + $scope.savingsInvoices[i].total_benchmark;

					//totals
					$scope.totalFuelBenchmark += $scope.savingsInvoices[i].benchmark_fuel_charge;
					$scope.totalBenchmarkAccessorial += parseFloat($scope.savingsInvoices[i].total_benchmark);
					$scope.totalBenchmarkFrieghtCharge += $scope.savingsInvoices[i].freight_charge;
					$scope.totalBenchmarkCharge += $scope.savingsInvoices[i].benchmark_charge;
					$scope.totalAccesorialCharge += parseFloat($scope.savingsInvoices[i].total_associated_costs);
					$scope.totalCharged += $scope.savingsInvoices[i].savings_total_charge;
					$scope.totalFreightCharge += $scope.savingsInvoices[i].savings_frieght_charge;
					$scope.totalFuelCharge += parseFloat($scope.savingsInvoices[i].savings_fuel_surcharge);
				}
			};

			$http.get('/secure-api/invoice/get_invoices_price_savings?' + $scope.params.invoiceIDs, config)
				.then(function(response) {
					$scope.savingsInvoices = response.data.data;
					for (var i in $scope.savingsInvoices) {
						$scope.savingsInvoices[i].carrier_name = undoCleanEntry($scope.savingsInvoices[i].carrier_name);
						$scope.savingsInvoices[i].invoice_number = undoCleanEntry($scope.savingsInvoices[i].invoice_number);
						$scope.savingsInvoices[i].receiver_name = undoCleanEntry($scope.savingsInvoices[i].receiver_name);
						$scope.savingsInvoices[i].receiver_zip = undoCleanEntry($scope.savingsInvoices[i].receiver_zip);
						$scope.savingsInvoices[i].ACCSCosts = [];
						$scope.savingsInvoices[i].shipped_Item = [];
					}
					$scope.calculation();
				}, function(err) {
					console.log(err);
					$state.go('login');
				});

			$http.get('/secure-api/accessorial_cost_invoice/get_associated_costs_invoices', config)
				.then(function(response) {
					$scope.ACCSCosts = response.data.data;
					for (var i in $scope.ACCSCosts) {
						$scope.ACCSCosts[i].invoice_number = undoCleanEntry($scope.ACCSCosts[i].invoice_number);
						for (var j in $scope.savingsInvoices) {
							if ($scope.ACCSCosts[i].invoice_number === $scope.savingsInvoices[j].invoice_number) {
								$scope.savingsInvoices[j].ACCSCosts.push($scope.ACCSCosts[i]);
							}
						}
					}
				}, function(err) {
					console.log(err);
					$state.go('login');
				});

			$http.get('/secure-api/shipping_class_invoice/get_shipping_class_invoice', config)
				.then(function(response) {
					$scope.shipped_Item = response.data.data;
					for (var i in $scope.shipped_Item) {
						$scope.shipped_Item[i].invoice_number = undoCleanEntry($scope.shipped_Item[i].invoice_number);
						for (var j in $scope.savingsInvoices) {
							if ($scope.shipped_Item[i].invoice_number === $scope.savingsInvoices[j].invoice_number) {
								$scope.savingsInvoices[j].shipped_Item.push($scope.shipped_Item[i]);
							}
						}
					}
				}, function(err) {
					console.log(err);
					$state.go('login');
				});
		}]);
})(window, window.angular);