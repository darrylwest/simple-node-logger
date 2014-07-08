/**
 * @class AbstractAppenderTests
 *
 * @author: darryl.west@raincitysoftware.com
 * @created: 7/7/14 6:27 PM
 */
var should = require('chai').should(),
    dash = require( 'lodash' ),
    casual = require( 'casual' ),
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
                'formatLevel'
            ];

        it('should create an instance of AbstractAppender', function() {
            should.exist( appender );
            appender.should.be.instanceof( AbstractAppender );
            appender.getTypeName().should.equal('FooAppender');
        });

        it('should have all expected methods by size and type', function() {
            dash.methods( appender ).length.should.equal( methods.length );
            methods.forEach(function(method) {
                appender[ method ].should.be.a( 'function' );
            });
        });
    });

    describe('formatFields', function() {
        var appender = new AbstractAppender( createOptions() ),
            logger = createLogger();

        it('should create and format fields for a specified log entry', function() {
            var entry = logger.createEntry( 'info', [ 'this is a test, time: ', new Date() ] ),
                fields = appender.formatEntry( entry );

            should.exist( fields );
            fields.length.should.equal( 5 );
        });
    });
});