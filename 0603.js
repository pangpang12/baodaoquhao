//0523获取学号
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
var obj，j,enroll,finance,jwb,enrollcomplete,financecomplete,jwbcomplete;
// models
//var models = require('./models/models');//初始化  
//var config = models.config;models.orm.initialize(config, function(err, models) {
//    if(err) {
//        console.error('orm initialize failed.', err)
//        return;  
//    }  
//    app.models = models.collections;
//});
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
        cookie: {maxAge:1000*60*60*24},
        resave: false,
        saveUninitialized: true
}));

//var Number_1;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

//连接数据库
var pool = mysql.createPool({
        connectionLimit:8,
        host:'localhost',
        user:'mynode',
        password:'123456',
        database:'Room'
});

//var code;
app.get('/',function(req,res){
    console.log(req.url);

    if (!req.session.No){
        //var 
        var code = url.parse(req.url,true).query.code;
        var link = 'https://qyapi.weixin.qq.com/cgi-bin/user/getuserinfo?access_token='+token+'&code='+code;
        console.log(new Date()+' and the code is '+code+' Now getting the Number...');
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
//                  res.render('website');
////////////////0603
                    pool.getConnection(function(err,connection){
                        if (err) throw err;
                        var query=connection.query('SELECT * FROM Student WHERE Number=?',req.session.No,function(err,ret){
                            if (err) throw err;
                            console.log(ret);
                            ////
                            req.session.Gender=ret[0].Gender;
                            ////
                            res.render('website',{
                                rb:ret[0].RB
                            });
                            connection.release();
                        })
                    })
////////////////0603
                }else{
                    console.dir(body);
                }
            });
        });
//为了获取学号我跟你拼了
        console.log('The req is:'+req.sessionID+' and the Number is:'+req.session.No);
    }else{
    console.log('index  the req is:  '+req.sessionID+'the Number is:    '+req.session.No);
////////////////////
                    pool.getConnection(function(err,connection){
                        if (err) throw err;
                        var query=connection.query('SELECT * FROM Student WHERE Number=?',req.session.No,function(err,ret){
                            if (err) throw err;
                            console.log(ret);
                            req.session.Gender=ret[0].Gender;
                            res.render('website',{
                                rb:ret[0].RB
                            });
                            connection.release();
                        })
                    })
////////////////////
    }
})

app.get('/Rselect',function(req,res){
    console.log('The Student Number is: '+req.session.No+'The req is: '+req.sessionID);
    //pool.getConnection(function(err,connection){
    //  if (err) throw err;
    //  var query = connection.query('SELECT * FROM Student WHERE Number=?',req.session.No,function(err,ret){
    //      if (err) throw err;
    //      console.log(ret);
    //      if (ret[0].RB){
    //          var aa = '同学你已经选择了:'+ret[0].RB+'床位，不能更改';
    //          connection.release();
    //          //return res.redirect('/');
    //          res.render('index0');
    //      }else{
    //      req.session.Gender = ret[0].Gender;
    //      res.render('Rselect',{title:'hehe'});
    //      connection.release();}
    //  });
    //  console.log(query.sql);
    //});
    res.render('Rselect',{
        title:'选择宿舍'
    });

})

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
                sql2=' AND Floor="'+req.body.Floor.trim()+'"';
        }

        req.session.sql = 'SELECT * FROM Choose where Gender="'+req.session.Gender+'" AND Notes is null'+sql1+sql2;
        return res.redirect('/Rlist');
});

app.get('/Rlist',function(req,res){
        pool.getConnection(function(err,connection){
                if (err) throw err;
                var query = connection.query(req.session.sql,function(err,ret){
                        if (err) {
                                throw err;
                                return res.redriect('/');
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

app.get('/selected/:RB',function(req,res){
    console.log('床位选择中...');
    pool.getConnection(function(err,connection){
        if (err) throw err;
        var value = {RB:req.params.RB};
        var query = connection.query('SELECT Notes FROM Choose WHERE RB=?',value.RB,function(err,ret){
            if (err) throw err;
            console.log(ret);
            if (ret[0].Notes){
                connection.release();
                return res.redirect('/Rlist',{
                    title:'没有抢到床位，请重新选择'
                });
            }

            else{
                connection.query('UPDATE Choose SET Notes="'+req.session.No+'" WHERE RB=?',value.RB,function(err,ret){
                    if (err) throw err;
                    console.log(ret);
                });
                connection.query('UPDATE Student SET RB=? WHERE Number="'+req.session.No+'"',value.RB,function(err,ret){
                    if (err) throw err;
                    console.log(ret);
                });
                connection.release();

                res.redriect('/');
                //res.render('selected',{
                //  title:'同学您已抢到床位'+value.RB+'床位不能更改'
                //});
            }
        })
        console.log(query.sql);
    })  

})

//add process_query报道流程查询（lishuo）
app.get('/process',function(req,res){
    // if("1601210613"!=null){
    get_process(res,req.session.No,"aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
    // app.models.pro_query.findOne({stu_id:'1601210613'},function(err,allinfo){
    //     if (err){
    //         console.log(err);
    //     }
    //     console.log(allinfo);
    //     res.render('process',{
    //         title:'报道流程查询',
    //         process:allinfo,
    //     });
    // })
})

function get_process(res,userID,userInfoToken){
        //https://api.mysspku.com/index.php/V2/StudentInfo/getDetail?stuid=STUID&token=TOKEN
        //设置get请求参数
        var get_options={
        host:'api.mysspku.com',
        path:'/index.php/V2/Ssbd/getinfo?stuid='+userID+'&token='+userInfoToken,
        method:'GET',
        rejectUnauthorized: false,
    };
    //  console.log("https://api.mysspku.com/index.php/V2/StudentInfo/getDetail?stuid="+userId+"&token="+userInfoToken);
    var get_req = https.request(get_options,function(response){
        var responseText=[];
        var size=0;
        response.setEncoding('utf8');
        response.on('data',function(data){
            console.log(data);
            responseText.push(data);
            j = JSON.parse(data);
            obj=j.data;
            enrollcomplete=(obj.enrollcomplete=="1");
            financecomplete=(obj.financecomplete=="1");
            jwbcomplete=(obj.jwbcomplete=="1");
            if(j.errcode==40001){
                console.log("学生学号不存在。");
            }
            res.render('process',{
                title:'报道流程查询',
                obj:obj,
                enroll:enrollcomplete,
                finance:financecomplete,
                jwb:jwbcomplete
            });
        // console.log("enroll======")
        // console.log(enroll);
        // console.log("objjjjjjjjjjjj")
        // console.log(obj);
        });

    });

    //对于前面设置请求和json数据进行发送
    //get_req.write(post_str);
    get_req.end();
}

app.listen(80,function(req,res){
    console.log('app is running at port 3000');
});