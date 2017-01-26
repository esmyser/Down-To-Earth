var express      = require('express');
var favicon      = require('serve-favicon');
var logger       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var routes       = require('./routes/index');

var app = express();

app.set('views', 'views');
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended : false }));
app.use(cookieParser());
app.use(express.static('public'));

app.get('/', function(req, res, next) {
  console.log(ENV.key);
  
  res.render('index', { 
      title : 'Down to Earth', 
      key   : ENV.key 
  });
});