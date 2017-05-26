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

var at = require('./wx_token/at.js');
var token=at.access_token;
setTimeout(r,4000);
function r(){
    token=at.access_token;
    console.log(token);
}
//var code;
//var No;//='1601210700';

//定义EJS模板引擎和模板文件位置
app.set('views',path.join(__dirname,'views'));
app.set('view engine','ejs');

//定义静态文件目录
app.use(express.static(path.join(__dirname,'public')));

app.use(session({
	secret:'1234',
	name:'mydbs',
	cookie:{maxAge:1000*60*6},
	resave:false,
	saveUninitialized: true
}));

//5.18再次更新
var pool = mysql.createPool({
	connectionLimit:8,
	host:'localhost',
	user:'mynode',
	password:'123456',
	database:'Room'
});

//定义数据解析器
var code;
var No;    //date 0510 time 1533
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}),function(req,res,next){
	console.log(req.url);
//date 0520 time 1549
	//var No;
	if (req.url.indexOf('code')!=-1&&code!=url.parse(req.url,true).query.code){
		code=url.parse(req.url,true).query.code;
		console.log('nes code is:'+code);
//date 0520 tiem 1534
		//var No;
		getID();
console.log('Student No. is +'+No);
		//req.session.No=No;
//date 0520 time 1450		req.session.No=No;	
	}
//date 0520 tiem 2204
	if (No){
		req.session.No=No;
		console.log('The session is:'+req.sessionID+';The Student Number is:'+req.session.No);
////////	}
	if (!req.session.Gender){
		pool.getConnection(function(err,connection){
			if (err) throw err;
			var query = connection.query('SELECT * FROM Student WHERE Number=?',req.session.No,function(err,ret){
				if (err) throw err;
				console.log(ret);
				Gender = ret[0].Gender;
				locat = ret[0].Room;
				connection.release();
			});
		})
		req.session.Gender = Gender;
		req.session.locat = locat;
	}
}
//date 0520 time 1502 watch the session id
console.log('the session is:'+req.sessionID+'the Student Number is:'+req.session.No);
	next();

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
//date 0520 time 1425
                              console.log(No);
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
var Gender;
var locat;
app.get('/',function(req,res){
	res.render('index',{
		title:'Hello'
	});
})

app.get('/Rselect',function(req,res){
	console.log('条件');
console.log('tiaojian xingbie=:'+req.session.Gender+req.session.locat);

	if (req.session.locat){
		var aa='同学你已经选择了'+req.session.locat;
		return res.redirect('/',{
			title:aa+',宿舍已选不能更改'
		});
	}
	res.render('Rselect',{
		title:'选择宿舍'
	});

})

//n表示筛选的床位数量
//var roomList;
app.post('/Rselect',function(req,res){
	//date 0521 time 1001
	var sql1;
	var sql2;
console.log('The Gender of the student:'+req.session.Gender+' and the student is:'+req.session.No);
	if (req.body.Apartment.trim()==0){
		sql1='';
	}else {
		sql1=' AND Apartment="'+req.body.Apartment.trim()+'"';
	}	

	if (req.body.Floor.trim()==0){
		sql2='';		
	}else {
		sql2=' AND Floor=+"'+req.body.Floor.trim()+'"';
	}	

	req.session.sql = 'SELECT * FROM Choose where Gender="'+req.session.Gender+'" AND Notes is null'+sql1+sql2;
	return res.redirect('/Rlist');
});

app.get('/Rlist',function(req,res){
	pool.getConnection(function(err,connection){
		if (err) throw err;
		var query = connection.query(req.session.sql,function(err,ret){
			if (err){
				console.log(err);
				return res.redirect('/',{
					title:'Choose again'
				});
			}
			console.log(ret);
			res.render('Rlist',{
				title:'可选宿舍',
				roomList:ret
			});
			connection.release();
		});
		console.log(query.sql);
	}) 
})

app.get('/login',function(req,res){
	console.log('报到流程');
	res.render('login',{
		title:'查看报到进度'
	});
})


//监听3000端口
app.listen(3000,function(req,res){
	console.log('app is running at port 3000');
})

