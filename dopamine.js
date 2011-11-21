/*!
 * dopamine.js
 *
 * Copyright 2011, Armin Dressler
 * Licensed under the MIT license.
 * See LICENSE for details.
 */
;(function($) {

	var Dopamine = function() {
		this.init();
	}

	Dopamine.prototype = {

		name: 'Dopamine',

		init: function() {
			this.plugins = [];
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

		call: function(type, arg) {
			arg = arg || null;

			// call events
			$(this).trigger(type, [type, arg])
			$(this).trigger('default', [type, arg]);

			// call methods
			this.__call_method(type, type, arg);
			if (type != 'default') {
				this.__call_method('default', type, arg);
			}

			// call listeners
			$.each(this.plugins, function(i, listener) {
				listener.call(type, arg);
			});
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
			this.init(arguments);
		}
		newDopamine.prototype = $.extend({}, Dopamine.prototype, prototype);
		return newDopamine;
	}

	// globalize class 
	window.Dopamine = Dopamine;

})(window.jQuery);
