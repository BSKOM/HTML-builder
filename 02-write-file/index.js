const fs = require('fs');
const readline = require('readline');
const path = require('path');

const filePathOut = path.join(__dirname, './text.txt')
const writel = fs.createWriteStream(filePathOut, {
  encoding: 'utf-8',
  flags: 'a'
});

console.log('input text: ');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.on('line', (chunc) => {
  chunc.trim() === 'exit' ? exit() : writel.write(chunc); });
rl.on('SIGINT', exit);

function exit() {
  console.log('Write ok! Good bye...')
  process.exit();
}
