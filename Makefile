JSFILES=index.js lib/*.js test/*.js test/mocks/*.js
TESTFILES=test/*.js
ESLINT=node_modules/.bin/eslint
MOCHA=node_modules/.bin/mocha

all:
	@make npm
	@make test

npm:
	@npm install

lint:
	@( $(ESLINT) $(JSFILES) && echo "lint tests passed..." )

test:
	@( [ -d node_modules ] || make npm )
	@( $(MOCHA) $(TESTFILES) && make lint )

integration:
	@( ./test/integration/run-examples.sh )

watch:
	@( ./watcher.js )

.PHONY:	npm
.PHONY:	test
.PHONY:	jshint
.PHONY:	watch
