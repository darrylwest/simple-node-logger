/**
 *
 *
 * @author: darryl.west@raincitysoftware.com
 * @created: 7/27/14 9:53 AM
 */
var should = require('chai').should(),
    dash = require( 'lodash' ),
    casual = require( 'casual' ),
    moment = require('moment' ),
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
        opts.logDirectory = process.env.HOME + '/logs';
        opts.fileNamePattern = 'app-<Date>.log';
        opts.autoOpen = false;

        return opts;
    };

    describe('#instance', function() {
        var appender = new RollingFileAppender( createOptions() ),
            methods = [
                'formatter',
                'write',
                'checkForRoll',
                'createFileName',
                '__protected',
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

    describe('createFileName', function() {
        var opts = createOptions(),
            now = new moment( '2014-02-06T18:00Z' ).utc(),
            patterns = [
                'YY.MM.DD',
                'YYYY.MM.DD.HH',
                'YYYY.MM.DD-a',
                'YYYYMMDD',
                'MMM-DD'
            ],
            expected = [
                'app-14.02.06.log',
                'app-2014.02.06.18.log',
                'app-2014.02.06-pm.log',
                'app-20140206.log',
                'app-Feb-06.log'
            ];

        it('should create a filename based on known pattern and date', function() {
            var appender,
                idx,
                fn;

            for (idx = 0; idx < patterns.length; idx++) {
                opts.dateFormat = patterns[ idx ];
                appender = new RollingFileAppender( opts );

                fn = appender.createFileName( now );

                // console.log( fn );

                fn.should.equal( expected[ idx ] );
            }
        });
    });

});
