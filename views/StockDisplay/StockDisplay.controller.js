(function () {
    'use strict';

    angular
        .module('app')
        .controller('StockDisplayController', StockDisplayController);

    StockDisplayController.$inject = ['$filter','$http', '$scope','$location','$timeout','$rootScope'];
    function StockDisplayController($filter, $http, $scope,$location,$timeout,$rootScope){
        $scope.searchBy="productID";
        $scope.isLoading = "Loading Inventory...";
        
        //Current Page setting in NavBar Menu 
        $rootScope.globals.currentUser.currentPage = "stock";
        $rootScope.currentPage();
        
        $scope.filterProducts = function(inventoryItem){
            var flag1 = false;
            $scope.searchBy = document.getElementById("searchBy").value;
            $scope.searchText = document.getElementById("searchText").value;
            if ($scope.searchText != undefined && $scope.searchText != null && $scope.searchText != ''){
                if (($scope.searchBy=='Product Name') && (inventoryItem.pName != null && inventoryItem.pName.toLowerCase().indexOf($scope.searchText.toLowerCase()) != -1)){
                    flag1 = true;
                }  
                else if (($scope.searchBy=='productID') && (inventoryItem.pID != null && inventoryItem.pID.toLowerCase().indexOf($scope.searchText.toLowerCase())!= -1)){
                    flag1 = true;
                } 
                else if (($scope.searchBy=='Company Name') && (inventoryItem.pManufacturer != null && inventoryItem.pManufacturer.toLowerCase().indexOf($scope.searchText.toLowerCase()) != -1)){
                    flag1 = true;
                }
            }
            else{
                flag1 = true;
            }
            return flag1;
        }

        $scope.clearText = function(){
            document.getElementById("searchText").value= "";
        }

        $scope.getAllInventoryItems = function(){
            $http.get('/getAllInventoryItems').success(function(response){
                if(response!=undefined && response.length!=0 ){
                    $scope.count = Object.keys(response).length;
                    $scope.allInventoryItem = response;
                    $scope.isLoading = null;
                }   
                else{
                    $scope.isLoading = "Loading...";
                }
            });
        }

        //Getting a single product id to search the  details of the product 
        $scope.getSinglePID = function(){   
            $scope.productEntryType = 'single';
            $scope.isLoading = "Loading....";
            
            $http.post('/getSinglePID',$scope.product).success(function(response){
                if(response == '"fail"' || response == '"junk data"'){
                    swal({title: "No ID detected!",   text: "Please retry",   type: "error",   confirmButtonText: "ok" });

                }
                else if(response == '"connection_error"'){
                    swal({title: "Connection Error!",   text: "Connection could not be established",   type: "error",   confirmButtonText: "ok" });
                }
                else{
                    $scope.searchText = response;
                    $scope.isLoading = null;
                }
            });
        }
    }
})();