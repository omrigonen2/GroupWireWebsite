# GroupWire release website

Static public release notes for GroupWire. This repository is intentionally separate from
`WAGroupManager`, so its source and Render deployment cannot be included in the application
service.

## Local development

```bash
npm test
npm run build
```

Open `dist/index.html` through a local static file server. The site has no runtime dependencies
and renders `data/releases.json` in English and Hebrew.

## Release synchronization

`WAGroupManager/.github/workflows/sync-release-website.yml` runs after updates to the app's
`main` branch. It exports the canonical app changelog and commits `data/releases.json` here only
when release content changed.

Configure the application repository:

1. Create a fine-grained GitHub token with **Contents: Read and write** access to this repository.
2. Save it in `WAGroupManager` as the Actions secret `WEBSITE_REPO_TOKEN`.
3. If this repository is not `omrigonen2/GroupWireWebsite`, set the app repository Actions
   variable `WEBSITE_REPOSITORY` to its `owner/repository` name.

Without the secret, the app workflow exits successfully with a configuration warning and does
not attempt a cross-repository write.

## Render

Create a Blueprint from this repository. `render.yaml` provisions one Static Site:

- Build command: `npm run build`
- Publish directory: `dist`
- Automatic deploys from website commits
- Pull request previews
- Security headers

The application Render service continues to use only the separate `WAGroupManager` repository.
