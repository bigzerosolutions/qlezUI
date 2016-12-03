(function () {
    'use strict';

    angular
        .module('app', ['ngRoute', 'ngCookies'])
        .config(config)
        .controller('appController', appController)
        .run(run);
        

    config.$inject = ['$routeProvider', '$locationProvider'];
    function config($routeProvider, $locationProvider) {
        $routeProvider
            .when('/welcome_home', {
                controller: 'WelcomeHomeController',
                templateUrl: 'views/WelcomeHome/WelcomeHome.view.html',
                controllerAs: 'vm'
            })

            .when('/app_setting', {
                controller: 'ServiceChangeController',
                templateUrl: 'views/UserHome/service_Change.view.html',
                controllerAs: 'vm'
            })

            .when('/user_home', {
                controller: 'UserHomeController',
                templateUrl: 'views/UserHome/UserHome.view.html',
                controllerAs: 'vm'
            })

            .when('/login_page', {
                controller: 'LoginController',
                templateUrl: 'views/Login/Login.view.html',
                controllerAs: 'vm'
            })

            .when('/stock_inventory', {
                controller: 'StockInventoryController',
                templateUrl: 'views/StockInventory/StockInventory.view.html',
                controllerAs: 'product'
            })
            .when('/thankyou_page', {
                controller: 'ThankYouController',
                templateUrl: 'views/ThankYou/ThankYou.view.html',
                controllerAs: 'thankyou'
            })
            .when('/stock_display', {
                controller: 'StockDisplayController',
                templateUrl: 'views/StockDisplay/StockDisplay.view.html',
                controllerAs: 'vm'
            })
            .when('/sales_welcome', {
                controller: 'SalesWelcomeController',
                templateUrl: 'views/Sales/SalesWelcome/SalesWelcome.view.html',
                controllerAs: 'vm'
            })
            .when('/sales_billing', {
                controller: 'SalesBillingController',
                templateUrl: 'views/Sales/SalesBilling/SalesBilling.view.html',
                controllerAs: 'vm'
            })
            .when('/customer_home', {
                controller: 'CustomerHomeController',
                templateUrl: 'views/Customer/Home/CustomerHome.view.html',
                controllerAs: 'vm'
            })

            .when('/customer_registration', {
                controller: 'CustomerRegistrationController',
                templateUrl: 'views/Customer/Registration/CustomerRegistration.view.html',
                controllerAs: 'customer'
            })

            .when('/customer_actions', {
                controller: 'CustomerActionsController',
                templateUrl: 'views/Customer/Actions/CustomerActions.view.html',
                controllerAs: 'vm'
            })
            .otherwise({ redirectTo: '/welcome_home' });
    }

    run.$inject = ['$rootScope', '$location', '$cookieStore', '$http'];
    function run($rootScope, $location, $cookieStore, $http,AuthenticationService) {
        // keep user logged in after page refresh
        $rootScope.globals = $cookieStore.get('globals') || {};
        if ($rootScope.globals.currentUser) {
            $http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.authdata; // jshint ignore:line
        }
 
        $rootScope.$on('$locationChangeStart', function (event, next, current) {
            // redirect to login page if not logged in and trying to access a restricted page
            var restrictedPage = $.inArray($location.path(), ['/welcome_home', '/login_page']) === -1;
            var loggedIn = $rootScope.globals.currentUser;
            if (restrictedPage && !loggedIn) {
                $location.path('/welcome_home');
            }
        });
    }

     appController.$inject = ['$rootScope','$http', '$scope','$filter','$timeout','$route','AuthenticationService','$location'];
    function appController($rootScope, $http, $scope,$filter,$timeout,$route,AuthenticationService,$location) 
    {
        //console.log("user: "+$rootScope.globals.currentUser);
        if($rootScope.globals.currentUser != null){
            $scope.InvoiceStaff = $rootScope.globals.currentUser.username;
            $scope.Menu = "Menu";
            $scope.Home = "Home";
            $scope.Sales = "Sales";
            $scope.Customer = "Customer";
            $scope.Inventory = "Inventory";
            $scope.Stock = "Stock";
        }

        $scope.Logout = function(){
            AuthenticationService.ClearCredentials();
            $scope.InvoiceStaff = null;
            $rootScope.menu = $rootScope.action = {
            'display' : "none"
            };
            $location.path('/thankyou_page');
        }
        $rootScope.currentPage = function(){

            var page = $rootScope.globals.currentUser.currentPage;
            switch(page) {
                case "home":
                        $rootScope.home = {
                        'background-color': "#eee",
                        'cursor': "default"
                        };
                        $rootScope.inventory = $rootScope.sales = $rootScope.customer = $rootScope.stock ={
                        'background-color': "#fff",
                        'cursor' : "pointer"
                        };
                    break;
                case "inventory":
                        $rootScope.inventory = {
                        'background-color': "#eee",
                        'cursor': "default"
                        };
                        $rootScope.home = $rootScope.sales = $rootScope.customer = $rootScope.stock ={
                        'background-color': "#fff",
                        'cursor' : "pointer"
                        };
                    break;
                case "sales":
                        $rootScope.sales = {
                        'background-color': "#eee",
                        'cursor': "default"
                        };
                        $rootScope.inventory = $rootScope.home = $rootScope.customer = $rootScope.stock ={
                        'background-color': "#fff",
                        'cursor' : "pointer"
                        };
                    break;
                case "customer":
                        $rootScope.customer = {
                        'background-color': "#eee",
                        'cursor': "default"
                        };
                        $rootScope.inventory = $rootScope.home = $rootScope.sales = $rootScope.stock ={
                        'background-color': "#fff",
                        'cursor' : "pointer"
                        };
                    break;
                case "stock":
                        $rootScope.stock = {
                        'background-color': "#eee",
                        'cursor': "default"
                        };
                        $rootScope.inventory = $rootScope.home = $rootScope.customer = $rootScope.sales ={
                        'background-color': "#fff",
                        'cursor' : "pointer"
                        };
                    break;
                default:
                    
                }
            if (page=="home") 
            {
                $rootScope.home = {
                'background-color': "#eee",
                'cursor': "default"
                };
            }
        }
    }

    /*app.use(session({
        cookieName: 'session',
        secret: 'random_string_goes_here',
        duration: 30 * 60 * 1000,
        activeDuration: 5 * 60 * 1000,
    }));*/

})();