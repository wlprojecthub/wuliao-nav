# 无聊的导航 - Code Wiki

> 本文档对应 `v1.1.0` 版本，记录项目当前架构、模块职责、数据结构、图标机制、运行部署方式和维护规则。

---

## 目录

- [1. 项目概览](#1-项目概览)
- [2. 技术栈](#2-技术栈)
- [3. 目录结构](#3-目录结构)
- [4. 系统架构](#4-系统架构)
- [5. 模块职责](#5-模块职责)
- [6. 关键函数](#6-关键函数)
- [7. 数据结构](#7-数据结构)
- [8. CSS 设计系统](#8-css-设计系统)
- [9. 依赖关系](#9-依赖关系)
- [10. 运行与部署](#10-运行与部署)
- [11. 数据维护指南](#11-数据维护指南)
- [12. 已知限制与注意事项](#12-已知限制与注意事项)

---

## 1. 项目概览

**项目名称**：无聊的导航（wuliao-nav）

**项目类型**：纯静态网址导航站

**核心定位**：一个收集 ACGN、AI、开发资源与实用工具的个人导航页，采用 ACG 二次元粉色风格和 Webstack 经典布局。

**核心特性**：

- Stardust Edition ACG 星愿主题：粉紫、薰衣草和浅蓝色背景、玻璃态效果
- 星愿导语面板：根据默认视图和搜索状态动态展示说明与统计
- Webstack 布局：左侧固定侧边栏、右侧内容区、顶部搜索栏
- 横向网站卡片：本地 favicon、名称、描述、推荐或风险标记
- 实时模糊搜索：支持名称、描述、标签的多关键词匹配，英文不区分大小写，使用 300ms 防抖；当前还支持域名、完整 URL、深层 URL、主域名匹配子域名、明确中文别名、`?q=` 状态恢复和中文 IME composition 输入保护
- 分类侧边栏导航：支持平滑滚动和滚动自动高亮
- 二级分类导航：按用途自动分组，可在一级分类内快速跳转
- Webstack 树形侧边栏：点击一级分类展开二级分类，点击二级分类跳转到对应内容
- 键盘可访问导航：一级分类使用原生按钮，并同步维护 `aria-expanded` 展开状态
- 人工质量排序：二级分组内依次展示编辑推荐、普通、带访问提示的网站，同级按照人工维护的实用性顺序展示
- 中国大陆访问提示：区分红橙色的“需要科学上网”和浅金色的“可能需要科学上网”
- 清晰徽章：推荐和访问提示使用更大的字号、字重与内边距
- Stardust 404 页面：独立错误页、返回导航和常用分类快捷入口
- 响应式布局：适配桌面端、平板端和移动端
- HTML 转义和 URL 协议校验：降低动态渲染产生的 XSS 风险
- 本地 Favicon：优先读取本地图标；无法可靠确认官方图标的站点使用默认四角星图标，图标加载失败时显示网站名称首字母
- 纯静态部署：无需后端、数据库和构建工具

**当前数据规模**：

- 网站总数：988 个
- 分类数量：12 个
- 本地 Favicon：923 个可发布文件
- 默认四角星图标站点：38 个
- 缺失 favicon 引用：0 个

---

## 2. 技术栈

| 层级 | 技术 | 说明 |
|------|------|------|
| 结构层 | HTML5 | 页面骨架、语义化标签、无障碍属性 |
| 表现层 | CSS3 | CSS 自定义属性、Grid、Flexbox、动画、响应式布局 |
| 行为层 | 原生 JavaScript（ES6+） | 数据渲染、搜索、导航和移动端交互 |
| 图标资源 | 本地 PNG Favicon | 从 `assets/img/favicons/` 按域名读取 |
| 部署 | 静态站点 | 可部署到 Nginx、1Panel、Vercel、Netlify、GitHub Pages |

项目不使用第三方框架、包管理器或构建工具。

---

## 3. 目录结构

```text
wuliao-nav/
├── index.html                  # 页面入口和 DOM 容器
├── 404.html                    # Stardust 风格静态错误页
├── assets/
│   ├── css/
│   │   └── style.css           # 全局样式和 404 页面样式（1958 行）
│   ├── js/
│   │   ├── data.js             # 分类、二级分类规则和网站数据（1115 行）
│   │   └── main.js             # 渲染、搜索和交互逻辑（620 行）
│   └── img/
│       ├── favicons/           # 本地图标（923 个可发布文件）
│       └── default-icon.png    # 品牌四角星页面图标和无效 URL 兜底图标
├── scripts/
│   ├── bump-release-version.js # 发布前刷新静态资源内容哈希
│   ├── preview-server.js       # 本地静态预览与 404 验收
│   ├── check-data.js           # 数据一致性检查
│   ├── check-favicons.js       # favicon 引用与资源检查
│   └── 缓存刷新.txt            # 发布脚本简要说明
├── deploy/
│   └── nginx-cache.conf        # Nginx / OpenResty 缓存配置片段
├── CHANGELOG.md                # 版本更新日志
├── CODE_WIKI.md                # 技术文档
└── README.md                   # 项目说明
```

**核心文件职责**：

| 文件 | 行数 | 职责 |
|------|------|------|
| `index.html` | 67 | 页面结构、DOM 容器、资源引入 |
| `404.html` | 71 | Stardust 风格错误页、返回导航和快捷入口 |
| `assets/js/data.js` | 1115 | `CATEGORIES`、`SUBCATEGORIES` 和 `SITES_DATA` |
| `assets/js/main.js` | 620 | 初始化、导语面板、二级分组、树形侧边栏、排序、搜索、图标选择和事件绑定 |
| `assets/css/style.css` | 1958 | 主题、布局、卡片、树形侧边栏、二级导航、404 页面、动画和响应式样式 |
| `scripts/bump-release-version.js` | 69 | 为 CSS、数据、品牌默认图标和脚本生成内容哈希，并同步更新脚本兜底路径与两个 HTML 入口 |
| `scripts/preview-server.js` | 93 | 启动本地静态预览服务，并对不存在路径返回 `404.html` |
| `scripts/check-data.js` | 264 | 只读检查网站数据总数、分类、URL、重复 URL、字段合法性和关键条目状态 |
| `scripts/check-favicons.js` | 273 | 只读检查默认图标、favicon 引用、关键图标、空文件和图片格式 |
| `deploy/nginx-cache.conf` | 29 | HTML 重新验证、带哈希代码长期缓存和图片短期缓存规则 |

---

## 4. 系统架构

### 4.1 整体架构

```text
index.html
├── assets/css/style.css
├── assets/js/data.js
│   ├── CATEGORIES
│   ├── SUBCATEGORIES
│   └── SITES_DATA
└── assets/js/main.js
    ├── 安全处理：escapeHtml()、sanitizeUrl()
    ├── 渲染：renderSidebar()、renderSites()、createSiteCard()
    ├── 分组：sortSites()、groupSitesBySubcategory()、getSubcategory()
    ├── 搜索：handleSearch()、normalizeSearchInput()、siteUrlMatchesSearch()、highlightText()
    ├── 搜索状态：getSearchQueryFromUrl()、updateSearchQueryInUrl()、restoreSearchFromUrl()
    ├── 图标：getFaviconUrl()
    └── 交互：toggleCategory()、scrollToCategory()、scrollToSubcategory()、bindEvents()
```

### 4.2 初始化流程

```text
DOMContentLoaded
  └── init()
      ├── renderSidebar()
      ├── restoreSearchFromUrl()
      │   └── handleSearch({ updateUrl: false })
      │       └── renderSites()
      │           └── createHero()
      └── bindEvents()
```

### 4.3 渲染流程

```text
renderSites(sites)
  ├── createHero()：渲染星愿导语面板
  ├── 无匹配结果：渲染空状态
  ├── 按 site.category 分组
  └── 按 CATEGORIES 顺序遍历分类
      ├── 渲染分类标题和数量
      ├── sortSites()：推荐、普通、带访问提示三级排序，同级使用人工质量顺序
      ├── groupSitesBySubcategory()：按规则生成二级分组
      └── 遍历二级分类并调用 createSiteCard(site)
          ├── sanitizeUrl(site.url)
          ├── getFaviconUrl(site)
          ├── escapeHtml(name、description、risk)
          ├── highlightText()
          └── 返回卡片 HTML
```

---

## 5. 模块职责

### 5.1 `index.html` - 页面骨架

`index.html` 定义以下主要 DOM 元素：

| ID | 元素 | 用途 |
|----|------|------|
| `sidebar` | `<aside>` | 左侧分类栏，移动端可滑入滑出 |
| `sidebarNav` | `<nav>` | 分类导航容器，由 JavaScript 动态填充 |
| `sidebarOverlay` | `<div>` | 移动端侧边栏遮罩 |
| `sidebarToggle` | `<button>` | 移动端侧边栏打开按钮 |
| `searchInput` | `<input>` | 搜索输入框 |
| `mainContent` | `<main>` | 分类区块和网站卡片容器 |
| `backToTop` | `<button>` | 回到顶部按钮 |

资源加载顺序：

```html
<link rel="icon" href="assets/img/default-icon.png?v=<内容哈希>">
<link rel="apple-touch-icon" href="assets/img/default-icon.png?v=<内容哈希>">
<link rel="stylesheet" href="assets/css/style.css">
<script src="assets/js/data.js"></script>
<script src="assets/js/main.js"></script>
```

`data.js` 必须先于 `main.js` 加载，因为 `main.js` 直接读取全局变量 `CATEGORIES` 和 `SITES_DATA`。

### 5.2 `assets/js/data.js` - 数据层

该文件集中维护：

| 变量 | 类型 | 说明 |
|------|------|------|
| `CATEGORIES` | `Array<Category>` | 12 个分类的顺序、名称和 Emoji 图标 |
| `SUBCATEGORIES` | `Record<string, Array<Subcategory>>` | 各一级分类下的二级分类规则 |
| `SITES_DATA` | `Array<Site>` | 988 个网站的数据记录 |

数据通过普通 `<script>` 标签同步加载，无模块化依赖。

### 5.3 `assets/js/main.js` - 逻辑层

该文件负责：

- 初始化页面
- 渲染动态星愿导语面板
- 渲染分类侧边栏
- 按一级和二级分类渲染网站卡片
- 将编辑推荐网站置顶、带访问提示的网站置底，同级网站按照数据表中的人工质量顺序展示
- 转义动态文本并校验链接协议
- 从本地目录解析 Favicon 地址
- 搜索网站并高亮匹配文字
- 支持别名、域名、完整 URL 和深层 URL 搜索，并通过 `?q=` 保存与恢复搜索状态
- 保护中文 IME composition 组合输入，避免拼音输入过程中提前触发筛选
- 控制侧边栏导航和滚动高亮
- 控制 Webstack 风格一级、二级树形侧边栏
- 控制移动端侧边栏
- 控制回到顶部按钮

全局状态：

| 变量 | 初始值 | 说明 |
|------|--------|------|
| `activeCategory` | `'all'` | 当前激活的分类 ID |
| `currentSearch` | `''` | 当前搜索关键词 |
| `expandedCategory` | `null` | 当前展开的一级分类 ID |
| `searchTimer` | `undefined` | 搜索输入防抖计时器 |
| `isComposingSearch` | `false` | 中文输入法组合输入状态 |

### 5.4 `assets/css/style.css` - 表现层

样式文件负责：

- ACG 粉色主题和玻璃态效果
- 左侧固定栏和顶部吸顶栏
- 网站卡片 Grid 布局
- 推荐、风险和搜索高亮样式
- 分类区块入场动画
- 回到顶部按钮
- 平板端和移动端响应式布局

---

## 6. 关键函数

### 6.1 安全处理

#### `escapeHtml(str)`

将动态文本中的 `&`、`<`、`>`、`"` 和 `'` 转义，避免文本被解释为 HTML。

用于网站名称、描述和风险提示。

#### `sanitizeUrl(url)`

使用 `new URL(url)` 解析链接，仅允许 `http:` 和 `https:` 协议。无效 URL 或其他协议会降级为 `#`。

#### `safeIdentifier(value)`

仅允许动态 DOM 标识符使用字母、数字和连字符，避免分类或二级分类 ID 进入属性和内联调用时改变 HTML 结构。

#### `getScrollBehavior()` / `exitSearch()`

统一处理减少动态效果偏好下的滚动方式，并在分类导航前清空搜索框、搜索状态和待执行的防抖任务。

### 6.2 初始化与渲染

#### `init()`

依次调用 `renderSidebar()`、`restoreSearchFromUrl()` 和 `bindEvents()`。`restoreSearchFromUrl()` 会读取 URL 中的 `?q=` 参数，并通过 `handleSearch({ updateUrl: false })` 恢复搜索状态或渲染默认视图。

#### `renderSidebar()`

统计每个分类的网站数量，渲染“全部”和 12 个分类导航项。

#### `renderSites(sites)`

按分类对网站分组，并按照 `CATEGORIES` 的定义顺序渲染分类区块。没有匹配结果时显示空状态。

#### `sortSites(sites)`

复制网站数组后排序：编辑推荐网站优先，普通网站居中，带 `risk` 的访问提示网站置底；同一优先级按照网站在 `SITES_DATA` 中的人工维护顺序展示。

#### `getSiteSortPriority(site)`

返回网站排序权重：推荐为 `0`、普通为 `1`、带风险提示的网站为 `2`。如果网站同时标记推荐和风险提示，以风险提示为准并排在末尾。

#### `isSiteHighlighted(site)`

合并数据记录中的 `highlight` 标记和 `EDITOR_RECOMMENDED_SITES` 编辑精选名单，用于控制推荐徽章和排序优先级。

#### `groupSitesBySubcategory(categoryId, sites)`

按照 `SUBCATEGORIES` 的定义顺序生成二级分组，仅渲染包含网站的分组。

#### `getSubcategory(categoryId, site)`

将网站名称、描述和标签合并为可检索文本，按顺序匹配二级分类关键词。没有匹配项时进入该一级分类的 fallback 分组。

#### `createSiteCard(site)`

生成单个网站卡片 HTML：

- 使用 `sanitizeUrl()` 处理跳转链接
- 使用 `escapeHtml()` 转义动态文本
- 根据 `highlight` 和 `risk` 添加样式
- `risk` 与推荐徽章互斥显示，`risk` 优先
- 使用本地图标，加载失败时显示网站名称首字母

#### `createHero(resultCount)`

生成页面顶部的星愿导语面板。默认状态展示导航站定位；搜索状态展示关键词和匹配结果数量。

### 6.3 本地图标

#### `getFaviconUrl(site)`

先检查站点是否显式配置默认图标，再使用 `new URL(site.url).hostname` 提取域名，并生成本地图标地址：

```javascript
if (site.icon === 'default') {
    return 'assets/img/default-icon.png?v=608d62088fc4';
}
```

`cloud.hosthatch.com` 保留特殊默认图标逻辑，不要求存在对应的 hostname favicon 文件。其他站点使用：

```javascript
assets/img/favicons/${domain}.png
```

图标加载流程：

```text
本地图标存在
  └── 显示 PNG 图标

本地图标不存在或加载失败
  └── img.onerror
      ├── 切换到品牌四角星默认图标
      └── 默认图标仍失败时显示网站名称首字母

URL 无法解析
  └── 使用 assets/img/default-icon.png?v=<内容哈希>

已确认没有有效本地图标
  └── 使用 assets/img/default-icon.png?v=<内容哈希>
```

缺失或不可用的网站图标将使用与站点品牌一致的四角星默认图标兜底。当前实现不依赖 Google Favicon API。

### 6.4 搜索

#### `handleSearch(options = {})`

搜索规则：

- 忽略输入首尾空格
- 英文不区分大小写
- 使用空格将输入拆分为多个搜索词
- 将网站名称、描述、标签和可选别名合并为统一搜索文本
- 每个搜索词均使用子字符串方式匹配，实现多关键词模糊查找
- 当搜索词可解析为域名、完整 URL 或带路径 URL 时，通过 `siteUrlMatchesSearch(site, term)` 匹配站点 hostname
- 支持输入主域名命中对应子域名，例如 `deepseek.com` 命中 `chat.deepseek.com`
- 所有搜索词都命中时，网站才会显示
- 空关键词恢复全部网站
- 默认会通过 `updateSearchQueryInUrl()` 将搜索词写入 `?q=`，恢复流程可通过参数跳过 URL 写入

搜索输入使用 300ms 防抖。

#### `normalizeSearchInput(value)`

对搜索输入执行 NFKC 归一化、去除首尾空白并转为小写，供文本搜索和 URL 搜索共用。

#### `getSearchQueryFromUrl()` / `updateSearchQueryInUrl(value)` / `restoreSearchFromUrl()`

`getSearchQueryFromUrl()` 从当前地址读取 `q` 参数。`updateSearchQueryInUrl(value)` 使用 `history.replaceState()` 写入或清除 `?q=`。`restoreSearchFromUrl()` 将 URL 中的搜索词恢复到搜索框，并调用 `handleSearch({ updateUrl: false })`。

#### `normalizeHostname(hostname)` / `getInputHostname(value)` / `siteUrlMatchesSearch(site, term)`

这些函数负责域名和 URL 搜索。输入可以是域名、完整 URL 或深层 URL；解析后会去除 `www.`，并允许主域名命中对应子域名。

#### `highlightText(text, keyword)`

将搜索关键词按空格拆分、去重并按长度降序排列，再将结果中逐词匹配的文字包裹为：

```html
<span class="search-highlight">匹配文字</span>
```

#### `escapeRegExp(string)`

转义搜索关键词中的正则表达式特殊字符，避免关键词改变正则语义。

### 6.5 导航与移动端

#### `scrollToCategory(categoryId)`

- 搜索状态下先清空搜索并恢复全部卡片
- 更新侧边栏激活状态
- 按系统减少动态效果偏好滚动到目标分类
- 在移动端关闭侧边栏

#### `toggleCategory(categoryId)`

清空搜索状态，展开或收起一级分类下的二级菜单，并按系统减少动态效果偏好滚动到该一级分类内容。函数末尾调用 `closeSidebar()`，确保移动端点击一级分类后菜单、遮罩与 `aria-expanded` 状态同步收起。

#### `scrollToSubcategory(event, categoryId, subcategoryId)`

清空搜索状态，激活二级分类菜单，按系统减少动态效果偏好滚动到对应内容，并在移动端关闭侧边栏。

#### `updateSidebarTree(activeSubcategory)`

统一更新一级分类激活状态、二级菜单展开状态和二级分类激活状态，并同步维护一级分类按钮的 `aria-expanded` 与二级菜单的 `aria-hidden` 属性。

#### `openSidebar()` / `closeSidebar()`

控制移动端侧边栏、遮罩层和页面滚动锁定，并同步维护菜单按钮的 `aria-expanded`。

#### `bindEvents()`

绑定搜索输入、侧边栏、遮罩、回到顶部、滚动和 ESC 键事件。搜索输入额外监听 `compositionstart`、`compositionend` 和 `event.isComposing`，用于保护中文输入法组合输入；窗口额外监听 `popstate`，用于浏览器历史导航时恢复 `?q=` 搜索状态。

#### `updateActiveNavOnScroll()`

根据当前滚动位置更新侧边栏激活分类。滚动监听通过 `requestAnimationFrame` 节流。

---

## 7. 数据结构

### 7.1 分类数据 `CATEGORIES`

```typescript
interface Category {
    id: string;    // 分类唯一标识
    name: string;  // 分类显示名称
    icon: string;  // Emoji 图标
}
```

当前分类统计：

| ID | 名称 | 图标 | 网站数量 |
|----|------|------|----------|
| `recommend` | 常用推荐 | ⭐ | 27 |
| `ai` | AI 工具 | 🤖 | 155 |
| `dev` | 开发编程 | 💻 | 203 |
| `design` | 设计创作 | 🎨 | 62 |
| `anime` | 动漫游戏 | 🎮 | 65 |
| `media` | 影音媒体 | 🎬 | 47 |
| `social` | 社交通讯 | 💬 | 46 |
| `office` | 效率办公 | 📝 | 83 |
| `shopping` | 网购金融 | 🛒 | 75 |
| `cloud` | 云服务 | ☁️ | 68 |
| `software` | 软件资源 | 📦 | 64 |
| `tools` | 实用工具 | 🔧 | 93 |
| **总计** | | | **988** |

### 7.2 网站数据 `SITES_DATA`

```typescript
interface Site {
    name: string;         // 网站名称
    url: string;          // 完整 URL
    description: string;  // 简短描述
    tags: string[];       // 搜索标签
    category: string;     // CATEGORIES 中存在的分类 ID
    highlight?: boolean;  // 是否显示推荐样式
    risk?: string;        // 访问提示：“需要科学上网”或“可能需要科学上网”
    icon?: 'default';     // 可选，仅允许使用站内默认四角星图标
    aliases?: string[];   // 可选，明确人工确认的搜索别名
}
```

当前 `aliases` 仅用于：

- Bilibili：`B站`、`哔哩哔哩`
- DeepSeek：`深度求索`

### 7.3 二级分类规则 `SUBCATEGORIES`

```typescript
interface Subcategory {
    id: string;          // 二级分类唯一标识
    name: string;        // 显示名称
    keywords?: string[]; // 按顺序匹配名称、描述和标签
    fallback?: boolean;  // 未命中规则时使用的兜底分组
}
```

示例：

```javascript
ai: [
    { id: 'chat', name: '对话助手', keywords: ['对话', '助手', '聊天'] },
    { id: 'image', name: '图像设计', keywords: ['绘画', '图像', '设计'] },
    { id: 'other', name: '其他 AI', fallback: true }
]
```

规则从上到下匹配，因此更具体的关键词应放在通用关键词之前。

示例：

```javascript
{
    name: 'GitHub',
    url: 'https://github.com',
    description: '全球最大的代码托管平台，开源项目聚集地',
    tags: ['开源', '代码', 'Git'],
    category: 'recommend',
    highlight: true
}
```

---

## 8. CSS 设计系统

### 8.1 核心变量

| 变量 | 值 | 用途 |
|------|-----|------|
| `--sidebar-width` | `240px` | 侧边栏宽度 |
| `--topbar-height` | `56px` | 顶部导航栏高度 |
| `--sidebar-bg` | 粉紫渐变 | 侧边栏背景 |
| `--body-bg` | `#fff5f8` | 页面背景 |
| `--card-bg` | `#ffffff` | 卡片背景 |
| `--accent-color` | `#ff6b95` | 主题强调色 |
| `--highlight-color` | `#e85d92` | 推荐样式颜色 |
| `--lavender` | `#8c79d9` | 薰衣草紫装饰色 |
| `--radius` | `18px` | 标准圆角 |
| `--radius-lg` | `24px` | 大圆角 |

### 8.2 布局

```text
┌──────────┬──────────────────────────────┐
│          │         .topbar              │
│ .sidebar │──────────────────────────────│
│  240px   │                              │
│          │       .sites-content         │
│          │                              │
└──────────┴──────────────────────────────┘
```

- `.sidebar`：固定定位，宽度为 240px
- `.main-content`：通过 `margin-left` 为侧边栏留出空间
- `.topbar`：使用 `position: sticky`
- `.sites-grid`：使用 CSS Grid 自动填充卡片

### 8.3 响应式断点

| 断点 | 主要变化 |
|------|----------|
| `> 1024px` | 默认桌面布局 |
| `≤ 1024px` | 缩小卡片最小宽度 |
| `≤ 768px` | 侧边栏改为滑入式，主内容取消左侧间距，卡片改为单列 |

### 8.4 动效

- `heroArrival`：导语面板淡入并轻微上移
- `sectionArrival`：分类区块柔和入场
- `twinkle`：Logo、星光和空状态图标闪烁
- `moonFloat`：导语面板月牙缓慢漂浮
- `orbitPulse`：侧边栏 Logo 轨道光点呼吸
- `prefers-reduced-motion`：系统开启减少动态效果时，自动关闭动画和过渡

---

## 9. 依赖关系

### 9.1 内部依赖

```text
index.html
├── style.css
├── data.js
└── main.js
    ├── 依赖 CATEGORIES
    ├── 依赖 SITES_DATA
    └── 依赖 index.html 中的 DOM 容器
```

### 9.2 外部依赖

项目运行不依赖外部 API、第三方 JavaScript 库或后端服务。

网站卡片图标从 `assets/img/favicons/` 加载。部分目标网站本身可能需要特定网络环境才能访问，但这不影响导航页加载。

---

## 10. 运行与部署

### 10.1 本地运行

直接打开 `index.html` 即可查看，也可以使用本地 HTTP 服务器：

```bash
python -m http.server 8080
```

然后访问：

```text
http://localhost:8080
```

### 10.2 本地预览与验收

```powershell
node .\scripts\preview-server.js --port 8765
node .\scripts\check-data.js
node .\scripts\check-favicons.js
```

`preview-server.js` 用于本地静态预览与 404 验收；`check-data.js` 用于只读检查网站数据一致性；`check-favicons.js` 用于只读检查 favicon 引用和资源状态。

### 10.3 Nginx 部署

每次上传新版本前，先刷新静态资源哈希：

```bash
node scripts/bump-release-version.js
```

然后将 `deploy/nginx-cache.conf` 中的缓存规则合并到站点 `server` 配置块。HTML
入口应重新验证，带内容哈希的 CSS、JavaScript 和品牌默认图标可以及时刷新并长期缓存。
其他图片使用稳定文件名，因此 `/assets/img/` 使用 7 天可重新验证缓存，避免 favicon 更新后
长期停留在旧版本。

```nginx
server {
    listen 80;
    server_name nav.example.com;
    root /var/www/wuliao-nav;
    index index.html;
    error_page 404 /404.html;

    location / {
        try_files $uri $uri/ =404;
    }

    location = /404.html {
        internal;
    }

    location /assets/css/ {
        expires 1y;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    location /assets/js/ {
        expires 1y;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    location /assets/img/ {
        expires 7d;
        add_header Cache-Control "public, max-age=604800, must-revalidate";
    }
}
```

### 10.4 其他静态托管

整个项目可以直接部署到：

- 1Panel 静态站点
- Vercel
- Netlify
- GitHub Pages

`404.html` 默认按站点根目录部署，使用 `/assets/...`、`/` 和 `/#category-...` 根路径，
以保证 `/abc/test/123` 等多级错误路径下资源仍可正确加载。如果部署到 GitHub Pages
项目路径（例如 `/wuliao-nav/`），应在部署版本中将 `404.html` 的资源路径、首页链接和
快捷入口统一加上 `/wuliao-nav/` 基础路径，并配置项目级 404。不能机械改为相对路径，
否则多级错误路径会再次解析到错误目录。

---

## 11. 数据维护指南

### 11.1 新增网站

在 `assets/js/data.js` 的 `SITES_DATA` 数组中添加：

```javascript
{
    name: '网站名称',
    url: 'https://example.com',
    description: '网站描述',
    tags: ['标签1', '标签2'],
    category: '分类ID',
    highlight: true,       // 可选
    risk: '可能需要科学上网' // 可选，也可以使用“需要科学上网”
}
```

### 11.2 调整网站排序

排序由 `assets/js/main.js` 中的 `sortSites()` 统一处理：

1. 带 `risk` 的访问提示网站固定放在当前二级分类末尾。
2. `highlight: true` 或列入 `EDITOR_RECOMMENDED_SITES` 的网站固定放在当前二级分类前端。
3. 同一优先级内按照网站在 `SITES_DATA` 中的先后位置展示。需要微调名次时，移动对应数据记录即可。

`EDITOR_RECOMMENDED_SITES` 使用 `分类ID:网站名称` 作为键，例如：

```javascript
'dev:VS Code'
```

### 11.3 网络可达性提示维护

访问提示使用两级文案：

- `需要科学上网`：长期受限服务，例如 Google、YouTube、Wikipedia、Facebook 和 Telegram。卡片使用红橙色强调线和徽章。
- `可能需要科学上网`：跨境访问可能受地区、运营商、DNS 路径和时间影响的网站。卡片使用较柔和的浅金色强调线和徽章。

项目支持为站点配置网络可达性提示标签。相关提示数据由维护者根据实际访问情况定期复核并更新，公开版本仅包含最终展示所需的数据配置，不包含内部检测日志与维护归档文件。

### 11.4 新增分类

在 `CATEGORIES` 数组中添加：

```javascript
{ id: 'new-id', name: '新分类名称', icon: '📌' }
```

然后将对应网站的 `category` 设为新分类 ID。

新增一级分类时，还应在 `SUBCATEGORIES` 中添加对应规则，并至少提供一个 `fallback: true` 的兜底分组。

### 11.5 新增本地图标

网站卡片图标文件名必须与 URL 的 `hostname` 完全一致：

```text
URL:      https://github.com
hostname: github.com
图标文件: assets/img/favicons/github.com.png
```

如果网站使用 `www` 子域名，文件名也必须包含 `www`：

```text
URL:      https://www.google.com
图标文件: assets/img/favicons/www.google.com.png
```

缺失或不可用的网站图标将使用与站点品牌一致的四角星默认图标兜底；卡片图标请求失败时
仍会显示网站名称首字母，避免阻止网站显示。

官方 favicon 仅在来源可靠且可识别时保留。无法可靠确认官方图标、错误字母占位或不适合保留的图标，应让站点配置 `icon: 'default'` 使用默认四角星图标。`cloud.hosthatch.com` 按当前运行逻辑使用默认四角星图标，不要求存在 `assets/img/favicons/cloud.hosthatch.com.png`。

v1.1.0 发布前外链收口已更新以下入口：

- WeChat Mini Program -> `https://developers.weixin.qq.com/miniprogram/dev/framework/`
- Redis Cloud -> `https://redis.io/cloud/`
- 慧言AI -> `https://huiyan-ai.cn/`
- Copilot -> `https://copilot.microsoft.com/`
- Taro -> `https://docs.taro.zone/docs/`

已删除 Pleasant AI 和 Poj。Play.ht、Responsinator、站长工具和 JavaTpoint 经复核后继续保留。

Redis Cloud、慧言AI 和 Copilot 因新 hostname 未取得足够可靠的品牌图标，当前使用 `icon: 'default'`；Taro 更新入口后继续使用 `icon: 'default'`。本轮 URL 变化或条目删除产生的孤立 favicon 已清理。当前 favicon 文件数量为 923，默认四角星图标站点数量为 38，缺失引用为 0。

新增 `aliases` 时必须有明确人工确认，当前仅允许 Bilibili 和 DeepSeek 使用。数据或图标变更后，应运行：

```powershell
node .\scripts\check-data.js
node .\scripts\check-favicons.js
```

### 11.6 数据校验规则

| 规则 | 说明 |
|------|------|
| `name` 不可为空 | 网站名称必填 |
| `url` 必须为合法 URL | 建议使用 `https://` |
| URL 协议仅允许 `http:` 和 `https:` | 其他协议会被替换为 `#` |
| `category` 必须存在 | 必须匹配 `CATEGORIES` 中的 ID |
| `tags` 至少包含一个标签 | 用于搜索匹配 |
| URL 不可重复 | 避免同一网站重复展示 |
| `highlight` 与 `risk` 同时存在时 | 卡片保留对应样式，但徽章仅显示 `risk` |

---

## 12. 已知限制与注意事项

| 类别 | 说明 |
|------|------|
| **纯静态数据** | 所有网站硬编码在 `data.js` 中，不支持后台管理 |
| **无构建工具** | 不提供模块化打包、压缩和 Tree Shaking |
| **搜索为全量匹配** | 每次搜索遍历 988 条网站数据，当前规模可接受 |
| **图标需手动维护** | 新增网站后应补充对应 hostname 的 PNG 图标 |
| **图标并非全部使用独立 favicon** | 当前 923 个本地 favicon 文件，无法可靠确认官方图标的站点使用默认四角星图标，缺失 favicon 引用为 0 |
| **搜索增强边界** | 当前未实现拼写纠错、图片意图搜索、搜索范围选择器和按需渲染 |
| **视觉基线** | 当前版本保留 v1.0.1 原有卡片视觉与 hover 交互 |
| **无深色模式** | 当前仅提供浅色 ACG 粉色主题 |
| **无国际化** | 界面和大部分描述使用中文 |
| **Emoji 兼容性** | 分类 Emoji 在不同系统上的显示效果可能略有差异 |
