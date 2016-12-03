var port = process.env.PORT || 5000; 
var express = require('express');
var app = express();
//var mongojs = require('mongojs');
//var db = mongojs('billDB',['login']);
//var morgan = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
//var nodemailer = require("nodemailer");
//var smtpTransport = require("nodemailer-smtp-transport");
var querystring = require('querystring');
var http = require('http');
var path = require('path');
var session = require('express-session');
var aesjs = require('aes-js');
var jsonfile = require('jsonfile');
var file = '/tmp/data.json';
var parseurl = require('parseurl');
var request = require('request');

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}))

app.use(function (req, res, next) {
  var views = req.session.views
  if (!views) {
    views = req.session.views = {}
  }
  // get the url pathname
  var pathname = parseurl(req).pathname;

  // count the views
  views[pathname] = (views[pathname] || 0) + 1
  //console.log("views: "+req.url);
  next()
})

app.get('/', function (req, res, next) {
  if(req.session.views['/'] >=2 ){
   next();}
   else{
    res.redirect("#/homepage");
   }
  //res.send('you viewed this page ' + req.session.views['/'] + ' times')
})


var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', 'example.com');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
}

app.use("/", express.static(path.join(__dirname, 'public')));
app.use('app-content', express.static(__dirname, + '/app-content'));
app.use('app-services', express.static(__dirname, + '/app-services'));
app.use('views', express.static(__dirname, + '/views'));
app.use('', express.static(__dirname, + '/home'));

//app.use(morgan('dev'));1
app.use(bodyParser.urlencoded({'extended': 'true'}));
app.use(bodyParser.json()); // parse application/json
app.use(bodyParser.json({type: 'application/vnd.api+json'})); // parse application/vnd.api+json as json
app.use(methodOverride('X-HTTP-Method-Override')); 
app.use(allowCrossDomain);

app.get('/',function(req,res){
   res.sendFile('index.html',{root: __dirname });
});

var key = aesjs.util.convertStringToBytes("mdfyhdbk12yhnopu");
var iv = aesjs.util.convertStringToBytes("IVMustBe16Bytes.");
var status = false;

var ecode ={"key": key, "iv":iv};

app.get('/getcode', function(req , res) 
{
  res.json(ecode);
});

//For Log Saving
var fs = require('fs');
var util = require('util');
/*var log_file = fs.createWriteStream(__dirname + '/debug.log', {flags : 'w'});
*/var log_stdout = process.stdout;
var baseAPIurl = 'http://localhost:8080/AngularJSWithRestful';

console.log = function(d) { //
  log_file.write(util.format(d) + '\n');
  log_stdout.write(util.format(d) + '\n');
};

/******************************************* Login Section *********************************************/

app.post('/loginAuth', function(req , res) 
{
    request({
      uri: "http://localhost:8080/AngularJSWithRestful/LoginServlet",
      method: "POST",
      form: {
        username: req.body.username,
        password: req.body.password
      },
      timeout: 5000,
    }, 
    function(success, response, body) {
      if(body == "success")
      {
          console.log("Login : The user has been verified.");
          res.send("true");
      }
      else
      {
          console.log("Login : The user is not verified.");
          res.send("false");
      }
    });
});

/******************************************* Adding Product to DB *********************************************/

app.post('/addProduct', function(req , res) 
{
    console.log("Add Product : Adding Product to Db Started");
    request({
      uri: "http://localhost:8080/AngularJSWithRestful/AddProduct",
      method: "POST",
      form: {
          product_ID: req.body.pID,
          product_NOS: req.body.Nos,
          product_Name: req.body.pName,
          product_Manufacturer: req.body.cName,
          product_Category: req.body.pCategory,
          product_Desc: req.body.pDesc,
          product_Cost: req.body.pCost,
          product_Mrp: req.body.pMrp,
          product_OfferPrice: req.body.offerprice,
          product_Tax: req.body.pTax,
          product_Expiry: req.body.Expiry,
          product_InvoiceDate: req.body.invDate,
          product_InvoiceStaff: req.body.invStaff
      },
      timeout: 15000,
    }, 
    function(success, response, body) {
      if(body == "success")
      {
          console.log("Add Product : Data has been Successfully received at the Service API");
          res.send("true");
      }
      else
      {
          console.log("Add Product : Data has NOT been Successfully delivered to the Service API");
          res.send("false");
      }
    });
});

/******************************************* Loading data from Service *********************************************/

app.get('/loadCategory', function(req , res) 
{
    console.log("Load Category : Initiating request to fetch product category list from service");
    request({
      uri: "http://localhost:8080/AngularJSWithRestful/LoadCategoryServlet",
      method: "POST",
      timeout: 5000,
    }, 
    function(success, response, body) {
      if(body == "fail")
      {
          console.log("Load Category : No Product List was received");
          res.send("fail");
      }
      else
      {
          //console.log("Load Category : Product List received : " + body);
          res.send(body);          
      }
    });
});

/******************************************* Customer Registration *********************************************/

app.post('/customerActions', function(req , res) 
{
    console.log("Customer Register : Customer Action "+req.body.action+" Started");
    var data = {};
    switch(req.body.action) {
    case "fetchAll":
        data = {actionRequired : req.body.action};
        break;
    case "fetchSingle":
        data = {actionRequired : req.body.action};
        break;
    case "edit":
        data = {actionRequired : req.body.action,
                customer_cID: req.body.cID,
                customer_cName: req.body.cName,
                customer_cContact: req.body.cContact,
                customer_cAddress: req.body.cAddress,
                customer_cDOB: req.body.cDOB,
                customer_cEmail: req.body.cEmail
                };
        break;
    case "delete":
        data = {actionRequired : req.body.action,
                customer_ID: req.body.cID};
        break;
    case "register":
        data = {actionRequired : req.body.action,
                customer_cID: req.body.cID,
                customer_cName: req.body.cName,
                customer_cContact: req.body.cContact,
                customer_cAddress: req.body.cAddress,
                customer_cDOB: req.body.cDOB,
                customer_cEmail: req.body.cEmail
                };
        break;
    default:
        data = {actionRequired : req.body.action};
    }
    request({
      uri: "http://localhost:8080/AngularJSWithRestful/customerServlet",
      method: "POST",
      form: data,
      timeout: 15000,
    }, 
    function(success, response, body) {
      if(body == "Customer_addition_successful")
      {
          console.log("Customer Register : Data has been Successfully Added");
          res.send("true");
      }
      else if(body == "Customer_addition_failed")
      {
          console.log("Customer Register : Data has NOT been Successfully Added");
          res.send("false");
      }
      else if(body == "No_Items_Found")
      {
        console.log("All Customer Details : No Item was Found");
      }
      else if(body == "Customer_Deletion_Successful")
      {
        console.log("Customer Delete : Deleted Successfully");
        res.send("success")
      }
      else if(body =="Customer_Deletion_Unsuccessful")
      {
        console.log("Customer Delete : Deletion was unsuccessful");
      }
      else if (body == "No_Action_Requested") 
      {
        console.log("Please set some action request");
        res.send("false")
      }
      else
      {
        console.log("Data Received");
        res.send(body);
      }
    });
});


/******************************************* Getting Single Product ID *********************************************/

app.post('/getSingleID', function(req , res) 
{
      console.log("Single ID : Initiating request to fetch single id from service");
      request({
      uri: "http://localhost:8080/AngularJSWithRestful/InventoryServlet",
      method: "POST",
      timeout: 15000,
      }, 
      function(success, response, body) {
        if(body == "fail")
        {
            console.log("Single ID : No Product ID was received");
            res.send("fail");
        }
        else
        {
            console.log("Single ID : Recieved ID "+ body);
            res.send(body);
        }
      });
  
});


/******************************************* Setting  *********************************************/

app.post('/setEnv', function(req , res) 
{
    key_value = req.body.Env_key;
    console.log("setEnv : Initiating request to set Env from service "+req.body.Env_key);
    request({
      uri: "http://localhost:8080/AngularJSWithRestful/SetEnvironmentServlet",
      method: "POST",
      form: {
        key : key_value
      },
      timeout: 15000,
      }, 
      function(success, response, body) {
        if(body == "fail")
        {
            console.log("setEnv : Environment Setting was not successful");
            res.send("fail");
        }
        else
        {
            console.log("setEnv : Settings have done Successfully");
            res.send(body);
        }
      });
      //res.send("true");
});
/******************************************* Getting Purchased Item Details *********************************************/

app.get('/getPurchasedItems', function(req , res) 
{
    
    console.log("Purchased Items : Initiating request to fetch Purchased Item Details from service");
     request({
      uri: "http://localhost:8080/AngularJSWithRestful/PurchasedItems",
      method: "POST",
      timeout: 15000,
      }, 
      function(success, response, body) {
        if(body == "fail")
        {
            console.log("Purchased Items : No Product Details was received");
            res.send("fail");
        }
        else
        {
            console.log("Purchased Items : Recieved Product Details");
            res.send(body);
        }
      });
    
});


app.post('/transactionServlet', function(req , res) 
{
    console.log("transaction : Initiating payment request.");
     request({
      uri: "http://localhost:8080/AngularJSWithRestful/transactionServlet",
      method: "POST",
      form:{
        t_ID : req.body.transaction_ID,
        t_timestamp: req.body.transaction_timestamp,
        t_amount: req.body.trxn_amount
      },
      timeout: 15000,
      },
      function(success, response, body) {
        if(body == "fail")
        {
            console.log("Purchased Items : No Product Details was received");
            res.send("fail");
        }
        else
        {
            console.log("Purchased Items : Recieved Product Details");
            res.send(body);
        }
      });
    
});


/******************************************* Getting All Inventory Item Details *********************************************/

app.get('/getAllInventoryItems', function(req , res) 
{
    console.log("Inventory Items : Initiating request to fetch product Inventory from service");
    request({
      uri: "http://localhost:8080/AngularJSWithRestful/CompleteInventoryServlet",
      method: "POST",
      timeout: 5000,
    }, 
    function(success, response, body) {
      if(body == "fail")
      {
          console.log("Inventory Items : No Product List was received");
          res.send("fail");
      }
      else
      {
          //console.log("Inventory Items : Product List received : " + body);
          res.send(body);          
      }
    });
});

/******************************************* Forgot Password *********************************************/

app.post('/changeUserPassword', function(req , res) 
{
    console.log("Change Password : Change Password function called");
    request({
      uri: "http://localhost:8080/AngularJSWithRestful/changePasswordServlet",
      method: "POST",
      form: {
        username: req.body.userID
      },
      timeout: 5000,
    }, 
    function(success, response, body) {
      if(body == "fail")
      {
          console.log("Change Password : Password change link was not sent");
          res.send("fail");
      }
      else
      {
          console.log("Change Password : Password Reset link sent Successfully");
          res.send(body);          
      }
    });
});

/******************************************* Updating DB after payment *********************************************/

app.post('/updateProductDB', function(req , res) 
{
    console.log("Update Product Table : Change Password function called");

    request({
      uri: "http://localhost:8080/AngularJSWithRestful/UpdateProductTableServlet",
      method: "POST",
      timeout: 5000,
    }, 
    function(success, response, body) {
      if(body == "failed")
      {
          console.log("Update Product Table : Product table was not updated Successfully");
          res.send("fail");
      }
      else
      {
          console.log("Update Product Table : Product table updated Successfully");
          res.send(body);          
      }
    });
});

process.on('SIGINT', function() {
    process.exit(0);
});


app.listen(port, function () {
  console.log('Application is listening on port '+ port + '!' );
});
console.log("Application has been Initiated");
