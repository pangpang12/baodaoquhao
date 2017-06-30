<?php
session_start();
include 'phpqrcode.php';
QRcode::png("http://xss.mysspku.com/info.php?number=".$_SESSION['number']);
?>

