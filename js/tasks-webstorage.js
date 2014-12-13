storageEngine = function() {
	var initialized = false;
	var initializedObjectStores = {};

	function getStorageObject(type) {
		var item = localStorage.getItem(type);
		var parsedItem = JSON.parse(item);

		return parsedItem;
	}

	return {
		init: function(successCallback, errorCallback) {
			if (window.localStorage) {
				initialized = true;
				successCallback(null);
			} else {
				errorCallback('storage_api_not_supported', 'The web storage api is not supported');
			}
		},

		initObjectStore: function(type, successCallback, errorCallback) {
			if (!initialized) {
				errorCallback('storage_api_not_initialized', 'The storage engine has not been initialized');
			} else if (!localStorage.getItem(type)) {
				initObjectStoreCount(type, 0);
				localStorage.setItem(type, JSON.stringify({index: 1}));
			} else {

				if (!recordCounter.contains(type)) {
					var item = $.parseJSON(localStorage.getItem(type));
					recordCounter.initObjectStoreCount(type, Object.keys(item).length - 1);
				}
			}

			initializedObjectStores[type] = true;
			successCallback(null);
		},

		save: function(type, obj, successCallback, errorCallback) {
			if (!initialized) {
				errorCallback('storage_api_not_initialized', 'The storage engine has not been initialized');
			} else if (!initializedObjectStores[type]) {
				errorCallback('store_not_initialized', 'The object store '+type+' has not been initialized');
			}

			var storageItem = getStorageObject(type);

			if (!obj.id) {
				// obj.id = $.now();
				obj.id = storageItem.index++;
			}

			storageItem[obj.id] = obj;
			// console.log(storageItem);
			localStorage.setItem(type, JSON.stringify(storageItem));
			recordCounter.increment(type);
			successCallback(obj);
		},

		saveAll: function(type, objs, successCallback, errorCallback) {

			if (!initialized) {
				errorCallback('storage_api_not_initialized', 'The storage engine has not been initialized');
			} else if (!initializedObjectStores[type]) {
				errorCallback('store_not_initialized', 'The object store '+type+' has not been initialized');
			}

			var storageItem = getStorageObject(type);


			$.each(objs, function(index, obj) {
				if (!obj.id) {
					// obj.id = $.now();
					obj.id = storageItem.index++;
				}

				storageItem[obj.id] = obj;
				// console.log(storageItem);
				localStorage.setItem(type, JSON.stringify(storageItem));
				recordCounter.increment(type);
			});

			successCallback(objs);
		},

		findAll: function(type, successCallback, errorCallback) {

			if (!initialized) {
				errorCallback('storage_api_not_initialized', 'The storage engine has not been initialized');
			} else if (!initializedObjectStores[type]) {
				errorCallback('store_not_initialized', 'The object store '+type+' has not been initialized');
			}

			var result = [];
			var storageItem = getStorageObject(type);

			// console.log(storageItem);

			$.each(storageItem, function(i, v) {
				// console.log(i);
				if (i !== 'index') {
					result.push(v);
				}

			});

			successCallback(result);
		},

		delete: function(type, id, successCallback, errorCallback) {

			if (!initialized) {
				errorCallback('storage_api_not_initialized', 'The storage engine has not been initialized');
			} else if (!initializedObjectStores[type]) {
				errorCallback('store_not_initialized', 'The object store '+type+' has not been initialized');
			}

			var storageItem = getStorageObject(type);

			if (storageItem[id]) {
				delete storageItem[id];
				localStorage.setItem(type, JSON.stringify(storageItem));
				recordCounter.decrement(type);
				successCallback(id);
			} else {
				errorCallback('object_not_found', 'The object requested could not be found');
			}
		},

		findByProperty: function(type, propertyName, propertyValue, successCallback, errorCallback) {
			if (!initialized) {
				errorCallback('storage_api_not_initialized', 'The storage engine has not been initialized');
			} else if (!initializedObjectStores[type]) {
				errorCallback('store_not_initialized', 'The object store '+type+' has not been initialized');
			}

			var result = [];

			var storageItem = getStorageObject(type);

			$.each(storageItem, function(i, v) {
				if (v[propertyName] === propertyValue) {
					result.push[v];
				}
			});

			successCallback(result);
		},

		findById: function(type, id, successCallback, errorCallback) {

			if (!initialized) {
				errorCallback('storage_api_not_initialized', 'The storage engine has not been initialized');
			} else if (!initializedObjectStores[type]) {
				errorCallback('store_not_initialized', 'The object store '+type+' has not been initialized');
			}

			var storageItem = getStorageObject(type);

			var result = storageItem[id];

			successCallback(result);
		},

		count: function(type) {
			return recordCounter.getCount(type);
		}
	}

}();