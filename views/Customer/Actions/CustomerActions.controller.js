(function() {
    'use strict';
    angular
        .module('app')
        .controller('CustomerActionsController', CustomerActionsController);

    CustomerActionsController.$inject = ['$rootScope', '$location', '$timeout','$scope','$http'];

    function CustomerActionsController($rootScope, $location, $timeout,$scope,$http) {
        //Current Page setting in NavBar Menu 
        $rootScope.globals.currentUser.currentPage = "customer";
        $rootScope.currentPage();

        var customers = [];
        var customer = {};
        var searchText = '';
        var customerDOB = '';
        var onEdit = null;

        $scope.searchBy="CustomerID";
        $scope.isLoading = "Loading...."; 
        $scope.filterCards = filterCards;
        $scope.onEdit = onEdit;
        $scope.searchText = searchText;
        $scope.customerDOB = customerDOB;
        $scope.customers = customers;
        $scope.customer = customer;
        $scope.getCustomers = getCustomers;
        $scope.editCustomer = editCustomer;
        $scope.saveCustomers = saveCustomers;
        $scope.deleteCustomers = deleteCustomers;
        
        getCustomers();
        
        //Getting a single customer id to search the  details of that customer 
        $scope.getSingleCID = function(){   
            $scope.productEntryType = 'single';
            $scope.isLoading = "Loading....";
            
            $http.post('/getSingleID',$scope.product).success(function(response){
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

        //Clear Text on dropdown change
        $scope.clearText = function(){
            if($scope.searchBy == 'CustomerID'){
                $scope.custDOB ={
                'display' : "none"
                };
            }
            else{
                $scope.custDOB ={
                'display' : "block"
                };   
            }
            document.getElementById("searchText").value= "";
        }

        //Getting Entire Customers Details
        function getCustomers(){
            $scope.customer.action = "fetchAll";
            $http.post('/customerActions',$scope.customer).success(function(response){
                if(response == "fail"){
                    $timeout(function (){
                       $scope.isLoading = null; 
                    }, 2000);
                    $scope.user = "Guest";
                    $scope.isLoading = "Error in fetching customers!";
                }
                else if(response == "connection_error"){
                    // when the service connection was not successful
                    $scope.isLoading = "Error in fetching customers!";
                    swal({title: "Connection Error!",   text: "Connection could not be established! Please Refresh",   type: "error",   confirmButtonText: "ok" });
                    swal.close();
                }
                else{
                    $scope.isLoading = null;
                    $scope.customers =response;
                }
            });
        }

        //Filtering View according to search
        function filterCards(cost){
            var flag1 = false;
            if ($scope.searchText != undefined && $scope.searchText != null && $scope.searchText != ''){
                if($scope.searchBy == 'CustomerID'){
                    if (cost.customer_ID != null && cost.customer_ID.toLowerCase().indexOf($scope.searchText.toLowerCase()) != -1) {
                    flag1 = true;
                    }
                }
                else{
                    if ((cost.customer_Name != null && cost.customer_Name.toLowerCase().indexOf($scope.searchText.toLowerCase()) != -1) && (cost.customer_DOB != null && cost.customer_DOB.toLowerCase().indexOf($scope.customerDOB.toLowerCase()) != -1)) {
                    flag1 = true;
                    }    
                }
            } 
            else{
                flag1 = true;
            }
            return flag1;
        }

        function editCustomer(customerId){
            for (var i = 0; i < $scope.customers.length; i++){
                if ($scope.customers[i].customer_ID == customerId){
                    $scope.onEdit = customerId;
                }
            }
        };

        //Saving customer after edit
        function saveCustomers(customerId){  
            $scope.editCustomerValues = {
                "action": "edit",
                "cAddress": $scope.customer.customerAddress,
                "cContact": $scope.customer.customerContact,
                "cDOB": $scope.customer.customerDOB,
                "cEmail": $scope.customer.customerEmail,
                "cID":customerId,
                "cName":$scope.customer.customerName
                };
            $scope.customer.action = "edit";
            $http.post('/customerActions',$scope.editCustomerValues).success(function(response){
                if(response == '"fail"' || response == '"junk data"'){
                    swal({title: "Not edited!",   text: "Please retry",   type: "error",   confirmButtonText: "ok" });
                }
                else if(response == '"connection_error"'){
                    $scope.isLoading = null;
                    swal({title: "Connection Error!",   text: "Connection could not be established",   type: "error",   confirmButtonText: "ok" });
                }
                else{
                    for (var i = 0; i < $scope.customers.length; i++){
                        if ($scope.customers[i].Id == customerId){
                            $scope.customers[i].Name = $scope.customerName;
                            $scope.customers[i].City = $scope.customerCity;
                        }
                    }
                    $scope.onEdit = null;
                }
            });
        };

        function deleteCustomers(customerId){
            $scope.deleteCustomerValues ={
                "action": "delete",
                "cID":customerId
                };
            $http.post('/customerActions',$scope.deleteCustomerValues).success(function(response){
                if(response == '"fail"' || response == '"junk data"'){
                    swal({title: "Not deleted!",   text: "Please retry",   type: "error",   confirmButtonText: "ok" });
                }
                else if(response == '"connection_error"'){
                    $scope.isLoading = null;
                    swal({title: "Connection Error!",   text: "Connection could not be established",   type: "error",   confirmButtonText: "ok" });
                }
                else{
                    for(var i = $scope.customers.length - 1; i >= 0; i--){
                        if($scope.customers[i].Id === customerId){
                            $scope.customers.splice(i, 1);
                        }
                        getCustomers();
                    }                    
                }
            });
        };
    }
})();
