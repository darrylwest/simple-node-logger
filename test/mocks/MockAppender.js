/**
 * @class MockAppender
 *
 * @author: darryl.west@raincitysoftware.com
 * @created: 7/6/14 8:41 AM
 */
var MockAppender = function() {
    'use strict';

    var appender = this;

    this.entries = [];

    this.write = function(entry) {
        appender.entries.push( entry );
    };
};

module.exports = MockAppender;