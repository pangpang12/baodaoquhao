<?php
session_start();
header("Content-Type:text/html;charset=utf-8");
$protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off' || $_SERVER['SERVER_PORT'] == 443) ? "https://" : "http://";
$url = "$protocol$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]";
$lin = substr(trim($url),-10);
echo "学号为:".$lin."</br>";
//session_start();
$_SESSION['max(values)'] = 10000;
$data = json_decode(get_php_file("count.php"));
$link = mysqli_connect('localhost','mynode','123456','Room');
if (!link){
  printf("Can't connect to MySQL Server. Errorcode: %s ", mysqli_connect_error());
  exit();
}
$sql = "SELECT ListNo FROM Student WHERE Number="."'".$lin."'";
//echo $sql."</br>";
$answer = mysqli_query($link,$sql);
$row = mysqli_fetch_assoc($answer);
echo "报名号为:".$row['ListNo'];
$number = intval($row['ListNo']);
if ($number == 0)
exit("该同学还未取号，请取号后再报名");
//if ($number>=1&&$number<=20){
//  $sql2 = "update Student set ListNo=".$_SESSION['max(values)']." where Number="."'".$lin."'";
//  echo $sql2."</br>";
//  if (mysqli_query($link,$sql2)){
//    //echo mysqli_affected_rows();
//    $data->counter = $data->counter+1;
//    $data->max = $data->max+1;
//    set_php_file("count.php",json_encode($data));
//    echo "请进";
//  }else{
//    echo "更新失败";
//  }
//  $link->close();
//}

if ($data->counter>=20||$number-$data->max>=20){
  exit("办理人数太多，请稍后再办");
}else {
  $sql2 = "update Student set ListNo=".$_SESSION['max(values)']." where Number="."'".$lin."'";
  //echo $sql2."</br>";
  if (mysqli_query($link,$sql2)){
    //echo mysqli_affected_rows();
    $a = $data->counter;
    $b = $data->max;
    $data->counter = $a+1;
    $data->max = $b+1;
    set_php_file("count.php",json_encode($data));
    echo "请进";
  }else{
    echo "更新失败";
  }
  $link->close();
}
  function get_php_file($filename) {
    return trim(substr(file_get_contents($filename), 15));
  }
  function set_php_file($filename, $content) {
    $fp = fopen($filename, "w");
    fwrite($fp, "<?php exit();?>" . $content);
    fclose($fp);
  }
?>
