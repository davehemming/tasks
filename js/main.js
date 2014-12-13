$(document).ready(function() {
	$('[required="required"]').prev('label').append('<span class="required">*</span');
	$('tbody tr:even').addClass('even');

	$('#btnAddTask').click(function(evt) {
		evt.preventDefault();
		$('#taskCreation').removeClass('not');
	});

	$('tbody').on('click', 'td', 'time', function(evt) {

		// console.log($(evt.target).prop('tagName'));

		if ($(evt.target).prop('tagName') !== 'A') {
			$(evt.target).closest('td').siblings().andSelf().not('td:has(nav)').toggleClass('rowHighlight');
		}



	});

	$('#btnDeleteSelectedTasks').click(function(evt) {
		evt.preventDefault();
		var $rows = $('tr:has(td.rowHighlight)');
		var rowCount = $rows.length;

		if (rowCount > 0) {
			var msg = 'Delete ' + rowCount + ' rows?';

			if (confirm(msg)) {
				$rows.remove();
				alert(rowCount + ' rows were deleted.');
			}
		}


	});

	$('tbody').on('click', '.deleteRow', function(evt) {
		evt.preventDefault();
		$(evt.target).parents('tr').remove();
	});

	$('#saveTask').click(function(evt) {
		evt.preventDefault();
		var task = $('form').toObject();
		$('#taskRow').tmpl(task).appendTo($('#tblTasks tbody'));
		$('form').find('input, select').val('');
	});

	$('a').hover(function(evt) {
		// console.log('hi');
		var $tr = $(evt.target).closest('tr');

		// console.log($tr);
	});

});