<?php
session_start();
header("Content-Type:text/html;charset=utf-8"); 
?>
<?php
  if (!$_SESSION['number'])
    exit("同学您还没有注册，请注册后再取号");
  if ($_SESSION['id'])
    header("Location: Test4.php");    

  echo "学号:".$_SESSION['number']."</br>";
  $lati = (float)$_COOKIE['lati'];
  $longi = (float)$_COOKIE['longi'];

  function vertify_distance($x,$y){
        $rylocationx =39.764526 ;//软院的纬度
        $rylocationy =116.363218;//软院的经度
        $locationx = $x;//获取位置的纬度
        $locationy = $y;//获取位置的经度
        $dis1=$rylocationx-$locationx;//纬度之差
        $dis2=$rylocationy-$locationy;//经度之差
        $distance = 111*sqrt($dis1*$dis1+$dis2*$dis2);//距离比较公式

      if ($distance<=2) {
          return 0;
        }else{
          return 1;
        }
    }

  if (vertify_distance($lati,$longi)){
    exit("同学您还没有到校，请到校后再取号");
  }
  $link = mysqli_connect('localhost','mynode','123456','Room');
  if (!link){
    printf("Can't connect to MySQL Server. Errorcode: %s ", mysqli_connect_error());
    exit("连接错误请重新进入选号");
  }

  //$data = json_decode(file_get_contents("max.json"));
  //$n = $data->max+1;
  ////var_dump($answer);
  //$upd = "update Student set ListNo=".$n." where Number="."'".$_SESSION['number']."'";
  $upd = "insert into login(S_Number) values ('".$_SESSION['number']."')";
  mysqli_query($link,$upd);
  //if (!mysqli_query($link,$upd)){
  //  echo "取号失败，请重新取号";
  //  //header("Location: in.php");
  //  exit();
  //}
  //$data->max=$data->max+1;
  //$fp = fopen("max.json", "w");
  //fwrite($fp, json_encode($data));
  //fclose($fp);
  //set_php_file("max.php",json_encode($data));
  //$link->close();
  $sql2 = "SELECT id FROM login WHERE S_Number="."'".$_SESSION['number']."'";
  $answer2 = mysqli_query($link,$sql2);
  $row2 = mysqli_fetch_assoc($answer2);
  if (!$row2['id']) {
    exit("取号失败，请重新进入取号");
  }
  $_SESSION['id'] = $row2['id'];
  echo "同学您的报名号为:".$row2['id']."</br>";
  $link->close();
?>
<a href="http://xss.mysspku.com/Test3.php"><input type="button" style="width:200px;height:60px;" value="点我生成报名二维码"></input></a>
