/**
 * @class SimpleLogger
 *
 * @author: darryl.west@raincitysoftware.com
 * @created: 7/6/14
 */
var dash = require( 'lodash' ),
    Logger = require('./Logger' ),
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
        dfltLevel = options.level || Logger.DEFAULT_LEVEL,
        loggerConfigFile = options.loggerConfigFile,
        refresh = options.refresh,
        fs = options.fs || require('fs' ),
        createInterval = options.createInterval || setInterval,
        minRefresh = options.minRefresh || 10 * 1000,
        refreshId;

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

        loggers.push( logger );

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

    /**
     * create a rolling file appender and add it to the appender list
     *
     * @param opts
     * @returns the appender
     */
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

    this.getLoggers = function() {
        return loggers;
    };

    /**
     * start the refresh thread; minimum cycle time = 10 seconds...
     */
    this.startRefreshThread = function() {
        // TODO replace with watcher thread
        if (fs.existsSync( loggerConfigFile ) && dash.isNumber( refresh )) {
            var t = Math.max( minRefresh, refresh );
            refreshId = createInterval( manager.readConfig, t);
        }
    };

    /**
     * set the level of all loggers to the specified level
     *
     * @param level - one of the know levels
     */
    this.setAllLoggerLevels = function(level) {
        loggers.forEach(function(logger) {
            logger.setLevel( level );
        });
    };

    /**
     * read and parse the config file; change settings if required
     */
    this.readConfig = function(completeCallback) {
        // TODO refactor into configuration delegate to read stats and then process file only if stats change
        var callback = function(err, buf) {
            if (err) {
                console.log( err );
            } else {

                var conf = JSON.parse( buf.toString() );
                if (conf.appenders && conf.appenders.length > 0) {
                    // find each appender and set the level
                    conf.appenders.forEach(function(app) {
                        var level = app.level;

                        var appender = dash.find( appenders, function(item) {
                            if (item.getTypeName() === app.typeName && app.level) {
                                return item;
                            }
                        });

                        if (appender && typeof appender.setLevel === 'function') {
                            appender.setLevel( level );
                        }
                    });
                }

                if (conf.loggers && conf.loggers.length > 0) {
                    conf.loggers.forEach(function(item) {
                        if (item.category === 'all') {
                            manager.setAllLoggerLevels( item.level );
                        }
                    });
                }
            }

            if (completeCallback) {
                return completeCallback( err );
            }
        };

        fs.readFile( loggerConfigFile, callback );
    };

    this.__protected = function() {
        return {
            domain:domain,
            dfltLevel:dfltLevel,
            refresh:refresh,
            loggerConfigFile:loggerConfigFile
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
    if(arguments.length === 1 && typeof arguments[0] !== "string"){
        opts = arguments[0];
        logFilePath = undefined;
    }

    var manager = new SimpleLogger();

    manager.createConsoleAppender(opts);

    if (logFilePath) {
        opts = opts || {};
        opts.logFilePath = logFilePath;
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
SimpleLogger.createSimpleFileLogger = function(logFilePath, opts) {
    'use strict';

    var manager = new SimpleLogger();
    
    opts = opts || {};
    opts.logFilePath = logFilePath;

    manager.createFileAppender( { logFilePath:logFilePath } );

    return manager.createLogger();
};

/**
 * create a rolling file logger by passing options to SimpleLogger and Logger.  this enables setting
 * of domain, category, etc.
 *
 * @param options
 * @returns rolling logger
 */
SimpleLogger.createRollingFileLogger = function(options) {
    'use strict';

    if (!options) {
        throw new Error('createRollingFileLogger requires configuration options for this constructor');
    }

    var opts;

    // read a dynamic config file if available
    if (typeof options.readLoggerConfig === 'function') {
        opts = options.readLoggerConfig();

        opts.readLoggerConfig = options.readLoggerConfig;
    } else {
        opts = options;
    }

    var manager = new SimpleLogger( opts );

    manager.createRollingFileAppender( opts );

    if (opts.refresh && opts.loggerConfigFile) {
        process.nextTick( manager.startRefreshThread );
    }

    return manager.createLogger( opts );
};

/**
 * create a log manager
 *
 * @param options - file or rolling file specs;
 */
SimpleLogger.createLogManager = function(options) {
    'use strict';

    if (!options) {
        options = {};
    }

    var opts;

    // read a dynamic config file if available
    if (typeof options.readLoggerConfig === 'function') {
        opts = options.readLoggerConfig();

        opts.readLoggerConfig = options.readLoggerConfig;
    } else {
        opts = options;
    }

    var manager = new SimpleLogger( opts );

    if (opts.logDirectory && opts.fileNamePattern) {
        manager.createRollingFileAppender( opts );
    }

    // create at least one appender
    if (manager.getAppenders().length === 0) {
        manager.createConsoleAppender( opts );
    }

    return manager;
};
