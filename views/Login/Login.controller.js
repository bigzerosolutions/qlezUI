(function () {
    'use strict';

    angular
        .module('app')
        .controller('LoginController', LoginController);

    LoginController.$inject = ['$location','$scope','$http','AuthenticationService','$rootScope'];
    
    function LoginController($location,$scope,$http,AuthenticationService,$rootScope){
        var vm = this;
        $rootScope.menu = $rootScope.action = {
            'display' : "none"
        };
        // For any earlier clearing Sessions
        AuthenticationService.ClearCredentials();
        
        $scope.login = function(){  
            $http.post('/loginAuth',$scope.vm).success(function(response){
                if(response == "true"){
                    AuthenticationService.SetCredentials(vm.username, vm.password);
                    if(vm.username == "admin"){
                        $location.path('/app_setting');    
                        $rootScope.globals.currentUser.username = vm.username;
                    }
                    else if(vm.username == "salesman")
                    {
                        $location.path('/sales_welcome');
                        $rootScope.globals.currentUser.username = vm.username; 
                    }
                    else{
                        $location.path('/user_home');   
                    }
                }
                else if(response == "false"){
                    swal({title: "Login Error!",   text: "Login Credentials are not valid",   type: "error",   confirmButtonText: "ok" });
                }
                else{
                    //When the connection was not successfull
                    swal({title: "Connection Error!",   text: "Connection could not be established",   type: "error",   confirmButtonText: "ok" });
                }
            }); 
        };

        $scope.changePassword = function(){
            $http.post('/changeUserPassword',{"userID": vm.userID}).success(function(response){ 

            });
        };  
    }
})();