const options = {}
var mysql           = require('mysql');
const express       = require('express');
const app           = express();
var server          = require('http').Server(options, app);
const bodyParser    = require('body-parser');

app.use(express.static('public'));
app.use(bodyParser.json());                                           
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));        
app.use(bodyParser.urlencoded({ extended: true }));                     
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

var connection = mysql.createConnection({
    host : 'localhost',
    user : 'tennisportal',
    password : 'Portal123',
    database : 'projektbazy',
    port: 3306
   });

app.get('/ping', function(request, response){
    response.send(new Date().toISOString())
})

connection.connect(function(err) {
    if (err) {
      console.error('error connecting: ' + err.stack)
    } else {
        console.log("Połączono z bazą danych")
        server.listen(80)
    }
})
