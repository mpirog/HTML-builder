const fs = require('fs');
const path = require('path');

const errorCallback = (err) => {
  if (err) {
    throw err;
  }
};

const writeStream = fs.createWriteStream(path.resolve(__dirname, './project-dist/bundle.css'));

const readData = (filePath) => {
  fs.createReadStream(path.resolve(__dirname, filePath))
    .on('data', (chunk) => {
      writeStream.write(chunk.toString());
      writeStream.write('\n');
    });
};

const readFile = (currentPath, fPath) => {
  currentPath = path.resolve(__dirname, `${currentPath}/${fPath}`);

  fs.stat(currentPath, (err, stats) => {
    errorCallback(err);

    if (stats.isDirectory()) {
      readDirectory(currentPath);
    } else {
      if (path.extname(currentPath) === '.css') {
        readData(currentPath);
      }
    };
  });
};

const readDirectory = (currentPath) => {
  currentPath = path.resolve(__dirname, currentPath);

  fs.readdir(currentPath, (err, files) => {
    errorCallback(err);
    
    files.forEach((file) => {
      readFile(currentPath, file);
    });    
  });
};

readDirectory('./styles');
