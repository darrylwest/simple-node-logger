/**
 * @class SimpleLoggerTests
 *
 * @author: darryl.west@raincitysoftware.com
 * @created: 7/7/14 9:44 AM
 */
const should = require('chai').should();
const dash = require( 'lodash' );
const fs = require( 'fs' );
const Logger = require('../lib/Logger' );
const SimpleLogger = require( '../lib/SimpleLogger' );
const MockAppender = require( './mocks/MockAppender');

describe('SimpleLogger', function() {
    'use strict';

    const createOptions = function() {
        const opts = {};

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
                'setAllLoggerLevels',
                'startRefreshThread',
                'readConfig',
                '__protected'
            ];

        it('should create an instance of SimpleLogger', function() {
            should.exist( manager );
            manager.should.be.instanceof( SimpleLogger );

            manager.getAppenders().length.should.equal( 0 );
            manager.getLoggers().length.should.equal( 0 );

            const p = manager.__protected();

            should.exist( p );
            p.dfltLevel.should.equal( 'info' );
        });

        it('should have all expected methods by size and type', function() {
            dash.functionsIn( manager ).length.should.equal( methods.length );
            methods.forEach(function(method) {
                manager[ method ].should.be.a( 'function' );
            });
        });
    });

    describe('createLogger', function() {
        const manager = new SimpleLogger( createOptions() );

        it('should create a basic logger with console appender', function() {
            const log = manager.createLogger('MyCategory', 'warn');

            should.exist( log );
            log.__protected().category.should.equal( 'MyCategory' );
            log.getLevel().should.equal( 'warn' );

            log.should.be.instanceof( Logger );
        });
    });

    describe('#domain', function() {
        const opts = createOptions();

        opts.domain = 'MyDomain';
        opts.level = 'error';

        const manager = new SimpleLogger( opts );

        it('should create a simple logger with a domain', function() {
            const p = manager.__protected();
            p.domain.should.equal( opts.domain );
            p.dfltLevel.should.equal( opts.level );
        });

        it('should create a log with specified domain, category and level', function() {
            const log = manager.createLogger('MyCat');

            log.getLevel().should.equal( opts.level );
            log.__protected().domain.should.equal( opts.domain );

            // default to a single console appender
            log.getAppenders().length.should.equal( 0 );
        });
    });

    describe('addAppender', function() {
        const manager = new SimpleLogger( createOptions() );

        it('should add a new appender to the list', function() {
            manager.getAppenders().length.should.equal( 0 );

            const appender = manager.addAppender( new MockAppender() );

            should.exist( appender );
            appender.should.be.instanceof( MockAppender );
            manager.getAppenders().length.should.equal( 1 );
        });
    });

    describe('createConsoleAppender', function() {
        const manager = new SimpleLogger( createOptions() );

        it('should create a new console appender and add it to the appenders list', function() {
            const appender = manager.createConsoleAppender();
            should.exist( appender );
            manager.getAppenders().length.should.equal( 1 );
        });
    });

    describe('createFileAppender', function() {
        const manager = new SimpleLogger( createOptions() );

        it('should create a new file appender and add it to the appenders list', function() {
            const appender = manager.createFileAppender( { logFilePath:'/dev/null' });
            should.exist( appender );
            manager.getAppenders().length.should.equal( 1 );
        });
    });

    describe('createRollingFileAppender', function() {
        const manager = new SimpleLogger( createOptions() );

        it('should create a new rolling file appender and add it to the appenders list', function() {
            const opts = {};

            opts.level = 'debug';
            opts.logDirectory = process.env.HOME + '/logs';
            opts.fileNamePattern = 'app-<Date>.log';
            opts.autoOpen = false;

            const appender = manager.createRollingFileAppender( opts );
            should.exist( appender );
            manager.getAppenders().length.should.equal( 1 );
        });
    });

    describe('startRefreshThread', function() {
        const opts = createOptions();

        opts.loggerConfigFile = __dirname + '/fixtures/logger-config.json';
        opts.refresh = 2000;

        const manager = new SimpleLogger( opts );

        it('should start refresh thread if config file and refresh are set', function(done) {
            manager.startRefreshThread = function() {
                if (fs.existsSync( opts.loggerConfigFile ) && dash.isNumber( opts.refresh )) {
                    // console.log('file: ', opts.loggerConfigFile );
                    const obj = JSON.parse( fs.readFileSync( opts.loggerConfigFile ));
                    should.exist( obj );

                    done();
                } else {
                    /*eslint no-console: "off"*/
                    console.log(opts.refresh);
                    console.log('file: ', opts.loggerConfigFile, ' does not exist?');
                }
            };

            process.nextTick( manager.startRefreshThread );
        });
    });

    describe('readConfig', function() {
        const opts = createOptions();

        opts.loggerConfigFile = __dirname + '/fixtures/logger-config.json';
        opts.refresh = 2000;

        const manager = new SimpleLogger( opts );

        it('should read and parse a valid configuration file', function(done) {
            const callback = function(err) {
                should.not.exist( err );

                // TODO test the appenders to see if at the correct level

                // TODO test the loggers to see if at the correct level

                done();
            };

            manager.readConfig( callback );
        });
    });

    describe('createSimpleLogger', function() {
        it('should create a simple logger with a single console adapter when invoked with null options', function() {
            const log = SimpleLogger.createSimpleLogger();

            should.exist( log );
            log.getLevel().should.equal('info');
            const appenders = log.getAppenders();
            appenders.length.should.equal(1);
            appenders[0].getTypeName().should.equal('ConsoleAppender');
        });

        it('should create a simple logger with a single console adapter when invoked with format options', function() {
            const opts = {
                timestampFormat:'x' // unix timestamp
            };
            const log = SimpleLogger.createSimpleLogger( opts );

            should.exist( log );
            log.getLevel().should.equal('info');
            const appenders = log.getAppenders();
            appenders.length.should.equal(1);
            const appender = appenders[0];
            appender.getTypeName().should.equal('ConsoleAppender');
            const dt = new Date('2017-05-01T01:01:01Z');
            appender.formatTimestamp(dt).should.equal('1493600461000');
        });

        it('should create a simple logger with  console and file appenders when invoked with a filename', function() {
            const log = SimpleLogger.createSimpleLogger('/tmp/mytmpfile.log');

            should.exist( log );
            log.getLevel().should.equal('info');
            const appenders = log.getAppenders();
            appenders.length.should.equal(2);
            appenders[0].getTypeName().should.equal('ConsoleAppender');
            appenders[1].getTypeName().should.equal('FileAppender');
        });
    });
});
