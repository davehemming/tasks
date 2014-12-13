function ajaxTest1() {
	promise = $.ajax({
		type : "GET",
		dataType: "json",
		url : "/fit3083/tasks/server/tasks.json",
		cache : false,
		// success : function( data) {
		// 	console.log( data);
		// }
	});

	promise.done(function(data) {
		console.log(data);
	});

	promise.fail(function() {
		console.log('JSON import failed');
	});
}

function ajaxTest2() {

	cachedTasks = function() {
		var tasks = null;
		return {
			getTasks: function() {
				var deferred = $.Deferred();
				if (tasks) {
					deferred.resolve(tasks);
					return deferred.promise();
				} else {
					var promise1 = $.ajax({
						url: '../tasks/server/tasks.json',
					});
					promise1.done(function(data) {
						tasks = data;
						setTimeout(function() {deferred.resolve(tasks)}, 5000);
					});

					return deferred.promise();
				}
			}
		}
	}();

	promise = cachedTasks.getTasks();
	promise.done(function(data) {
		console.log('Got Tasks first time');
	});

	promise = cachedTasks.getTasks();
	promise.done(function(data) {
		console.log('Got Tasks second time');
	});

}