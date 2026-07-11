/**
 * @typedef {{ title: string, body?: string, items?: string[] }} PageSection
 * @typedef {{
 *   path: string,
 *   eyebrow: string,
 *   title: string,
 *   description: string,
 *   sections?: PageSection[],
 *   steps?: string[][],
 *   linkCards?: string[][],
 *   cta: string,
 *   ctaHref: string,
 *   secondaryCta?: string,
 *   secondaryHref?: string,
 *   article?: boolean,
 *   mockup?: string,
 *   code?: boolean
 * }} Page
 */

/** @param {string} slug @param {string} title @param {string} description @param {PageSection[]} sections @returns {Page} */
const feature = (slug, title, description, sections) => ({
  path: `features/${slug}`,
  eyebrow: 'Product feature',
  title,
  description,
  sections,
  cta: 'Start free',
  ctaHref: 'https://bo.groupwire.cloud/signup',
});

/** @param {string} slug @param {string} title @param {string} description @param {string[]} painPoints @param {string[]} benefits @param {string} [cta] @param {string} [ctaHref] @returns {Page} */
const solution = (slug, title, description, painPoints, benefits, cta = 'Start free', ctaHref = 'https://bo.groupwire.cloud/signup') => ({
  path: `solutions/${slug}`,
  eyebrow: 'Built for your workflow',
  title,
  description,
  sections: [
    { title: 'Where publishing breaks down', items: painPoints },
    { title: 'How GroupWire helps', items: benefits },
  ],
  cta,
  ctaHref,
});

/** @param {string} slug @param {string} title @param {string} description @param {PageSection[]} sections @returns {Page} */
const article = (slug, title, description, sections) => ({
  path: `resources/${slug}`,
  eyebrow: 'GroupWire field guide',
  title,
  description,
  sections,
  cta: 'Build your publishing workspace',
  ctaHref: 'https://bo.groupwire.cloud/signup',
  article: true,
});

/** @type {Page[]} */
export const pages = [
  {
    path: 'product',
    eyebrow: 'Product overview',
    title: 'A complete workspace for WhatsApp publishing',
    description: 'GroupWire gives teams one place to manage channel setup, QR-based WhatsApp Web connections, AI-assisted creation, templates, destination lists, previews, scheduling, delivery tracking, and analytics.',
    steps: [
      ['01', 'Create a workspace', 'Set workspace defaults, invite teammates, and assign roles.'],
      ['02', 'Add channels', 'Create a channel for each brand, community, client, or publishing stream.'],
      ['03', 'Connect WhatsApp', 'Link a WhatsApp Web session by scanning a QR code for each channel.'],
      ['04', 'Build publishing assets', 'Set up agents, templates, destinations, logos, language, and timezone.'],
      ['05', 'Create and preview', 'Draft, refine, attach media, and review the final post.'],
      ['06', 'Publish or schedule', 'Send now, schedule for later, retry failures, and review history.'],
    ],
    sections: [
      { title: 'One channel, one clear setup', body: 'Channels keep each publishing stream isolated with its own WhatsApp connection, timezone, logo, agents, templates, and destinations.' },
      { title: 'The right scope for every role', items: ['Tenant managers control the workspace and all channels.', 'Channel managers operate assigned channels and assets.', 'Content editors create and edit content in assigned channels.'] },
      { title: 'Operations stay visible', body: 'History, analytics, status filters, connection health, scheduling, notifications, and manager review queues keep daily publishing work understandable.' },
    ],
    cta: 'Create your workspace',
    ctaHref: 'https://bo.groupwire.cloud/signup',
    mockup: 'dashboard',
  },
  {
    path: 'features',
    eyebrow: 'Feature overview',
    title: 'WhatsApp publishing features for teams that need control',
    description: 'Bring daily publishing into one structured workspace, from AI content creation to scheduling, delivery tracking, analytics, integrations, and team access.',
    linkCards: [
      ['AI content creation', 'Channel-specific agents, templates, and a chat-style editor.', '/features/ai-content'],
      ['WhatsApp publishing', 'Saved destinations, preview, publishing, scheduling, and retries.', '/features/whatsapp-publishing'],
      ['Scheduling', 'Channel-timezone scheduling and a visible content calendar.', '/features/scheduling'],
      ['Analytics', 'Status, trends, failures, retries, and connection health.', '/features/analytics'],
      ['Team workspaces', 'Roles, channel assignments, invitations, and preferences.', '/features/team-workspaces'],
      ['Mobile PWA', 'An installable, responsive workspace with web push.', '/features/mobile-pwa'],
    ],
    sections: [
      { title: 'Create', items: ['AI agents', 'AI agent builder on eligible plans', 'Reusable templates', 'Chat-style editor', 'Images and videos', 'Preview before publishing'] },
      { title: 'Publish', items: ['QR-based WhatsApp Web connection', 'Saved groups and channels', 'Named destination lists', 'Publish now', 'Schedule by channel timezone', 'Retry failed or partial sends'] },
      { title: 'Operate', items: ['History and status filters', 'Core and advanced analytics', 'Manager review workflow', 'In-app, web push, and email notifications', 'API and webhooks on Business'] },
    ],
    cta: 'Explore plans',
    ctaHref: '/pricing',
  },
  feature('ai-content', 'Create WhatsApp content faster with channel-specific AI', 'Define AI agents and templates for each publishing channel, so posts can be drafted, refined, formatted, and prepared in a consistent voice.', [
    { title: 'Agents that understand the channel', items: ['System prompt and model setting', 'Channel context and brand voice', 'Preferred structure and content rules'] },
    { title: 'Repeatable templates', items: ['Reusable headers and footers', 'Placeholders and branded structures', 'Formatting rules and campaign patterns'] },
    { title: 'A practical editor', body: 'Choose a channel and agent, generate a draft, refine it conversationally, edit manually, add media, and preview the exact post before publishing.' },
    { title: 'Guided setup when included', body: 'Eligible plans include an AI-assisted agent builder that helps channel managers standardize agent setup without hiding the final instructions.' },
  ]),
  feature('whatsapp-publishing', 'Publish to WhatsApp groups and channels with a real workflow', 'Move beyond manual copy-paste publishing. Save destinations, organize lists, preview content, publish now, schedule for later, retry failures, and keep a clear record.', [
    { title: 'A connection per channel', body: 'Each channel links a WhatsApp Web session through a QR code. Teams can monitor connection health and reconnect when needed.' },
    { title: 'Saved destinations and lists', items: ['Save WhatsApp groups and channels', 'Create reusable named audience lists', 'Choose destinations without rebuilding recipients'] },
    { title: 'Preview before publishing', items: ['Final text and placeholders', 'Selected destinations', 'Images or videos', 'Channel branding'] },
    { title: 'Publish, schedule, retry', body: 'Publish immediately, schedule for a future time, cancel pending scheduled work, and retry failed or partially failed sends.' },
  ]),
  feature('scheduling', 'Schedule WhatsApp content around your channel timezone', 'Prepare content ahead of time, schedule it for a future publish time, and manage upcoming work from a calendar built for publishing teams.', [
    { title: 'Schedule posts', body: 'Set future publish times using the timezone configured for each channel.' },
    { title: 'Change course safely', body: 'Cancel pending scheduled content when plans change, without losing visibility into the item.' },
    { title: 'See the next six weeks', body: 'Tenant managers can use the calendar to review scheduled and in-progress content across the workspace.' },
    { title: 'Keep the record', body: 'After publishing, content remains in history with status and filters.' },
  ]),
  feature('analytics', 'Know what was published, what failed, and what comes next', 'See publishing activity, content history, channel health, and performance trends across WhatsApp, WordPress, and Facebook.', [
    { title: 'Operational analytics', items: ['Created, scheduled, published, and failed content', 'Success rate and trend over time', 'Per-channel and multichannel totals', 'Connection health, publish duration, and retry counts'] },
    { title: 'Business analytics', items: ['Destination failure breakdown', 'User, template, and agent leaderboards', 'Weekday and hour activity heatmaps', 'CSV analytics and workspace JSON exports'] },
    { title: 'History in context', body: 'Past content stays filterable by status. Visibility follows each user’s channel access.' },
  ]),
  feature('team-workspaces', 'Keep every workspace, channel, and user in the right scope', 'Each customer organization is an isolated workspace. Users can belong to multiple workspaces and switch between them.', [
    { title: 'Roles that match the work', items: ['Tenant managers control workspace operations', 'Channel managers operate assigned channels', 'Content editors create and edit assigned content'] },
    { title: 'Invitations and assignments', body: 'Managers invite users by email, assign roles, and select the channels each teammate can access.' },
    { title: 'Workspace preferences', body: 'Configure the workspace name, timezone, language defaults, allowed notification channels, and an optional OpenAI API key override.' },
  ]),
  feature('mobile-pwa', 'Manage WhatsApp publishing from mobile or desktop', 'Install GroupWire as a PWA so publishing teams can keep up with content, notifications, connection status, and scheduled work wherever they are.', [
    { title: 'Installable experience', body: 'Add GroupWire to a mobile home screen or desktop environment from a supported browser.' },
    { title: 'Resilient by design', body: 'An offline fallback keeps connectivity failures understandable instead of showing a broken page.' },
    { title: 'Useful web push', body: 'Opt into notifications for publishing success or failure, WhatsApp connection changes, and invitations.' },
    { title: 'Daily work up front', body: 'Responsive navigation centers Dashboard, Channels, Create, History, and More.' },
  ]),
  solution('community-managers', 'Run your community updates without rebuilding the same workflow every day', 'For solo operators and community managers, GroupWire brings repeatable templates, AI-assisted drafting, saved destinations, publishing history, and scheduling into one channel.', ['Rewriting the same update formats', 'Copying posts across groups manually', 'Losing track of what was sent', 'Depending on reminders'], ['Save your channel setup once', 'Use templates for repeatable formats', 'Draft posts with an AI agent', 'Preview and schedule updates', 'Review past content in history']),
  solution('teams', 'Give your team one place to create, review, and publish WhatsApp content', 'Coordinate editors, channels, lists, templates, scheduling, manager review, and eligible WordPress or Facebook publishing.', ['Editors work in separate tools', 'Managers lack visibility', 'Destination lists drift', 'Success is difficult to measure'], ['Invite users and assign roles', 'Give every channel its own assets', 'Use a manager review workflow', 'Publish now or schedule', 'Track success rates and failures'], 'Compare plans', '/pricing'),
  solution('agencies', 'Manage multiple brands, clients, or communities from one publishing system', 'Structure each client or publishing stream as a channel, assign users, monitor performance, and connect Business operations through API keys and webhooks.', ['Channels are spread across accounts', 'Client content lacks structure', 'Reporting is hard to consolidate', 'Operations need reliable integrations'], ['Separate every brand into a channel', 'Configure channel-specific assets', 'Track analytics and publishing health', 'Use API keys and outbound webhooks', 'Review audit history and exports'], 'Contact sales', '/contact'),
  {
    path: 'integrations',
    eyebrow: 'Connected publishing',
    title: 'Connect your WhatsApp workflow to the channels that matter',
    description: 'GroupWire is WhatsApp-first, with eligible plans supporting WordPress publishing and Facebook Page cross-posting from the same content operation.',
    linkCards: [
      ['WhatsApp', 'Connect a WhatsApp Web session per channel by scanning a QR code. No official partnership is implied.', '/features/whatsapp-publishing'],
      ['WordPress', 'Generate a draft or article from published WhatsApp content.', '/integrations/wordpress'],
      ['Facebook Page', 'Connect a Page through OAuth and optionally cross-post.', '/integrations/facebook'],
    ],
    sections: [{ title: 'Extend only when it helps', body: 'WhatsApp remains the center of the workflow. Connected publishing is available according to plan and configuration.' }],
    cta: 'View pricing',
    ctaHref: '/pricing',
  },
  {
    path: 'integrations/wordpress',
    eyebrow: 'WordPress integration',
    title: 'Turn published WhatsApp content into a WordPress draft or article',
    description: 'On eligible plans, connect a WordPress site and extend approved, published content into your editorial workflow.',
    sections: [
      { title: 'Start from completed work', body: 'Use a published WhatsApp post as the source so teams do not have to rebuild the same story from scratch.' },
      { title: 'Choose the publishing mode', items: ['Generate an editable WordPress draft', 'Publish an article when your workflow is ready', 'Track the connected result from GroupWire'] },
      { title: 'Keep credentials scoped', body: 'Each eligible channel stores its own site connection and publishing settings.' },
    ],
    cta: 'Compare plans',
    ctaHref: '/pricing',
  },
  {
    path: 'integrations/facebook',
    eyebrow: 'Facebook Page integration',
    title: 'Cross-post eligible content to a connected Facebook Page',
    description: 'Connect a Facebook Page through OAuth and optionally continue the workflow after WhatsApp publishing.',
    sections: [
      { title: 'Connect the Page', body: 'Authorize a Page through the supported OAuth flow for an eligible channel.' },
      { title: 'Publish with context', body: 'Choose Facebook cross-posting as part of the content operation, while keeping WhatsApp as the primary workflow.' },
      { title: 'Availability', body: 'Facebook publishing depends on plan eligibility, Page permissions, and an active integration configuration.' },
    ],
    cta: 'View eligible plans',
    ctaHref: '/pricing',
  },
  {
    path: 'developers',
    eyebrow: 'Developers',
    title: 'Connect GroupWire to your business systems',
    description: 'Business workspaces can use API keys and outbound webhooks to connect publishing activity with external systems.',
    sections: [
      { title: 'REST API', body: 'Authenticate requests with the X-GroupWire-Api-Key header. The current public surface includes GET /api/v1/workspace for workspace metadata and subscription summary.' },
      { title: 'Webhook events', items: ['content.published', 'content.failed', 'content.scheduled', 'subscription.updated'] },
      { title: 'Operational use cases', items: ['Notify internal tools after publishing', 'Trigger support workflows on failures', 'Sync scheduled events with reporting', 'Track subscription changes'] },
    ],
    cta: 'Open API docs',
    ctaHref: 'https://bo.groupwire.cloud/api/docs',
    secondaryCta: 'View Business',
    secondaryHref: '/pricing',
    code: true,
  },
  {
    path: 'security',
    eyebrow: 'Security',
    title: 'Security and access controls for publishing teams',
    description: 'Control access to workspaces, channels, content, settings, billing, API keys, webhooks, and exports based on roles and plan eligibility.',
    sections: [
      { title: 'Account protection', items: ['Email verification and password reset', 'Password policy rules', 'TOTP authenticator app 2FA', 'Required 2FA for Business workspaces'] },
      { title: 'Workspace access', items: ['Isolated customer workspaces', 'Role-based capabilities', 'Channel assignments for managers and editors', 'Active workspace switching'] },
      { title: 'Administrative visibility', body: 'Eligible Business workspaces can use audit logs and exports. Retention follows the active plan.' },
      { title: 'Integration boundaries', body: 'WhatsApp Web sessions are linked by QR code. API keys and third-party credentials are managed within authorized workspace settings.' },
    ],
    cta: 'Start free',
    ctaHref: 'https://bo.groupwire.cloud/signup',
  },
  {
    path: 'resources',
    eyebrow: 'Resources',
    title: 'Practical guides for WhatsApp publishing teams',
    description: 'Learn how to structure content operations, manage destinations, write repeatable templates, schedule campaigns, and improve publishing workflows.',
    linkCards: [
      ['Build a WhatsApp publishing workflow', 'A practical guide to channels, roles, templates, destinations, previews, and history.', '/resources/whatsapp-content-workflow'],
      ['Use AI templates for repeatable posts', 'Create useful branded structures with agents and reusable templates.', '/resources/ai-templates-for-whatsapp'],
      ['Manage multichannel publishing', 'Extend WhatsApp content into WordPress and Facebook workflows.', '/resources/multichannel-publishing'],
    ],
    sections: [{ title: 'Operational guidance, not hype', body: 'Every guide focuses on repeatable work your team can set up, review, and improve.' }],
    cta: 'Explore GroupWire',
    ctaHref: '/product',
  },
  article('whatsapp-content-workflow', 'How to build a WhatsApp publishing workflow for your team', 'A practical system for turning scattered drafts and recipient lists into a publishing operation your team can understand.', [
    { title: '1. Define channels around ownership', body: 'Create a channel for each brand, community, client, or content stream that needs its own connection, voice, timezone, and audience.' },
    { title: '2. Assign roles and destinations', body: 'Give users only the channels they need. Save WhatsApp groups and channels, then combine recurring audiences into named destination lists.' },
    { title: '3. Standardize creation', body: 'Document the voice in an AI agent and the repeatable structure in templates. Keep manual editing available before every preview.' },
    { title: '4. Preview, publish, and schedule', body: 'Review the final text, placeholders, media, and destinations. Publish immediately or schedule in the channel timezone.' },
    { title: '5. Learn from history', body: 'Review published, failed, and retried items. Use trends and connection health to improve the workflow.' },
  ]),
  article('ai-templates-for-whatsapp', 'How to use AI templates for repeatable WhatsApp posts', 'Separate voice, structure, and facts so AI-assisted drafts stay consistent without becoming rigid.', [
    { title: 'Give the agent a clear role', body: 'Define audience, tone, preferred structure, terminology, and rules. Avoid asking one agent to serve unrelated channels.' },
    { title: 'Put stable structure in templates', body: 'Store headers, footers, placeholders, calls to action, and formatting patterns that should repeat.' },
    { title: 'Keep facts in the prompt', body: 'Provide current dates, names, links, and campaign details for each draft instead of embedding changing facts in the template.' },
    { title: 'Review the rendered message', body: 'Edit the draft manually and preview placeholders, media, branding, and destinations before publishing.' },
  ]),
  article('multichannel-publishing', 'How to manage multichannel publishing from WhatsApp content', 'Use WhatsApp as the primary operation, then adapt eligible content for WordPress and Facebook without duplicating the full workflow.', [
    { title: 'Choose the primary source', body: 'Complete and publish the WhatsApp post first so the approved operational message becomes the source of truth.' },
    { title: 'Adapt for the destination', body: 'A WordPress article needs editorial depth, while a Facebook Page post may need a different opening and link treatment.' },
    { title: 'Connect only eligible channels', body: 'Keep site and Page connections scoped to the relevant GroupWire channel and verify plan availability.' },
    { title: 'Track the combined operation', body: 'Use multichannel totals and history to understand what reached each destination and where follow-up is needed.' },
  ]),
  {
    path: 'signup',
    eyebrow: 'Get started',
    title: 'Create your GroupWire workspace',
    description: 'Start managing WhatsApp publishing from one workspace. Create your account, verify your email, and set up your first channel.',
    sections: [{ title: 'What happens next', items: ['Create your account in the secure GroupWire app', 'Verify your email', 'Set up your workspace and first channel'] }],
    cta: 'Create workspace',
    ctaHref: 'https://bo.groupwire.cloud/signup',
    secondaryCta: 'Already have an account? Log in',
    secondaryHref: 'https://bo.groupwire.cloud/login',
  },
  {
    path: 'login',
    eyebrow: 'Welcome back',
    title: 'Log in to GroupWire',
    description: 'Access your workspace, channels, drafts, schedules, publishing history, and analytics in the secure GroupWire app.',
    sections: [{ title: 'Continue securely', body: 'Authentication and workspace access are handled at bo.groupwire.cloud.' }],
    cta: 'Log in',
    ctaHref: 'https://bo.groupwire.cloud/login',
    secondaryCta: 'Create a workspace',
    secondaryHref: 'https://bo.groupwire.cloud/signup',
  },
];

export const pageByPath = new Map(pages.map((page) => [page.path, page]));
