(function () {
    'use strict';
    angular
        .module('app')
        .controller('CustomerHomeController', CustomerHomeController);

    CustomerHomeController.$inject = ['$rootScope', '$location','$timeout'];
    function CustomerHomeController($rootScope, $location,$timeout) 
    {
        var vm = this;
        //Current Page setting in NavBar Menu 
        $rootScope.globals.currentUser.currentPage = "customer";
        $rootScope.currentPage();

        vm.CustomerRegistration = CustomerRegistration;
        vm.CustomerActions = CustomerActions;
        
        function CustomerRegistration()
        {
            $location.path('/customer_registration');
        }
        
        function CustomerActions() 
        {
            $location.path('/customer_actions');
        };
        
    }
})();