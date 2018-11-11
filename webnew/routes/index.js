var express = require('express');
var bodyParser = require('body-parser');
var router = express.Router();
var crypto = require('crypto');

var sqlite3 = require('sqlite3').verbose();

router.use(bodyParser.json());

router.get('/', function(req, res){
    var uid = req.session.uid;
    var username = req.session.username;
    var data = {};
    if(uid){
        data.signin = true;
        data.username = req.session.username;
        res.redirect('/home');
    }else{
        res.render('index.ejs', { data:data });
    }
});

router.post('/signup',function(req, res, next) {
    var db = new sqlite3.Database('sql.db');
    data = req.body;

    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if(data.email==""){
        return res.send({error:'email empty error'});
    } else if (data.username==""){
        return res.send({error:'username empty error'});
    } else if (data.password==""){
        return res.send({error:'password empty error'});
    } else if(!re.test(data.email)){
        return res.send({error:'email format error'});
    } else if(data.password.length<6){
        return res.send({error:'password length error'});
    }

    var md5 = crypto.createHash('md5');
    var password = md5.update(data.password).digest('base64');

    db.run("insert into user values(null,(?),(?),(?))",[data.email,password,data.username],function (error) {
        if(error) {
            if (error.code == 'SQLITE_CONSTRAINT') {
                return res.send({error:'unique email error'});
            }
        }else{
            req.session.uid = this.lastID;
            req.session.username = data.username;
            req.session.save();
            data.uid = req.session.uid;
            db.close();
            res.send(data);
        }
    });

});

router.post('/signin',function(req, res) {
    var db = new sqlite3.Database('sql.db');
    data = req.body;
    if(data.email==""){
        return res.send({error:'email empty error'});
    } else if (data.password==""){
        return res.send({error:'password empty error'});
    }
    var md5 = crypto.createHash('md5');
    var password = md5.update(data.password).digest('base64');
    db.all("select * from user where email = (?) and password = (?)",[data.email,password],function (error,data) {
        if(data.length==0) {
            
            return res.send({error:'invalid email or password'});
        }else {
            data=data[0];
            req.session.uid = data.userid;
            req.session.username = data.username;
            req.session.save();
            data.uid = req.session.uid;
            db.close();
            res.send(data);
        }
    });
});
router.get('/logout',function(req, res) {
    req.session.uid = null;
    req.session.username = null;
    req.session.save();
    res.redirect('/');
});
module.exports = router;