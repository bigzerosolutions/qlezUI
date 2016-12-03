(function () {
    'use strict';

    angular
        .module('app')
        .controller('StockInventoryController', StockInventoryController);

    StockInventoryController.$inject = ['$rootScope','$http', '$scope','$filter','$route'];
    function StockInventoryController($rootScope, $http, $scope,$filter,$route){
        //Current Page setting in NavBar Menu
        $rootScope.globals.currentUser.currentPage = "inventory";
        $rootScope.currentPage();

        var date = new Date();
        var options = [];
        var isLoading = null;
        $scope.pID = null;
        $scope.productEntryType = "";
        $scope.InvoiceDate = $filter('date')(new Date(), 'dd-MM-yyyy');
        $scope.isLoading = isLoading;
        $scope.options = options;
        
        $scope.noDecimal = function($event){
            if(isNaN(String.fromCharCode($event.keyCode))){
                $event.preventDefault();
            }
        };

        $scope.onlyOneDecimal3 = function($event){
        var value=document.getElementById("productOffer").value;     
        if($event.keyCode != 46  && (isNaN(String.fromCharCode($event.keyCode))|| $event.keyCode == 32)){
            $event.preventDefault();
        }else if($event.keyCode == 46){
            var chars= value.split('');
            var dotCount = 0;
            if(chars.length>0){
                for (var i = 0; i < chars.length; i++) {
                    if(chars[i] == '.'){
                        dotCount = dotCount + 1;
                    }
                }
            }
            else{
                $event.preventDefault();
            }
            dotCount = dotCount + 1;
            if(dotCount>1){
                $event.preventDefault();
            }
        }
        else{
            var chars= value.split('');
            var dotCount = 0;
            var digitsAfterDecimal = 0; 
            if(chars.length>0){
                for (var i = 0; i < chars.length; i++){
                    if(chars[i] == '.'){
                        dotCount = dotCount + 1;
                    }
                    if(dotCount>0 && chars[i] != '.'){
                        digitsAfterDecimal = digitsAfterDecimal + 1;
                    }
                }
                if(digitsAfterDecimal>1){
                    $event.preventDefault();
                }
            }
        }
    };


        $scope.onlyOneDecimal2 = function($event){
                var value=document.getElementById("productMRP").value;  
                if($event.keyCode != 46  && (isNaN(String.fromCharCode($event.keyCode))|| $event.keyCode == 32)){
                    $event.preventDefault();
                }
                else if($event.keyCode == 46){
                    var chars= value.split('');
                    var dotCount = 0;
                    if(chars.length>0){
                        for (var i = 0; i < chars.length; i++) {
                            if(chars[i] == '.'){
                                dotCount = dotCount + 1;
                            }
                        }
                    }
                    else{
                        $event.preventDefault();
                    }
                    dotCount = dotCount + 1;
                    if(dotCount>1){
                        $event.preventDefault();
                    }
                }
                else{
                    var chars= value.split('');
                    var dotCount = 0;
                    var digitsAfterDecimal = 0; 
                    if(chars.length>0){
                        for (var i = 0; i < chars.length; i++){
                            if(chars[i] == '.'){
                                dotCount = dotCount + 1;
                            }
                            if(dotCount>0 && chars[i] != '.'){
                                digitsAfterDecimal = digitsAfterDecimal + 1;
                            }
                        }
                        if(digitsAfterDecimal>1){
                            $event.preventDefault();
                        }
                    }
                }};
                $scope.onlyOneDecimal1 = function($event){
                    var value=document.getElementById("productTax").value;    
                    if($event.keyCode != 46  && (isNaN(String.fromCharCode($event.keyCode))|| $event.keyCode == 32)){
                        $event.preventDefault();
                    }
                    else if($event.keyCode == 46){
                        var chars= value.split('');
                        var dotCount = 0;
                        if(chars.length>0){
                            for (var i = 0; i < chars.length; i++){
                                if(chars[i] == '.'){
                                    dotCount = dotCount + 1;
                                }
                            }
                        }
                        else{
                            $event.preventDefault();
                        }
                        dotCount = dotCount + 1;
                        if(dotCount>1){
                            $event.preventDefault();
                        }
                    }
                    else{
                        var chars= value.split('');
                        var dotCount = 0;
                        var digitsAfterDecimal = 0; 
                        if(chars.length>0){
                        for (var i = 0; i < chars.length; i++){
                            if(chars[i] == '.'){
                                dotCount = dotCount + 1;
                            }
                            if(dotCount>0 && chars[i] != '.'){
                                digitsAfterDecimal = digitsAfterDecimal + 1;
                            }
                        }
                        if(digitsAfterDecimal>1){
                            $event.preventDefault();
                        }
                    }
                }
            };

            $scope.onlyOneDecimal = function($event){
                var value=document.getElementById("productCost").value;  
                if($event.keyCode != 46  && (isNaN(String.fromCharCode($event.keyCode))|| $event.keyCode == 32)){
                    $event.preventDefault();
                }
                else if($event.keyCode == 46){
                    var chars= value.split('');
                    var dotCount = 0;
                    if(chars.length>0){
                        for (var i = 0; i < chars.length; i++){
                            if(chars[i] == '.'){
                                dotCount = dotCount + 1;
                            }
                        }
                    }
                    else{
                        $event.preventDefault();
                    }
                    dotCount = dotCount + 1;
                    if(dotCount>1){
                        $event.preventDefault();
                    }
                }
                else{
                    var chars= value.split('');
                    var dotCount = 0;
                    var digitsAfterDecimal = 0; 
                    if(chars.length>0){
                    for(var i = 0; i < chars.length; i++){
                        if(chars[i] == '.'){
                            dotCount = dotCount + 1;
                        }
                        if(dotCount>0 && chars[i] != '.'){
                            digitsAfterDecimal = digitsAfterDecimal + 1;
                        }
                    }
                    if(digitsAfterDecimal>1){
                        $event.preventDefault();
                    }
                }
            }
        };
       
        $http.get('/loadCategory',$scope.product).success(function(response){
            if(response != null && response !='"error_connecting_db"' && response !='"fail"' && response !='"connection_error"' ){
                if(response.status=='304'){
                    //Junk Data Detected
                    swal({title: "Junk data detected",   text: "Error Connecting to Service API",   type: "error",   confirmButtonText: "ok" });
                }
                else{
                    for (var i = 0; i < response.length; i++) {
                        $scope.options.push(response[i]);
                    }
                }
            }
            else if(response =='"error_connecting_db"'){
                //Connection to service error
                swal({   title: "Service API error!",   text: "Error Connecting to DB in service API",   type: "error",   confirmButtonText: "ok" });
            }
            else if(response == '"connection_error"'){
                swal({   title: "Connection Error!",   text: "Could not connect to service API",   type: "error",   confirmButtonText: "ok" });
            }
            else{
                swal({   title: "No Data found!",   text: "No Recieve any data",   type: "error",   confirmButtonText: "ok" });    
            }
        });

        $scope.categoryChange = function(){
            var cat = $scope.product.pCategory.category_id;
            if(cat != undefined){ 
                for (var i = 0; i < $scope.options.length; i++){
                    if($scope.options[i].category_id == cat){
                        $scope.product.pTax = $scope.options[i].category_Tax ;
                    }
                }
            }
            else{
                $scope.product.pTax = 12.5;
            }
        }

        $scope.offerPriceChange = function(){
            var op = document.getElementById("productOffer").value;
            if(op != undefined ){ 
                $scope.product.pMrp = op;
            }
        }

        $scope.clearAll = function(){
          $scope.product ={};
        }
        
        $scope.productformSubmit = function(productEntryType){   
            $scope.product.invDate = $scope.InvoiceDate;
            $scope.product.invStaff = $scope.InvoiceStaff;
            $scope.product.cName = $scope.company.Name;
            $scope.product.pID = $scope.pID;
            if($scope.product.Nos == undefined){
                $scope.product.Nos = "0";
            }
            $scope.product.pCategory = $scope.product.pCategory.category_name;
            $scope.isLoading = "Loading....";
            $scope.product.Expiry =  $filter('date')($scope.product.Expiry, 'dd-MM-yyyy');
            $('#singleproduct').modal('hide');
            $http.post('/addProduct',$scope.product).success(function(response){
                $scope.clearAll();
                var message = '';
                if(response == "true"){
                    if(productEntryType=='single'){
                        message = "Product has been added to the database";
                    }
                    else{
                        message = "Products have been added to the database";
                    }
                    $scope.isLoading = null;
                    swal({   title: "Success!",   text:message ,   type: "info",   confirmButtonText: "ok" });
                }
                else if(response == "connection_error"){
                    swal({title: "Connection Error!",   text: "Connection could not be established",   type: "error",   confirmButtonText: "ok" });
                }
                else{
                    $scope.isLoading = null;
                    swal({   title: "Sorry!",   text: "Product could not be added to the database",   type: "error",   confirmButtonText: "ok" });
                }
            });
        };

        //Getting a single product id to insert a single record to db
        $scope.getSingleID = function(){   
            $scope.productEntryType = 'single';
            $scope.isLoading = "Loading....";
            $http.post('/getSinglePID',$scope.product).success(function(response){
                if(response == '"fail"' || response == '"junk data"'){
                    $('#ProductEntry').modal('hide');
                    swal({title: "No ID detected!",   text: "Please retry",   type: "error",   confirmButtonText: "ok" });

                }
                else if(response == '"connection_error"'){
                    $('#ProductEntry').modal('hide');
                    $scope.isLoading = null;
                    swal({title: "Connection Error!",   text: "Connection could not be established",   type: "error",   confirmButtonText: "ok" });
                }
                else{
                    $scope.pID =response;
                    $scope.isLoading = null;
                    response.substr(1, (response.length-2));
                }
            });
        }

        $scope.getBulkPID = function () 
        {
            $scope.productEntryType = 'bulk';
            $scope.isLoading = null;
        }
    }
})();
