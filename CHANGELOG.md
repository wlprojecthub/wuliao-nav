# 更新日志

> 版本号采用 `YYYY.MM.DD.N` 格式；`N` 表示当天第几次更新。历史条目的日期保持不变。

## [2026.05.31.5] - 2026-05-31

### 项目结构分类整理与版本号规范化

- 🗂️ 按线上运行、维护工具、部署配置和历史归档重新整理项目文件
- 🚚 将现役 `nginx-cache.conf` 从归档区恢复到根目录 `deploy/`
- 📦 将历史发布包和 OpenResty 完整配置备份归入本地维护归档
- 🧾 将 CHANGELOG 全部版本号统一改写为日期型编号，保留各条目的原始日期
- 📖 同步更新 README、CODE_WIKI 和归档目录说明

---

## [2026.05.31.4] - 2026-05-31

### 网站域名全量审计

- 🔎 校验全部站点 URL：当前 `996` 个网站均为合法 URL，无重复地址
- 🌐 校验全部 `961` 个唯一域名：DNS 均可正常解析
- 🔄 更新已迁移入口：Windsurf、Amazon Q Developer、FigJam Diagramming Tool、Open 3D Engine（O3DE）和 Squarespace Domains
- 🧹 移除已停运或已被现有卡片覆盖的入口：Glitch、Tradesy、SUMo 和 Codota
- 🖼️ 为 Windsurf、O3DE 和 Squarespace Domains 补充本地图标
- ℹ️ 保留 `Poj` 的 `http://poj.org` 地址，该站点是当前唯一非 HTTPS 入口

---

## [2026.05.31.3] - 2026-05-31

### 控制台警告清理

- 🖼️ 为 `codingcompetitions.withgoogle.com` 补充本地 Google 图标，修复 Google Code Jam 卡片图标请求 `404`
- 📱 补充标准的 `mobile-web-app-capable` 元标签，消除移动端 Web App 兼容性弃用警告

---

## [2026.05.31.2] - 2026-05-31

### 多关键词搜索高亮修复

- 🐛 修复多关键词模糊搜索结果正确但卡片文字无法分别高亮的问题
- ✨ 高亮逻辑与筛选逻辑统一按空格拆分关键词，并逐词匹配
- 🔎 高亮关键词按长度降序匹配并自动去重，避免 `git github` 等包含关系导致文字高亮不完整

---

## [2026.05.31.1] - 2026-05-31

### 模糊搜索优化

- 🔍 搜索框支持多关键词模糊查找，输入多个词用空格分隔，所有词都必须匹配
- 🔡 英文搜索自动忽略大小写，支持混合输入
- 📝 将网站名称、描述、标签合并为统一搜索文本，提升匹配准确性
- ⚡ 优化搜索逻辑，使用 `split()` + `every()` 实现更灵活的多词匹配

---

## [2026.05.30.16] - 2026-05-30

### 多级路径 404 页面资源修复

- 🐛 将 `404.html` 的样式表、站点图标和首页快捷入口统一改为根路径引用
- 🧭 修复 `/1/1`、`/abc/test/123` 等多级错误 URL 下相对路径解析到错误目录的问题
- 🏠 将“返回上一页”按钮无历史记录时的兜底地址改为站点根路径 `/`
- 🎨 保持 404 页面的文字、布局、颜色和动画设计不变

---

## [2026.05.30.15] - 2026-05-30

### 归档目录分类整理

- 🗂️ 将网址可访问性检测工具移入本地维护归档
- 🧭 将本地归档内容按风险复核、站点维护和历史参考资料分类整理
- 📦 将访问提示复核生成文件集中管理
- 🛠️ 修正移动后脚本访问站点数据和输出目录的相对路径
- 📖 新增本地归档说明，记录各类维护资料的职责

---

## [2026.05.30.14] - 2026-05-30

### 检测脚本目录英文化

- 🗂️ 将网址可访问性检测工具目录改为英文命名
- 🧾 将检测日志重命名为 `url-accessibility-check.log`
- 🔄 调整日志转换器，使标准化结果自动记录传入日志的实际文件名

---

## [2026.05.30.13] - 2026-05-30

### 大陆节点检测结果导入

- 📥 使用网址可访问性检测日志中的 `652` 条结果更新访问提示
- 🚧 将日志中 `113` 个无法访问的网站升级为“需要科学上网”
- ⚠️ 保留 `539` 个可以访问网站的“可能需要科学上网”提示
- 🧰 完善检测日志转换流程，支持将 UTF-16LE 日志转换为标准 JSON 结果文件
- ✅ 更新后共有 `153` 个“需要科学上网”和 `539` 个“可能需要科学上网”网站

---

## [2026.05.30.12] - 2026-05-30

### 大陆节点逐站复核准备

- 🧪 完善待测清单导出流程，支持生成 JSON 和 CSV 格式
- 📥 完善检测结果导入流程，仅将大陆节点确认无法访问的网站升级为“需要科学上网”
- 🛡️ 优化按域名规则复核的流程，保留已由实测升级的严格提示
- 🧾 当前待验证清单包含 `652` 个网站和 `633` 个不同域名，不使用本机网络结果冒充中国大陆节点实测结论

---

## [2026.05.30.11] - 2026-05-30

### 徽章可读性优化

- 🔎 将“推荐”“需要科学上网”“可能需要科学上网”徽章字号由 `9px` 提升为 `11px`
- 🎨 增加徽章内边距和字重，提升快速浏览时的识别度
- 📐 扩大风险卡片右侧留白，避免较长访问提示与卡片内容重叠

---

## [2026.05.30.10] - 2026-05-30

### 访问提示视觉分级

- 🚧 “需要科学上网”改为更醒目的红橙色，表示较重提示
- ⚠️ “可能需要科学上网”使用较柔和的浅金色，表示较轻提示
- 🎨 卡片左侧强调线和右上角徽章同步区分两种等级

---

## [2026.05.30.9] - 2026-05-30

### 中国大陆访问提示复核

- 🌐 重新审核全部 `692` 个带访问提示的网站
- 🚧 将长期受限服务标记为“需要科学上网”，共 `40` 条
- ⚠️ 将可能受地区、运营商、DNS 路径和时间影响的境外站点标记为“可能需要科学上网”，共 `652` 条
- 🐛 修复 `Canva Magic` 风险提示中的“需科学上学”错别字
- 🧰 完善按域名规则重复审核访问提示的维护流程
- 🎨 扩大风险徽章预留空间，避免较长提示文字与卡片描述重叠

---

## [2026.05.30.8] - 2026-05-30

### 前端质量审查修复

- ♿ 将一级分类从无链接地址的 `<a>` 改为原生按钮，支持键盘聚焦和激活
- 🧭 为可展开一级分类增加 `aria-expanded` 与 `aria-controls` 状态关联
- 🙈 折叠状态的二级菜单同步设置 `aria-hidden`，并阻止隐藏链接进入鼠标与键盘交互
- 🎯 为导航、卡片、按钮和快捷入口补充统一的 `:focus-visible` 焦点样式
- 🏠 为 404 页面的“返回上一页”按钮增加无历史记录时返回首页的兜底
- 🏷️ 区分 10 组同名网站入口，保留原始 URL 和分类，不再显示含义模糊的重复名称
- ⚡ 为站点图标增加原生懒加载和异步解码，降低首屏资源压力

---

## [2026.05.30.7] - 2026-05-30

### 404 页面样式加载修复

- 🐛 移除 404 页面的根路径覆盖，修复子目录部署或直接预览时样式和图标无法加载的问题
- ✅ 使用相对路径加载本地样式、图标和首页链接

---

## [2026.05.30.6] - 2026-05-30

### Stardust 404 页面

- 🌙 新增独立 `404.html`，提供与首页一致的 ACG 星愿主题错误页
- ✦ 新增月牙轨道、404 渐变数字、漂浮星光和柔和入场动画
- 🏠 提供返回首页、返回上一页以及常用分类快捷入口
- 📱 增加移动端布局和 `prefers-reduced-motion` 动效降级支持

---

## [2026.05.30.5] - 2026-05-30

### 人工质量排序

- ⭐ 为各分类补充编辑精选名单，常用、稳定且有代表性的网站优先展示
- 🔄 移除同级网站名称排序，改为使用数据表中的人工质量顺序
- 🧭 保留排序硬规则：编辑推荐优先，普通网站居中，需科学上网网站置底
- 📝 同步更新 README 和 Code Wiki 的排序维护说明

---

## [2026.05.30.4] - 2026-05-30

### 排序与侧边栏细节

- 🔄 调整每个二级分类内的网站顺序：推荐网站 → 普通网站 → 需科学上网网站
- 🔤 同一优先级内继续按照网站名称稳定排序
- 🎨 固定一级分类数量徽章的底色和文字颜色，展开或激活菜单时不再跳色

---

## [2026.05.30.3] - 2026-05-30

### Webstack 树形侧边栏

- 🧭 左侧导航改为 Webstack 风格的一级、二级树形菜单
- 📂 点击一级分类后展开或收起该分类下的二级分类，并滚动到一级分类内容
- 🎯 点击二级分类后平滑跳转到对应网站分组，同时显示激活状态
- 🔄 页面滚动切换一级分类时，侧边栏同步更新激活项和展开分组
- 📱 移动端点击二级分类后自动关闭侧边栏

---

## [2026.05.30.2] - 2026-05-30

### 二级分类与排序

- 🗂️ 为 12 个一级分类增加规则型二级分类，共生成 64 个有效二级分组
- 🧭 每个一级分类增加二级分类快捷导航，可平滑滚动到对应网站分组
- 🔄 网站展示顺序调整为：一级分类 → 二级分类 → 推荐优先 → 名称稳定排序
- 🔍 搜索结果继续按二级分类分组，便于在大量匹配项中快速定位
- 📱 移动端二级分类导航支持横向滑动，减少纵向空间占用

---

## [2026.05.30.1] - 2026-05-30

### ACG 视觉升级

- ✦ 新增 Stardust Edition 星愿主题，重做粉紫、薰衣草和浅蓝色视觉体系
- ☾ 新增星愿导语面板，根据默认视图和搜索状态动态显示站点统计
- 🎨 重做侧边栏 Logo、分类导航、顶部栏、分类标题和网站卡片层级
- ✨ 新增月牙漂浮、星光闪烁、卡片微光和更柔和的区块入场动画
- 📱 优化移动端导语面板、侧边栏和单列卡片布局
- ♿ 新增 `prefers-reduced-motion` 降级处理，减少动画偏好用户可自动关闭动效
- 🖼️ 将本地图标覆盖率从 833 个提升至 947 个，剩余缺失图标使用首字母兜底

---

## [2026.05.29.3] - 2026-05-29

### 里程碑

- 🎉 网站总数达到 **1000 个**！

### 网站扩展

- 📦 从 742 个扩展至 **1000 个**（+258）
- ⭐ **常用推荐**：新增 Quora、Reddit、Medium、Dev.to、Hacker News、V2EX、少数派、即时热榜、WikiHow、LifeHacker（+10）
- 🤖 **AI 工具**：新增 Claude、Grok、Perplexity、Kimi、通义千问、文心一言、豆包、混元、Cursor、GitHub Copilot、V0、Bolt.new、Lovable、Suno AI、Udio、Soundraw 等（+158）
- 💻 **开发编程**：新增 LeetCode、Codeforces、AtCoder、Replit、Docker Hub、Kubernetes、Terraform、Tailwind CSS、shadcn/ui、Vite、Webpack、ESLint、Prettier、Godot、Unity、Unreal Engine、Scratch、freeCodeCamp、Coursera 等（+206）
- 🎨 **设计创作**：新增 ColorHunt、Coolors、Google Fonts、Unsplash、Pexels、Pixabay、Freepik、Flaticon 等（+62）
- 🎮 **动漫游戏**：新增 MyAnimeList、AniList、MangaDex、Crunchyroll、IGN、GameSpot、Twitch 等（+66）
- 🎬 **影音媒体**：新增 Spotify、Apple Music、YouTube Music、Tidal、Deezer、Vimeo、Bandcamp、SoundCloud 等（+47）
- 💬 **社交通讯**：新增 Discord、Slack、Teams、Zoom、WhatsApp、Telegram、Signal、Mastodon、Bluesky、Threads、微信、QQ、钉钉、飞书 等（+46）
- 📝 **效率办公**：新增 Todoist、TickTick、Cal.com、Calendly、Miro、FigJam、Loom、Affine、AppFlowy、Anytype、思源笔记、Wolai、FlowUs 等（+83）
- 🛒 **网购金融**：新增 Amazon、eBay、AliExpress、Temu、SHEIN、Booking.com、Airbnb、Coinbase、Binance、Robinhood 等（+76）
- ☁️ **云服务**：新增 Vercel、Netlify、Heroku、DigitalOcean、Vultr、Hetzner、阿里云、腾讯云、华为云、火山引擎 等（+68）
- 📦 **软件资源**：新增 VLC、OBS Studio、Audacity、GIMP、Blender、7-Zip、Everything、PowerToys、AutoHotkey 等（+67）
- 🔧 **实用工具**：新增 Regex101、CyberChef、Excalidraw、Draw.io、Carbon、Sentry、Grafana、Cypress、Playwright、Storybook 等（+94）

### 优化改进

- 🔄 重构 data.js 文件，清理无效空行和重复数据
- ✅ 自动去重验证，确保无重复网站
- 📊 更新分类统计数据
- 🖼️ **本地图标**：下载 833 个网站图标到本地（10.92 MB），提升加载速度
- ⚡ 移除 Google Favicon API 依赖，图标加载更快更稳定

---

## [2026.05.29.2] - 2026-05-29

### 网站扩展

- 📦 继续扩展网站数量，从 717 个增加至 **742 个**（+25）
- ⭐ **常用推荐**：新增 Reddit、Stack Exchange（+5）
- 🤖 **AI 工具**：新增 Microsoft Copilot、Inflection AI、Mistral AI、Kaggle、D-ID、HeyGen、Adobe Firefly、Lexica Art、PromptHero、Runway ML（+10）
- 💻 **开发编程**：新增 Topcoder、CodeSignal、Tutorialspoint、The Odin Project、Full Stack Open、Roadmap.sh、web.dev、SitePoint、Smashing Magazine、CSS Grid Garden（+10）
- 🎨 **设计创作**：新增 UI8、Creative Market、Envato Elements、The Noun Project、IconFinder、Font Awesome、DaFont、1001 Fonts、Adobe Color、BrandColors（+10）
- 🎮 **动漫游戏**：新增 Game Jolt、Newgrounds、Kongregate、CrazyGames、Poki、MiniClip、Sketchfab、VRChat、Roblox、Minecraft（+10）
- 🎬 **影音媒体**：新增 Twitch、Kick、Audius、Last.fm、Discogs、RateYourMusic、Genius、Musixmatch、Shazam、AllMusic（+10）
- 💬 **社交通讯**：新增 Signal、Zoom、LinkedIn、Pinterest、Viber、Microsoft Teams、Google Meet、Telegram、WhatsApp、LINE（+10）
- 📝 **效率办公**：新增 Airtable、Miro、Zapier、IFTTT、Todoist、Calendly、Cal.com、ClickUp、Asana、Monday.com（+10）
- 🛒 **网购金融**：新增 Walmart、Target、Best Buy、Newegg、Etsy、Booking.com、Airbnb、Expedia、TripAdvisor、Coinbase（+10）
- ☁️ **云服务**：新增 Cloudways、Kinsta、WP Engine、A2 Hosting、SiteGround、Bluehost、Namecheap、GoDaddy、Cloudflare Registrar、Porkbun（+10）
- 📦 **软件资源**：新增 AlternativeTo、Slant、G2、Capterra、Product Hunt、F-Droid、Flathub、Snap Store、Mac App Store、Microsoft Store（+10）
- 🔧 **实用工具**：新增 GTmetrix、PageSpeed Insights、WebPageTest、VirusTotal、BrowserStack、LambdaTest、Excalidraw、tldraw、Wolfram Alpha、Desmos（+10）

### 优化改进

- 🔄 自动去重脚本优化，确保无重复网站
- 📊 更新分类统计数据

---

## [2026.05.29.1] - 2026-05-29

### 网站扩展

- 📦 继续扩展网站数量，从 529 个增加至 **717 个**（+188）
- 🤖 **AI 工具**：新增 Anthropic、OpenAI、DeepMind、Meta AI、TensorFlow、PyTorch、Keras、Scikit-learn、Weights & Biases、Gradio、Streamlit 等（+13）
- 💻 **开发编程**：新增 W3Schools、Exercism、Frontend Mentor、CSS-Tricks、JavaScript.info、Rust Book、Go Tour、Ruby on Rails、Laravel、Django、Flask、Express.js、FastAPI、Spring、Flutter、React Native、Electron、Tauri、Three.js、D3.js、ECharts、Chart.js 等（+27）
- 🎨 **设计创作**：新增 Figma Community、Awwwards、CSS Design Awards、One Page Love、Mobbin、Spline、Rive、LottieFiles、Iconscout、Undraw、Storyset、Humaaans（+16）
- 🎮 **动漫游戏**：新增 Metacritic、OpenCritic、HowLongToBeat、SteamDB、EpicDB、PSNProfiles、TrueAchievements、VNDB、Fuwanovel（+15）
- 🎬 **影音媒体**：新增 JustWatch、Reelgood、Letterboxd、IMDb、Rotten Tomatoes、TMDb、Trakt、Apple Podcasts、Spotify Podcasts、Overcast、Pocket Casts、Audible、Librivox（+16）
- 💬 **社交通讯**：新增 Flickr、500px、VSCO、Imgur、Fandom、Discourse、Flarum、Circle、BeReal、Locket、Clubhouse（+16）
- 📝 **效率办公**：新增 Heptabase、Obsidian、Logseq、Roam Research、Craft、Bear、Ulysses、iA Writer、Typora、Joplin、Standard Notes、Google Keep、Apple Notes、Milanote、Scrintal、Tana、Capacities（+20）
- 🛒 **网购金融**：新增 Shopify、WooCommerce、Magento、BigCommerce、Mercari、Poshmark、Depop、Vinted、Wallapop、Craigslist、StockX、GOAT、Grailed、The RealReal（+20）
- ☁️ **云服务**：新增 AWS Lightsail、Google Cloud Run、Azure Container Instances、Cloudflare Pages、Cloudflare Workers、Deno Deploy、Neon、CockroachDB、MongoDB Atlas、Redis Cloud、Upstash、Convex、Appwrite、PocketBase（+16）
- 📦 **软件资源**：新增 Crackhub、FileCR、GetIntoPC、HaxPC、SadeemPC、KaranPC、FileHorse、TechSpot、MajorGeeks、SnapFiles、FreewareFiles、NirSoft、Sysinternals、Portable Freeware（+16）
- 🔧 **实用工具**：新增 Pastebin、Hastebin、dpaste、JSON Formatter、JSON Crack、QuickType、Curl Converter、HTTPie、Insomnia、Hoppscotch、Swagger、ReadMe、Stoplight（+13）

### 优化改进

- 🔄 优化数据结构，提升加载性能
- 📊 更新分类统计数据

---

## [2026.05.28.2] - 2026-05-28

### 修复

- ✅ 修复搜索状态下侧边栏导航逻辑不一致问题
- ✅ 修复动态 HTML 没有转义的 XSS 漏洞
- ✅ 移除重复站点数据（斯巴达、掘金、CSDN、Codecademy、Stack Overflow、CodePen、JSFiddle、SourceForge、Medium、Crunchyroll）

### 安全增强

- 🔒 添加 HTML 转义函数 `escapeHtml()` 防止 XSS 注入
- 🔒 添加 URL 安全验证函数 `sanitizeUrl()` 限制协议

---

## [2026.05.28.1] - 2026-05-28

### 重构

- 🔄 重构分类系统，从 10 个分类扩展至 12 个：
  - 新增「AI 工具」分类
  - 新增「云服务」分类
  - 拆分「生活服务」为「影音媒体」「社交通讯」「效率办公」「网购金融」

### 功能改进

- 🎨 更新 ACG 风格主题配色
- 📱 优化移动端布局
- 🔍 优化搜索算法

---

## [2026.05.27.2] - 2026-05-27

### 网站扩展

- 📦 添加 168 个来自 kejilion-sites.js 的网站

### 数据整理

- 🔄 合并 kejilion-sites.js 数据到 data.js
- 🗂️ 重新分类整理所有网站

---

## [2026.05.27.1] - 2026-05-27

### 修复

- ✅ 修复右侧空白问题，优化页面布局
- ✅ 修复滚动时侧边栏激活状态不重置问题

### 改进

- 🎨 优化 ACG 风格设计
- 🔄 优化搜索功能性能

---

## [2026.05.26.1] - 2026-05-26

### 设计变更

- 🎨 改为 ACG/二次元风格设计
- 🎨 采用粉色渐变主题
- ✨ 添加玻璃态效果

### 布局优化

- 🔄 调整为 Webstack 风格布局

---

## [2026.05.25.1] - 2026-05-25

### 功能增强

- 🔍 添加本地搜索功能
- 📱 添加移动端适配
- ⚡ 添加平滑滚动效果

### 数据扩展

- 📦 扩展网站数据至 200+ 个

---

## [2026.05.24.1] - 2026-05-24

### 设计更新

- 🎨 改为玻璃态（Glassmorphism）设计风格
- ✨ 添加毛玻璃效果

---

## [2026.05.23.1] - 2026-05-23

### 数据扩展

- 📦 添加书签数据（favorites_2026_5_27.html）
- 🗂️ 分类整理所有网站

---

## [2026.05.22.1] - 2026-05-22

### 功能添加

- 🔍 添加搜索功能
- 📁 添加分类侧边栏

---

## [2026.05.21.1] - 2026-05-21

### 设计改进

- 🎨 优化配色方案
- ✨ 添加动画效果

---

## [2026.05.20.1] - 2026-05-20

### 功能增强

- 📱 添加响应式布局
- 🔄 添加平滑滚动

---

## [2026.05.19.1] - 2026-05-19

### 初始版本

- 🎉 项目初始化
- 📦 添加基础网站数据
- 🎨 基础样式设计
