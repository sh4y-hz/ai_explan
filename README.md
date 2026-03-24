# AI_explan 🤖

<p align="center">
  <strong>智能文本解释 Chrome 扩展</strong>
</p>

<p align="center">
  选中文字，右键点击，即刻获得 AI 解释。支持多轮对话追问。
</p>

---

## ✨ 功能特点

- **🎯 即选即问** - 选中任意文字，右键选择 AI_explan，立即获得解释
- **💬 多轮对话** - 支持追问和深入讨论，像 ChatGPT 一样交互
- **🔄 智能上下文** - 自动提取选中文字的上下文，提供更精准的解释
- **🌐 多 API 支持** - 支持 Qwen、Kimi、OpenAI、Anthropic 等多种 AI 服务
- **🎨 美观界面** - 现代化对话式 UI，支持 Markdown 格式
- **⚙️ 灵活配置** - 可自定义 API、模型、面板宽度等设置

---

## 📦 安装

### 方式一：从源码安装（开发者模式）

1. **下载源码**
   ```bash
   git clone https://github.com/your-username/ai_explan.git
   cd ai_explan
   ```

2. **打开 Chrome 扩展页面**
   - 在 Chrome 地址栏输入 `chrome://extensions`
   - 开启右上角的 **"开发者模式"**

3. **加载扩展**
   - 点击 **"加载已解压的扩展程序"**
   - 选择项目中的 `src` 文件夹

4. **配置 API**
   - 点击浏览器工具栏中的 AI_explan 图标
   - 切换到 **API** 标签
   - 选择你的 AI 服务商并输入 API Key
   - 点击 **Save API Settings**

---

## 🚀 使用方法

### 基本使用

1. 在任意网页选中想要了解的文字
2. 右键点击 → 选择 **AI_explan**
3. 右侧将弹出对话窗口，AI 会自动解释选中内容
4. 在底部输入框继续追问

### 配置选项

点击扩展图标打开设置面板：

| 标签 | 功能 |
|------|------|
| General | 开关扩展、面板宽度 |
| API | 选择 AI 服务、配置 API Key |
| Context | 上下文深度、包含内容 |
| Appearance | 主题、字体大小 |
| Advanced | 日志、数据导出 |

---

## 🔧 支持的 AI 服务

| 服务商 | API 类型 | 默认模型 |
|--------|----------|----------|
| Qwen (通义千问) | OpenAI 兼容 | qwen-max |
| Kimi (月之暗面) | OpenAI 兼容 | moonshot-v1-8k |
| OpenAI | OpenAI | gpt-4o |
| Anthropic (Claude) | Anthropic | claude-3-5-sonnet |

> 💡 **提示**：所有 OpenAI 兼容的 API 都可以使用，只需填入正确的 Base URL。

---

## 📁 项目结构

```
ai_explan/
├── src/                    # 扩展源码（加载此文件夹）
│   ├── api/
│   │   └── api-manager.js  # API 管理器
│   ├── background.js       # Service Worker
│   ├── content.js          # 内容脚本（对话界面）
│   ├── popup.html          # 设置页面
│   ├── popup.js            # 设置逻辑
│   ├── popup.css           # 设置样式
│   ├── settings-manager.js # 设置管理
│   └── manifest.json       # 扩展配置
├── README.md               # 项目说明
├── USER_GUIDE.md           # 用户手册
└── LICENSE                 # MIT 许可证
```

---

## 🔒 隐私说明

- **API Key 本地存储** - 你的 API Key 仅存储在浏览器本地，不会上传到任何服务器
- **数据不收集** - 扩展不会收集任何用户数据
- **开源透明** - 所有代码开源，可自行审查

---

## 🛠️ 技术栈

- **Manifest V3** - Chrome 扩展最新标准
- **Vanilla JavaScript** - 无框架依赖，轻量高效
- **Chrome APIs** - contextMenus, storage, runtime
- **OpenAI Compatible API** - 支持 OpenAI 格式的所有 API

---

## 📝 开发笔记

这是一个 **Vibe Coding** 项目，通过 AI 辅助编程完成。

### 开发过程

1. **需求分析** - 明确功能：选中文字 → AI 解释 → 多轮对话
2. **架构设计** - Chrome Extension Manifest V3 + 多 API 支持
3. **迭代开发** - 从基础功能到对话式交互
4. **问题修复** - 异步消息处理、API 响应解析、UI 优化

---

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

---

## 📄 许可证

MIT License - 可自由使用、修改和分发。

---

## 🙏 致谢

感谢所有 AI 服务提供商，让这个项目成为可能。

---

<p align="center">
  Made with ❤️ and AI assistance
</p>
