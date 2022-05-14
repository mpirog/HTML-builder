const fs = require('fs');
const path = require('path');
const readline = require('readline');
const process = require('process');

const output = process.stdout;
const input = process.stdin;

const rl = readline.createInterface({ input, output });

const writeStream = fs.createWriteStream(path.resolve(__dirname, './text.txt'))

const exitProcess = () => output.write('Bye Bye!!!');

output.write('Hello!!! Could you please write something?\n');

rl.on('line', (input) => {
  if (input.toLocaleLowerCase() === 'exit') {
    rl.close();
    return;
  }

  writeStream.write(`${input}\n`);
});

process.on('exit', exitProcess);