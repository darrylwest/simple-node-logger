# Simple Node Logger
- - -

A very simple multi-level logger for console and file.

- levels: trace, debug, info, warn, error and fatal levels (plus all and off)
- flexible appender/formatters with default to HH:mm:ss.SSS LEVEL message
- add appenders to send output to console, file, etc

Installation
===

    npm install simple-node-logger --save


How to use
===
	// create a stdout console logger
	var log = new require('simple-node-logger').createLogger();

or

	// create a stdout and file logger
	var log = require('simple-node-logger').createLogger('project.log');

or

	// create a file only file logger
	var log = require('simple-node-logger').createFileLogger('project.log');
	
The first use will simply log to the console.  The second will log to the console and to the project.log file.  The third logs to the file only.

Log Levels
===
The default level is 'info' but the log level can be set by doing this:

	log.setLevel('warn');
	
This sets the log level to warn and suppresses debug and info messages.

Default Format
===
The default format is LEVEL [ time ] message. For example, the log message:

	log.info('subscription to ', channel, ' accepted at ', new Date().toJSON());

Yields:

	INFO [14:14:21.363]  subscription to /devchannel accepted at 2014-04-10T14:20:52.938Z
	


License
===
Apache 2.0

- - -
<p><small><em>version 0.9.72</em></small></p>
