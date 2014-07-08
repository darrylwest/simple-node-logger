/**
 * @class AbstractAppender
 *
 * @author: darryl.west@raincitysoftware.com
 * @created: 7/7/14 5:58 PM
 */
var Logger = require('./Logger' ),
    moment = require( 'moment' ),
    dash = require( 'lodash' );

var AbstractAppender = function(options) {
    'use strict';

    var appender = this,
        typeName = options.typeName;

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

        fields.push( moment( entry.ts ).format('HH:mm:ss.SSS') );
        fields.push( entry.level.toUpperCase() );

        if (entry.category) {
            fields.push( entry.category );
        }

        return fields;
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

    var parent = new AbstractAppender( options );

    dash.extend( child, parent );

    return parent;
};