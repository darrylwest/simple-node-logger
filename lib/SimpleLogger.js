/**
 * @class SimpleLogger
 *
 * @author: darryl.west@raincitysoftware.com
 * @created: 7/6/14
 */
var Logger = require('./Logger');

var SimpleLogger = function(options) {
    'use strict';

    var simple = this,
        appenders = options.appenders,
        dfltLevel = options.level || Logger.DEFAULT_LEVEL;

    /**
     * create a logger with optional category and level
     *
     * @param category
     * @param level
     */
    this.createLogger = function(category, level) {
        var logger,
            opts = {};

        if (!level) level = dfltLevel;

        opts.level = level;
        opts.appenders = appenders;

        logger = new Logger( opts );

        return logger;
    };

};

module.exports = SimpleLogger;