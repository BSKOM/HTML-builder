const fs = require('fs');
const path = require('path');
const fsPromises = fs.promises;
const { readdir } = require('fs/promises');

const events = require('events');
const eventEmitter = new events.EventEmitter();


const pathDirStyles = path.join(__dirname, 'styles');
const pathComponents = path.join(__dirname, 'components');
const templates = path.join(__dirname, 'template.html');
const pathAssets = path.join(__dirname, 'assets');
const projectDist = path.join(__dirname, 'project-dist');

let protoHtml = '';
let readStream = new fs.ReadStream(templates, 'utf8');
readStream.on('data', function (chunk) {
  protoHtml += chunk;
});

readStream.on('close', function () {
  createBundleHtml(pathComponents, projectDist);
});

const htmlReady = function htmlReady() {
  setDir(projectDist);
};

const distReady = function distReady() {
  htmlSave(projectDist);
};

const htmlSaved = function htmlSaved() {
  createBundleCss(pathDirStyles, projectDist);
};

const cssReady = function cssReady() {
  copyDirRec(pathAssets, path.join(projectDist, 'assets')); 
};

function setDir(dist) {
  fs.access(dist, fs.F_OK, (err) => {
    (!err) ? delFiles(dist) : creaDist(dist);
  });
}

async function creaDist(dist) {
  fs.mkdir(dist, (err) => {
    if (err) { return console.error(err); }
    eventEmitter.emit('distReady', 'creaDist');
  });
}

function htmlSave(dist) {
  fs.writeFile(path.join(dist, 'index.html'), protoHtml, err => {
    if (err) { 
      console.error(err);
      return 1;
    }
    //file written successfully
    eventEmitter.emit('htmlSaved', 'htmlSave');
  });
}

async function delFiles(dist) {
  fs.rm(dist, { recursive: true }, (err) => {
    if (err) { console.error(err);}
    creaDist(dist);
  });
}

async function createBundleHtml(inPath) {
  const files = await readdir(inPath);

  for (const file of files) {
    let pathCurFile = path.join(inPath, file);
    let valCurFile = '';

    fs.stat(pathCurFile, (err, stat) => {
      if (stat.isFile() && (path.extname(file) === '.html')) {
        let filePathIn = path.join(pathComponents, file);
        let readStream = new fs.ReadStream(filePathIn, 'utf8');
        readStream.on('data', function (chunk) {
          valCurFile = chunk + '\n';
          let extName = path.extname(file);
          let fileBase = path.basename(file, extName).trim();
          protoHtml = protoHtml.split(`{{${fileBase}}}`).join(valCurFile);
        });

        readStream.on('close', function () {
          if (file === files[files.length - 1]) {
            eventEmitter.emit('htmlReady', 'bundleHtml');
          } // last of mohican:)
        });
      }
    });
  }
}

async function createBundleCss(inPath, outPath) {
  const files = await readdir(inPath);
  let filePathOut = path.join(outPath, 'style.css');
  let writeStream = new fs.WriteStream(filePathOut, {
    encoding: 'utf-8', flags: 'w'
  });
  for (const file of files) {
    let pathCurFile = path.join(inPath, file);
    fs.stat(pathCurFile, (err, stat) => {
      if (stat.isFile() && (path.extname(file) === '.css')) {
        let filePathIn = path.join(__dirname, 'styles', file);
        let readStream = new fs.ReadStream(filePathIn, 'utf8');
        readStream.on('data', function (chunk) {
          writeStream.write(chunk + '\n');
          if(file === files[files.length -1]){
            eventEmitter.emit('cssReady', 'createBundleCss');
          }
        });
      }
    });
  }
}

async function copyDirRec(dir, dist) {
  const items = await readdir(dir, { withFileTypes: true });
  await fsPromises.mkdir(dist);
  // console.log('dir, dist', dir, dist);
  for (let item of items) {
    const inPath = path.join(dir, item.name);
    const outPath = path.join(dist, item.name);
    if (item.isDirectory()) {
      await copyDirRec(inPath, outPath);
      // console.log('item dir', item);
    } else {
      await fsPromises.copyFile(inPath, outPath);
    }
  }
}

eventEmitter.addListener('cssReady', cssReady);
eventEmitter.addListener('htmlSaved', htmlSaved);
eventEmitter.addListener('distReady', distReady);
eventEmitter.addListener('htmlReady', htmlReady);
