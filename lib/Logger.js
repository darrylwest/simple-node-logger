/**
 * @class Logger
 *
 * @author: darryl.west@raincitysoftware.com
 * @created: 7/5/14 6:28 PM
 */
const dash = require('lodash');

const Logger = function(options) {
    'use strict';

    var logger = this,
        pid = options.pid || process.pid,
        domain = options.domain,
        category = options.category,
        level = options.level || Logger.DEFAULT_LEVEL,
        levels = options.levels || Logger.STANDARD_LEVELS,
        currentLevel = levels.indexOf( level ),
        appenders = options.appenders || [];

    /**
     * log the statement message
     *
     * @param level the level of this message
     * @param msg
     */
    this.log = function(level, msg) {
        var entry = logger.createEntry( level, msg );

        process.nextTick(function() {
            // write the message to the appenders...
            appenders.forEach(function(appender) {
                appender.write( entry );
            });
        });

        return entry;
    };

    /**
     * create the entry object used to log messages
     *
     * @param level - info, debug, etc.
     * @param messageList - a list of message objects
     * @returns then entry object
     */
    this.createEntry = function(level, messageList) {
        var entry = {};

        entry.ts = Date.now();

        entry.pid = pid;
        if (domain) entry.domain = domain;
        if (category) entry.category = category;

        entry.level = level;
        entry.msg = messageList;

        return entry;
    };

    /**
     * set the level
     *
     * @param lvl one of the recognized logger levels
     */
    this.setLevel = function(lvl) {
        currentLevel = levels.indexOf(lvl);
        level = lvl;
        appenders.forEach( function(a){
            a.setLevel( lvl );
        });
    };

    /**
     * return the current level string
     */
    this.getLevel = function() {
        return level;
    };

    /**
     * set the list of appenders
     * @param app
     */
    this.setAppenders = function(appenderList) {
        appenders = appenderList;
    };

    /**
     * add an appender to the list
     *
     * @param appender - implements write method
     */
    this.addAppender = function(appender) {
        appenders.push( appender );
    };

    /**
     * remove the appender using the type name
     */
    this.removeAppender = function(typeName) {
        throw new Error('not implemented yet');
    };

    this.getAppenders = function() {
        return appenders;
    };

    this.isDebug = function() {
        return isLevelAt( 'debug' );
    };

    this.isInfo = function() {
        return isLevelAt( 'info' );
    };

    var isLevelAt = function(lvl) {
        var idx = levels.indexOf( lvl );

        return idx >= currentLevel;
    };

    // now initialize the methods for the standard levels
    var init = function() {
        levels.forEach(function(lvl) {
            logger[ lvl ] = function() {
                if (levels.indexOf( lvl ) >= currentLevel) {
                    var args = Array.prototype.slice.call( arguments );
                    logger.log( lvl, args );
                }
            };
        });
    };

    this.__protected = function() {
        return {
            pid:pid,
            domain:domain,
            category:category
        };
    };

    init();
};

Logger.STANDARD_LEVELS = [ 'all', 'trace', 'debug', 'info', 'warn', 'error', 'fatal' ];
Logger.DEFAULT_LEVEL = 'info';

module.exports = Logger;
