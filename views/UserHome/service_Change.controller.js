(function () {
    'use strict';
    angular
        .module('app')
        .controller('ServiceChangeController', ServiceChangeController);

    ServiceChangeController.$inject = ['$rootScope','$scope', '$location','$http'];
    
    function ServiceChangeController($rootScope,$scope, $location,$http){
        $rootScope.menu = $rootScope.action = {
            'display' : "none"
        };
        var key = "no_Hardware";
        $scope.key =key;
        
        $scope.setEnv = function(Env){  
            if(Env=='Prod'){
                $scope.key = "Hardware";
            }
            $http.post('/setEnv',{"Env_key": $scope.key}).success(function(response){   
                if(response == "true"){
                    var test = $location.path('/user_home');
                }
                else if(response == "false"){
                    console.log("Setting : Env is not set.");
                    swal({title: "Setting Error!",   text: "Connection issue.",   type: "error",   confirmButtonText: "ok" });
                }
                else{
                    //When the connection was not successfull
                    swal({title: "Connection Error!",   text: "Connection could not be established",   type: "error",   confirmButtonText: "ok" });
                }
            }); 
        };
    }
})();