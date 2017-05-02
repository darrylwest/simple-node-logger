/**
 *
 *
 * @author: darryl.west@raincitysoftware.com
 * @created: 7/7/14 5:15 PM
 */
const should = require('chai').should();
const dash = require( 'lodash' );
const Logger = require('../lib/Logger' );
const FileAppender = require('../lib/FileAppender');

describe('FileAppender', function() {
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
        const opts = createOptions();
        const logger = createLogger();

        it('should write a formatted entry', function(done) {
            opts.writer = {};
            opts.writer.write = function(str) {
                should.exist( str );

                str.should.contain('INFO');
                str.should.contain(':');

                done();
            };

            const appender = new FileAppender( opts );
            const entry = logger.createEntry( 'info', [ 'this is a test, time: ', new Date() ] );
            appender.write( entry );

        });

        it('should skip log entries less than the specified level', function(done) {
            opts.writer = function(str) {
                should.not.exist( str );
            };

            opts.level = 'fatal';

            const appender = new FileAppender( opts );
            const entry = logger.createEntry( 'info', [ 'this is a test, time: ', new Date() ] );
            appender.write( entry );

            process.nextTick(function() {
                done();
            });
        });
    });
});
