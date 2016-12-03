(function () {
    'use strict';

    angular
        .module('app')
        .controller('SalesWelcomeController', SalesWelcomeController);

    SalesWelcomeController.$inject = ['$http', '$scope','$location','$timeout','$rootScope'];
    function SalesWelcomeController($http, $scope,$location,$timeout,$rootScope){
        var vm = this;
        $rootScope.menu = {
            'display' : "none"
        };
        $rootScope.action = {
            'display' : "block"
        };
        //$scope.isLoading = "Loading....";
        //var customer = {};
   
        //customer.action = "fetchSingle";
        /*$http.post('/customerActions',customer).success(function(response){
           // console.log(response);
            
            if(response == "not registered"){
                //console.log("Customer is not registered");
                $scope.isLoading = "Loading...."; 
                $timeout(function (){
                   $scope.isLoading = null; 
                }, 2000);
                $scope.user = "Guest";
            }
            else if(response == "connection_error"){
                // when the service connection was not successful
                //console.log("Connection Error");
                $scope.isLoading = "Loading....";
                swal({title: "Connection Error!",   text: "Connection could not be established! Please Refresh",   type: "error",   confirmButtonText: "ok" });
                swal.close();
            }
            else{
                console.log("The user is Registered " + response);
                $scope.isLoading = null;
                $scope.user =response;
            }
            $rootScope.globals.currentUser.customerName= $scope.user;
        });  
*/
        $scope.showBill = function(){
            $location.path('/sales_billing');
        }
    }
})();