/**
 *
 *
 * @author: darryl.west@raincitysoftware.com
 * @created: 7/27/14 9:53 AM
 */
const should = require('chai').should(),
    dash = require( 'lodash' ),
    path = require( 'path' ),
    moment = require('moment' ),
    Logger = require('../lib/Logger' ),
    RollingFileAppender = require('../lib/RollingFileAppender');

describe('RollingFileAppender', function() {
    'use strict';

    const createLogger = function() {
        var opts = {};

        opts.domain = 'MyDomain';
        opts.category = 'MyCategory';
        opts.level = 'debug';

        return new Logger( opts );
    };

    const createOptions = function() {
        var opts = {};

        opts.level = 'debug';
        opts.logDirectory = process.env.HOME + '/logs';
        opts.fileNamePattern = 'app-<Date>.log';
        opts.autoOpen = false;

        return opts;
    };

    describe('#instance', function() {
        const appender = new RollingFileAppender( createOptions() ),
            methods = [
                'formatter',
                'write',
                'setLevel',
                'checkForRoll',
                'createFileName',
                '__protected',
                'getTypeName',
                'formatEntry',
                'formatLevel',
                'formatTimestamp',
                'formatMessage',
                'formatDate',
                'formatObject'
            ];

        it('should create an instance of RollingFileAppender', function() {
            should.exist( appender );
            appender.should.be.instanceof( RollingFileAppender );
            appender.getTypeName().should.equal('RollingFileAppender');

            var p = appender.__protected();
            should.exist( p );
            p.writers.length.should.equal( 0 );
            p.openWriter.should.be.a( 'function' );
        });

        it('should have all expected methods by size and type', function() {
            dash.functionsIn( appender ).length.should.equal( methods.length );
            methods.forEach(function(method) {
                appender[ method ].should.be.a( 'function' );
            });
        });
    });

    describe('checkForRoll', function() {
        var opts = createOptions();

        opts.dateFormat = 'YYYY.MM.DD';

        it('should return false when the date stays within the same day', function() {
            var now = moment( '2014-01-01T00:00:00' ),
                fn = opts.fileNamePattern.replace( /<DATE>/i, now.format( opts.dateFormat ) ),
                appender,
                p;

            opts.currentFile = path.join( process.env.HOME, fn );
            appender = new RollingFileAppender( opts );
            p = appender.__protected();

            appender.checkForRoll( now ).should.equal( false );

            // now add a second
            now = now.add( 1, 's' );
            appender.checkForRoll( now ).should.equal( false );

            // now add a few hours
            now = now.add( 4, 'h' );
            appender.checkForRoll( now ).should.equal( false );
        });

        it('should return true when the day changes', function() {
            var now = moment(),
                fn = opts.fileNamePattern.replace( /<DATE>/i, now.format( opts.dateFormat ) ),
                appender,
                p;

            opts.currentFile = path.join( process.env.HOME, fn );
            appender = new RollingFileAppender( opts );
            p = appender.__protected();

            // now add a few hours
            now = now.add( 1, 'day' );
            appender.checkForRoll( now ).should.equal( true );
        });

    });

    describe('createFileName', function() {
        var opts = createOptions(),
            now = moment( '2014-02-06T18:00Z' ).utc(),
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
