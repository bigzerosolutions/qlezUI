(function () {
    'use strict';
    angular
        .module('app')
        .controller('UserHomeController', UserHomeController);

    UserHomeController.$inject = ['$rootScope','AuthenticationService', '$location','$timeout'];
    function UserHomeController($rootScope,AuthenticationService, $location,$timeout){
        var vm = this;
        $rootScope.menu = $rootScope.action = {
            'display' : "block"
        };
        
        //Current Page setting in NavBar Menu
        $rootScope.globals.currentUser.currentPage = "home";
        $rootScope.currentPage();
        
        vm.StockInventory = StockInventory;
        vm.CustomerService = CustomerService;
        vm.StockDisplay = StockDisplay;

        function StockDisplay(){
            $location.path('/stock_display');
        }

        function CustomerService(){
            $location.path('/customer_home');
        }
        
        function StockInventory(){
            $location.path('/stock_inventory');
        };
    }
})();