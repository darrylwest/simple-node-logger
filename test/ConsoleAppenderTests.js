/**
 * @class ConsoleAppender
 *
 * @author: darryl.west@raincitysoftware.com
 * @created: 7/6/14 12:18 PM
 */
const should = require('chai').should(),
    dash = require( 'lodash' ),
    Logger = require('../lib/Logger' ),
    ConsoleAppender = require('../lib/ConsoleAppender');

describe('ConsoleAppender', function() {
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

        return opts;
    };

    describe('#instance', function() {
        const appender = new ConsoleAppender( createOptions() ),
            methods = [
                'formatter',
                'write',
                'setLevel',
                'getTypeName',
                'formatEntry',
                'formatLevel',
                'formatTimestamp',
                'formatMessage',
                'formatDate',
                'formatObject'
            ];

        it('should create an instance of ConsoleAppender', function() {
            should.exist( appender );
            appender.should.be.instanceof( ConsoleAppender );
            appender.getTypeName().should.equal('ConsoleAppender');
        });

        it('should have all expected methods by size and type', function() {
            dash.functionsIn( appender ).length.should.equal( methods.length );
            methods.forEach(function(method) {
                appender[ method ].should.be.a( 'function' );
            });
        });
    });

    describe('write/format', function() {
        var opts = createOptions(),
            logger = createLogger();

        it('should write a formatted entry', function(done) {
            var appender,
                entry;

            opts.writer = function(str) {
                should.exist( str );

                console.log( str );

                str.should.contain('INFO');
                str.should.contain(':');

                done();
            };

            appender = new ConsoleAppender( opts );
            entry = logger.createEntry( 'info', [ 'this is a test, time: ', new Date() ] );
            appender.write( entry );

        });

        it('should skip log entries less than the specified level', function(done) {
            var appender,
                entry;

            opts.writer = function(str) {
                should.not.exist( str );
            };

            opts.level = 'fatal';

            appender = new ConsoleAppender( opts );
            entry = logger.createEntry( 'info', [ 'this is a test, time: ', new Date() ] );
            appender.write( entry );

            process.nextTick(function() {
                done();
            });
        });
    });
});
