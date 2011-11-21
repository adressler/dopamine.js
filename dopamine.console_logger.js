/*!
 * dopamine.js
 *
 * Copyright 2011, Armin Dressler
 * Licensed under the MIT license.
 * See LICENSE for details.
 */
;(function($) {

	if (!window.Dopamine) {
		console.error('dopamine.js missing');
		return;
	}

	window.DopamineConsoleLogger = Dopamine.extend({

		name: 'DopamineConsoleLogger',

		_default: function(type, arg) {
			console.debug('[' + type + ']', arg);
		}

	});

})(window.jQuery);
