# AI_explan 用户手册

## 目录

1. [安装指南](#安装指南)
2. [快速开始](#快速开始)
3. [功能详解](#功能详解)
4. [API 配置](#api-配置)
5. [常见问题](#常见问题)

---

## 安装指南

### 步骤 1：下载扩展

从 GitHub 下载项目源码：

```bash
git clone https://github.com/your-username/ai_explan.git
```

或直接下载 ZIP 文件并解压。

### 步骤 2：加载到 Chrome

1. 打开 Chrome 浏览器
2. 在地址栏输入 `chrome://extensions` 并回车
3. 开启右上角的 **"开发者模式"** 开关
4. 点击左上角的 **"加载已解压的扩展程序"** 按钮
5. 选择项目中的 `src` 文件夹
6. 扩展加载成功后，会在工具栏显示 AI_explan 图标

---

## 快速开始

### 第一次使用

1. **配置 API Key**
   - 点击浏览器工具栏中的 AI_explan 图标
   - 切换到 **API** 标签
   - 选择一个 AI 服务商（推荐 Qwen 或 Kimi）
   - 输入你的 API Key
   - 点击 **Save API Settings**

2. **开始使用**
   - 在任意网页选中一段文字
   - 右键点击 → 选择 **AI_explan**
   - 右侧会弹出对话窗口，AI 会自动解释选中内容

---

## 功能详解

### 对话功能

- **自动解释**：选中文字后，AI 会自动给出解释
- **追问**：在底部输入框输入问题，按回车或点击发送
- **多轮对话**：支持连续追问，AI 会记住上下文
- **清空历史**：选中新的文字会自动清空之前的对话

### 设置选项

#### General（常规设置）

| 选项 | 说明 |
|------|------|
| Enable/Disable | 开启或关闭扩展 |
| Panel Width | 侧边栏宽度（300-800px） |

#### API（API 设置）

| 选项 | 说明 |
|------|------|
| Preferred API | 首选 AI 服务 |
| API Key | 各服务的 API 密钥 |
| Base URL | API 地址（可自定义） |
| Model | 使用的模型 |

#### Context（上下文设置）

| 选项 | 说明 |
|------|------|
| Context Length | 提取上下文的长度 |
| Include Headers | 是否包含标题 |
| Include Code Blocks | 是否包含代码块 |

#### Appearance（外观设置）

| 选项 | 说明 |
|------|------|
| Theme | 主题（浅色/深色/跟随系统） |
| Font Size | 字体大小 |
| Panel Opacity | 面板透明度 |
| Animations | 是否显示动画 |

#### Advanced（高级设置）

| 选项 | 说明 |
|------|------|
| Export Settings | 导出设置到 JSON 文件 |
| Import Settings | 从 JSON 文件导入设置 |
| Restore Defaults | 恢复默认设置 |

---

## API 配置

### Qwen（通义千问）

1. 访问 [阿里云 DashScope](https://dashscope.console.aliyun.com/)
2. 开通服务并获取 API Key
3. 在扩展中填入 API Key

**默认配置：**
- Base URL: `https://dashscope.aliyuncs.com/compatible-mode/v1`
- Model: `qwen-max`

### Kimi（月之暗面）

1. 访问 [Moonshot AI](https://platform.moonshot.cn/)
2. 注册并获取 API Key
3. 在扩展中填入 API Key

**默认配置：**
- Base URL: `https://api.moonshot.cn/v1`
- Model: `moonshot-v1-8k`

### OpenAI

1. 访问 [OpenAI Platform](https://platform.openai.com/)
2. 获取 API Key
3. 在扩展中填入 API Key

**默认配置：**
- Base URL: `https://api.openai.com/v1`
- Model: `gpt-4o`

### Anthropic（Claude）

1. 访问 [Anthropic Console](https://console.anthropic.com/)
2. 获取 API Key
3. 在扩展中填入 API Key

**默认配置：**
- Base URL: `https://api.anthropic.com/v1`
- Model: `claude-3-5-sonnet-20241022`

### 自定义 API

如果你使用其他 OpenAI 兼容的 API（如 DeepSeek、智谱等）：

1. 选择 **OpenAI** 作为 API 类型
2. 修改 **Base URL** 为你的 API 地址
3. 修改 **Model** 为对应的模型名称
4. 填入 API Key

---

## 常见问题

### Q: 右键菜单没有 AI_explan 选项？

**A:** 请检查：
1. 扩展是否已正确加载
2. 扩展是否已启用（在扩展设置中）
3. 是否选中了文字（必须先选中文字才会显示选项）

### Q: 点击 AI_explan 后没有弹出窗口？

**A:** 请检查：
1. 打开 `chrome://extensions`
2. 找到 AI_explan，点击 **service worker** 查看 Console
3. 检查是否有错误信息
4. 尝试刷新页面后重试

### Q: AI 返回错误信息？

**A:** 请检查：
1. API Key 是否正确
2. API 是否有余额
3. Base URL 是否正确
4. 尝试切换其他 API 服务

### Q: 如何获取 API Key？

**A:** 
- Qwen: 访问阿里云 DashScope 控制台
- Kimi: 访问 Moonshot AI 平台
- OpenAI: 访问 OpenAI Platform
- Anthropic: 访问 Anthropic Console

### Q: 对话历史会保存吗？

**A:** 
- 当前对话会在选中新文字时清空
- 关闭侧边栏后对话历史会丢失
- 这是为了保护隐私，数据不会持久化存储

### Q: 支持哪些浏览器？

**A:** 
- 目前仅支持 Chrome 浏览器
- 理论上支持所有 Chromium 内核浏览器（Edge、Brave 等）
- 未测试 Safari 和 Firefox

---

## 技术支持

如遇到问题，请：
1. 查看 Chrome 扩展页面的错误日志
2. 在 GitHub 提交 Issue
3. 附上错误截图和复现步骤

---

**祝你使用愉快！** 🎉
