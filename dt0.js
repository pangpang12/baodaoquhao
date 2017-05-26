//加载依赖库
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var crypto = require('crypto');
var cookieParser = require('cookie-parser');
var mysql = require('mysql');
var http = require('http');
var https = require('https');
var url = require('url');
var session = require('express-session');
//get the access_token,code,then get the userid\
var app = express();


app.use(session({
	secret:'1234',
	name:'mydbs',
	cookie:{maxAge:1000*60*6},
	resave:false,
	saveUninitialized: true
}));

var at = require('./wx_token/at.js');
var token=at.access_token;
setTimeout(r,4000);
function r(){
    token=at.access_token;
    console.log(token);
}
//var code;
var No;//='1601210700';

//定义EJS模板引擎和模板文件位置
app.set('views',path.join(__dirname,'views'));
app.set('view engine','ejs');

//定义静态文件目录
app.use(express.static(path.join(__dirname,'public')));

//use the cookie

//定义数据解析器
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({extened:true}),function(req,res){
        res.render('index',{
        title:'Hello'
        });
var code = req.session.code;
if (code){
	getID()
	req.session.No = No;	
}else{
	var arg = url.parse(req.url,true).query;
	req.session.code = arg.code;
	code = req.session.code;
	getID();
	req.session.No = No;

}

function getID(){
	 var link = 'https://qyapi.weixin.qq.com/cgi-bin/user/getuserinfo?access_token='+token+'&code='+code;
	 console.log(new Date());
	 var req = https.get(link,function(res){
	 	var bodyChunks = '';
	 	res.on('data',function(chunk){
	 		bodyChunks +=chunk;
	 	});
	 	res.on('end',function(){
	 		var body = JSON.parse(bodyChunks);
	 		console.log(body);
	 		if (body.UserId){
	 			No = body.UserId;
	 			console.log(No)
	 		}else{
	 			console.dir(body);
	 		}
	 	});

	 });
	 req.on('error',function(e){
	 	console.log('error:'+e.message);
	 });
}	
});

//连接数据库
var connection = mysql.createConnection({
	host:'localhost',
	user:'mynode',
	password:'123456',
	database:'Room'
})

connection.connect(function(err){
	if (err) throw err;

})

//获取当用户的学号以便查询宿舍情况
//var No = '1601210700'; 

//获取该学号同学的性别,然后显示该性别的宿舍
var gender;
//func to get the Gender

//connection.query('select Gender from Student where Number="'+No+'"',function(err,ret){
//	if (err) throw err;
//	console.log(ret);
//	gender = ret[0].Gender;
//	console.log(gender);
//	console.log(typeof(gender));	
//}); 

//在页面中显示的剩余床位数

//相应首页get请求
//app.get('/',function(req,res){
//	res.render('index',{
//		title:'首页',
//	});
//});

app.get('/Rlist',function(req,res,next){
	res.json(req.cookies);
	console.log(req.cookies);
})

//监听3000端口
app.listen(3000,function(req,res){
	console.log('app is running at port 3000');
})

