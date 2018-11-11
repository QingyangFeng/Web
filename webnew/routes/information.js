var express = require('express');
var bodyParser = require('body-parser');
var nodemailer=require('nodemailer');

var multer = require('multer')
var router = express.Router();

var sqlite3 = require('sqlite3').verbose();

router.use(bodyParser.json());

router.get('/',function (req, res){
    var uid = req.session.uid;
    if(uid){
        res.render('information.ejs', {data: {type:'information',signin:true, username: req.session.username}});
    }else{
        res.render('information.ejs', {data: {type:'information'}});
    }
    var username = req.session.username;
});


router.get('/report/:id',function (req, res){
    var db = new sqlite3.Database('sql.db');
    result={};
    db.serialize(function() {
        db.all("SELECT report.*,user.email,user.username FROM report,user WHERE report.userid=user.userid and report.reportid=(?)", [req.params.id], function (error, data) {
            result.data=data[0];
        });

        db.all("SELECT comment.content,comment.reportid, comment.time, comment.userid,user.username FROM comment, user WHERE comment.userid = user.userid and comment.reportid=(?)", [req.params.id], function (error, data) {
            db.close();
            result.comments = data;
            var uid = req.session.uid;
            if(uid){
                result.data.signin=true;
                result.data.uid=uid;
                result.data.username=req.session.username;
            }
            return res.render('detail.ejs', result);
        });
    });
    //404
});

router.post('/submitEvent',function (req, res){
    var uid = req.session.uid;
    if(!uid){
        res.send({});
    }
    var db = new sqlite3.Database('sql.db');
    data = req.body;
    var d=new Date();
    date = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
    db.run("insert into report values(null,(?),(?),(?),(?),(?),(?))",[
        data.location,
        uid,
        data.description,
        data.title,
        data.image,
        date
    ],function (error,data) {
        return res.send('success');

    });
});


router.post('/upImage', function(req, res) {
    const upload = multer({storage: multer.diskStorage({
        destination: function (req, file, callback) {
            callback(null, __dirname + '/../public/img/')
        },
        filename: function (req, file, callback) {
            var fileFormat = (file.originalname).split(".")
            callback(null, file.originalname)
        }
    })});
    const Postupload = upload.single('file');
    Postupload(req, res, function (err) {
        if(err){
            return  console.log(err)
        }else{
            res.send(true)
        }
    })
});

router.get('/loadData',function (req, res){
    var db = new sqlite3.Database('sql.db');

    db.all("select * from report",function (error,data) {
        res.send(data);
    });
});


router.post('/submitComment', function(req, res) {
    uid = req.session.uid;
    if(!uid){
        console.log('uid not');
    }
    var db = new sqlite3.Database('sql.db');
    var d=new Date();
    var date = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
    db.run("insert into comment values(null,(?),(?),(?),(?))",[
        req.body.content,
        req.body.rid,
        uid,
        date
    ],function (error,data) {
        return res.send('success');
    });
});




module.exports = router;