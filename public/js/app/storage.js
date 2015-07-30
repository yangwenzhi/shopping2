//localstorage
define("storage", ["jquery"], function($) {

	var storage = {
		id: '',
		db: localStorage,
		relative: true,
		support:function(){
			return window.localStorage ? true : false;
		},
		getlocal: function(key, isJson) {
			try {
				return isJson === true ? JSON.parse(this.db.getItem(key)) : this.db.getItem(key)
			} catch (err) {
				return null
			}
		},
		setlocal: function(key, value, isJson) {
			try {
				if (isJson === true) {
					this.db.setItem(key, JSON.stringify(value))
				} else {
					this.db.setItem(key, value)
				}
			} catch (err) {
				console.log(err)
			}
		},
		get: function(part, key) {
			var config = this.getlocal(part, true);
			if (typeof key == 'undefined') {
				return config
			}
			return config?config[key]:false;
		},
		set: function(part, key, value, data) {
			if (typeof data == 'undefined') {
				data = this.getlocal(part, true) ? this.getlocal(part, true) : {}
			}
			if (key != "" && key != null) {
				data[key] = value
			} else {
				data = value
			}
			this.setlocal(part, data, true)
		},
		length: function(data) {
			if (typeof data == 'undefined' || data == null || !(data instanceof Array)) {
				return 0
			}
			return data.length
		},
		remove: function(key) {
			try {
				this.db.removeItem(key)
			} catch (err) {
				console.log(err)
			}
		},
		clear: function(keylist) {
			var self = this;
			try {
				if (keylist instanceof Array) {
					$.each(keylist, function(i, n) {
						self.remove(n)
					})
				}
			} catch (err) {
				console.log(err)
			}
		}
	};
	return storage;

});