The Chrome extension uses **WXT** (a modern Chrome extension build tool), which generates the `manifest.json` during the build process. You cannot load the `public` folder directly - you need to build the extension first.

## How to compile and load:

First @page-agent/core and other internal packages have to be built since  @page-agent/core points to ./dist/esm/ which doesn't exist yet - the internal packages need to be built first.  The extension depends on these packages which are part of the monorepo and need to be compiled first. Let me check the core package configuration:
`npm run build:libs`

### Option 1: Build and load manually
```bash
cd packages/extension
npm run build:ext
```

This generates the built extension in the `.wxt/chrome-mv3` folder. Then in Chrome:
1. Go to `chrome://extensions/`
2. Enable **Developer mode** (top right)
3. Click **Load unpacked**
4. Select the `packages/extension/.wxt/chrome-mv3` folder

If you're loading the development build, it requires the dev server to be running. Otherwise you need to build the production version instead. 

### Option 2: Use dev mode (recommended for development)
```bash
cd packages/extension
npm run dev
```

This starts a development server with hot-reloading and automatically opens Chrome with the extension loaded.

### Why it failed:
The `public` folder only contains static assets (`assets/` and `_locales/`). WXT combines these with your source code from `src/` and generates the final `manifest.json` in the `.wxt/chrome-mv3` output directory.