var express = require('express');
var router  = express.Router();
var ENV     = require('../figaro.json');

// GET Home Page
router.get('/', function(req, res, next) {
    console.log(ENV.key);
    
    res.render('index', { 
        title : 'Down to Earth', 
        key   : ENV.key 
    });
});

module.exports = router;