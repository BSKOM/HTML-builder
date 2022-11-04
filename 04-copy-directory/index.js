const fs = require('fs');
const path = require('path');
const fsPromises = fs.promises;
const { readdir } = require('fs/promises');
const pathDirCopy = path.join(__dirname, 'files-copy');
const pathDir = path.join(__dirname, 'files');

function copyDir() {
  fs.access(pathDirCopy, fs.F_OK, (err) => {
    if (!err) {
      delFiles().then(createDirItems(pathDir, pathDirCopy));
    } else {
      fsPromises.mkdir(pathDirCopy).then(createDirItems(pathDir, pathDirCopy));
    }
  });
};

copyDir();

async function delFiles() {
  const files = await readdir(pathDirCopy);
  for (const file of files) {
    let filePath = path.join(pathDirCopy, file);
    fs.unlink(filePath, (err => { if (err) throw err; }));
  }
};

async function createDirItems(inPath, outPath) {
  const files = await readdir(inPath);
  for (const file of files) {
    fs.copyFile(path.join(inPath, `${file}`), path.join(outPath, `${file}`), (err) => {
      if (err) throw err;
    });
  }
};