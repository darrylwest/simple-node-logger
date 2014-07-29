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

    var manager = this,
        domain = options.domain,
        appenders = options.appenders || [],
        loggers = options.loggers || [],
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

        if (domain) {
            opts.domain = domain;
        }

        if (category) opts.category = category;

        logger = new Logger( opts );

        return logger;
    };

    /**
     * create the console appender and add it to the appenders list
     *
     * @param opts - appender settings
     * @returns ConsoleAppender -
     */
    this.createConsoleAppender = function(opts) {
        if (!opts) opts = {};

        return manager.addAppender( new ConsoleAppender( opts ) );
    };

    /**
     * create a file appender and add it to the appenders list
     *
     * @param opts
     * @returns a FileAppender object
     */
    this.createFileAppender = function(opts) {
        if (!opts) {
            throw new Error('file appender must be created with log file path set in options');
        }

        return manager.addAppender( new FileAppender( opts ) );
    };

    this.createRollingFileAppender = function( opts ) {
        return manager.addAppender( new RollingFileAppender( opts ) );
    };

    /**
     * add the appender to list
     *
     * @param appender
     * @returns the new appender
     */
    this.addAppender = function(appender) {
        appenders.push( appender );

        return appender;
    };

    this.getAppenders = function() {
        return appenders;
    };

    this.__protected = function() {
        return {
            domain:domain,
            dfltLevel:dfltLevel
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

    var manager = new SimpleLogger();

    manager.createConsoleAppender();

    if (logFilePath) {
        manager.createFileAppender( { logFilePath:logFilePath } );
    }

    return manager.createLogger();
};

/**
 * static convenience method to create a file logger (no console logging);
 *
 * @param logFilePath
 * @returns logger
 */
SimpleLogger.createSimpleFileLogger = function(logFilePath) {
    'use strict';

    var manager = new SimpleLogger();

    manager.createFileAppender( { logFilePath:logFilePath } );

    return manager.createLogger();
};

/**
 * create a rolling file logger by passing options to SimpleLogger and Logger.  this enables setting
 * of domain, category, etc.
 *
 * @param options
 * @returns {*}
 */
SimpleLogger.createRollingFileLogger = function(options) {
    'use strict';

    var manager = new SimpleLogger( options );

    manager.createRollingFileAppender( options );

    return manager.createLogger( options );
};
