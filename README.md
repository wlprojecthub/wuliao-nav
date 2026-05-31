# 无聊的导航 (Boring Navigation)

一个简洁优雅的静态网址导航网站，采用 ACG 二次元风格设计。

## 功能特性

- 🎨 **ACG 星愿主题** - 粉紫、薰衣草和浅蓝色构成的 Stardust Edition 视觉风格
- ✨ **轻量动态效果** - 星光闪烁、月牙漂浮、卡片微光和柔和入场动画
- 🔍 **本地模糊搜索** - 支持名称、描述、标签的多关键词匹配，英文搜索不区分大小写
- 📱 **响应式布局** - 完美适配桌面和移动端
- ⚡ **快速加载** - 纯静态页面，无需后端
- 🎯 **智能分类** - 12 个精心分类的网站目录
- 🗂️ **二级分类** - 每个一级分类按用途细分，并提供快捷导航
- 🧭 **树形侧边栏** - Webstack 风格一级菜单，点击后展开二级分类并快速跳转
- ♿ **键盘可访问** - 一级分类支持键盘聚焦和激活，展开状态提供 ARIA 标记
- 🔄 **人工质量排序** - 二级分组内依次展示编辑推荐、普通、带访问提示的网站，同级按照人工维护的实用性顺序展示
- 🌐 **网络可达性提示** - 针对不同网络环境下可能存在的访问差异，提供可配置的提示标签，便于维护者复核与更新
- 🔎 **清晰徽章** - 放大推荐和访问提示文字，便于快速识别
- 🌙 **星轨 404 页面** - 提供与首页一致的 Stardust ACG 风格错误页和常用分类快捷入口，支持子目录部署

## 当前数据统计

- **网站总数**: 996 个
- **分类数量**: 12 个

## 分类列表

| ID | 名称 | 图标 | 网站数量 |
|----|------|------|----------|
| recommend | 常用推荐 | ⭐ | 27 |
| ai | AI 工具 | 🤖 | 158 |
| dev | 开发编程 | 💻 | 205 |
| design | 设计创作 | 🎨 | 62 |
| anime | 动漫游戏 | 🎮 | 66 |
| media | 影音媒体 | 🎬 | 47 |
| social | 社交通讯 | 💬 | 46 |
| office | 效率办公 | 📝 | 83 |
| shopping | 网购金融 | 🛒 | 75 |
| cloud | 云服务 | ☁️ | 68 |
| software | 软件资源 | 📦 | 66 |
| tools | 实用工具 | 🔧 | 93 |

## 技术栈

- **HTML5** - 页面结构
- **CSS3** - 样式设计（Glassmorphism 玻璃态效果）
- **JavaScript** - 交互逻辑
- **本地 Favicon** - 950 个可发布图标文件已下载到本地（11.24 MB）
- **无障碍动效** - 自动适配 `prefers-reduced-motion` 系统偏好

## 快速开始

### 本地运行

```bash
# 克隆项目
git clone https://github.com/wlprojecthub/wuliao-nav.git

# 进入项目目录
cd wuliao-nav

# 使用任意 HTTP 服务器运行
python -m http.server 8080
# 或
npx serve .
```

### 部署

直接将项目文件部署到任意静态网站托管服务：
- Nginx
- 1Panel
- Vercel
- Netlify
- GitHub Pages

### 发布缓存刷新

每次上传新版本前，在项目根目录运行：

```bash
node scripts/bump-release-version.js
```

脚本会计算 `style.css`、`data.js` 和 `main.js` 的内容哈希，并更新
`index.html` 与 `404.html` 中的资源 URL。执行后再上传完整项目。

使用 Nginx 或 OpenResty 部署时，将 `deploy/nginx-cache.conf` 中的规则复制到
站点 `server` 配置块并重新加载服务器。HTML 入口需要在每次访问时重新验证，
以便浏览器发现新的资源哈希；带版本号的静态资源可缓存一年。

## 文件结构

```
wuliao-nav/
├── index.html          # 主页面
├── 404.html            # Stardust 风格静态错误页
├── assets/
│   ├── css/
│   │   └── style.css   # 样式文件
│   ├── js/
│   │   ├── data.js     # 网站数据（996 个）
│   │   └── main.js     # 核心逻辑
│   └── img/
│       ├── favicons/   # 本地图标（950 个可发布文件，11.24 MB）
│       └── default-icon.png  # 默认图标
├── scripts/
│   ├── bump-release-version.js # 发布前刷新静态资源哈希
│   └── 缓存刷新.txt     # 发布脚本简要说明
├── deploy/
│   └── nginx-cache.conf # Nginx / OpenResty 缓存配置片段
├── README.md           # 项目说明
├── CHANGELOG.md        # 更新日志
└── CODE_WIKI.md        # 技术文档
```

## 自定义配置

### 添加新网站

编辑 `assets/js/data.js` 文件，按照现有格式添加网站数据：

```javascript
{
    name: '网站名称',
    url: 'https://example.com',
    description: '网站描述',
    tags: ['标签1', '标签2'],
    category: '分类ID',
    highlight: true,  // 可选，高亮显示
    risk: '可能需要科学上网'  // 可选，也可以使用“需要科学上网”
}
```

### 修改分类

编辑 `assets/js/data.js` 中的 `CATEGORIES` 一级分类数组：

```javascript
const CATEGORIES = [
    { id: 'category_id', name: '分类名称', icon: '📌' },
    // ...
];
```

二级分类由同文件中的 `SUBCATEGORIES` 规则自动匹配网站名称、描述和标签。新增网站通常无需手工填写二级分类。

## 浏览器支持

- Chrome (推荐)
- Firefox
- Safari
- Edge

## 许可证

MIT License

## 贡献

欢迎提交 Issue 和 Pull Request！

---

**无聊的导航** - 让上网更有趣 ✨
