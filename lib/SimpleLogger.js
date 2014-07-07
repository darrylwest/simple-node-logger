/**
 *
 * @author: darryl.west@raincitysoftware.com
 * @created: 7/6/14
 */
var SimpleLogger = function(options) {
    'use strict';

    var simple = this,
        appenders = options.appenders,
        dfltLevel = options.level || 'info';

    this.createLogger = function(category, level) {
        if (!level) level = dfltLevel;

        // create a logger with or without a category or level
    };

};