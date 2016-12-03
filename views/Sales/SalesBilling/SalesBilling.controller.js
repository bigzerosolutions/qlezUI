(function () {
    'use strict';

    angular
        .module('app')
        .controller('SalesBillingController', SalesBillingController);

    SalesBillingController.$inject = ['$filter','$http', '$scope','$location','$timeout','$rootScope'];
    function SalesBillingController($filter, $http, $scope,$location,$timeout,$rootScope) 
    {
        
        $scope.isLoading = "Loading....";
        $scope.isBillLoading = "Loading....";

        //Unique bill number generation
        $scope.date = $filter('date')(new Date(), 'dd-MM-yyyy');
        $scope.time = $filter('date')(new Date(), 'hh:mm:ss a');
        $scope.date1 = $filter('date')(new Date(), 'ddMMyyyy');
        $scope.h = $filter('date')(new Date(), 'hh');
        $scope.m = $filter('date')(new Date(), 'mm');
        $scope.s = $filter('date')(new Date(), 'ss');
        $scope.billNO = $scope.date1+$scope.h+$scope.m+$scope.s;
        $scope.paymentStatus = "Payment Successfull";

        //Bill Generation
        $scope.showBill = function(){
            $scope.user = $rootScope.globals.currentUser.customerName;
            $http.get('/getPurchasedItems').success(function(response){
                $scope.subtotal =0;
                if(response!=undefined && response.length!=0 && response!='fail' && response!='failed now'){
                    $scope.count = Object.keys(response).length;
                    $scope.allPurchasedItems = response;
                    $scope.totalcount = parseInt($scope.allPurchasedItems[0].totalItems);
                    for(var i =0;i< $scope.count;i++){
                        $scope.subtotal = $scope.subtotal + parseInt($scope.allPurchasedItems[i].ptot);    
                    }
                    $scope.isBillLoading = null;
                }
                else{
                    $scope.count=0; 
                    if(response=='fail'){
                        $scope.isBillLoading = "Failed to load all the items"; 
                    } 
                    else if(response.length==0){
                        $scope.isBillLoading = "no Items for billing"; 
                    }
                    else if(response == "connection_error"){
                        $scope.isLoading = "Error connecting to service API";
                    }
                    else{
                        $scope.isBillLoading = "Error fetching items"; 
                    }
                }   
            });
        }

        //when payment is done
        $scope.payment = function(){
            var transaction = {
                "transaction_ID" : $scope.billNO,
                "transaction_timestamp": $scope.date +" " + $scope.time,  
                "trxn_amount": $scope.subtotal
            };
            $http.post('/updateProductDB').success(function(response){
                if(response == "success"){
                    $http.post('/transactionServlet',transaction).success(function(response){
                        if(response == "success"){
                            swal({title: "Payment Successfull",   text: "Have a Wonderfull day",   type: "info",   confirmButtonText: "ok" });
                            $location.path('/userhome');
                        }
                        else{
                            swal({title: "Transaction DB update unsuccessful!",   text: "Please Try again",   type: "error",   confirmButtonText: "ok" });
                            console.log("Updation of Transaction DB Failed");
                        }
                    });
                }
                else{
                    swal({title: "Product DB update unsuccessful!",   text: "Please Try again",   type: "error",   confirmButtonText: "ok" });
                    console.log("Updation of Product DB Failed");
                }
            });
        };
    }
})();