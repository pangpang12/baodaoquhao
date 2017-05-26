var later = require('later');
var https = require('https');

var corpid = 'wx1d3765eb45497a18';
var corpsecret = 'uJBYD04TA1wGRmp4rA_GMaiLdIhuBUhPIpF3OT9QQvpe9PmixaJSsz3sU-aEq2Dc';
var url = 'https://qyapi.weixin.qq.com/cgi-bin/gettoken?corpid=wx1d3765eb45497a18&corpsecret=uJBYD04TA1wGRmp4rA_GMaiLdIhuBUhPIpF3OT9QQvpe9PmixaJSsz3sU-aEq2Dc';
var access_token;

later.date.localTime();
console.log("Now:" + new Date());

var sched = later.parse.recur().every(2).hour();
next = later.schedule(sched).next(10);
console.log(next);

var timer = later.setInterval(test,sched);
setTimeout(test,1000);

function test(){
	console.log(new Date());
	var req = https.get(url,function(res){
		var bodyChunks = '';
		res.on('data',function(chunk){
			bodyChunks += chunk;
		});
		res.on('end',function(){
			var body = JSON.parse(bodyChunks);
			if (body.access_token){
				access_token = body.access_token;
				console.log(access_token);
				exports.at = access_token;
			}else{
				console.dir(body);
			}
		});
	});
	req.on('error',function(e){
		console.log('error:'+e.message);
	});
}
