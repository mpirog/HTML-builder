const fs = require('fs');
const path = require('path');
const { stdout } = require('process');

fs.createReadStream(path.resolve(__dirname, './text.txt')).on('data', (data) => {
    stdout.write(data.toString());
});