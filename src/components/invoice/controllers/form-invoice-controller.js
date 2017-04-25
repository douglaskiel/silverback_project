(function(window, angular, undefined) {
	angular.module('app')
		.controller('invoiceFormCtrl', ['$scope', '$state', '$http', '$stateParams', 'userSvc', function($scope, $state, $http, $stateParams, userSvc) {

			var config = {
				headers: {
					'auth-token': userSvc.token
				}
			};

			$scope.allInvoices = [];
			$scope.specificInvoice = [];
			$scope.allCompanies = [];
			$scope.allCarriers = [];
			$scope.allFuelRates = [];
			$scope.allIOT = [];
			$scope.allPrebuiltAccessorial = [];
			$scope.items = [];
			$scope.totalWeight = 0;
			$scope.totalAccessorialCharges = 0;
			$scope.invoice = {};
			$scope.classOptions = [
				50, 55, 60, 65, 70, 77.5, 85, 92.5, 100, 110, 125, 150, 175, 200, 250, 300, 400, 500
			];
			$scope.shippingClasses = [];
			$scope.accessorialCharges = [];
			$scope.associatedCosts = [];
			$scope.totalBenchmarkCost = [];
			$scope.allOperations = [];
			$scope.rateString = '';
			$scope.returnString = '';
			$scope.state = $state.current;
			$scope.params = $stateParams;
			$scope.errors = false;
			$scope.errorsArry = [];
			$scope.newRow = false;

			if ($scope.params.invoiceID !== "") {
				$http.get('/secure-api/invoice/get_invoice?' + $scope.params.invoiceID, config)
					.then(function(response) {
						$scope.specificInvoice = response.data.data;
						for (var i = 0; i < $scope.specificInvoice.length; i++) {
							$scope.specificInvoice[i].process_date = date_parse($scope.specificInvoice[i].process_date);
							$scope.specificInvoice[i].ship_date = date_parse($scope.specificInvoice[i].ship_date);
							$scope.specificInvoice[i].delivery_date = date_parse($scope.specificInvoice[i].delivery_date);
							$scope.specificInvoice[i].billed_weight = parseFloat($scope.specificInvoice[i].billed_weight);
							$scope.specificInvoice[i].total_associated_costs = parseFloat($scope.specificInvoice[i].total_associated_costs);
							$scope.specificInvoice[i].classification = parseFloat($scope.specificInvoice[i].classification);
							$scope.specificInvoice[i].weight = parseFloat($scope.specificInvoice[i].weight);
							$scope.specificInvoice[i].gross_charge = parseFloat($scope.specificInvoice[i].gross_charge);
							$scope.specificInvoice[i].absolute_min_charge = parseFloat($scope.specificInvoice[i].absolute_min_charge);
							$scope.specificInvoice[i].carrier_discount = parseFloat($scope.specificInvoice[i].carrier_discount);
							$scope.shippingClasses.push({
								'weight': $scope.specificInvoice[i].weight,
								'classification': $scope.specificInvoice[i].classification,
								'rate': $scope.specificInvoice[i].rate,
								'charge': $scope.specificInvoice[i].charge,
								'invoice_number': $scope.specificInvoice[i].invoice_number,
								'item_id': $scope.specificInvoice[i].item_id
							});
							$scope.PD = {};

							$scope.specificInvoice[i].invoice_number = undoCleanEntry($scope.specificInvoice[i].invoice_number);
							$scope.specificInvoice[i].sender_name = undoCleanEntry($scope.specificInvoice[i].sender_name);
							$scope.specificInvoice[i].sender_address_1 = undoCleanEntry($scope.specificInvoice[i].sender_address_1);
							$scope.specificInvoice[i].sender_city = undoCleanEntry($scope.specificInvoice[i].sender_city);
							$scope.specificInvoice[i].sender_country = undoCleanEntry($scope.specificInvoice[i].sender_country);
							$scope.specificInvoice[i].receiver_name = undoCleanEntry($scope.specificInvoice[i].receiver_name);
							$scope.specificInvoice[i].receiver_address_1 = undoCleanEntry($scope.specificInvoice[i].receiver_address_1);
							$scope.specificInvoice[i].receiver_city = undoCleanEntry($scope.specificInvoice[i].receiver_city);
							$scope.specificInvoice[i].receiver_country = undoCleanEntry($scope.specificInvoice[i].receiver_country);
							$scope.specificInvoice[i].transportation_mode = undoCleanEntry($scope.specificInvoice[i].transportation_mode);
							$scope.specificInvoice[i].package_type = undoCleanEntry($scope.specificInvoice[i].package_type);
							$scope.specificInvoice[i].sender_address_2 = undoCleanEntry($scope.specificInvoice[i].sender_address_2);
							$scope.specificInvoice[i].receiver_address_2 = undoCleanEntry($scope.specificInvoice[i].receiver_address_2);
							$scope.specificInvoice[i].receiver_zip_4 = undoCleanEntry($scope.specificInvoice[i].receiver_zip_4);
							$scope.specificInvoice[i].receiver_zip = undoCleanEntry($scope.specificInvoice[i].receiver_zip);
							$scope.specificInvoice[i].sender_zip = undoCleanEntry($scope.specificInvoice[i].sender_zip);
							$scope.specificInvoice[i].sender_zip_4 = undoCleanEntry($scope.specificInvoice[i].sender_zip_4);
						}
						$scope.invoice = $scope.specificInvoice[0];
						$scope.items = $scope.specificInvoice;
						$http.get('/secure-api/accessorial_cost_invoice/get_associated_costs_invoice?' + $scope.specificInvoice[0].invoice_number, config)
							.then(function(response) {
								$scope.associatedCosts = response.data.data;
								for (var i = 0; i < $scope.associatedCosts.length; i++) {
									$scope.accessorialCharges.push({
										'actual_cost': parseFloat($scope.associatedCosts[i].actual_cost),
										'benchmark_cost': parseFloat($scope.associatedCosts[i].benchmark_cost),
										'cost_code': $scope.associatedCosts[i].cost_code,
										'cost_id': $scope.associatedCosts[i].cost_id,
										'invoice_number': $scope.associatedCosts[i].invoice_number
									});
									$scope.PD = {};
								}
							}, function(err) {
								console.log(err);
							});
					}, function(err) {
						console.log(err);
						$state.go('login');
					});
			} else {
				$scope.invoice = {};
				var today = new Date();
				var day = today.getDay();

				if (day === 5) {
					$scope.invoice.process_date = today;
				} else {
					$scope.invoice.process_date = new Date(moment().day(5));
				}
				$scope.shippingClasses.push({
						
					});
				$scope.PD = {};
			}

			$scope.setOldCost = function(oldCharge) {
				$scope.invoice.old_cost = (oldCharge * (1 - 0.829));
				$scope.invoice.new_cost = (oldCharge * (1 - sanatizePercent($scope.invoice.discount_percent)));
				$scope.invoice.old_fsc = ($scope.invoice.old_cost * sanatizePercent($scope.invoice.fsc_percent));
				$scope.invoice.new_fsc = ($scope.invoice.new_cost * sanatizePercent($scope.invoice.fsc_percent));
				$scope.invoice.old_total_cost = $scope.invoice.old_cost + $scope.invoice.old_fsc;
				$scope.invoice.new_total_cost = $scope.invoice.new_cost + $scope.invoice.new_fsc;
				$scope.invoice.savings = $scope.invoice.old_total_cost - $scope.invoice.new_total_cost;
			};

			$scope.submitXPOInvoice = function(invoice) {
				invoice.old_cost = (Math.round(parseFloat(invoice.old_cost) * 100))/100;
				invoice.old_fsc = (Math.round(parseFloat(invoice.old_fsc) * 100))/100;
				invoice.old_total_cost = (Math.round(parseFloat(invoice.old_total_cost) * 100))/100;
				invoice.new_cost = (Math.round(parseFloat(invoice.new_cost) * 100))/100;
				invoice.new_fsc = (Math.round(parseFloat(invoice.new_fsc) * 100))/100;
				invoice.new_total_cost = (Math.round(parseFloat(invoice.new_total_cost) * 100))/100;
				invoice.discount_percent = sanatizePercent(invoice.discount_percent);
				invoice.savings = (Math.round(parseFloat(invoice.savings)*100)/100);
				console.log(invoice);
			};

			$scope.carrierCheck = function() {
				var senderStateString = $scope.invoice.sender_state;
				var receiverStateString = $scope.invoice.receiver_state;
				var senderZipString = $scope.invoice.sender_zip;
				var receiverZipString = $scope.invoice.receiver_zip;
				var carrierString = $scope.invoice.carrier_id;
				var senderInfo;
				var receiverInfo;

				for (var i in $scope.allCarriers) {
					if ($scope.invoice.carrier_id === $scope.allCarriers[i].carrier_id) {
						$scope.invoice.carrier_name = $scope.allCarriers[i].carrier_name;
					}
				}

				if (carrierString && senderStateString && receiverStateString) {
					for (i in $scope.allOperations) {
						if ($scope.allOperations[i].carrier_id === carrierString) {
							if ($scope.allOperations[i].states === senderStateString) {
								if (!$scope.allOperations[i].zip_code || $scope.allOperations[i].zip_code === "") {
									senderInfo = $scope.allOperations[i];
									break;
								} else if ($scope.allOperations[i].zip_code === senderZipString) {
									senderInfo = $scope.allOperations[i];
									break;
								}
							}
						}
					}
					for (i in $scope.allOperations) {
						if ($scope.allOperations[i].carrier_id === carrierString) {
							if ($scope.allOperations[i].states === receiverStateString) {
								if ($scope.allOperations[i].zip_code === receiverZipString) {
									receiverInfo = $scope.allOperations[i];
									break;
								} else if (!$scope.allOperations[i].zip_code || $scope.allOperations[i].zip_code === "") {
									receiverInfo = $scope.allOperations[i];
									break;
								}
							}
						}
					}
					if (senderInfo && receiverInfo) {
						if (parseFloat(senderInfo.absolute_minimum_charge) > parseFloat(receiverInfo.absolute_minimum_charge)) {
							$scope.invoice.absolute_min_charge = parseFloat(senderInfo.absolute_minimum_charge);
							$scope.invoice.carrier_discount = parseFloat(senderInfo.discount);
							$scope.invoice.accelerated_charge = parseFloat(senderInfo.accelerated_charge);
						} else {
							$scope.invoice.absolute_min_charge = parseFloat(receiverInfo.absolute_minimum_charge);
							$scope.invoice.carrier_discount = parseFloat(receiverInfo.discount);
							$scope.invoice.accelerated_charge = parseFloat(receiverInfo.accelerated_charge);
						}
					}
				}
			};

			$scope.submitInvoice = function(invoice, items, accessorialCharges) {
				$scope.errors = false;
				$scope.errorsArry = [];
				var senderState = false;
				var receiverState = false;
				var senderZip = false;
				var receiverZip = false;

				for (var i in $scope.allOperations) {
					if ($scope.allOperations[i].states === invoice.sender_state && $scope.allOperations[i].carrier_id === invoice.carrier_id) {
						senderState = true;
					}
					if ($scope.allOperations[i].states === invoice.receiver_state && $scope.allOperations[i].carrier_id === invoice.carrier_id) {
						receiverState = true;
					}
					if (($scope.allOperations[i].zip_code == invoice.sender_zip && $scope.allOperations[i].carrier_id === invoice.carrier_id) || (($scope.allOperations[i].zip_code === null || $scope.allOperations[i].zip_code === "") && $scope.allOperations[i].carrier_id === invoice.carrier_id)) {
						senderZip = true;
					}
					if (($scope.allOperations[i].zip_code == invoice.receiver_zip && $scope.allOperations[i].carrier_id === invoice.carrier_id) || (($scope.allOperations[i].zip_code === null || $scope.allOperations[i].zip_code === "") && $scope.allOperations[i].carrier_id === invoice.carrier_id)) {
						receiverZip = true;
					}
					if (senderState && receiverState && senderZip && receiverZip) {
						break;
					}
				}
				var r = true;

				if (!senderState || !receiverState || !senderZip || !receiverZip) {
					r = confirm("The carrier you selected does not appear to deleive to the selected State and Zip Code combination, would you like to continue anyway?");
				}
				if (r) {
					$scope.totalWeight = 0;
					$scope.totalAccessorialCharges = 0;
					$scope.totalBenchmarkCost = 0;

					if (items != [] && items.length !== 0) {
						if (!invoice.hasOwnProperty('sender_address_2')) {
							invoice.sender_address_2 = '';
						}
						if (!invoice.hasOwnProperty('sender_zip_4')) {
							invoice.sender_zip_4 = '';
						}
						if (!invoice.hasOwnProperty('receiver_address_2')) {
							invoice.receiver_address_2 = '';
						} 
						if (!invoice.hasOwnProperty('receiver_zip_4')) {
							invoice.receiver_zip_4 = '';
						}
						invoice.invoice_number = cleanEntry(invoice.invoice_number);
						invoice.sender_name = cleanEntry(invoice.sender_name);
						invoice.sender_address_1 = cleanEntry(invoice.sender_address_1);
						invoice.sender_city = cleanEntry(invoice.sender_city);
						invoice.sender_country = cleanEntry(invoice.sender_country);
						invoice.receiver_name = cleanEntry(invoice.receiver_name);
						invoice.receiver_address_1 = cleanEntry(invoice.receiver_address_1);
						invoice.receiver_city = cleanEntry(invoice.receiver_city);
						invoice.receiver_country = cleanEntry(invoice.receiver_country);
						invoice.transportation_mode = cleanEntry(invoice.transportation_mode);
						invoice.package_type = cleanEntry(invoice.package_type);
						invoice.sender_address_2 = cleanEntry(invoice.sender_address_2);
						invoice.receiver_address_2 = cleanEntry(invoice.receiver_address_2);
						invoice.receiver_zip_4 = cleanEntry(invoice.receiver_zip_4);
						invoice.receiver_zip = cleanEntry(invoice.receiver_zip);
						invoice.sender_zip = cleanEntry(invoice.sender_zip);
						invoice.sender_zip_4 = cleanEntry(invoice.sender_zip_4);
						invoice.carrier_discount = Math.round(sanatizePercent(invoice.carrier_discount) * 100) / 100;
						if (!invoice.accelerated_service) {
							invoice.accelerated_service = false;
						}
						for (i in items) {
							items[i].invoice_number = invoice.invoice_number;
							$scope.totalWeight += parseFloat(items[i].weight);
						}
						invoice.billed_weight = $scope.totalWeight;

						var benchmark = 0;
						for (i in accessorialCharges) {
							accessorialCharges[i].invoice_number = invoice.invoice_number;
							$scope.totalAccessorialCharges += parseFloat(accessorialCharges[i].actual_cost);
							$scope.totalBenchmarkCost += accessorialCharges[i].benchmark_cost;

						}
						invoice.total_associated_costs = $scope.totalAccessorialCharges;
						invoice.total_benchmark = $scope.totalBenchmarkCost;

						$scope.rateShipment(invoice, function() {
							if ($scope.params.invoiceID === "") {
								$http.post('/secure-api/invoice/insert_invoice', {
										invoice: invoice,
										shippedItems: items,
										accessorialCharges: accessorialCharges
									}, config)
									.then(function(reponse) {
										console.log('New Invoice Added');
										$state.reload();
									}, function(err) {
										console.error(err);
									});
							} else {
								$http.put('/secure-api/invoice/update_invoice', {
										invoice: invoice,
										shippedItems: items,
										accessorialCharges: accessorialCharges
									}, config)
									.then(function(response) {
										console.log('Invoice Updated');
										$state.reload();
									}, function(err) {
										console.log(err);
									});
							}
						});
					} else {
						console.log('You must have atleast one item to submit this Invoice');
					}
				}
			};

			$scope.rateShipment = function(invoice, callback) {
				//sender receiver zip codes starts at 1 and 7
				var rateString = (invoice.sender_zip + " " + invoice.receiver_zip + " ");
				//discount entered 10 times starts at 13
				var discount = invoice.carrier_discount * 10000;
				for (var i = 0; i < 10; i++) {
					rateString = rateString + discount;
				}
				//absolute min charge starts at 53
				if (invoice.absolute_min_charge < 100) {
					rateString = rateString + '0' + (invoice.absolute_min_charge * 100);
				} else {
					rateString = rateString + (invoice.absolute_min_charge * 100);
				}
				//fuel surcharge entered twice starts 58
				var ltlSurcharge = (Math.round(invoice.fuel_surcharge * 10000) / 100).toString();
				ltlSurcharge = padding_right(ltlSurcharge, ' ', 6);
				rateString = rateString + ltlSurcharge + ltlSurcharge;
				//padding for weight break
				rateString = rateString + '      ';
				//weight and class x 10 starts at 76
				for (i = 0; i < 10; i++) {
					if ($scope.shippingClasses[i]) {
						var classification = $scope.shippingClasses[i].classification.toString();
						if (classification.length < 4) {
							classification = padding_right(classification, ' ', 4);
						}
						var weight = $scope.shippingClasses[i].weight.toString();
						if (weight.length < 6) {
							weight = padding_left(weight, '0', 6);
						}
						rateString = rateString + classification;
						rateString = rateString + padding_right(weight, ' ', 19);
					}
				}
				//pad out until 406
				rateString = padding_right(rateString, ' ', 405);
				rateString = rateString + 'MARS 500       20010806';
				rateString = padding_right(rateString, ' ', 500);

				var data = {
					rateString: rateString
				};

				$http.put('/secure-api/invoice/test_tcp', data, config)
					.then(function(response) {
						var returnString = response.data;
						$scope.returnString = returnString.replace(/ /g, '&nbsp;');
						for (i = 0; i < 10; i++) {
							var startSliceRate = 85;
							var endSliceRate = 91;
							var startSliceCharge = 91;
							var endSliceCharge = 98;
							var itteration = i * 23;
							if ($scope.shippingClasses[i]) {
								startSliceRate = startSliceRate + itteration;
								endSliceRate = endSliceRate + itteration;
								startSliceCharge = startSliceCharge + itteration;
								endSliceCharge = endSliceCharge + itteration;
								rate = returnString.slice(startSliceRate, endSliceRate);
								rate = [rate.slice(0, -2), '.', rate.slice(-2)].join('');
								$scope.shippingClasses[i].rate = parseFloat(rate);
								charge = returnString.slice(startSliceCharge, endSliceCharge);
								charge = [charge.slice(0, -2), '.', charge.slice(-2)].join('');
								$scope.shippingClasses[i].charge = parseFloat(charge);
							}
						}
						var sum = returnString.slice(318, 326);
						sum = [sum.slice(0, -2), '.', sum.slice(-2)].join('');
						$scope.invoice.rated_sum = parseFloat(sum);

						var totalCharge = returnString.slice(396, 404);
						totalCharge = [totalCharge.slice(0, -2), '.', totalCharge.slice(-2)].join('');
						$scope.invoice.rated_total_charge = parseFloat(totalCharge);
						callback(invoice);
					}, function(err) {
						console.log(err);
						$scope.errors = true;
						switch (err.data) {
							case '01':
								console.log('This tariff is not available');
								$scope.errorsArry.push('This tariff is not available');
								break;
							case '02':
								console.log('Rates are not available for this date');
								$scope.errorsArry.push('Rates are not available for this date');
								break;
							case '03':
								console.log('The origin ZIP Code was not found in this tariff');
								$scope.errorsArry.push('The origin ZIP Code was not found in this tariff');
								break;
							case '04':
								console.log('The destination ZIP Code was not found in this tariff');
								$scope.errorsArry.push('The destination ZIP Code was not found in this tariff');
								break;
							case '05':
								console.log('A rate base number was not found for this pair of ZIP Codes');
								$scope.errorsArry.push('A rate base number was not found for this pair of ZIP Codes');
								break;
							case '06':
								console.log('Tariff data is missing or corrupt');
								$scope.errorsArry.push('Tariff data is missing or corrupt');
								break;
							case '99':
								console.log('Internal system error');
								$scope.errorsArry.push('Internal system error');
								break;
							default:
								$scope.errorsArry.push('We have encountered an unknown error retreiving your shipment rating');
								console.log('We have encountered an unknown error retreiving your shipment rating');
						}
					});
			};

			$scope.autoFillClient = function(clientID) {
				for (var i in $scope.allCompanies) {
					if (clientID === $scope.allCompanies[i].client_id) {
						$scope.invoice.sender_name = $scope.allCompanies[i].client_name;
						$scope.invoice.sender_address_1 = $scope.allCompanies[i].client_address_1;
						$scope.invoice.sender_address_2 = $scope.allCompanies[i].client_address_2;
						$scope.invoice.sender_city = $scope.allCompanies[i].client_city;
						$scope.invoice.sender_zip = $scope.allCompanies[i].client_zip;
						$scope.invoice.sender_zip_4 = $scope.allCompanies[i].client_zip_4;
						$scope.invoice.sender_country = $scope.allCompanies[i].client_country;
						$scope.invoice.sender_state = $scope.allCompanies[i].client_state;
						$scope.invoice.client_id = $scope.allCompanies[i].client_id;
						$scope.invoice.iot_id = 117;
					}
				}
			};

			$scope.addRowItem = function(shippingClasses) {
				if (shippingClasses.length < 10 || shippingClasses.length === undefined) {
					$scope.shippingClasses.push({
						'weight': shippingClasses.weight,
						'classification': shippingClasses.class,
						'invoice_number': shippingClasses.invoice_number
					});
					$scope.PD = {};
				}
				if ($scope.newRow === false) {
					$scope.newRow = true;
				}
			};

			$scope.addRowCharge = function(accessorialCharges) {
				if (accessorialCharges.length < 12 || accessorialCharges.length === undefined) {
					$scope.accessorialCharges.push({
						'actual_cost': accessorialCharges.actual_cost,
						'benchmark_cost': accessorialCharges.benchmark_cost,
						'cost_code': accessorialCharges.cost_code,
						'invoice_number': accessorialCharges.invoice_number
					});
					$scope.PD = {};
				}
				if ($scope.newRow === false) {
					$scope.newRow = true;
				}
			};

			$scope.remove = function() {
				var newDataListItem = [];
				var newItem = 0;
				angular.forEach($scope.shippingClasses, function(selected) {
					if (!selected.selected) {
						newDataListItem.push(selected);
					}
				});
				$scope.shippingClasses = newDataListItem;
				for(var i in $scope.shippingClasses){
					if(!$scope.shippingClasses[i].item_id){
						newItem++;
					}
				}
				var newDataListCharge = [];
				angular.forEach($scope.accessorialCharges, function(selected) {
					if (!selected.selected) {
						newDataListCharge.push(selected);
					}
				});
				$scope.accessorialCharges = newDataListCharge;
				for(i in $scope.accessorialCharges){
					if(!$scope.accessorialCharges[i].cost_id){
						newItem++;
					}
				}

				if($scope.shippingClasses.length < 1){
					$scope.addRowItem($scope.shippingClasses);
				}

				if(newItem < 1 ){
					$scope.newRow = false;
				}
			};

			$scope.fuelChange = function(fuelSurchargeID) {
				for (var i in $scope.allFuelRates) {
					if ($scope.allFuelRates[i].fuel_rate_id === fuelSurchargeID) {
						$scope.invoice.fuel_rate_id = $scope.allFuelRates[i].fuel_rate_id;
						$scope.invoice.fuel_date = $scope.allFuelRates[i].fuel_date;
						$scope.invoice.fuel_rate = $scope.allFuelRates[i].fuel_rate;
						$scope.invoice.fuel_surcharge = $scope.allFuelRates[i].fuel_surcharge;
						break;
					}
				}
			};

			$scope.autoFuelSurcharge = function(shipDate) {
				$scope.invoice.wrongDate = false;
				var day = shipDate.getDay();
				var fuelSurchargeDate = moment(shipDate);
				var monday;
				if (day === 0 || day === 1 || day === 2) {
					monday = moment(fuelSurchargeDate).day(-6);
				} else {
					monday = moment(fuelSurchargeDate).day(1);
				}

				fuelSurchargeDate = new Date(monday._d).toISOString().slice(0, 10);

				for (var i in $scope.allFuelRates) {
					$scope.allFuelRates[i].fuel_date = new Date($scope.allFuelRates[i].fuel_date).toISOString().slice(0, 10);
					if ($scope.allFuelRates[i].fuel_date === fuelSurchargeDate) {
						$scope.invoice.fuel_rate_id = $scope.allFuelRates[i].fuel_rate_id;
						$scope.invoice.fuel_date = $scope.allFuelRates[i].fuel_date;
						$scope.invoice.fuel_rate = $scope.allFuelRates[i].fuel_rate;
						$scope.invoice.fuel_surcharge = $scope.allFuelRates[i].fuel_surcharge;
						break;
					}
				}
			};

			$scope.deleteAccessorialCharge = function(charge) {
				var r = confirm("Are you sure you want to delete this Charge?");
				$scope.totalAccessorialCharges = 0;
				$scope.totalBenchmarkCost = 0;
				for (var i in $scope.accessorialCharges) {
					$scope.totalAccessorialCharges += $scope.accessorialCharges[i].actual_cost;
					$scope.totalBenchmarkCost += $scope.accessorialCharges[i].benchmark_cost;
				}
				$scope.totalAccessorialCharges -= charge.actual_cost;
				$scope.totalBenchmarkCost -= charge.benchmark_cost;
				if (r === true) {
					request = '/secure-api/accessorial_cost_invoice/delete_associated_costs_invoice?' + charge.cost_id + "/" + $scope.totalAccessorialCharges + "&" + $scope.totalBenchmarkCost + "|" + charge.invoice_number;
					$http.delete(request, config)
						.then(function(response) {
							$state.reload();
							console.log('Charge Removed');
						}, function(err) {
							console.log(err);
						});
				}
			};

			$scope.deleteShippingClass = function(item) {
				var r = confirm("Are you sure you want to delete this Item?");
				$scope.totalWeight = 0;
				for (var i in $scope.shippingClasses) {
					$scope.totalWeight += $scope.shippingClasses[i].weight;
				}
				$scope.totalWeight -= item.weight;
				if (r === true) {
					request = '/secure-api/shipping_class_invoice/delete_shipping_class_invoice?' + item.item_id + "/" + $scope.totalWeight + "|" + item.invoice_number;
					$http.delete(request, config)
						.then(function(response) {
							$state.reload();
							console.log('Item Removed');
						}, function(err) {
							console.log(err);
						});
				}
			};

			$scope.changeCharge = function(index, charge) {
				for (var i in $scope.allPrebuiltAccessorial) {
					if ($scope.allPrebuiltAccessorial[i].prebuilt_cost_id === charge.prebuilt_cost_id) {
						$scope.accessorialCharges[index].benchmark_cost = parseFloat($scope.allPrebuiltAccessorial[i].benchmark_cost);
						$scope.accessorialCharges[index].cost_code = $scope.allPrebuiltAccessorial[i].cost_code;
						break;
					}
				}
			};

			$http.get('/secure-api/accessorial_cost/get_prebuilt_associated_costs', config)
				.then(function(response) {
					$scope.allPrebuiltAccessorial = response.data.data;
				}, function(err) {
					console.log(err);
				});
			$http.get('/secure-api/company/get_companies', config)
				.then(function(response) {
					$scope.allCompanies = response.data.data;
				}, function(err) {
					console.log(err);
				});
			$http.get('/secure-api/carrier/get_carriers', config)
				.then(function(response) {
					$scope.allCarriers = response.data.data;
				}, function(err) {
					console.log(err);
				});
			$http.get('/secure-api/iot/get_iot', config)
				.then(function(response) {
					$scope.allIOT = response.data.data;
				}, function(err) {
					console.log(err);
				});
			$http.get('/secure-api/fuel_rates/get_fuel_rates', config)
				.then(function(response) {
					$scope.allFuelRates = response.data.data;
					for (var i in $scope.allFuelRates) {
						$scope.allFuelRates[i].fuel_date = date_parse($scope.allFuelRates[i].fuel_date);
						$scope.allFuelRates[i].fuel_date_display = moment($scope.allFuelRates[i].fuel_date).format('YYYY/MM/DD');
					}
				}, function(err) {
					console.log(err);
				});
			$http.get('/secure-api/operational_area/get_operational_area', config)
				.then(function(response) {
					$scope.allOperations = response.data.data;
				}, function(err) {
					console.log(err);
				});
		}]);
})(window, window.angular);