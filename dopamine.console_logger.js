/*!
 * dopamine.js
 *
 * Copyright 2011, Armin Dressler
 * Licensed under the MIT license.
 * See LICENSE for details.
 */
;(function($) {

	window.DopamineConsoleLogger = Dopamine.extend({

		name: 'DopamineConsoleLogger',

		_default: function(type, arg) {
			var prefix = this.options.prefix || '';
			console.debug(prefix + '[' + type + ']', arg);
		}

	});

})(window.jQuery);
