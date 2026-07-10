const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const releaseData = JSON.parse(fs.readFileSync(path.join(root, 'data', 'releases.json'), 'utf8'));
const html = fs.readFileSync(path.join(root, 'src', 'index.html'), 'utf8');
const browserScript = fs.readFileSync(path.join(root, 'src', 'app.js'), 'utf8');

function assert(condition, message) {
  if (!condition) throw new Error(message);
  process.stdout.write(`ok - ${message}\n`);
}

assert(releaseData.schemaVersion === 1, 'release schema is supported');
assert(Array.isArray(releaseData.releases) && releaseData.releases.length > 0, 'release history is not empty');
assert(releaseData.releases[0].version === releaseData.currentVersion, 'latest release matches current version');

const versions = new Set();
releaseData.releases.forEach((release) => {
  assert(!versions.has(release.version), `release ${release.version} is unique`);
  versions.add(release.version);
  assert(/^\d+\.\d+\.\d+$/.test(release.version), `release ${release.version} uses SemVer`);
  assert(/^\d{4}-\d{2}-\d{2}$/.test(release.date), `release ${release.version} has an ISO date`);
  assert(release.changes.en.length > 0, `release ${release.version} has English notes`);
  assert(release.changes.he.length > 0, `release ${release.version} has Hebrew notes`);
});

assert(html.includes('id="release-list"'), 'page contains the release list');
assert(html.includes('id="language-switch"'), 'page contains the language switch');
new Function(browserScript);
assert(true, 'browser JavaScript parses successfully');
