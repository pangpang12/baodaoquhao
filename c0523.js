////0523获取学号
"use strict"
//加载依赖库
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var crypto = require('crypto');
var mysql = require('mysql');
var http = require('http');
var https = require('https');
var url = require('url');
var session = require('express-session');
//get the access_token,code,then get the userid
var app = express();

var at = require('./wx_token/at.js');
var token=at.access_token;
setTimeout(r,4000);
function r(){
    token=at.access_token;
    console.log(token);
}

//定义EJS模板引擎和模板文件位置
app.set('views',path.join(__dirname,'views'));
app.set('view engine','ejs');

//定义静态文件目录
app.use(express.static(path.join(__dirname,'public')));

//获取UserId
app.use(session({
        secret: '1234',
        name: 'mynode',
        cookie: {maxAge:1000*60*20},
        resave: false,
        saveUninitialized: true
}));

var Number_1;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}),function(req,res,next){
	console.log(req.url);
	////////////////
		if (!req.session.No){
		var code = url.parse(req.url,true).query.code;
		var link = 'https://qyapi.weixin.qq.com/cgi-bin/user/getuserinfo?access_token='+token+'&code='+code;
		console.log(new Date()+' The code is: '+code+' Now getting the Number...');
		var hehe = https.get(link,function(nn){
			var bodyChunks = '';
			nn.on('data',function(chunk){
				bodyChunks += chunk;
			});
			nn.on('end',function(){
				var body = JSON.parse(bodyChunks);
				console.log(body);
				if (body.UserId) {
					req.session.No = body.UserId;
					console.log(req.session.No);
Number_1 = req.session.No;
console.log('Number_1 is'+Number_1);
				}else{
					console.dir(body);
				}
			});
		});
		req.session.No = Number_1;
//为了获取学号我跟你拼了
		console.log('The req is:'+req.sessionID+' and the Number is:'+req.session.No);
	}
        console.log(req.sessionID+' is req and the Number is:'+req.session.No);
	next();
});

//连接数据库
var pool = mysql.createPool({
        connectionLimit:8,
        host:'localhost',
        user:'mynode',
        password:'123456',
        database:'Room'
});


app.get('/',function(req,res){
	res.render('index',{
		title: 'Hello'
	});
})

app.listen(3000,function(req,res){
	console.log('app is running at port 3000');
});
