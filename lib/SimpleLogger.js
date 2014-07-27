/**
 * @class SimpleLogger
 *
 * @author: darryl.west@raincitysoftware.com
 * @created: 7/6/14
 */
var Logger = require('./Logger' ),
    ConsoleAppender = require('./ConsoleAppender' ),
    FileAppender = require( './FileAppender' ),
    RollingFileAppender = require( './RollingFileAppender' );

var SimpleLogger = function(options) {
    'use strict';

    if (!options) options = {};

    var simple = this,
        domain = options.domain,
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

        if (domain) {
            opts.domain = domain;
        }

        if (category) opts.category = category;

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

    /**
     * create a file appender
     *
     * @param opts
     * @returns a FileAppender object
     */
    this.createFileAppender = function(opts) {
        if (!opts) {
            throw new Error('file appender must be created with log file path set in options');
        }

        return new FileAppender( opts );
    };

    /**
     * add the appender to list
     *
     * @param appender
     * @returns the new appender
     */
    this.addAppender = function(appender) {
        if (!appenders) {
            appenders = [];
        }

        appenders.push( appender );

        return appender;
    };

    this.__protected = function() {
        return {
            domain:domain,
            dfltLevel:dfltLevel,
            appenders:appenders
        };
    };
};

module.exports = SimpleLogger;

/**
 * static convenience method to create a simple console logger
 *
 * @param logFilePath - optional, if present then a file appender is created
 * @returns logger
 */
SimpleLogger.createSimpleLogger = function(logFilePath) {
    'use strict';

    var simple = new SimpleLogger();

    simple.addAppender( simple.createConsoleAppender() );

    if (logFilePath) {
        simple.addAppender( simple.createFileAppender( { logFilePath:logFilePath } ));
    }

    return simple.createLogger();
};

/**
 * static convenience method to create a file logger (no console logging);
 *
 * @param logFilePath
 * @returns logger
 */
SimpleLogger.createSimpleFileLogger = function(logFilePath) {
    'use strict';

    var simple = new SimpleLogger();

    simple.addAppender( simple.createFileAppender( { logFilePath:logFilePath } ));

    return simple.createLogger();
};

SimpleLogger.createRollingFileLogger = function(options) {
    'use strict';

    var simple = new SimpleLogger();

    simple.addAppender( new RollingFileAppender( options ) );

    return simple.createLogger();
};