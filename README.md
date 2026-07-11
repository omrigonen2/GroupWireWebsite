# GroupWire marketing website

English-language public marketing site for GroupWire, built with Astro and emitted as a fully
static site. The application and authentication experience remain at
`https://bo.groupwire.cloud`.

## Development

Requirements: Node.js 20 or newer and npm.

```bash
npm install
npm run dev
```

Validation and production output:

```bash
npm test
npm run build
npm run preview
```

Astro writes the deployable site to `dist/`. The route set is generated at build time and includes
product, feature, solution, integration, developer, pricing, FAQ, contact, demo, resource, legal,
and release pages.

## Public website data

- `data/website.json` is the build-time fallback for public feature highlights, plans, app URL,
  and terms/privacy availability.
- Browsers request `https://bo.groupwire.cloud/meta/website` after load and hydrate supported
  sections with current public data.
- Contact and demo forms send JSON to
  `https://bo.groupwire.cloud/meta/website/leads`.
- The marketing repository must never include application secrets or depend on the app runtime
  filesystem.

## Release synchronization

`data/releases.json` is generated from the canonical application version and changelog by
`WAGroupManager/.github/workflows/sync-release-website.yml`. Do not edit it manually. The
marketing site imports this file during the Astro build and renders English release history at
`/releases`.

The application workflow needs a fine-grained token with Contents read/write access saved as
`WEBSITE_REPO_TOKEN`. Set `WEBSITE_REPOSITORY` when the destination differs from the workflow
default.

## Render

`render.yaml` provisions a Render Static Site with:

- Build command `npm run build`
- Publish directory `dist`
- Pull request previews and automatic deploys
- Long-lived caching for fingerprinted Astro assets
- Security headers and a CSP that permits public metadata and lead requests only to
  `bo.groupwire.cloud`

The separate application service continues to deploy only from `WAGroupManager`.
