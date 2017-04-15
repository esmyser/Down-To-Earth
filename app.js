var express      = require('express');
var morgan       = require('morgan');
var bodyParser   = require('body-parser');
var env          = require('./figaro.json');

var app = express();

app.set('views', './views');
app.set('view engine', 'jade');

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended : false }));
app.use(express.static('public'));

app.get('/', function(req, res) {  
  res.render('index', { 
      key: env.key 
  });
});

app.listen(3000, function () {
  console.log('Starting Down To Earth');
});

module.exports = app;