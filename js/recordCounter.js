recordCounter = (function() {
	var objectStoreCounts = {};

	return {

		initObjectStoreCount: function(name, count) {
			objectStoreCounts[name] = count;
		},

		contains: function(name) {
			var found = false;

			$.each(objectStoreCounts, function(i, v) {
				if (name === i) {
					found = true;
					return;
				}
			})

			return found;
		},

		increment: function(name) {
			objectStoreCounts[name]++;
		},

		decrement: function(name) {
			objectStoreCounts[name]--;
		},

		getCount: function(name) {
			return objectStoreCounts[name];
		}
	}
}());