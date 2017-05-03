/**
 *
 *
 * @author: darryl.west@raincitysoftware.com
 * @created: 7/27/14 9:53 AM
 */
const should = require('chai').should();
const dash = require( 'lodash' );
const path = require( 'path' );
const moment = require('moment' );
const RollingFileAppender = require('../lib/RollingFileAppender');

describe('RollingFileAppender', function() {
    'use strict';

    const createOptions = function() {
        const opts = {};

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

            const p = appender.__protected();
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

        it('should check openWriter can open a new file with default createFileName', function() {
            const p = appender.__protected();
            p.openWriter.should.be.a('function');
            p.writers.length.should.equal( 0 );
            const openWriter = p.openWriter;
            openWriter.should.be.a('function');
            openWriter();
            p.writers.length.should.equal( 1 );
        });

        it('should check openWriter can optn a new files with filename passed in');
    });

    describe('checkForRoll', function() {
        var opts = createOptions();

        opts.dateFormat = 'YYYY.MM.DD';

        it('should return false when the date stays within the same day', function() {
            var now = moment( '2014-01-01T00:00:00' ),
                fn = opts.fileNamePattern.replace( /<DATE>/i, now.format( opts.dateFormat ) ),
                appender;

            opts.currentFile = path.join( process.env.HOME, fn );
            appender = new RollingFileAppender( opts );
            const p = appender.__protected();

            should.exist( p );

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
                appender;

            opts.currentFile = path.join( process.env.HOME, fn );
            appender = new RollingFileAppender( opts );
            const p = appender.__protected();

            should.exist( p );

            // now add a few hours
            now = now.add( 1, 'day' );
            appender.checkForRoll( now ).should.equal( true );
        });

    });

    describe('createFileName', function() {
        const opts = createOptions();
        const now = moment( '2014-02-06T18:00Z' ).utc();
        const patterns = [
            'YY.MM.DD',
            'YYYY.MM.DD.HH',
            'YYYY.MM.DD-a',
            'YYYYMMDD',
            'MMM-DD'
        ];
        const expected = [
            'app-14.02.06.log',
            'app-2014.02.06.18.log',
            'app-2014.02.06-pm.log',
            'app-20140206.log',
            'app-Feb-06.log'
        ];

        it('should create a filename based on known pattern and date', function() {
            // TODO : refactor for forEach
            for (let idx = 0; idx < patterns.length; idx++) {
                opts.dateFormat = patterns[ idx ];
                const appender = new RollingFileAppender( opts );

                const fn = appender.createFileName( now );

                fn.should.equal( expected[ idx ] );
            }
        });
    });

});
