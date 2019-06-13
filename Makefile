install:
	npm install
gendiff:
	npx babel-node src/bin/gendiff.js
publish:
	npm publish --dry-run
lint:
	npx eslint .
build:
	npm run build
test:
	npm run test --watchAll