const fs = require('fs');
const path = require('path');

const sourcePath = path.resolve(__dirname, './files');
const copyPath = path.resolve(__dirname, './files-copy');

const errorCallback = (err) => {
  if (err) {
    throw err;
  }
};

const makeDir = (dirPath) => {
  fs.mkdir(dirPath, { recursive: true }, errorCallback);
};

const copyNewFile = (currentPath, fPath) => {
  currentPath = path.resolve(__dirname, `${currentPath}/${fPath}`);
  
  fs.stat(currentPath, (err, stats) => {
    errorCallback(err);

    const newPath = currentPath.replace(sourcePath, copyPath);

    if (stats.isDirectory()) {
      makeDir(newPath);
      readDirectory(currentPath);
    } else {
      fs.copyFile(currentPath, newPath, errorCallback);
    }
  });
};

const readDirectory = (currentPath) => {
  currentPath = path.resolve(__dirname, currentPath);

  fs.readdir(currentPath, (err, files) => {
    errorCallback(err);
  
    files.forEach((file) => {
      copyNewFile(currentPath, file);
    });    
  });
};

const runProcessCopy = () => {
  makeDir(copyPath);
  readDirectory(sourcePath);
};

//------------------------
fs.stat(copyPath, (err) => {
  if (err) {
    runProcessCopy();
  } else {
    fs.rm(copyPath, { recursive: true }, (err) => {
      errorCallback(err);
      runProcessCopy();
    });
  }
});
