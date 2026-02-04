# Chrome Web Store 提交信息 / Chrome Web Store Listing

## 打包 / Pack

```bash
npm run build
npm run pack
```

生成 `dist/10dos-<version>.zip`，用于商店上传。

---

## 商店必填项 / Required Fields

### 应用名称 / Name
- **10dos**

### 简短说明 / Short description（最多 132 字符）

- **English:**  
  `Chrome extension: minimal todo & task list. Add, complete, delete from toolbar. Syncs across devices. Lightweight productivity.`
- **中文：**  
  `Chrome 极简待办与任务列表。工具栏添加、完成、删除，多设备同步，轻量生产力工具。`

### 详细说明 / Detailed description

**English:**

```
10dos is a minimal Chrome extension for your todo list and daily tasks. A lightweight productivity tool that lives in your toolbar—click the icon to open your list, no new tab.

• Todo list: add tasks (type + Enter), complete (checkbox), delete (×)
• Switch between Active and Completed tasks
• Up to 10 active and 10 completed items
• Syncs across your devices via Chrome (same Google account)
• No sign-up, no account with us—data stays in your browser

Website & install: https://10dos.com | Feedback & suggestions: https://github.com/zhangzhibin/10dos
```

**中文：**

```
10dos 是一款极简 Chrome 扩展，用于待办与每日任务。轻量生产力工具，常驻工具栏，点击即可打开列表，不新开标签。

• 待办列表：添加任务（输入+回车）、完成（勾选）、删除（×）
• 在「未完成」与「已完成」之间切换
• 最多 10 条未完成、10 条已完成
• 通过 Chrome 同步到你的设备（同一 Google 账号）
• 无需单独注册，数据仅存于浏览器

官网与安装：https://10dos.com | 反馈与建议：https://github.com/zhangzhibin/10dos
```

### 官网与联系 / Website & support（商店允许填写）

- **Website URL：** `https://10dos.com` — 官网与安装说明  
- **Support URL（建议填 GitHub）：** `https://github.com/zhangzhibin/10dos` — 方便用户提 Issue、建议与联系  

在 Chrome Web Store 开发者仪表盘「Store listing」中填写 **Website** 与 **Support URL**（可填 GitHub 仓库地址，便于反馈与建议）。

### 类别 / Category
- **Productivity**（生产力）

### 语言 / Language
- 主语言：**English (United States)**
- 可添加：**中文（简体）** 等

---

## Single purpose / 单一用途

**English (for store):**

> This extension has a single purpose: to provide a minimal todo list that users can open from the toolbar. Users add, complete, and delete tasks in the popup. Task data is stored and synced only via Chrome’s built-in storage (same Google account); no data is sent to any external or developer server.

**中文：**

> 本扩展仅有一个用途：在浏览器工具栏提供极简待办列表。用户在弹窗中添加、完成、删除任务。任务数据仅通过 Chrome 内置存储（同一 Google 账号）保存与同步，不会发送到任何外部或开发者服务器。

---

## 权限说明 / Permission justification

| 权限 / Permission | 用途 / Purpose | 商店填写示例 / Store justification (EN) |
|-------------------|----------------|------------------------------------------|
| **storage** | 保存与同步用户的待办列表；使用 `chrome.storage.sync`，数据仅存在于用户 Chrome 账号，不上传第三方。 | **Why is this permission needed?** — To save the user’s todo list and sync it across their devices when they are signed into Chrome with the same Google account. All data stays in Chrome’s sync storage; nothing is sent to our or any other server. |

---

## 资源清单 / Assets Checklist

| 项 | 要求 | 说明 |
|----|------|------|
| 图标 | 128×128 PNG | 已有 `extension/icons/icon128.png` |
| 商店图标 | 128×128 | 同上，商店会生成 48、16 |
| 截图 | 1280×800 或 640×400 | 可选，推荐 1–5 张，见 `screenshots/` |
| 宣传图（小） | 440×280 PNG | 可选 |
| 宣传图（大） | 920×680 PNG | 可选 |
| 宣传图（Marquee） | 1400×560 PNG | 可选 |

---

## 隐私与权限 / Privacy & Permissions

- **权限及理由：** 见上文「权限说明 / Permission justification」。
- **隐私政策：** 若商店要求，需提供可访问的隐私政策 URL（说明仅使用 Chrome 存储、不同步到开发者服务器）。

---

## 提交前检查 / Pre-submit Checklist

- [ ] `npm run build` 无报错
- [ ] `npm run pack` 生成 zip
- [ ] 在 Chrome 中“加载已解压的扩展程序”选择 `extension/` 目录，功能正常
- [ ] 确认 `manifest.json` 中 `version` 与 `package.json` 一致
- [ ] 准备好简短说明、详细说明（中/英按需）
- [ ] 在商店 listing 中填写 **Website**：`https://10dos.com`，**Support URL**：`https://github.com/zhangzhibin/10dos`
- [ ] 如需隐私政策，准备好 URL 并填到开发者仪表盘
