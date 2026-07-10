const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const sourceDirectory = path.join(root, 'src');
const dataFile = path.join(root, 'data', 'releases.json');
const outputDirectory = path.join(root, 'dist');

if (!fs.existsSync(path.join(sourceDirectory, 'index.html'))) {
  throw new Error('src/index.html is missing');
}
if (!fs.existsSync(dataFile)) {
  throw new Error('data/releases.json is missing');
}

fs.rmSync(outputDirectory, { recursive: true, force: true });
fs.cpSync(sourceDirectory, outputDirectory, { recursive: true });
fs.mkdirSync(path.join(outputDirectory, 'data'), { recursive: true });
fs.copyFileSync(dataFile, path.join(outputDirectory, 'data', 'releases.json'));

process.stdout.write(`Built static website in ${outputDirectory}\n`);
