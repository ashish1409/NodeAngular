var express = require('express');
var app = express();
var fs = require("fs")
var path = require('path')
var router = express.Router()
var multer = require('multer')
var uuid = require('node-uuid');
var bodyParser = require('body-parser')
app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
    extended: true
}));
app.use(function(req, res, next) { //allow cross origin requests
    res.setHeader("Access-Control-Allow-Methods", "POST, PUT, OPTIONS, DELETE, GET");
    res.header("Access-Control-Allow-Origin", "http://localhost");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});





app.use(express.static('public'));
app.use(express.static('node-module'));

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null,__dirname + '/public/images')
  }, 
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)  )
  }
})

var upload = multer({ //multer settings
    storage: storage
}).single('file');

// var upload = multer({
//   dest: __dirname + '/public/images',
//   filename: function (req, file, cb) {
//     cb(null, file.fieldname + '-' + Date.now())
//   }
// })

//module.exports = router


app.get('/listUsers', function(req, res) {
    fs.readFile(__dirname + "/" + "users.json", 'utf8', function(err, data) {
        //console.log('ggggggggggggggggggggggggggggggg', guid );
        res.end(data);
    });
})


app.post('/post', function(req, res) {
    var guid = uuid.v1();
    var objIndex = guid
    var user = {

        "product": req.body.product,
        "price": req.body.price,
        "description": req.body.description,
        "quantity": req.body.quantity,
        "id": objIndex,
        "ProfileImage": req.body.ProfileImage
    }

    //console.log(objIndex)
    fs.readFile(__dirname + "/" + "users.json", 'utf8', function(err, data) {
        data = JSON.parse(data);

        data["user" + objIndex] = user;
        console.log(data)

        //console.log( data );
        res.end(JSON.stringify(data));
        fs.writeFile(__dirname + "/" + "users.json", JSON.stringify(data), function(err) {
            if (err) {
                return console.error(err);
            }
            fs.readFile(__dirname + "/" + "users.json", 'utf8', function(err, data) {
                if (err) {
                    return console.error(err);
                }
                //console.log("Asynchronous read: " + data.toString());
            });
        });
    });
})


app.post('/upload',  function(req, res) {
 

    upload(req,res,function(err){
        //var fileDetails = JSON.stringify(req.file)
        if(err){
             res.json({error_code:1,err_desc:err});
             return;
        }
        //console.log(req.file)
         res.json({error_code:0,err_desc:null,fileDetails: req.file});
         //res.end(JSON.stringify(req.file));
    });
})


app.post('/delete', function(req, res) {
    //console.log( req.body);
    var deleteIndex = req.body.id;
    // First read existing users.
    fs.readFile(__dirname + "/" + "users.json", 'utf8', function(err, data) {
        data = JSON.parse(data);
        delete data["user" + deleteIndex];

        //console.log( data );
        res.end(JSON.stringify(data));
        fs.writeFile(__dirname + "/" + "users.json", JSON.stringify(data), function(err) {
            if (err) {
                return console.error(err);
            }
            fs.readFile(__dirname + "/" + "users.json", 'utf8', function(err, data) {
                if (err) {
                    return console.error(err);
                }
                //console.log("Asynchronous read: " + data.toString());
            });
        });


    });
})



app.post('/edit', function(req, res) {


    //console.log( req.body);
    var editIndex = req.body.id;

    var userEdit = {
        "product": req.body.product,
        "price": req.body.price,
        "description": req.body.description,
        "quantity": req.body.quantity,
        "id": objIndex,
        "ProfileImage": req.body.ProfileImage
    }
    // First read existing users.
    fs.readFile(__dirname + "/" + "users.json", 'utf8', function(err, data) {
        data = JSON.parse(data);
        //console.log(data["user" + editIndex]);
        delete data["user" + editIndex];        
        data["user" + editIndex] = userEdit;

        //console.log( data );
        res.end(JSON.stringify(data));
        fs.writeFile(__dirname + "/" + "users.json", JSON.stringify(data), function(err) {
            if (err) {
                return console.error(err);
            }
            fs.readFile(__dirname + "/" + "users.json", 'utf8', function(err, data) {
                if (err) {
                    //console.log(data);
                    return console.error(err);
                }
            });
        });


    });
})



var server = app.listen(8081, function() {

    var host = server.address().address
    var port = server.address().port

    console.log("Example app listening at http://%s:%s", host, port)
})