/**
 *
 *
 * @author: darryl.west@raincitysoftware.com
 * @created: 7/27/14 9:53 AM
 */
var should = require('chai').should(),
    dash = require( 'lodash' ),
    casual = require( 'casual' ),
    Logger = require('../lib/Logger' ),
    RollingFileAppender = require('../lib/RollingFileAppender');

describe('RollingFileAppender', function() {
    'use strict';

    var createLogger = function() {
        var opts = {};

        opts.domain = 'MyDomain';
        opts.category = 'MyCategory';
        opts.level = 'debug';

        return new Logger( opts );
    };

    var createOptions = function() {
        var opts = {};

        opts.level = 'debug';
        opts.fileDirectory = process.env.HOME + '/logs';
        opts.fileNamePattern = 'rolling-{YYYY.MM.DD-nn}.log';

        return opts;
    };

    describe('#instance', function() {
        var appender = new RollingFileAppender( createOptions() ),
            methods = [
                'formatter',
                'write',
                'getTypeName',
                'formatEntry',
                'formatLevel',
                'formatTimestamp'
            ];

        it('should create an instance of RollingFileAppender', function() {
            should.exist( appender );
            appender.should.be.instanceof( RollingFileAppender );
            appender.getTypeName().should.equal('RollingFileAppender');
        });

        it('should have all expected methods by size and type', function() {
            dash.methods( appender ).length.should.equal( methods.length );
            methods.forEach(function(method) {
                appender[ method ].should.be.a( 'function' );
            });
        });
    });

});
