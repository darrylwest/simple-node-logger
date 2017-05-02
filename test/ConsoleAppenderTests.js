/**
 * @class ConsoleAppender
 *
 * @author: darryl.west@raincitysoftware.com
 * @created: 7/6/14 12:18 PM
 */
const should = require('chai').should();
const dash = require( 'lodash' );
const Logger = require('../lib/Logger' );
const ConsoleAppender = require('../lib/ConsoleAppender');

describe('ConsoleAppender', function() {
    'use strict';

    const createLogger = function(options) {
        const opts = Object.assign({}, options);

        opts.domain = 'MyDomain';
        opts.category = 'MyCategory';
        opts.level = 'debug';

        return new Logger( opts );
    };

    const createOptions = function(options) {
        const opts = Object.assign({}, options);

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
        const opts = createOptions();
        const logger = createLogger();

        it('should write a formatted entry', function(done) {
            opts.writer = function(str) {
                should.exist( str );

                // console.log( str );

                str.should.contain('INFO');
                str.should.contain(':');

                done();
            };

            const appender = new ConsoleAppender( opts );
            const entry = logger.createEntry( 'info', [ 'this is a test, time: ', new Date() ] );
            appender.write( entry );

        });

        it('should skip log entries less than the specified level', function(done) {
            opts.writer = function(str) {
                should.not.exist( str );
            };

            opts.level = 'fatal';

            const appender = new ConsoleAppender( opts );
            const entry = logger.createEntry( 'info', [ 'this is a test, time: ', new Date() ] );
            appender.write( entry );

            process.nextTick(function() {
                done();
            });
        });
    });
});
