self.addEventListener('message', function(msg) {
	var data = msg.data;

	var tasksCSV = "Task, Required By, Category \n";

	for (var i = 0; i < data.length; i++) {
		for (var prop in data[i]) {
			if (prop != 'id' && prop != 'complete') {
				tasksCSV += data[i][prop] + ', ';
			}
		}

		tasksCSV = tasksCSV.substring(0, tasksCSV.length -2) + '\n';
	}

	self.postMessage(tasksCSV);

}, false);