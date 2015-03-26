# refresh-test-data:
# 	curl -sG 'https://thesession.org/members/61738/tunebook' -o 'tests/fixtures/thesession/tunebook.html'
# 	curl -sG 'https://thesession.org/tunes/1/abc'  -o 'tests/fixtures/thesession/tune.abc'

# ci-test:
# 	@./node_modules/.bin/gulp jshint
# 	$(MAKE) refresh-test-data

# test:
	# export NO_SCRAPE=true; export DB_HOST=testhost; export DB=testdb; ./node_modules/.bin/mocha --recursive --require expectations --require sinon tests/server/specs/

run-local:
	export DB=ideas NODE_ENV=development PORT=5000 DB_HOST=localhost; nodemon --watch app.js app.js

# build:
# 	export NODE_ENV=development; gulp; gulp watch

# deploy:
# 	@./node_modules/.bin/gulp default
# 	# Pre-deploy clean
# 	npm prune --production

# 	# Package+deploy
# 	@./node_modules/.bin/haikro build deploy \
# 		--app jigsnreels \
# 		--heroku-token $(HEROKU_AUTH_TOKEN) \
# 		--commit `git rev-parse HEAD` \