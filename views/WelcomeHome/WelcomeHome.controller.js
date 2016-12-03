(function () {
    'use strict';
    angular
        .module('app')
        .controller('WelcomeHomeController', WelcomeHomeController);

    WelcomeHomeController.$inject = ['$rootScope', '$location'];
    function WelcomeHomeController($rootScope, $location){
        var vm = this;
        vm.login = login;
        $rootScope.menu = $rootScope.action = {
            'display' : "none"
        };

        function login(){
            $location.path('/login_page');
        };
    }
})();