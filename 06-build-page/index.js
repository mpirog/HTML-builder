const fs = require('fs/promises');
const path = require('path');

const sourcePath = path.resolve(__dirname, './assets');
const copyPath = path.resolve(__dirname, './project-dist/assets');

const makeDir = async (dirPath) => {
  fs.mkdir(dirPath, { recursive: true }, (err) => {
    if (err) {
      throw err;
    }
  });
};

const readStyles = async (currentPath) => {
  currentPath = path.resolve(__dirname, currentPath);
  const paths = await fs.readdir(currentPath);

  let data = [];

  for (let i = 0; i < paths.length; i++) {
    let filePath = `${currentPath}/${paths[i]}`;
    let stat = await fs.stat(path.resolve(__dirname, filePath));

    if (stat.isDirectory()) {
      data = data.concat(await readStyles(filePath));
    } else {
      if (path.extname(filePath) === '.css') {
        const dt = await fs.readFile(path.resolve(__dirname, filePath));
        data.push(dt.toString());
      }
    }
  }

  return data;
};

const copyFiles = async (currentPath) => {
  currentPath = path.resolve(__dirname, `${currentPath}`);

  const newPath = currentPath.replace(sourcePath, copyPath);

  let stat = await fs.stat(currentPath);

  if (stat.isDirectory()) {
    await makeDir(path.resolve(__dirname, newPath));
    const paths = await fs.readdir(currentPath);

    for (let i = 0; i < paths.length; i++) {
      await copyFiles(`${currentPath}/${paths[i]}`);
    }
  } else {
    await fs.copyFile(currentPath, newPath);
  }
};

const mergeStyles = async () => {
  const data = await readStyles('./styles');
  await fs.writeFile(path.resolve(__dirname, './project-dist/style.css'), data.join('\n\n'));
};

const replaceHtmlTemplates = async () => {
  let data = await fs.readFile(path.resolve(__dirname, './template.html'));
  data = data.toString();
  const re = /(?<={{)(.*)(?=}})/g;

  const words = data.toString().match(re);

  for (let i = 0; i < words.length; i++) {
    let tmp = await fs.readFile(path.resolve(__dirname, `./components/${words[i]}.html`));

    data = data.replace(`{{${words[i]}}}`, tmp.toString());
  }
  
  fs.writeFile(path.resolve(__dirname, './project-dist/index.html'), data);
};

const removeDirectory = async (dirPath) => {
  try {
    await fs.rm(dirPath, { recursive: true })
  } catch {
    return;
  }
}

const runProcess = async () => {
  const distPath = path.resolve(__dirname, './project-dist');

  await removeDirectory(distPath);
  await makeDir(distPath);
  
  replaceHtmlTemplates();

  mergeStyles();

  copyFiles(sourcePath);
}

//------------------------

runProcess();