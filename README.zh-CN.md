# 10dos - 极简todos插件

[English](README.md)

极简 todos Chrome 扩展，使用 TypeScript 开发，点击图标即可快速查看和编辑任务。

## ✨ 特性

- 🎯 **极简设计** - 纯CSS样式，无外部UI框架依赖
- ⚡ **快速访问** - 点击扩展图标立即打开
- 💾 **自动保存** - 使用Chrome Storage API自动同步
- 🔒 **类型安全** - 完整的TypeScript类型定义
- 📦 **轻量级** - 最小化依赖，快速加载

## 🚀 快速开始

### 安装依赖

```bash
npm install
```

### 编译TypeScript

```bash
# 一次性编译
npm run build

# 或者监听模式（开发时使用）
npm run watch
```

### 加载扩展到Chrome

1. 打开Chrome浏览器，访问 `chrome://extensions/`
2. 开启右上角的"开发者模式"
3. 点击"加载已解压的扩展程序"
4. 选择项目中的 `extension/` 目录
5. 扩展加载成功！点击工具栏图标即可使用

## 📁 项目结构

```
10dos/
├── docs/                   # 项目文档
│   └── design-plan.md     # 初始设计方案
├── src/                    # TypeScript源码
│   ├── popup.ts           # 核心业务逻辑
│   ├── popup.html         # 弹窗界面
│   ├── types.ts           # 类型定义
│   └── styles/
│       └── popup.css      # 样式文件
├── extension/             # 编译输出目录（加载此目录到Chrome）
│   ├── manifest.json      # 扩展配置
│   ├── popup.html         # 编译后的HTML
│   ├── popup.js           # 编译后的JavaScript
│   ├── styles/
│   │   └── popup.css
│   └── icons/             # 扩展图标
│       ├── icon16.png
│       ├── icon48.png
│       └── icon128.png
├── tsconfig.json          # TypeScript配置
├── package.json           # 项目配置
├── icon-generator.html    # 图标生成工具
└── generate-icons.js      # 图标生成脚本
```

## 🎨 自定义图标

### 方法1：使用HTML生成器（推荐）

1. 在浏览器中打开 `icon-generator.html`
2. 点击按钮下载3个不同尺寸的图标
3. 将下载的PNG文件替换到 `extension/icons/` 目录

### 方法2：使用自己的图标

直接替换 `extension/icons/` 目录下的图标文件：
- `icon16.png` (16x16)
- `icon48.png` (48x48)
- `icon128.png` (128x128)

## 💡 核心功能

- ✅ **添加任务** - 在输入框输入任务内容，按回车添加
- ✅ **完成任务** - 点击复选框标记任务完成/未完成
- ✅ **删除任务** - 点击任务右侧的"×"按钮删除
- ✅ **数据同步** - 自动保存到Chrome云端，支持多设备同步

## 🛠️ 技术栈

- **TypeScript** - 类型安全的开发体验
- **Chrome Extension API** - Manifest V3
- **Chrome Storage API** - 数据持久化和同步
- **纯CSS** - 无外部UI框架，保持轻量

## 📝 开发说明

### 开发流程

1. 修改 `src/` 目录下的源码
2. 运行 `npm run watch` 自动编译
3. 在 `chrome://extensions/` 点击"重新加载"扩展
4. 点击扩展图标测试效果

### 文件说明

- **src/types.ts** - 定义Todo数据结构和存储接口
- **src/popup.ts** - TodoApp类，包含所有业务逻辑
- **src/popup.html** - 简洁的UI结构
- **src/styles/popup.css** - 极简黑白灰配色方案

### TypeScript配置

- 目标版本：ES2020
- 严格模式：已启用
- 输出目录：extension/
- Chrome类型：已包含 @types/chrome

## 🔄 后续扩展方向

- [ ] 任务编辑功能（双击编辑）
- [ ] 任务分类/标签
- [ ] 优先级标记
- [ ] 截止日期
- [ ] 搜索和筛选
- [ ] 导入/导出数据
- [ ] 快捷键支持
- [ ] 主题切换

## 📄 许可证

MIT License

## 🤝 贡献

欢迎提交Issue和Pull Request！
