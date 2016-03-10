/**
 * @class LoggerTests
 *
 * @author: darryl.west@raincitysoftware.com
 * @created: 7/5/14 6:28 PM
 */
const should = require('chai').should(),
    dash = require( 'lodash' ),
    randomData = require( 'random-fixture-data' ),
    Logger = require('../lib/Logger' ),
    MockAppender = require( './mocks/MockAppender');

describe('Logger', function() {
    'use strict';

    const createOptions = function() {
        var opts = {};

        opts.category = 'MyCat';
        opts.appenders = [ new MockAppender() ];

        return opts;
    };

    describe('#instance', function() {
        var logger = new Logger( createOptions() ),
            methods = [
                'log',
                'createEntry',
                'setLevel',
                'getLevel',
                'setAppenders',
                'addAppender',
                'removeAppender',
                'getAppenders',
                'isDebug',
                'isInfo',
                '__protected'
            ];

        it('should create an instance of Logger', function() {
            should.exist( logger );
            logger.should.be.instanceof( Logger );
        });

        it('should have all expected methods by size and type', function() {
            var allMethods = methods.concat( Logger.STANDARD_LEVELS );
            dash.functionsIn( logger ).length.should.equal( allMethods.length );
            allMethods.forEach(function(method) {
                logger[ method ].should.be.a( 'function' );
            });
        });

        it('should have one appender', function() {
            var appenders = logger.getAppenders();
            should.exist( appenders );
            appenders.length.should.equal( 1 );
        });
    });

    describe('log', function() {
        var opts = createOptions();

        opts.level = Logger.STANDARD_LEVELS[0]; // all
        opts.domain = 'MyApp';
        opts.pid = 999;

        it('should respond to all log statements', function(done) {
            var logger = new Logger( opts ),
                appender = new MockAppender();

            logger.setAppenders( [ appender ] );

            logger.trace('this is a fallopia japonica test', { n:'one'} );
            logger.debug( randomData.words( 3 ));
            logger.info( randomData.words( 3 ));
            logger.warn( randomData.words( 3 ));
            logger.error( randomData.words( 3 ));
            logger.fatal( randomData.words( 3 ));

            process.nextTick(function() {
                appender.entries.length.should.equal( 6 );

                done();
            });
        });

        it('should contain all entry attributes', function(done) {
            var logger = new Logger( opts ),
                appender = new MockAppender(),
                text = randomData.sentence;

            logger.setAppenders( [ appender ] );

            logger.info( text );

            process.nextTick(function() {
                appender.entries.length.should.equal( 1 );
                var entry = appender.entries[0];

                // console.log( entry );

                entry.ts.should.be.above( Date.now() - 1000 );
                entry.pid.should.equal( opts.pid );
                entry.domain.should.equal( opts.domain );
                entry.category.should.equal( opts.category );
                entry.level.should.equal('info');
                entry.msg.length.should.equal( 1 );
                entry.msg[0].should.equal( text );

                done();
            });
        });
    });

    describe('#isLevel', function() {
        it('should report isDebug as true if at or below debug', function() {
            var log = new Logger( createOptions() );

            log.setLevel('debug');
            log.getLevel().should.equal( 'debug' );
            log.isDebug().should.equal( true );
            log.setLevel('trace');
            log.isDebug().should.equal( true );
            log.setLevel('all');
            log.isDebug().should.equal( true );

        });
        it('should report isDebug as false if above debug', function() {
            var log = new Logger( createOptions() );

            log.setLevel('info');
            log.getLevel().should.equal( 'info' );
            log.isDebug().should.equal( false );

        });

        it('should report isInfo as true if at or below info', function() {
            var log = new Logger( createOptions() );

            log.setLevel('info');
            log.getLevel().should.equal( 'info' );
            log.isInfo().should.equal( true );
            log.setLevel('trace');
            log.isDebug().should.equal( true );
            log.setLevel('all');
            log.isDebug().should.equal( true );
        });

        it('should report isInfo as false if above info', function() {
            var log = new Logger( createOptions() );

            log.setLevel('warn');
            log.getLevel().should.equal( 'warn' );
            log.isInfo().should.equal( false );
        });
    });
});
