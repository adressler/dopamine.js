/*!
 * dopamine.js
 *
 * Copyright 2011, Armin Dressler
 * Licensed under the MIT license.
 * See LICENSE for details.
 */
;(function($) {

	var default_options = {
		enable: true,
		pass: true,
		accept: [],
		ignore: []
	}

	var Dopamine = function() {
		this.init.apply(this, arguments);
	}

	Dopamine.prototype = {

		name: 'Dopamine',

		init: function(options) {
			options = options || {};

			this.plugins = [];
			this.callbacks = {};
			this.options = $.extend({}, default_options, options);
		},

		bind: function(type, func) {
			$(this).bind(type, func);
		},

		unbind: function(type, func) {
			$(this).unbind(type, func);
		},

		addPlugin: function() {
			var self = this;
			$(arguments).each(function() {
				self.plugins.push(this);
			});
		},

		addCallback: function(type, arg) {
			var map = {};
			if (typeof(type) == 'object') {
				map = type;
			} else {
				map[type] = arg;
			}

			var self = this;
			$.each(map, function(type, func) {
				self.callbacks[type] = self.callbacks[type] || $.Callbacks();
				self.callbacks[type].add(func);
			});
		},

		acceptsType: function(type) {
			var whitelisted = (this.options.accept.length == 0) || (this.options.accept.length > 0 && this.options.accept.indexOf(type) > -1);
			var blacklisted = this.options.ignore.length > 0 && this.options.ignore.indexOf(type) > -1;
			return whitelisted && !blacklisted;
		},

		call: function(type, arg) {
			if (!this.options.enable || !this.acceptsType(type)) {
				return false;
			}

			arg = arg || null;

			// call events, callbacks and method
			this.__call_event(type, type, arg);
			this.__call_callback(type, type, arg);
			this.__call_method(type, type, arg);

			// call 'default' events, callbacks and method
			if (type != 'default') {
				this.__call_event('default', type, arg);
				this.__call_callback('default', type, arg);
				this.__call_method('default', type, arg);
			}

			// call plugins
			this.__call_plugins(type, arg);

			return true;
		},

		__call_event: function(method, type, arg) {
			$(this).trigger(method, [type, arg])
		},

		__call_method: function(method, type, arg) {
			var method = '_' + method;
			if (typeof(this[method]) == 'function') {
				this[method](type, arg);
				return true;
			}
			return false;
		},

		__call_callback: function(method, type, arg) {
			if (typeof(this.callbacks[method]) == 'object') {
				this.callbacks[method].fire(type, arg);
				return true;
			}
			return false;
		},

		__call_plugins: function(type, arg) {
			if (this.options.pass) {
				$.each(this.plugins, function(i, plugin) {
					plugin.call(type, arg);
				});
				return true;
			};
			return false;
		}
	}

	Dopamine.extend = function(prototype) {
		var newDopamine = function() {
			this.init.apply(this, arguments);
		}
		newDopamine.prototype = $.extend({}, Dopamine.prototype, prototype);
		return newDopamine;
	}

	// globalize class 
	window.Dopamine = Dopamine;

})(window.jQuery);
