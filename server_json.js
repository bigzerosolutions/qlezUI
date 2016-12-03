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

//CORS middleware
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
var log_file = fs.createWriteStream(__dirname + '/debug.log', {flags : 'w'});
var log_stdout = process.stdout;

console.log = function(d) { //
  log_file.write(util.format(d) + '\n');
  log_stdout.write(util.format(d) + '\n');
};

/******************************************* Login Section *********************************************/

app.post('/loginAuth', function(req , res) 
{
  console.log(req.body);
  var loginJson = [{
                'username': "admin",
                'password': "admin"
            }];
          console.log(loginJson);

          
            if (loginJson[0].username== req.body.username && loginJson[0].password == req.body.password) 
            {
              console.log("Login : The user has been verified.");
              status = true;
              res.json(status);
            }
            else
            {
              console.log("Login : The user is not verified.");
              status = false;
              res.json(status); 
            }
            
    
});

/******************************************* Adding Product to DB *********************************************/

app.post('/addProduct', function(req , res) 
{
    console.log("Add Product : Adding Product to Db Started");
    //console.log("Add Product : " + req.body)
    var data = querystring.stringify(
    {
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
      product_InvoiceStaff: req.body.invStaff,
    });
    //console.log(data);
    var options = 
    {
        host: 'localhost',
        port: 8080,
        path: 'http://localhost:8080/AngularJSWithRestful/AddProduct2DB',
        method: 'POST',
        headers: 
        {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(data)
        }
    };

    var reqst = http.request(options, function(res1) 
    {
        console.log("Add Product : Requesting for add product Service "+ res1.data);
        res1.setEncoding('utf8');
        res1.on('data', function (chunk) 
        {
            console.log("Add Product : Response from the Service API received.");
            console.log("Add Product : Response is : " + chunk);
            if (chunk == "success") 
            {
              console.log("Add Product : Data has been Successfully received at the Service API");
              status =true;
              res.json(status);
            }
            else
            {
              status =false;
              console.log("Add Product : Data has NOT been Successfully delivered to the Service API");
              res.json(status); 
            }
        });
    });
    
    reqst.on('error', function(err) {
      res.json("connection_error");
    });
    reqst.write(data);
    reqst.end();
});

/******************************************* Loading data from Service *********************************************/

app.get('/loadCategory', function(req , res) 
{
  console.log("Load Category : Initiating request to fetch product category list from service");
    //console.log("Load Category : " + req.body)
    var options = [{'category_name':'textiles'},{'category_name':'FMCG'}];

    res.send(options);
});

/******************************************* Customer Registration *********************************************/

app.post('/customerRegister', function(req , res) 
{
    console.log("Customer Register : Adding Customer Details to Db Started");
    //console.log("Customer Register : " + req.body)
    var data = querystring.stringify(
    {
      customer_cID: req.body.cID,
      customer_cName: req.body.cName,
      customer_cContact: req.body.cContact,
      customer_cAddress: req.body.cAddress,
      customer_cDOB: req.body.cDOB,
      customer_cEmail: req.body.cEmail
    });
    console.log(data);
    var options = 
    {
        host: 'localhost',
        port: 8080,
        path: 'http://localhost:8080/AngularJSWithRestful/customerRegisterServlet',
        method: 'POST',
        headers: 
        {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(data)
        }
    };

    var reqst = http.request(options, function(res1) 
    {
        console.log("Customer Register : Requesting for Service ");
        res1.setEncoding('utf8');
        res1.on('data', function (chunk) 
        {
            console.log("Customer Register : Response from the Service API received.");
            console.log("Customer Register : Response is : " + chunk);
            if (chunk == "success") 
            {
              console.log("Customer Register : Data has been Successfully received at the Service API");
              status =true;
              res.json(status);
            }
            else
            {
              status =false;
              console.log("Customer Register : Data has NOT been Successfully delivered to the Service API");
              res.json(status); 
            }
        });
    });
    
    reqst.write(data);
    reqst.end();
});

/******************************************* Getting Single Product ID *********************************************/

app.post('/getSingleID', function(req , res) 
{
    console.log("Single ID : Initiating request to fetch single id from service");
    //console.log(req.body)
     res.send("1234567891");
});

/******************************************* Getting Customer Details *********************************************/

app.post('/customerActions', function(req , res) 
{
    
    console.log("Customer Details : Initiating request to fetch Customer Details from service");
        var customers = [{"customer_Address":"address",
"customer_Contact":"9999999999",
"customer_DOB":"2007-02-01",
"customer_Email":"test@customer.com",
"customer_ID":"E280681000000039F021CAF7",
"customer_Name":"testCustomer1"
},{"customer_Address":"address",
"customer_Contact":"9999999999",
"customer_DOB":"2007-02-01",
"customer_Email":"test@customer.com",
"customer_ID":"E280681000000039F021CAF7",
"customer_Name":"testCustomer2"
}, {"customer_Address":"address",
"customer_Contact":"9999999999",
"customer_DOB":"2007-02-01",
"customer_Email":"test@customer.com",
"customer_ID":"E280681000000039F021CAF7",
"customer_Name":"testCustomer3"
}, {"customer_Address":"address",
"customer_Contact":"9999999999",
"customer_DOB":"2007-02-01",
"customer_Email":"test@customer.com",
"customer_ID":"E280681000000039F021CAF7",
"customer_Name":"testCustomer4"
}, {"customer_Address":"address",
"customer_Contact":"9999999999",
"customer_DOB":"2007-02-01",
"customer_Email":"test@customer.com",
"customer_ID":"E280681000000039F021CAF7",
"customer_Name":"testCustomer5"
}, {"customer_Address":"address",
"customer_Contact":"9999999999",
"customer_DOB":"2007-02-01",
"customer_Email":"test@customer.com",
"customer_ID":"E280681000000039F021CAF7",
"customer_Name":"testCustomer6"
}];
            res.send(customers);
      //res.json("connection_error");
});

app.post('/customerEdit', function(req , res) 
{
    console.log("Customer Details : Initiating request to fetch Customer Details from service");      
            res.send("true");
      //res.json("connection_error");
});

app.post('/customerDelete', function(req , res) 
{
    console.log("Customer Details : Initiating request to fetch Customer Details from service");
            res.send("true");
      //res.json("connection_error");
});

app.post('/setEnv', function(req , res) 
{
      res.send("true");
});

/******************************************* Getting Purchased Item Details *********************************************/

app.get('/getPurchasedItems', function(req , res) 
{
    
    console.log("Purchased Items : Initiating request to fetch Purchased Item Details from service");
    //console.log(req.body)
    var options = 
    {
        host: 'localhost',
        port: 8080,
        path: 'http://localhost:8080/AngularJSWithRestful/PurchasedItemsServlet',
        method: 'POST',
        headers: 
        {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(0)
        }
    };

    var reqst = http.request(options, function(res1) 
    {
        console.log("Purchased Items : Requesting for Service");
        res1.setEncoding('utf8');
        //console.log(testJson);
        res1.on('data', function (chunk) 
        {
            console.log("Purchased Items : Response from the Service API received.");
            //console.log("Response is : " + chunk);
            if (chunk != null) 
            {
              console.log("Purchased Items : Received Purchased Items List");
              res.send(chunk);
            }
            else
            {
              console.log("Purchased Items : No data was received");
              res.send("false"); 
            }
            //console.log(status);
        });
    });
    reqst.on('error', function(err) {
      res.json("connection_error");
    });
    reqst.write('');
    reqst.end();
});


/******************************************* Getting All Inventory Item Details *********************************************/

app.get('/getAllInventoryItems', function(req , res) 
{
  console.log("Inventory Items : Initiating request to fetch product Inventory from service");
    //console.log(req.body)
    var options = 
    {
        host: 'localhost',
        port: 8080,
        path: 'http://localhost:8080/AngularJSWithRestful/completeInventoryServlet',
        method: 'POST',
        headers: 
        {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(0)
        }
    };

    var reqst = http.request(options, function(res1) 
    {
        console.log("Inventory Items : Requesting for Service");
        res1.setEncoding('utf8');
        res1.on('data', function (chunk) 
        {
            console.log("Inventory Items : Response from the Service API received.");
            console.log("Inventory Items : Response is : " + chunk);
            if (chunk != null && chunk != "failed") 
            {
                  console.log("Inventory Items : Recieved Inventory Items");
                  res.send(chunk);
            }
            else
            {
              console.log("Inventory Items : No Inventory Items was received");
              res.json("fail"); 
            }
            //console.log(status);
        });
    });
    reqst.write('');
    reqst.end();
});

process.on('SIGINT', function() {
    process.exit(0);
});


app.listen(port, function () {
  console.log('Application is listening on port '+ port + '!' );
});
console.log("Application has been Initiated");