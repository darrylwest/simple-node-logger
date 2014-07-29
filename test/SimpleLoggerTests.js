/**
 *
 *
 * @author: darryl.west@roundpeg.com
 * @created: 7/7/14 9:44 AM
 */
var should = require('chai').should(),
    dash = require( 'lodash' ),
    casual = require( 'casual' ),
    Logger = require('../lib/Logger' ),
    SimpleLogger = require( '../lib/SimpleLogger' ),
    MockAppender = require( './mocks/MockAppender');

describe('SimpleLogger', function() {
    'use strict';

    var createOptions = function() {
        var opts = {};

        return opts;
    };

    describe('#instance', function() {
        var manager = new SimpleLogger( createOptions() ),
            methods = [
                'createLogger',
                'createConsoleAppender',
                'createFileAppender',
                'createRollingFileAppender',
                'addAppender',
                'getAppenders',
                'getLoggers',
                '__protected'
            ];

        it('should create an instance of SimpleLogger', function() {
            should.exist( manager );
            manager.should.be.instanceof( SimpleLogger );

            manager.getAppenders().length.should.equal( 0 );
            manager.getLoggers().length.should.equal( 0 );
        });

        it('should have all expected methods by size and type', function() {
            dash.methods( manager ).length.should.equal( methods.length );
            methods.forEach(function(method) {
                manager[ method ].should.be.a( 'function' );
            });
        });
    });

    describe('createLogger', function() {
        var manager = new SimpleLogger( createOptions() );

        it('should create a basic logger with console appender', function() {
            var log = manager.createLogger('MyCategory', 'warn');

            should.exist( log );
            log.__protected().category.should.equal( 'MyCategory' );
            log.getLevel().should.equal( 'warn' );

            log.should.be.instanceof( Logger );
        });
    });

    describe('#domain', function() {
        var opts = createOptions(),
            manager;

        opts.domain = 'MyDomain';
        opts.level = 'error';

        manager = new SimpleLogger( opts );

        it('should create a simple logger with a domain', function() {
            manager.__protected().domain.should.equal( opts.domain );
            manager.__protected().dfltLevel.should.equal( opts.level );
        });

        it('should create a log with specified domain, category and level', function() {
            var log = manager.createLogger('MyCat');

            log.getLevel().should.equal( opts.level );
            log.__protected().domain.should.equal( opts.domain );

            // default to a single console appender
            log.getAppenders().length.should.equal( 0 );
        });
    });

    describe('addAppender', function() {
        var manager = new SimpleLogger( createOptions() );

        it('should add a new appender to the list', function() {
            manager.getAppenders().length.should.equal( 0 );

            var appender = manager.addAppender( new MockAppender() );

            should.exist( appender );
            appender.should.be.instanceof( MockAppender );
            manager.getAppenders().length.should.equal( 1 );
        });
    });

    describe('createConsoleAppender', function() {
        var manager = new SimpleLogger( createOptions() );

        it('should create a new console appender and add it to the appenders list', function() {
            var appender = manager.createConsoleAppender();
            manager.getAppenders().length.should.equal( 1 );
        });
    });

    describe('createFileAppender', function() {
        var manager = new SimpleLogger( createOptions() );

        it('should create a new file appender and add it to the appenders list', function() {
            var appender = manager.createFileAppender( { logFilePath:'/dev/null' });
            manager.getAppenders().length.should.equal( 1 );
        });
    });

    describe('createRollingFileAppender', function() {
        var manager = new SimpleLogger( createOptions() );

        it('should create a new rolling file appender and add it to the appenders list', function() {
            var opts = {},
                appender;

            opts.level = 'debug';
            opts.logDirectory = process.env.HOME + '/logs';
            opts.fileNamePattern = 'app-<Date>.log';
            opts.autoOpen = false;

            appender = manager.createRollingFileAppender( opts );
            manager.getAppenders().length.should.equal( 1 );
        });
    });
});
