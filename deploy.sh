tsc target/mquery.ts --outFile output/mquery.js
uglifyjs --compress --mangle --output output/mquery.min.js -- output/mquery.js