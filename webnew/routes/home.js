var express = require('express');
var router = express.Router();

router.get('/', function(req, res){
    var uid = req.session.uid;
    var username = req.session.username;
    var data = {};
    if(uid){
        data.signin = true;
        data.username = req.session.username;
    }else{
        data.signin = false;
    }
    res.render('home.ejs', {
        data:data
    });
});

module.exports = router;