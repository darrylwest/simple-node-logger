/**
 * @class SimpleLogger
 *
 * @author: darryl.west@raincitysoftware.com
 * @created: 7/6/14
 */
var Logger = require('./Logger' ),
    ConsoleAppender = require('./ConsoleAppender');

var SimpleLogger = function(options) {
    'use strict';

    if (!options) options = {};

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

        // if the appenders are null, then create a console appender
        if (!appenders) {
            appenders = [ simple.createConsoleAppender() ];
        }

        if (!level) level = dfltLevel;

        opts.level = level;
        opts.appenders = appenders;

        logger = new Logger( opts );

        return logger;
    };

    /**
     * create the console appender with optional options
     *
     * @param opts - appender settings
     * @returns ConsoleAppender -
     */
    this.createConsoleAppender = function(opts) {
        if (!opts) opts = {};

        return new ConsoleAppender( opts );
    };

};

module.exports = SimpleLogger;