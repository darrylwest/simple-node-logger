JSFILES=index.js lib/*.js test/*.js test/mocks/*.js
TESTFILES=test/*.js
JSHINT=node_modules/.bin/jshint
MOCHA=node_modules/.bin/mocha

all:
	@make npm
	@make test

npm:
	@npm install

test:
	@( [ -d node_modules ] || make npm )
	@( $(MOCHA) $(TESTFILES) )
	@( $(JSHINT) --reporter node_modules/jshint-stylish/ $(JSFILES) )

jshint:
	@( $(JSHINT) --verbose --reporter node_modules/jshint-stylish/ $(JSFILES) )

watch:
	@( ./watcher.js )

.PHONY:	npm
.PHONY:	test
.PHONY:	jshint
.PHONY:	watch
