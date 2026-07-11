const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const read = (...parts) => fs.readFileSync(path.join(root, ...parts), 'utf8');
const releaseData = JSON.parse(read('data', 'releases.json'));
const websiteData = JSON.parse(read('data', 'website.json'));
const routeSource = read('src', 'data', 'pages.js');
const catchAllSource = read('src', 'pages', '[...slug].astro');
const clientScript = read('public', 'site.js');
const leadFormSource = read('src', 'components', 'LeadForm.astro');
const renderConfig = read('render.yaml');

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
  assert(Array.isArray(release.changes.en) && release.changes.en.length > 0, `release ${release.version} has English notes`);
});

assert(websiteData.schemaVersion === 1, 'website fallback schema is supported');
assert(websiteData.appUrl === 'https://bo.groupwire.cloud', 'fallback uses the production application URL');
assert(websiteData.plans.length >= 3, 'website fallback includes public plans');
assert(!websiteData.plans.some((plan) => plan.slug === 'legacy'), 'legacy plan is excluded');
assert(websiteData.features.length >= 6, 'website fallback includes important feature highlights');
assert(websiteData.legal.terms && websiteData.legal.privacy, 'website fallback includes legal fallbacks');

const expectedRoutes = [
  'product', 'features',
  'features/ai-content', 'features/whatsapp-publishing', 'features/scheduling',
  'features/analytics', 'features/team-workspaces', 'features/mobile-pwa',
  'solutions/community-managers', 'solutions/teams', 'solutions/agencies',
  'integrations', 'integrations/wordpress', 'integrations/facebook',
  'developers', 'security', 'pricing', 'faq', 'contact', 'demo',
  'signup', 'login', 'resources', 'resources/whatsapp-content-workflow',
  'resources/ai-templates-for-whatsapp', 'resources/multichannel-publishing',
  'legal/terms', 'legal/privacy', 'legal/cookies', 'legal/data-processing',
  'legal/subprocessors', 'legal/security', 'legal/acceptable-use', 'releases',
];
expectedRoutes.forEach((route) => {
  const [, nestedSlug] = route.split('/');
  const generatedByHelper =
    (route.startsWith('features/') && routeSource.includes(`feature('${nestedSlug}'`)) ||
    (route.startsWith('solutions/') && routeSource.includes(`solution('${nestedSlug}'`)) ||
    (route.startsWith('resources/') && routeSource.includes(`article('${nestedSlug}'`));
  assert(generatedByHelper || routeSource.includes(`path: '${route}'`) || catchAllSource.includes(`'${route}'`), `route /${route} is generated`);
});

const sourceFiles = [
  read('src', 'components', 'Header.astro'),
  read('src', 'components', 'Footer.astro'),
  routeSource,
  catchAllSource,
  read('src', 'pages', 'index.astro'),
].join('\n');
assert(!/href=["'{`]\/(?:login|signup|api(?:\/docs)?)(?:["'}`/])/.test(sourceFiles), 'app links are never relative');
assert(!/[\u0590-\u05ff]/.test(sourceFiles), 'marketing source is English-only');
assert(!/(?:GroupWire|we) (?:is|are) an official (?:WhatsApp )?partner/i.test(sourceFiles), 'site makes no official partnership claim');
assert(/no official (?:WhatsApp )?partnership is implied/i.test(sourceFiles), 'site includes a clear partnership disclaimer');
assert(/review workflow/i.test(sourceFiles), 'approvals use manager review workflow language');
assert(/QR-based WhatsApp Web|WhatsApp Web session by scanning a QR code/i.test(sourceFiles), 'WhatsApp connection wording is precise');

new Function(clientScript);
assert(true, 'browser JavaScript parses successfully');
assert(clientScript.includes('https://bo.groupwire.cloud/meta/website'), 'client hydrates from the website metadata API');
assert(clientScript.includes("API_URL + '/leads'"), 'lead forms post to the website leads API');
assert(clientScript.includes("method: 'POST'"), 'lead forms use POST');
assert(clientScript.includes('body: JSON.stringify(fields)'), 'lead forms send backend-compatible top-level fields');
assert(clientScript.includes('fields.consent = data.has'), 'lead forms send explicit consent');
assert(leadFormSource.includes('name="company"'), 'lead forms use the backend company field');
assert(leadFormSource.includes('name="channelCount"'), 'lead forms use a numeric channel count');
assert(leadFormSource.includes('name="consent"') && leadFormSource.includes('required'), 'lead forms require consent');
assert(renderConfig.includes("connect-src 'self' https://bo.groupwire.cloud"), 'Render CSP allows the GroupWire API');
assert(renderConfig.includes('staticPublishPath: ./dist'), 'Render publishes Astro dist output');
