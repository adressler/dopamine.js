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

			// call events
			$(this).trigger(type, [type, arg])
			$(this).trigger('default', [type, arg]);

			// call methods
			this.__call_method(type, type, arg);
			if (type != 'default') {
				this.__call_method('default', type, arg);
			}

			// call plugins
			$.each(this.plugins, function(i, plugin) {
				plugin.call(type, arg);
			});

			return true;
		},

		__call_method: function(method, type, arg) {
			var method = '_' + method;
			if (typeof(this[method]) == 'function') {
				this[method].call(this, type, arg);
				return true;
			}
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
