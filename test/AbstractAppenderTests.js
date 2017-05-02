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

    const createLogger = function(options) {
        var opts = Object.assign({}, options);

        opts.domain = 'MyDomain';
        opts.category = 'MyCategory';
        opts.level = 'debug';

        return new Logger( opts );
    };

    const  createOptions = function(options) {
        var opts = Object.assign({}, options);

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
        const  appender = new AbstractAppender( createOptions() );
        const logger = createLogger();

        it('should create and format fields for a specified log entry', function() {
            const entry = logger.createEntry( 'info', [ 'this is a test, time: ', new Date() ] );
            const fields = appender.formatEntry( entry );

            should.exist( fields );
            fields.length.should.equal( 5 );
        });
    });

    describe('formatObject', function() {
        const appender = new AbstractAppender( createOptions() );

        it('should format a complex object into human readable output', function() {
            const list = [
                { 
                    name:'flarb', 
                    date:new Date() 
                },
                appender
            ];

            list.forEach(function(obj) {
                const formatted = appender.formatObject( obj );

                // console.log( formatted );
                formatted.should.be.a('string');
            });
        });
    });

    describe('formatMessage', function() {
        const appender = new AbstractAppender( createOptions() );

        it('should format a list of log messages', function() {
            const list = [ 'this is a test, time: ', new Date(), ' ', { name:'flarb', date:new Date() }, ' ', appender ];

            const formatted = appender.formatMessage( list );

            // console.log( formatted );
            should.exist( formatted );
            formatted.should.be.a('string');
        });
    });

    describe('#timestampFormat', function() {
        const ts = 1428516587697; // 2015-04-08T18:09:47.697Z

        it('should have the default format', function() {
            const opts = createOptions();
            const appender = new AbstractAppender( opts );
            const sdt = appender.formatTimestamp( ts);
            const parts = sdt.split('.');

            // get this to pass for all timezones
            parts[0].split(':')[1].should.equal( '09' );
            parts[0].split(':')[2].should.equal( '47' );
            parts[1].should.equal( '697' );

            // sdt.should.equal( '18:09:47.697');
        });

        it('should have a custom format from options', function() {
            const opts = {
                typeName:'customerTSAppender',
                timestampFormat:'x' // unix timestamp
            };
            const appender = new AbstractAppender( opts);
            const sdt = appender.formatTimestamp( ts );

            sdt.should.equal( ts.toString() );
        });
    });
});
