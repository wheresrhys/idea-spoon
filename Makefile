
run-local:
	export DB=ideas NODE_ENV=development PORT=5000 DB_HOST=localhost; nodemon --watch app.js app.js

backup:
	export MONGO_HOST=$(shell cat ~/.idea_spoon_mongo_host); \
	export MONGO_DB=$(shell cat ~/.idea_spoon_mongo_db); \
	export MONGO_USER=$(shell cat ~/.idea_spoon_mongo_user); \
	export MONGO_PASSWORD=$(shell cat ~/.idea_spoon_mongo_password); \
	node scripts.js backup

update:
	export MONGO_HOST=$(shell cat ~/.idea_spoon_mongo_host); \
	export MONGO_DB=$(shell cat ~/.idea_spoon_mongo_db); \
	export MONGO_USER=$(shell cat ~/.idea_spoon_mongo_user); \
	export MONGO_PASSWORD=$(shell cat ~/.idea_spoon_mongo_password); \
	node scripts.js update

restore:
	export MONGO_HOST=$(shell cat ~/.idea_spoon_mongo_host); \
	export MONGO_DB=$(shell cat ~/.idea_spoon_mongo_db); \
	export MONGO_USER=$(shell cat ~/.idea_spoon_mongo_user); \
	export MONGO_PASSWORD=$(shell cat ~/.idea_spoon_mongo_password); \
	node scripts.js restore