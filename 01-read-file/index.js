const fs = require('fs');
const path = require('path');

const filePathIn = path.join(__dirname, './text.txt');

let readStream = new fs.ReadStream(filePathIn, 'utf8');

readStream.on('data', function (chunk) {console.log(chunk);});
readStream.on('error', function (err) {
  (err.code == 'ENOENT') ? console.log("file not found"):console.error(err);
});
