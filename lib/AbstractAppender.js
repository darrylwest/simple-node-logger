/**
 * @class AbstractAppender
 *
 * @author: darryl.west@raincitysoftware.com
 * @created: 7/7/14 5:58 PM
 */
const Logger = require('./Logger' ),
    util = require( 'util' ),
    moment = require( 'moment' ),
    dash = require( 'lodash' );

const AbstractAppender = function(options) {
    'use strict';

    const appender = this,
        typeName = options.typeName,
        timestampFormat = options.timestampFormat || 'HH:mm:ss.SSS';

    this.separator = options.separator || ' ';

    /**
     * format the entry and return the field list
     *
     * @param entry the log entry
     * @returns field array
     */
    this.formatEntry = function(entry) {
        var fields = [];

        if (entry.domain) {
            fields.push( entry.domain );
        }

        fields.push( appender.formatTimestamp( entry.ts ) );
        fields.push( appender.formatLevel( entry.level ) );

        if (entry.category) {
            fields.push( entry.category );
        }

        fields.push( appender.formatMessage( entry.msg ) );

        return fields;
    };

    this.formatMessage = function(msg) {
        var list;

        if (!msg) {
            return '';
        }

        if (util.isArray( msg )) {
            list = msg.map(function(item) {
                if (util.isDate( item )) {
                    return appender.formatDate( item );
                } else {
                    return appender.formatObject( item );
                }
            });

            return list.join('');
        } else {
            return msg;
        }
    };

    this.formatDate = function(value) {
        return value.toJSON();
    };

    this.formatObject = function(value) {
        if (!value) {
            return '';
        }

        if (dash.isObject( value )) {
            try {
                return JSON.stringify( value );
            } catch (ignore) {
                return 'json error: ' + value.toString();
            }
        } else {
            var s = value.toString();
            if (s === '[object Object]') {
                return util.inspect( value );
            } else {
                return s;
            }
        }
    };

    /**
     * format the level string by forcing to upper case and padding to 5 chars
     *
     * @param level
     * @returns {string}
     */
    this.formatLevel = function(level) {
        var str = level.toUpperCase();
        if (str.length < 5) str += ' ';

        return str;
    };

    /**
     * format the timestamp to HH:mm:ss.SSS
     *
     * @param ts the unix milliseconds
     * @returns formatted string
     */
    this.formatTimestamp = function(ts) {
        return moment( ts ).format( timestampFormat );
    };

    /**
     * return the type name of this appender (ConsoleAppender)
     */
    this.getTypeName = function() {
        return typeName;
    };

    // constructor tests
    if (!typeName) throw new Error('appender must be constructed with a type name');
};

module.exports = AbstractAppender;

AbstractAppender.extend = function(child, options) {
    'use strict';

    const parent = new AbstractAppender( options );

    dash.extend( child, parent );

    return parent;
};
