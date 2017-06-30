<?php
session_start();
header("Content-Type:text/html;charset=utf-8"); 
?>
<?php
//获取code access_token 签名类
class QuHao{
	
    private $appId='wx1d3765eb45497a18';
   	private $appSecret='uJBYD04TA1wGRmp4rA_GMaiLdIhuBUhPIpF3OT9QQvpe9PmixaJSsz3sU-aEq2Dc';


   	private function httpGet($url) {

   	    $res = file_get_contents($url); //获取文件内容或获取网络请求的内容
      	$result = json_decode($res); //接受一个 JSON 格式的字符串并且把它转换为 PHP 变量
      	return $result;
    	}


    private function getAccessToken() {
////////////////
    $data = json_decode($this->get_php_file("access_token.php"));
    if ($data->expire_time < time()) {
	$url = "https://qyapi.weixin.qq.com/cgi-bin/gettoken?corpid=$this->appId&corpsecret=$this->appSecret";
	$res = $this->httpGet($url);
	$access_token = $res->access_token;
	$data->expire_time = time() +7000;
	$data->access_token = $access_token;
	$this->set_php_file("access_token.php",json_encode($data));
    } else {
	$access_token = $data->access_token;
    }
    return $access_token;
////////////////
      //$data = json_decode(file_get_contents("access_token.php"));
      //if ($data->expire_time< time()) {
        //$url = "https://qyapi.weixin.qq.com/cgi-bin/gettoken?corpid=$this->appId&corpsecret=$this->appSecret";
        //$res = $this->httpGet($url);
        //$access_token = $res->access_token;
        //$data->expire_time= time() + 7000;
        //$data->access_token = $access_token;
        //$fp = fopen("access_token.php", "w");
        //fwrite($fp, json_encode($data));
        //fclose($fp);
      //} else {
        //$access_token = $data->access_token;
      //}
        //return $access_token;
    }

  	private function get_StudentNumber() {

    	$a ="https://qyapi.weixin.qq.com/cgi-bin/user/getuserinfo?access_token=";
    	$b ="&code=";
    	$access_token = $this-> getAccessToken();
    	$code = trim(substr($_SERVER["QUERY_STRING"],5,-8));
    	$number_url = $a.$access_token.$b.$code;
    	$res= file_get_contents($number_url); 
    	$result = json_decode($res); 
      $studentnumber = $result->UserId;
    	return $studentnumber;
  	}


    public function set_session() {

      $res = $this->get_StudentNumber();
      if (!$res)
      exit("请您注册之后再取号");
      if (!isset($_SESSION['number']))
        $_SESSION['number'] = $res;
      //echo "同学您的学号为:".$_SESSION['number']."<br/>";
    }

	  private function createNonceStr($length = 16) {
	    $chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
	    $str = "";
	    for ($i = 0; $i < $length; $i++) {
	      $str .= substr($chars, mt_rand(0, strlen($chars) - 1), 1);
	    }
	    return $str;
	  }

	  private function getJsApiTicket() {
////////////////
	    $data = json_decode($this->get_php_file("jsapi_ticket.php"));
	    if ($data->expire_time < time()){
		$accessToken = $this->getAccessToken();
		$url = "https://qyapi.weixin.qq.com/cgi-bin/get_jsapi_ticket?access_token=$accessToken";
              $res = file_get_contents($url);
	      $res2 = substr($res,37);
              $ticket = substr($res2,0,-20);
              $data->expire_time = time() + 7000;
              $data->jsapi_ticket= $ticket;
	      $this->set_php_file("jsapi_ticket.php", json_encode($data));	
	    }else{
	      $ticket = $data->jsapi_ticket;
	    }
	    return $ticket;
////////////////

	    //$data = json_decode(file_get_contents("jsapi_ticket.php"));
	    //if ($data->expire_time < time()) {
	      //$accessToken = $this->getAccessToken();
	      //$url = "https://qyapi.weixin.qq.com/cgi-bin/get_jsapi_ticket?access_token=$accessToken";
	      //$res = file_get_contents($url);
        //$res2 = substr($res,37);
        //$ticket = substr($res2,0,-20);
	      //$data->expire_time = time() + 7000;
	      //$data->jsapi_ticket= $ticket;
	      //$fp = fopen("jsapi_ticket.php", "w");
	      //fwrite($fp, json_encode($data));
	      //fclose($fp);
	    //} else {
          //$ticket = $data->jsapi_ticket;
	    //}

	     //return $ticket;
	   }

  private function get_php_file($filename) {
    return trim(substr(file_get_contents($filename), 15));
  }
  private function set_php_file($filename, $content) {
    $fp = fopen($filename, "w");
    fwrite($fp, "<?php exit();?>" . $content);
    fclose($fp);
  }

	  public function getSignPackage() {

	    $jsapiTicket = $this->getJsApiTicket();
	    // 注意 URL 一定要动态获取，不能 hardcode.
	    $protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off' || $_SERVER['SERVER_PORT'] == 443) ? "https://" : "http://";
	    $url = "$protocol$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]";
	    $timestamp = time();
	    $nonceStr = $this->createNonceStr();
	    // 这里参数的顺序要按照 key 值 ASCII 码升序排序
	    $string = "jsapi_ticket=$jsapiTicket&noncestr=$nonceStr&timestamp=$timestamp&url=$url";
	    $signature = sha1($string);
	    $signPackage = array(
	      "appId"     => $this->appId,
	      "nonceStr"  => $nonceStr,
	      "timestamp" => $timestamp,
	      "url"       => $url,
	      "signature" => $signature,
	      "rawString" => $string
	    );
	    return $signPackage; 
	  }

}

  $Quhao=new QuHao;
  $Quhao->set_session();
  $link = mysqli_connect('localhost','mynode','123456','Room');
  if (!link){
          printf("Can't connect to MySQL Server. Errorcode: %s ", mysqli_connect_error());
  }
  $sql = "SELECT id FROM login WHERE S_Number="."'".$_SESSION['number']."'";
  $answer = mysqli_query($link,$sql);

  $row = mysqli_fetch_assoc($answer);
  if ($row){
    $_SESSION['id'] = $row['id'];
    header("Location: Test4.php");
  }
  $signPackage =$Quhao->getSignPackage();
?>

<script src="http://res.wx.qq.com/open/js/jweixin-1.0.0.js"></script>
<script type="text/javascript">
  wx.config({
    debug: true,
    appId: '<?php echo $signPackage["appId"];?>',
    timestamp: <?php echo $signPackage["timestamp"];?>,
    nonceStr: '<?php echo $signPackage["nonceStr"];?>',
    signature: '<?php echo $signPackage["signature"];?>',
    jsApiList: [
      // 所有要调用的 API 都要加到这个列表中
      'getLocation'
    ]
  });
    wx.ready(function () {
      wx.getLocation({

          type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'

          success: function (res)
          {
              //var latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
              //var longitude = res.longitude ; // 经度，浮点数，范围为180 ~ -180>。
              //var speed = res.speed; // 速度，以米/每秒计
              //var accuracy = res.accuracy; // 位置精
              //alert("latitude:"+latitude+"longitude:"+longitude);
              //$("#lati").html(latitude);
              //$("#longi").html(longitude);
              document.cookie = "lati="+res.latitude;
              document.cookie = "longi="+res.longitude;
          },

          fail:function()
          {
            alert("getLoc fail");
          }
      });
    });
    wx.error(function (res) {
        alert(res.errMsg);
    });
</script>
<a href="http://xss.mysspku.com/Test2.php"><input type="button" style="width:200px;height:60px;" value="点击取号"></input></a>
