(function(window, angular, undefined) {
    angular.module('app', ['ui.router', 'ngSanitize', 'angular.filter'])
        .config(['$urlRouterProvider', '$stateProvider', function($urlRouterProvider, $stateProvider) {
            $stateProvider
                .state('index', {
                    templateUrl: '/src/index.html',
                    controller: 'indexCtrl'
                })
                .state('home', {
                    url: "/",
                    templateUrl: '/src/components/home/home.html',
                    controller: 'homeCtrl'
                })
                .state('login', {
                    url: "/login",
                    templateUrl: '/src/components/user/views/login.html',
                    controller: 'loginCtrl'
                })
                .state('password_recovery', {
                    url: '/password_recovery',
                    templateUrl:'/src/components/user/views/password_recovery.html',
                    controller: 'loginCtrl'
                })
                .state('reset_password', {
                    url:'/reset_password/:userID/:resetCode',
                    templateUrl: '/src/components/user/views/reset_password.html',
                    controller: 'pswdCtrl'
                })
                .state('register', {
                    url: '/register',
                    templateUrl: '/src/components/user/views/register.html',
                    controller: 'registerCtrl'
                })
                .state('manage_users',{
                    url: '/manage_users',
                    templateUrl: 'src/components/user/views/manage_users.html',
                    controller: 'manageUserCtrl'
                })
                .state('profile', {
                    url: '/profile:user',
                    templateUrl:'/src/components/user/views/profile.html',
                    controller: 'profileCtrl'
                })
                .state('company', {
                    url: '/company',
                    templateUrl: '/src/components/company/company.html',
                    controller: 'companyCtrl'
                })
                .state('invoice_configuration', {
                    url: '/invoice_configuration',
                    templateUrl: '/src/components/invoice_configuration/invoice_config.html'
                })
                .state('iot', {
                    url: '/invoice_configuration/iot',
                    templateUrl: '/src/components/invoice_configuration/iot/iot.html',
                    controller: 'iotCtrl'
                })
                .state('fuel_rates', {
                    url: '/invoice_configuration/fuel_rates',
                    templateUrl: '/src/components/invoice_configuration/fuel_rates/fuel_rates.html',
                    controller: 'fuelRatesCtrl'
                })
                .state('operational_area', {
                    url: '/invoice_configuration/operational_area',
                    templateUrl: '/src/components/invoice_configuration/operational_area/operational_area.html',
                    controller: 'operationalAreaCtrl'
                })
                .state('carriers', {
                    url: '/invoice_configuration/carriers',
                    templateUrl: '/src/components/invoice_configuration/carriers/carriers.html',
                    controller: 'carrierCtrl'
                })
                .state('accessorial_cost', {
                    url: '/invoice_configuration/accessorial_cost',
                    templateUrl: '/src/components/invoice_configuration/prebuilt_associated_costs/prebuilt_associated_costs.html',
                    controller: 'accessorialCtrl'
                })
                .state('fsc', {
                    url: '/invoice_configuration/fsc',
                    templateUrl: '/src/components/invoice_configuration/fuel_surcharge_rates/fuel_surcharge_rates.html',
                    controller: 'fscCtrl'
                })
                .state('benchmark_fsc', {
                    url: '/invoice_configuration/benchmark_fsc',
                    templateUrl: '/src/components/invoice_configuration/benchmark_fsc/benchmark_fsc.html',
                    controller: 'benchmarkFSCCtrl'
                })
                .state('state_region', {
                    url: '/invoice_configuration/state_region',
                    templateUrl: 'src/components/invoice_configuration/state_regions/state_regions.html',
                    controller: 'stateRegionCtrl'
                })
                .state('list-invoice', {
                    url: '/invoice',
                    templateUrl: '/src/components/invoice/views/list-invoice.html',
                    controller: 'invoiceListCtrl'
                })
                .state('form-invoice', {
                    url: '/invoice/form-invoice/:invoiceID',
                    templateUrl: '/src/components/invoice/views/form-invoice.html',
                    controller: 'invoiceFormCtrl'
                })
                .state('view-invoice', {
                    url: '/invoice/view-invoice/:invoiceID',
                    templateUrl: '/src/components/invoice/views/view-invoice.html',
                    controller: 'invoiceViewCtrl'
                })
                .state('price-savings', {
                    url: '/invoice/price-savings/:invoiceIDs/:xpoIDs',
                    templateUrl: '/src/components/invoice/views/price-savings.html',
                    controller: 'priceSavingsCtrl'
                })
                .state('view-xpo-invoice', {
                    url:'/invoice/view-xpo-invoice/:invoiceID',
                    templateUrl: '/src/components/invoice/views/view-xpo-invoice.html',
                    controller:'viewXPOInvoice'
                })
                .state('form-xpo-invoice', {
                    url: '/invoice/form-xpo-invoice/:xpoID',
                    templateUrl: '/src/components/invoice/views/form-invoice.html',
                    controller: 'invoiceFormCtrl'
                });
            $urlRouterProvider.otherwise('/');
        }]);
})(window, window.angular);