/**
 * @class AbstractAppenderTests
 *
 * @author: darryl.west@raincitysoftware.com
 * @created: 7/7/14 6:27 PM
 */
const should = require('chai').should(),
    dash = require( 'lodash' ),
    Logger = require('../lib/Logger' ),
    AbstractAppender = require('../lib/AbstractAppender');

describe('AbstractAppender', function() {
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

        opts.typeName = 'FooAppender';

        return opts;
    };

    describe('#instance', function() {
        var appender = new AbstractAppender( createOptions() ),
            methods = [
                'getTypeName',
                'formatEntry',
                'formatLevel',
                'formatTimestamp',
                'formatMessage',
                'formatDate',
                'formatObject'
            ];

        it('should create an instance of AbstractAppender', function() {
            should.exist( appender );
            appender.should.be.instanceof( AbstractAppender );
            appender.getTypeName().should.equal('FooAppender');
        });

        it('should have all expected methods by size and type', function() {
            dash.functionsIn( appender ).length.should.equal( methods.length );
            methods.forEach(function(method) {
                appender[ method ].should.be.a( 'function' );
            });
        });
    });

    describe('formatEntry', function() {
        var appender = new AbstractAppender( createOptions() ),
            logger = createLogger();

        it('should create and format fields for a specified log entry', function() {
            var entry = logger.createEntry( 'info', [ 'this is a test, time: ', new Date() ] ),
                fields = appender.formatEntry( entry );

            should.exist( fields );
            fields.length.should.equal( 5 );
        });
    });

    describe('formatObject', function() {
        var appender = new AbstractAppender( createOptions() );

        it('should format a complex object into human readable output', function() {
            var formatted,
                list = [
                    { name:'flarb', date:new Date() },
                    appender
                ];

            list.forEach(function(obj) {
                formatted = appender.formatObject( obj );

                // console.log( formatted );
                formatted.should.be.a('string');
            });
        });
    });

    describe('formatMessage', function() {
        var appender = new AbstractAppender( createOptions() );

        it('should format a list of log messages', function() {
            var list = [ 'this is a test, time: ', new Date(), ' ', { name:'flarb', date:new Date() }, ' ', appender ];

            var formatted = appender.formatMessage( list );

            // console.log( formatted );
            should.exist( formatted );
            formatted.should.be.a('string');
        });
    });

    describe('#timestampFormat', function() {
        var ts = 1428516587697; // 2015-04-08T18:09:47.697Z

        it('should have the default format', function() {
            var opts = createOptions(),
                appender = new AbstractAppender( opts),
                sdt = appender.formatTimestamp( ts),
                parts = sdt.split('.');

            // get this to pass for all timezones
            parts[0].split(':')[1].should.equal( '09' );
            parts[0].split(':')[2].should.equal( '47' );
            parts[1].should.equal( '697' );

            // sdt.should.equal( '18:09:47.697');
        });

        it('should have a custom format from options', function() {
            var opts = {
                    typeName:'customerTSAppender',
                    timestampFormat:'x' // unix timestamp
                },
                appender = new AbstractAppender( opts),
                sdt = appender.formatTimestamp( ts );

            sdt.should.equal( ts.toString() );
        });
    });
});
