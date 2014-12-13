<?php
$fname = "tmp/".$_GET['url'];
header('Content-Type: text/csv');
header('Content-Disposition: attachment; filename="backup.csv"');
echo file_get_contents($fname);
unlink ($fname);
?>