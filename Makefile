
all:
	@make npm
	@make test

npm:
	@npm install

test:
	@( [ -d node_modules ] || make npm )
	@( grunt test )

jshint:
	@( [ -d node_modules ] || make npm )
	@( grunt jshint )

watch:
	@( grunt watchall )

docs:
	@( grunt jsdoc )

.PHONY:	npm
.PHONY:	test
.PHONY:	jshint
.PHONY:	watch
