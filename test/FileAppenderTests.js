/**
 *
 *
 * @author: darryl.west@raincitysoftware.com
 * @created: 7/7/14 5:15 PM
 */
const should = require('chai').should(),
    dash = require( 'lodash' ),
    Logger = require('../lib/Logger' ),
    FileAppender = require('../lib/FileAppender');

describe('FileAppender', function() {
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
        opts.logFilePath = '/tmp/log-test.log';
        opts.autoOpen = false;

        return opts;
    };

    describe('#instance', function() {
        var appender = new FileAppender( createOptions() ),
            methods = [
                'formatter',
                'write',
                'setLevel',
                'closeWriter',
                'getTypeName',
                'formatEntry',
                'formatLevel',
                'formatTimestamp',
                'formatMessage',
                'formatDate',
                'formatObject'
            ];

        it('should create an instance of FileAppender', function() {
            should.exist( appender );
            appender.should.be.instanceof( FileAppender );
            appender.getTypeName().should.equal('FileAppender');
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

            opts.writer = {};
            opts.writer.write = function(str) {
                should.exist( str );

                console.log( str );

                str.should.contain('INFO');
                str.should.contain(':');

                done();
            };

            appender = new FileAppender( opts );
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

            appender = new FileAppender( opts );
            entry = logger.createEntry( 'info', [ 'this is a test, time: ', new Date() ] );
            appender.write( entry );

            process.nextTick(function() {
                done();
            });
        });
    });
});
