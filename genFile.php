<?php
$length = 12;
$chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
$str = substr( str_shuffle( $chars ), 0, $length ).'.csv';
$fh = fopen(('tmp/'.$str), 'w') or die("can't open file");
fwrite($fh,$_POST["data"]);
fclose($fh);
echo $str;
?>