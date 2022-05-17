const fs = require('fs');
const path = require('path');
const { stdout } = require('process');

const currentPath = './secret-folder';

const getStatistics = (currentPath, fPath) => {
  currentPath = path.resolve(__dirname, `${currentPath}/${fPath}`);

  fs.stat(currentPath, (err, stats) => {
    if (!err) {
      if (!stats.isDirectory()) {
        const ext = path.extname(currentPath);
        stdout.write(`${path.basename(currentPath, ext)} - ${ext.substring(1)} - ${stats.size / 1024} kb\n`);
      }
    }
  });
};

const readDirectory = (currentPath) => {
  currentPath = path.resolve(__dirname, currentPath);

  fs.readdir(currentPath, (err, files) => {
    if (!err) {
      files.forEach((file) => {
        getStatistics(currentPath, file);
      });
    }
  });
};

readDirectory(currentPath);