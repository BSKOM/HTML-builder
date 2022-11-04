const fs = require('fs');
const path = require('path');
const { readdir } = require('fs/promises');

const pathDirCopy = path.join(__dirname, 'project-dist');
const pathDir = path.join(__dirname, 'styles');

async function createBundleCss(inPath, outPath) {
  const files = await readdir(inPath);
  let filePathOut = path.join(outPath, 'bundle.css');
  let writeStream = new fs.WriteStream(filePathOut, {
    encoding: 'utf-8', flags: 'w'
  });
  for (const file of files) {
    let pathCurFile = path.join(inPath, file);
    fs.stat(pathCurFile, (err, stat) => {
      if (stat.isFile() && (path.extname(file) === '.css')) {
        let filePathIn = path.join(__dirname, 'styles', file)
        let readStream = new fs.ReadStream(filePathIn, 'utf8');
        readStream.on('data', function (chunk) {
          writeStream.write(chunk + '\n');
        });
      }
    });
  }
};


createBundleCss(pathDir, pathDirCopy);