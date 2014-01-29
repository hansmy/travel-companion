REPORTER = nyan
TESTS =test/*.js
test:
	@./node_modules/.bin/mocha \
	 --reporter $(REPORTER) \
     --ui tdd
test-w:
	@./node_modules/.bin/mocha \
	--reporter $(REPORTER) \
    --growl \
    --watch
.PHONY: test test-w test-m