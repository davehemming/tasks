tasksController = function() {
	var taskPage;
	var initialised = false;

	function errorLogger(errorCode, errorMessage) {
		console.log(errorCode+':'+errorMessage);
	}

	function updateTaskCount() {
		$('footer').find('#taskCount').text(storageEngine.count('task'));
	}

	function clearTask() {
		$(taskPage).find('input').val('');
	}

	function overdueAndWarningBands() {
		$.each($(taskPage).find('#tblTasks tbody tr'), function(idx, row) {
			var due = Date.parse($(row).find('[datetime]').text());

			if (due.compareTo(Date.today()) < 0) {
				$(row).removeClass('even');
				$(row).addClass('overdue');
			} else if (due.compareTo((2).days().fromNow()) <= 0) {
				$(row).removeClass('even');
				$(row).addClass('warning');
			}
		});
	}

	function bandTableRows() {
		$(taskPage).find('tr').removeClass('even')
		$(taskPage).find('tr:even').addClass('even');
	}

	function createCSV() {
		storageEngine.findAll('task', function(tasks) {

			var worker = new Worker('js/tasks-csvgen.js');
			worker.addEventListener('message', function(e) {
				var tasksCSV = e.data;
				$.post('genFile.php', {data : tasksCSV}, function(url) {
		    	$(taskPage).append("<iframe src='download.php?url="+url+"' style='display: none;'></iframe>");
		    	});

		    	$(taskPage).find('iframe').remove();
			});

			worker.postMessage(tasks);
		});
	}

	function loadFromCSV(event) {

		var reader = new FileReader();
		reader.onload = function(evt) {
			var contents = evt.target.result;

			var worker = new Worker('js/tasks-csvparser.js');

			worker.addEventListener('message', function(e) {

				var tasks = e.data;
				storageEngine.saveAll('task', tasks, function() {
					tasksController.loadTasks();
				}, errorLogger);

			}, false);

			worker.postMessage(contents);
		};

		reader.onerror = function(evt) {
			errorLogger('connot_read_file', 'The file specified cannot be read');
		};

		reader.readAsText(event.target.files[0]);

	}

	return {
		init: function(page, callback) {

			if (initialised) {
				callback();

			} else {

				taskPage = page;
				var $form = $(taskPage).find('form');

				storageEngine.init(function() {
					storageEngine.initObjectStore('task', function() {
						callback();
					}, errorLogger)
				}, errorLogger);

				$form.validate({
					rules: {
						task: {
							required: true,
							maxlength: 40
						}
					}
				});

				$('#importFile').change(function(evt) {

					loadFromCSV(evt);
					// console.log(this);
					$(this).replaceWith($(this).val('').clone(true));

				});

				$(taskPage).find('#tblTasks tbody').on('click', '.completeRow', function(evt) {
					storageEngine.findById('task', $(evt.target).data().taskId, function(task) {
						task.complete = true;
						storageEngine.save('task', task, function() {
							tasksController.loadTasks();
						}, errorLogger);
					}, errorLogger);
				});

				$(taskPage).find('[required="required"]').prev('label').append('<span class="required">*</span');


				$(taskPage).find('#clearTask').click(function(evt) {
					evt.preventDefault();
					clearTask();
				});

				$(taskPage).find('#btnAddTask').click(function(evt) {
					evt.preventDefault();
					$(taskPage).find('#taskCreation').removeClass('not');
				});

				$(taskPage).find('tbody').on('click', 'td', 'time', function(evt) {

					if ($(evt.target).prop('tagName') !== 'A') {
						$(evt.target).closest('td').siblings().andSelf().not('td:has(nav)').toggleClass('rowHighlight');
					}

				});

				$(taskPage).find('#btnDeleteSelectedTasks').click(function(evt) {
					evt.preventDefault();
					var $rows = $(taskPage).find('tr:has(td.rowHighlight)');
					var rowCount = $rows.length;

					if (rowCount > 0) {
						var msg = 'Delete ' + rowCount + ' rows?';

						if (confirm(msg)) {

							$rows.each(function(i, v) {
								var taskId = parseInt($(this).find('.deleteRow').data().taskId);
								var $row = $(this);
								storageEngine.delete('task',
								taskId, function() {
									$row.remove();
									updateTaskCount();
									bandTableRows();
									if (i === $rows.length -1) {
										alert(rowCount + ' rows have been deleted.');
									}

								}, errorLogger);
							});
						}
					}


				});

				$(taskPage).find('tbody').on('click', '.deleteRow', function(evt) {
					evt.preventDefault();

					var taskId = parseInt($(evt.target).data().taskId);

					storageEngine.delete('task',
						taskId, function() {
							$(evt.target).parents('tr').remove();
							updateTaskCount();
							bandTableRows();
						}, errorLogger);

				});

				$(taskPage).find('#saveTask').click(function(evt) {
					evt.preventDefault();

					if ($form.valid()) {
						var task = $form.toObject();
						task.complete = false;
						storageEngine.save('task', task,
							function(savedTask) {
								// $(taskPage).find('#tblTasks tbody').empty();
								tasksController.loadTasks();
								clearTask();
								bandTableRows();
								$(taskPage).find('#taskCreation').addClass('not');
								// $('#taskRow').tmpl(task).appendTo($(taskPage).find('#tblTasks tbody'));
							}, errorLogger);
					}

				});

				$(taskPage).find('#tblTasks tbody').on('click', '.editRow',
					function(evt) {
						$(taskPage).find('#taskCreation').removeClass('not');

						storageEngine.findById('task', $(evt.target).data().taskId, function(task) {

							$(taskPage).find('form').fromObject(task);
						}, errorLogger);
					}
				)

				$(taskPage).find('#btnUncheckedExceptionTest').click(function(evt) {
					evt.preventDefault();

					tasksController.logPropertyValue(undefined, 'someProperty');
				});

				$(taskPage).find('#btnExportData').click(function(evt) {
					evt.preventDefault();

					createCSV();
				});


				initialised = true;
			}
		},

		loadTasks: function() {

			$(taskPage).find('#tblTasks tbody').empty();
			storageEngine.findAll('task', function(tasks) {

				tasks.sort(function(task1,task2) {
					var date1, date2;
					date1 = Date.parse(task1.requiredBy);
					date2 = Date.parse(task2.requiredBy);
					return date1.compareTo(date2);
				});

				$.each(tasks, function(index, task) {

					if (!task.complete) {
						task.complete = false;
					}

					$('#taskRow').tmpl(task).appendTo($(taskPage).find('#tblTasks tbody'));

				});
				updateTaskCount();
				bandTableRows();
				overdueAndWarningBands();
			}, errorLogger);

		}
	}
}();