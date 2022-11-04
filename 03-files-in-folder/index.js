const fs = require('fs');
const path = require('path');
const dirPath = path.join(__dirname, 'secret-folder');
const { readdir } = require('fs/promises');

console.log('dir:', dirPath);

(async () => {
  try {
    const files = await readdir(dirPath);
    for (const file of files) {
      let filePath = path.join(__dirname, 'secret-folder', file);
      let extName = path.extname(file);
      let fileBase = path.basename(file, extName);
      fs.stat(filePath, (err, stat) => {
        if (stat.isFile()) {
          (err) ? console.error(err) : console.log(`${fileBase} - ${extName.slice(1,)} - ${stat.size}b`);
        }
      })
    }
  } catch (err) {
    console.error(err);
  }
})();