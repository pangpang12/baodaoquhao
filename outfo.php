<?php
header("Content-Type:text/html;charset=utf-8");
session_start();
echo "同学您的学号为：".$_SESSION['number']."</br>";
if (!$_SESSION['id'])
echo "同学您还未取号，请先取号"."</br>";
else{
echo "您的报名号为：".$_SESSION['id']."</br>";
}
?>
<a href="http://xss.mysspku.com/in.php"><input type="button" style="width:200px;height:60px;" value="点击生成报名二维码"></input></a>
