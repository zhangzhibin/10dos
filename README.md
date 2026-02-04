# 10dos – Minimal todos Chrome extension

[中文介绍](README.zh-CN.md) · [GitHub](https://github.com/zhangzhibin/10dos) · [Site](https://10dos.com)

A minimal todos Chrome extension built with TypeScript. Click the extension icon to view and edit tasks quickly.

![10dos popup – Active tab](screenshots/10dos-1.png)

## ✨ Features

- **Minimal design** – Pure CSS, no external UI framework
- **Quick access** – Open from the extension icon
- **Auto-save** – Sync via Chrome Storage API
- **Type-safe** – Full TypeScript types
- **Lightweight** – Minimal dependencies, fast load

## 🚀 Quick start

### Install dependencies

```bash
npm install
```

### Build TypeScript

```bash
# One-time build
npm run build

# Watch mode (for development)
npm run watch
```

### Load extension in Chrome

1. Open Chrome and go to `chrome://extensions/`
2. Enable **Developer mode** (top right)
3. Click **Load unpacked**
4. Select the project’s `extension/` folder
5. Use the extension from the toolbar icon

### Host (optional — same workspace)

The 10dos website is a separate repo [10dos.com](https://github.com/zhangzhibin/10dos.com). To edit both extension and site in one place, clone it into `host/` (ignored by this repo):

```bash
git clone https://github.com/zhangzhibin/10dos.com.git host
```

Then `cd host && npm install && npm run dev` to run the site locally.

## 📁 Project structure

```
10dos/
├── host/                   # Optional: clone 10dos.com here to work on both
├── docs/                   # Project docs
│   └── design-plan.md     # Design plan
├── src/                    # TypeScript source
│   ├── popup.ts           # Core logic
│   ├── popup.html         # Popup UI
│   ├── types.ts           # Type definitions
│   └── styles/
│       └── popup.css      # Styles
├── extension/             # Build output (load this in Chrome)
│   ├── manifest.json      # Extension config
│   ├── popup.html
│   ├── popup.js
│   ├── styles/
│   │   └── popup.css
│   └── icons/
│       ├── icon16.png
│       ├── icon48.png
│       └── icon128.png
├── tsconfig.json
├── package.json
├── icon-generator.html    # Icon generator
└── generate-icons.js      # Icon script
```

## 🎨 Custom icons

### Option 1: HTML generator (recommended)

1. Open `icon-generator.html` in a browser
2. Download the three icon sizes
3. Replace the PNGs in `extension/icons/`

### Option 2: Your own icons

Replace the files in `extension/icons/`:

- `icon16.png` (16×16)
- `icon48.png` (48×48)
- `icon128.png` (128×128)

## 💡 Core features

- **Add task** – Type in the input and press Enter
- **Complete task** – Click the checkbox to toggle done/undone
- **Delete task** – Click the “×” on the right
- **Sync** – Data saved to Chrome sync storage (multi-device)

## 🛠️ Stack

- **TypeScript** – Type-safe development
- **Chrome Extension API** – Manifest V3
- **Chrome Storage API** – Persistence and sync
- **Plain CSS** – No UI framework

## 📝 Development

### Workflow

1. Edit source under `src/`
2. Run `npm run watch` to compile
3. Click **Reload** on `chrome://extensions/`
4. Test via the extension icon

### Files

- **src/types.ts** – Todo and storage types
- **src/popup.ts** – TodoApp and business logic
- **src/popup.html** – Popup markup
- **src/styles/popup.css** – Minimal styles

### TypeScript

- Target: ES2020
- Strict mode: enabled
- Output: `extension/`
- Chrome types: `@types/chrome`

## 🔄 Possible extensions

- [ ] Inline edit (e.g. double-click)
- [ ] Categories / tags
- [ ] Priority
- [ ] Due date
- [ ] Search / filter
- [ ] Import / export
- [ ] Keyboard shortcuts
- [ ] Theme toggle

## 📄 License

MIT License

## 🤝 Contributing

Issues and pull requests welcome.
