(function() {
    'use strict';
    angular
        .module('app')
        .controller('CustomerRegistrationController', CustomerRegistrationController);

    CustomerRegistrationController.$inject = ['$rootScope', '$location', '$timeout','$scope','$http','$route'];

    function CustomerRegistrationController($rootScope, $location, $timeout,$scope,$http,$route){
        //Current Page setting in NavBar Menu 
        $rootScope.globals.currentUser.currentPage = "customer";
        $rootScope.currentPage();
        
        $scope.emailFormat = /^[a-z]+[a-z0-9._]+@[a-z]+\.[a-z.]{2,5}$/;
        $scope.action = "Customer Registration";

        $scope.onlyCharactor = function($event){
            var code = $event.keyCode;
            if((code>=97 && code <=122)||(code>=65 && code <=90)|| code==32){}
            else{         
                $event.preventDefault();
            } 
        }
        var isLoading = "Loading....";
        $scope.isLoading = isLoading;

        $scope.noDecimal = function($event){
            if(isNaN(String.fromCharCode($event.keyCode))){
                $event.preventDefault();
            }
            var value=document.getElementById("customerContact").value;       
            if(!isNaN(String.fromCharCode($event.keyCode))){
                var chars= value.split('');
                if(chars.length >=10){
                    $event.preventDefault();
                }
            }
        };
        
        //Getting a new customer id to insert a single record to db
        $http.post('/getSinglePID',$scope.product).success(function(response){
            if(response == '"fail"' || response == '"junk data"'){
                swal({title: "No ID detected!",   text: "Please retry",   type: "error",   confirmButtonText: "ok" });
            }
            else if(response == '"connection_error"'){
                $scope.isLoading = null;
                swal({title: "Connection Error!",   text: "Connection could not be established",   type: "error",   confirmButtonText: "ok" });
            }
            else{
                $scope.customer.cID = response;
                $scope.isLoading = null;
            }
        });
        
        //Adding Customer to DB
        $scope.customerformSubmit = function(){
            $scope.customer.action = "register";
            $http.post('/customerActions',$scope.customer).success(function(response){
                if(response == "true"){
                    swal({   title: "Success!",   text:"New Customer has been added successfully" ,   type: "info",   confirmButtonText: "ok" });
                    $location.path('/customerHome');
                }
                else{
                    swal({   title: "Failed!",   text:"Failed to add New Customer" ,   type: "info",   confirmButtonText: "ok" });
                }
            });
        }
    }
})();