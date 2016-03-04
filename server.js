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






app.use(express.static('public'));

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null,__dirname + '/public/images')
  }, 
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)  )
  }
})

var upload = multer({ storage: storage })

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

        "name": req.body.name,
        "password": req.body.password,
        "profession": req.body.profession,
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


app.post('/upload', upload.single('file'), function(req, res) {
 console.log(req.file)
 res.end(JSON.stringify(req.file));
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
        "name": req.body.name,
        "password": req.body.password,
        "profession": req.body.profession,
        "id": editIndex,
        "ProfileImage": ProfileImage
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