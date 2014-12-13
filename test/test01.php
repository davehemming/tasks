<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="utf-8">
	<title>Task list</title>
	<style>
		body {
			margin: 20px;
		}
	</style>
	<script src="../js/jquery-2.1.1.js"></script>
	<script>
		$(document).ready(function() {
			// $('#test').click(function() {
			// 	var now = new Date().toString();
   //  			this.href = "data:text/plain;charset=UTF-8," + encodeURIComponent(now);
			// });
			var data = "hello";

			$.post('genFile.php', {data : data}, function(url) {
				// $("body").append("<a href='test01.php'>link</a>");
		    $("body").append("<iframe src='download.php?url="+url+"' style='display: none;'></iframe>");
		    });

		console.log(window.location);

		});
	</script>
	<p>
		<!-- <button id="test">Ajax Test 1</button> -->
		<!-- <a id="test" href="data:text/plain;charset=UTF-8,Hello%20World!" download="filename.txt">Download</a> -->
	</p>
	<?php //echo substr(dirname($_SERVER['PHP_SELF']), 1); ?>
</head>
<body>

</body>
</html>