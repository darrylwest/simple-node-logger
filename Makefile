
all:
	@make test

test:
	@( node test/file-log.js )
	@( node test/file-only.js )
	@( node test/stdout-log.js )

publish:
	@( node publish ./ )

.PHONY:	test
.PHONY:	publish
