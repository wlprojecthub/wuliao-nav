/* ============================
   无聊的导航 - 主逻辑文件
   ============================ */

const sidebarNav = document.getElementById('sidebarNav');
const mainContent = document.getElementById('mainContent');
const searchInput = document.getElementById('searchInput');
const sidebarToggle = document.getElementById('sidebarToggle');
const sidebar = document.getElementById('sidebar');
const sidebarOverlay = document.getElementById('sidebarOverlay');
const backToTop = document.getElementById('backToTop');

let activeCategory = 'all';
let currentSearch = '';
let expandedCategory = null;

// 编辑精选用于突出各分类内更常用、稳定且有代表性的站点。
// 数据表中的原始位置同时作为完整的人工质量排序，覆盖未单独精选的站点。
const EDITOR_RECOMMENDED_SITES = new Set([
    'recommend:GitHub', 'recommend:DeepSeek', 'recommend:Bilibili',
    'ai:通义千问', 'ai:Kimi', 'ai:豆包', 'ai:硅基流动', 'ai:ModelScope', 'ai:Kling AI',
    'dev:VS Code', 'dev:MDN Web Docs', 'dev:React', 'dev:Vue', 'dev:Vite', 'dev:Docker',
    'dev:Postman', 'dev:Gitee', 'dev:LeetCode',
    'design:Canva', 'design:站酷', 'design:阿里巴巴矢量图标库', 'design:Coolors',
    'design:TinyPNG', 'design:Remove.bg', 'design:Blender',
    'anime:萌娘百科', 'anime:Steam', 'anime:TapTap', 'anime:蜜柑计划', 'anime:哔哩哔哩漫画',
    'media:爱奇艺', 'media:腾讯视频', 'media:网易云音乐', 'media:QQ音乐', 'media:猫眼',
    'social:微信公众号', 'social:贴吧', 'social:微信官网', 'social:QQ', 'social:WeCom',
    'office:语雀', 'office:腾讯文档', 'office:WPS', 'office:飞书', 'office:钉钉',
    'office:ProcessOn', 'office:阿里云盘',
    'shopping:淘宝', 'shopping:京东', 'shopping:美团', 'shopping:携程', 'shopping:高德地图',
    'shopping:12306', 'shopping:支付宝', 'shopping:东方财富',
    'cloud:腾讯云', 'cloud:华为云', 'cloud:DigitalOcean', 'cloud:Vultr', 'cloud:Hetzner',
    'software:果核剥壳', 'software:异次元软件', 'software:少数派', 'software:Chocolatey',
    'software:Scoop', 'software:F-Droid', 'software:PowerToys', 'software:7-Zip',
    'tools:ILovePDF', 'tools:Speedtest', 'tools:ITDOG', 'tools:1Panel', 'tools:JSON Editor',
    'tools:Regex101', 'tools:Excalidraw', 'tools:Draw.io'
]);

const EDITORIAL_SITE_ORDER = new Map(SITES_DATA.map((site, index) => [site, index]));

// HTML 转义函数，防止 XSS 注入
function escapeHtml(str) {
    if (typeof str !== 'string') return '';
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return str.replace(/[&<>"']/g, m => map[m]);
}

// URL 安全验证，只允许 http/https 协议
function sanitizeUrl(url) {
    if (typeof url !== 'string') return '#';
    try {
        const parsed = new URL(url);
        if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
            return url;
        }
        return '#';
    } catch (e) {
        return '#';
    }
}

function init() {
    renderSidebar();
    renderSites();
    bindEvents();
}

function renderSidebar() {
    const categoryCounts = {};
    SITES_DATA.forEach(site => {
        categoryCounts[site.category] = (categoryCounts[site.category] || 0) + 1;
    });

    let html = '';
    html += `<button type="button" class="nav-item active" data-category="all" onclick="scrollToCategory('all')">
        <span class="nav-icon">📋</span>
        <span class="nav-name">全部</span>
        <span class="nav-count">${SITES_DATA.length}</span>
    </button>`;

    CATEGORIES.forEach(category => {
        const count = categoryCounts[category.id] || 0;
        const subcategoryCounts = getSubcategoryCounts(category.id);
        const subcategoryItems = (SUBCATEGORIES[category.id] || [])
            .filter(subcategory => subcategoryCounts[subcategory.id])
            .map(subcategory => `<a class="sidebar-subitem" data-subcategory="${category.id}-${subcategory.id}" href="#subcategory-${category.id}-${subcategory.id}" onclick="scrollToSubcategory(event, '${category.id}', '${subcategory.id}')">
                <span class="sidebar-subitem-dot"></span>
                <span class="sidebar-subitem-name">${escapeHtml(subcategory.name)}</span>
                <span class="sidebar-subitem-count">${subcategoryCounts[subcategory.id]}</span>
            </a>`).join('');

        html += `<div class="nav-group" data-category-group="${category.id}">
            <button type="button" class="nav-item" data-category="${category.id}" aria-expanded="false" aria-controls="sidebar-subnav-${category.id}" onclick="toggleCategory('${category.id}')">
                <span class="nav-icon">${category.icon}</span>
                <span class="nav-name">${category.name}</span>
                <span class="nav-count">${count}</span>
                <span class="nav-caret">›</span>
            </button>
            <div class="sidebar-subnav" id="sidebar-subnav-${category.id}" aria-hidden="true">${subcategoryItems}</div>
        </div>`;
    });

    sidebarNav.innerHTML = html;
    updateSidebarTree();
}

function getSubcategoryCounts(categoryId) {
    const counts = {};
    SITES_DATA
        .filter(site => site.category === categoryId)
        .forEach(site => {
            const subcategory = getSubcategory(categoryId, site);
            counts[subcategory.id] = (counts[subcategory.id] || 0) + 1;
        });
    return counts;
}

function renderSites(sites = SITES_DATA) {
    if (sites.length === 0) {
        mainContent.innerHTML = `${createHero(0)}<div class="no-results">
            <span class="no-results-icon">✧</span>
            <p>没有找到匹配的网站 (´;ω;｀)</p>
            <p>试试其他关键词吧~</p>
        </div>`;
        return;
    }

    const groupedSites = {};
    sites.forEach(site => {
        if (!groupedSites[site.category]) {
            groupedSites[site.category] = [];
        }
        groupedSites[site.category].push(site);
    });

    let html = createHero(sites.length);
    CATEGORIES.forEach(category => {
        const categorySites = sortSites(groupedSites[category.id] || []);
        if (!categorySites || categorySites.length === 0) return;
        const subcategoryGroups = groupSitesBySubcategory(category.id, categorySites);

        html += `<section class="category-section" id="category-${category.id}">
            <div class="category-header">
                <span class="category-icon">${category.icon}</span>
                <h2 class="category-title">${category.name}</h2>
                <span class="category-count">${categorySites.length} 个网站</span>
            </div>
            <div class="subcategory-nav">
                ${subcategoryGroups.map(group => `<a class="subcategory-chip" href="#subcategory-${category.id}-${group.id}" onclick="scrollToSubcategory(event, '${category.id}', '${group.id}')">
                    <span>${escapeHtml(group.name)}</span>
                    <small>${group.sites.length}</small>
                </a>`).join('')}
            </div>`;

        subcategoryGroups.forEach(group => {
            html += `<section class="subcategory-section" id="subcategory-${category.id}-${group.id}">
                <div class="subcategory-header">
                    <h3>${escapeHtml(group.name)}</h3>
                    <span>${group.sites.length}</span>
                </div>
                <div class="sites-grid">`;

            group.sites.forEach(site => {
                html += createSiteCard(site);
            });

            html += `</div></section>`;
        });

        html += `</section>`;
    });

    mainContent.innerHTML = html;
}

function sortSites(sites) {
    return [...sites].sort((a, b) => {
        const priorityDiff = getSiteSortPriority(a) - getSiteSortPriority(b);
        if (priorityDiff !== 0) return priorityDiff;
        return EDITORIAL_SITE_ORDER.get(a) - EDITORIAL_SITE_ORDER.get(b);
    });
}

function getSiteSortPriority(site) {
    if (site.risk) return 2;
    if (isSiteHighlighted(site)) return 0;
    return 1;
}

function isSiteHighlighted(site) {
    return Boolean(site.highlight || EDITOR_RECOMMENDED_SITES.has(`${site.category}:${site.name}`));
}

function groupSitesBySubcategory(categoryId, sites) {
    const subcategories = SUBCATEGORIES[categoryId] || [
        { id: 'other', name: '其他', fallback: true }
    ];
    const groups = new Map(subcategories.map(subcategory => [
        subcategory.id,
        { ...subcategory, sites: [] }
    ]));

    sites.forEach(site => {
        const subcategory = getSubcategory(categoryId, site);
        groups.get(subcategory.id).sites.push(site);
    });

    return [...groups.values()].filter(group => group.sites.length > 0);
}

function getSubcategory(categoryId, site) {
    const subcategories = SUBCATEGORIES[categoryId] || [];
    const fallback = subcategories.find(subcategory => subcategory.fallback)
        || { id: 'other', name: '其他', fallback: true };
    const searchableText = [
        site.name,
        site.description,
        ...(site.tags || [])
    ].join(' ').toLowerCase();

    return subcategories.find(subcategory =>
        !subcategory.fallback
        && subcategory.keywords.some(keyword => searchableText.includes(keyword.toLowerCase()))
    ) || fallback;
}

function createHero(resultCount) {
    const isSearching = Boolean(currentSearch);
    const eyebrow = isSearching ? 'SEARCHING THE STARDUST' : 'WELCOME TO MY LITTLE UNIVERSE';
    const title = isSearching ? `找到 ${resultCount} 个星愿结果` : '收集散落在网络里的闪光坐标';
    const description = isSearching
        ? `正在检索与“${escapeHtml(currentSearch)}”有关的网站卡片。`
        : '从灵感、创作到日常工具，把值得再次拜访的网站放进同一片星空。';

    return `<section class="hero-panel">
        <div class="hero-copy">
            <p class="hero-eyebrow"><span>✦</span>${eyebrow}</p>
            <h1>${title}</h1>
            <p class="hero-description">${description}</p>
            <div class="hero-stats">
                <span><strong>${resultCount}</strong> 个站点</span>
                <span><strong>${CATEGORIES.length}</strong> 个星系</span>
                <span><strong>LOCAL</strong> 图标仓库</span>
            </div>
        </div>
        <div class="hero-visual" aria-hidden="true">
            <span class="hero-moon">☾</span>
            <span class="hero-star hero-star-one">✦</span>
            <span class="hero-star hero-star-two">✧</span>
            <span class="hero-star hero-star-three">✦</span>
            <span class="hero-ring"></span>
        </div>
    </section>`;
}

function createSiteCard(site) {
    const safeUrl = sanitizeUrl(site.url);
    const faviconUrl = getFaviconUrl(site.url);
    const safeName = escapeHtml(site.name);
    const safeDesc = escapeHtml(site.description);
    const firstChar = safeName.charAt(0).toUpperCase();
    const isHighlighted = isSiteHighlighted(site);

    let cardClass = 'site-card';
    if (isHighlighted) cardClass += ' highlight';
    if (site.risk) {
        cardClass += ' risk-warning';
        cardClass += site.risk === '需要科学上网' ? ' risk-required' : ' risk-possible';
    }

    const riskTag = site.risk ? `<span class="risk-tag ${site.risk === '需要科学上网' ? 'risk-tag-required' : 'risk-tag-possible'}">${escapeHtml(site.risk)}</span>` : '';
    const highlightBadge = (isHighlighted && !site.risk) ? '<span class="highlight-badge">推荐</span>' : '';

    const highlightedName = highlightText(safeName, currentSearch);
    const highlightedDesc = highlightText(safeDesc, currentSearch);

    return `<a href="${safeUrl}" target="_blank" rel="noopener noreferrer" class="${cardClass}">
        ${riskTag}
        ${highlightBadge}
        <img class="card-icon" src="${faviconUrl}" alt="${safeName}" loading="lazy" decoding="async" onerror="this.style.display='none';this.nextElementSibling.style.display='flex';">
        <div class="card-icon-fallback" style="display:none">${firstChar}</div>
        <div class="card-info">
            <div class="card-name">${highlightedName}</div>
            <div class="card-desc">${highlightedDesc}</div>
        </div>
    </a>`;
}

function getFaviconUrl(url) {
    try {
        const domain = new URL(url).hostname;
        if (domain === 'cloud.hosthatch.com') {
            return 'assets/img/default-icon.png';
        }
        return `assets/img/favicons/${domain}.png`;
    } catch (e) {
        return 'assets/img/default-icon.png';
    }
}

function handleSearch() {
    const keyword = searchInput.value.trim().toLowerCase();
    currentSearch = keyword;

    if (!keyword) {
        renderSites();
        return;
    }

    const searchTerms = keyword.split(/\s+/).filter(term => term.length > 0);

    const filteredSites = SITES_DATA.filter(site => {
        const searchableText = [
            site.name,
            site.description,
            ...(site.tags || [])
        ].join(' ').toLowerCase();

        return searchTerms.every(term => searchableText.includes(term));
    });

    renderSites(filteredSites);
}

function highlightText(text, keyword) {
    if (!keyword) return text;
    const terms = [...new Set(keyword.split(/\s+/).filter(term => term.length > 0))]
        .sort((a, b) => b.length - a.length);
    if (terms.length === 0) return text;
    const regex = new RegExp(`(${terms.map(escapeRegExp).join('|')})`, 'gi');
    return text.replace(regex, '<span class="search-highlight">$1</span>');
}

function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function scrollToCategory(categoryId) {
    // 搜索状态下点击分类，先清空搜索
    if (currentSearch) {
        searchInput.value = '';
        currentSearch = '';
        renderSites();
    }

    activeCategory = categoryId;
    expandedCategory = categoryId === 'all' ? null : categoryId;
    updateSidebarTree();

    if (categoryId === 'all') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
        const target = document.getElementById(`category-${categoryId}`);
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    closeSidebar();
}

function toggleCategory(categoryId) {
    expandedCategory = expandedCategory === categoryId ? null : categoryId;
    activeCategory = categoryId;
    updateSidebarTree();

    const target = document.getElementById(`category-${categoryId}`);
    if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

function scrollToSubcategory(event, categoryId, subcategoryId) {
    event.preventDefault();
    activeCategory = categoryId;
    expandedCategory = categoryId;
    updateSidebarTree(`${categoryId}-${subcategoryId}`);
    const target = document.getElementById(`subcategory-${categoryId}-${subcategoryId}`);
    if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    closeSidebar();
}

function updateSidebarTree(activeSubcategory = '') {
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.toggle('active', item.dataset.category === activeCategory);
    });

    document.querySelectorAll('.nav-group').forEach(group => {
        const isExpanded = group.dataset.categoryGroup === expandedCategory;
        group.classList.toggle('expanded', isExpanded);
        group.querySelector('.nav-item').setAttribute('aria-expanded', String(isExpanded));
        group.querySelector('.sidebar-subnav').setAttribute('aria-hidden', String(!isExpanded));
    });

    document.querySelectorAll('.sidebar-subitem').forEach(item => {
        item.classList.toggle('active', item.dataset.subcategory === activeSubcategory);
    });
}

function openSidebar() {
    sidebar.classList.add('open');
    sidebarOverlay.classList.add('show');
    document.body.style.overflow = 'hidden';
}

function closeSidebar() {
    sidebar.classList.remove('open');
    sidebarOverlay.classList.remove('show');
    document.body.style.overflow = '';
}

function bindEvents() {
    let searchTimer;
    searchInput.addEventListener('input', () => {
        clearTimeout(searchTimer);
        searchTimer = setTimeout(handleSearch, 300);
    });

    sidebarToggle.addEventListener('click', openSidebar);
    sidebarOverlay.addEventListener('click', closeSidebar);

    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    let scrollTicking = false;
    window.addEventListener('scroll', () => {
        if (!scrollTicking) {
            scrollTicking = true;
            requestAnimationFrame(() => {
                if (window.scrollY > 300) {
                    backToTop.classList.add('visible');
                } else {
                    backToTop.classList.remove('visible');
                }
                updateActiveNavOnScroll();
                scrollTicking = false;
            });
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeSidebar();
        }
    });
}

function updateActiveNavOnScroll() {
    const sections = document.querySelectorAll('.category-section');
    const scrollPos = window.scrollY + 80;

    let currentCategory = 'all';

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionId = section.id.replace('category-', '');

        if (scrollPos >= sectionTop) {
            currentCategory = sectionId;
        }
    });

    if (activeCategory !== currentCategory) {
        activeCategory = currentCategory;
        expandedCategory = currentCategory === 'all' ? null : currentCategory;
        updateSidebarTree();
    }
}

document.addEventListener('DOMContentLoaded', init);
