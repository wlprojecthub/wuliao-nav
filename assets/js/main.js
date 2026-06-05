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
let searchTimer;
let isComposingSearch = false;

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
            return parsed.href;
        }
        return '#';
    } catch (e) {
        return '#';
    }
}

function safeIdentifier(value) {
    return typeof value === 'string' && /^[a-z0-9-]+$/i.test(value) ? value : '';
}

function getScrollBehavior() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
}

function exitSearch() {
    clearTimeout(searchTimer);
    const hadSearch = Boolean(currentSearch || searchInput.value);
    searchInput.value = '';
    currentSearch = '';
    updateSearchQueryInUrl('');
    if (hadSearch) {
        renderSites();
    }
}

function init() {
    renderSidebar();
    restoreSearchFromUrl();
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
        const categoryId = safeIdentifier(category.id);
        if (!categoryId) return;
        const count = categoryCounts[categoryId] || 0;
        const subcategoryCounts = getSubcategoryCounts(categoryId);
        const subcategoryItems = (SUBCATEGORIES[categoryId] || [])
            .filter(subcategory => subcategoryCounts[subcategory.id])
            .map(subcategory => {
                const subcategoryId = safeIdentifier(subcategory.id);
                if (!subcategoryId) return '';
                return `<a class="sidebar-subitem" data-subcategory="${categoryId}-${subcategoryId}" href="#subcategory-${categoryId}-${subcategoryId}" onclick="scrollToSubcategory(event, '${categoryId}', '${subcategoryId}')">
                <span class="sidebar-subitem-dot"></span>
                <span class="sidebar-subitem-name">${escapeHtml(subcategory.name)}</span>
                <span class="sidebar-subitem-count">${subcategoryCounts[subcategoryId]}</span>
            </a>`;
            }).join('');

        html += `<div class="nav-group" data-category-group="${categoryId}">
            <button type="button" class="nav-item" data-category="${categoryId}" aria-expanded="false" aria-controls="sidebar-subnav-${categoryId}" onclick="toggleCategory('${categoryId}')">
                <span class="nav-icon">${escapeHtml(category.icon)}</span>
                <span class="nav-name">${escapeHtml(category.name)}</span>
                <span class="nav-count">${count}</span>
                <span class="nav-caret">›</span>
            </button>
            <div class="sidebar-subnav" id="sidebar-subnav-${categoryId}" aria-hidden="true">${subcategoryItems}</div>
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
        const categoryId = safeIdentifier(category.id);
        if (!categoryId) return;
        const categorySites = sortSites(groupedSites[categoryId] || []);
        if (!categorySites || categorySites.length === 0) return;
        const subcategoryGroups = groupSitesBySubcategory(categoryId, categorySites);

        html += `<section class="category-section" id="category-${categoryId}">
            <div class="category-header">
                <span class="category-icon">${escapeHtml(category.icon)}</span>
                <h2 class="category-title">${escapeHtml(category.name)}</h2>
                <span class="category-count">${categorySites.length} 个网站</span>
            </div>
            <div class="subcategory-nav">
                ${subcategoryGroups.map(group => {
                    const groupId = safeIdentifier(group.id);
                    if (!groupId) return '';
                    return `<a class="subcategory-chip" href="#subcategory-${categoryId}-${groupId}" onclick="scrollToSubcategory(event, '${categoryId}', '${groupId}')">
                    <span>${escapeHtml(group.name)}</span>
                    <small>${group.sites.length}</small>
                </a>`;
                }).join('')}
            </div>`;

        subcategoryGroups.forEach(group => {
            const groupId = safeIdentifier(group.id);
            if (!groupId) return;
            html += `<section class="subcategory-section" id="subcategory-${categoryId}-${groupId}">
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
    const faviconUrl = getFaviconUrl(site);
    const safeName = escapeHtml(site.name);
    const safeDesc = escapeHtml(site.description);
    const firstChar = escapeHtml(site.name.charAt(0).toUpperCase());
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

    return `<a href="${escapeHtml(safeUrl)}" target="_blank" rel="noopener noreferrer" class="${cardClass}">
        ${riskTag}
        ${highlightBadge}
        <img class="card-icon" src="${escapeHtml(faviconUrl)}" alt="${safeName}" loading="lazy" decoding="async" onerror="if (!this.dataset.defaultFallback) { this.dataset.defaultFallback='true'; this.src='assets/img/default-icon.png?v=608d62088fc4'; } else { this.style.display='none';this.nextElementSibling.style.display='flex'; }">
        <div class="card-icon-fallback" style="display:none">${firstChar}</div>
        <div class="card-info">
            <div class="card-name">${highlightedName}</div>
            <div class="card-desc">${highlightedDesc}</div>
        </div>
    </a>`;
}

function getFaviconUrl(site) {
    if (site.icon === 'default') {
        return 'assets/img/default-icon.png?v=608d62088fc4';
    }

    try {
        const domain = new URL(site.url).hostname;
        if (domain === 'cloud.hosthatch.com') {
            return 'assets/img/default-icon.png?v=608d62088fc4';
        }
        return `assets/img/favicons/${domain}.png`;
    } catch (e) {
        return 'assets/img/default-icon.png?v=608d62088fc4';
    }
}

function handleSearch(options = {}) {
    const { updateUrl = true } = options;
    const rawSearch = searchInput.value;
    const keyword = normalizeSearchInput(rawSearch);
    currentSearch = keyword;

    if (updateUrl) {
        updateSearchQueryInUrl(rawSearch);
    }

    if (!keyword) {
        renderSites();
        return;
    }

    const searchTerms = keyword.split(/\s+/).filter(term => term.length > 0);

    const filteredSites = SITES_DATA.filter(site => {
        const searchableText = [
            site.name,
            site.description,
            ...(site.tags || []),
            ...(site.aliases || [])
        ].join(' ').toLowerCase();

        return searchTerms.every(term =>
            searchableText.includes(term) || siteUrlMatchesSearch(site, term)
        );
    });

    renderSites(filteredSites);
}

function normalizeSearchInput(value) {
    return String(value || '').normalize('NFKC').trim().toLowerCase();
}

function getSearchQueryFromUrl() {
    try {
        return new URL(window.location.href).searchParams.get('q') || '';
    } catch (e) {
        return '';
    }
}

function updateSearchQueryInUrl(value) {
    if (!window.history || !window.location) return;

    try {
        const url = new URL(window.location.href);
        const rawValue = String(value || '').trim();
        if (normalizeSearchInput(rawValue)) {
            url.searchParams.set('q', rawValue);
        } else {
            url.searchParams.delete('q');
        }
        window.history.replaceState(null, '', url);
    } catch (e) {
        // Search must keep working even if URL state cannot be updated.
    }
}

function restoreSearchFromUrl() {
    searchInput.value = getSearchQueryFromUrl();
    handleSearch({ updateUrl: false });
}

function normalizeHostname(hostname) {
    return String(hostname || '')
        .normalize('NFKC')
        .trim()
        .toLowerCase()
        .replace(/\.$/, '')
        .replace(/^www\./, '');
}

function getInputHostname(value) {
    const normalizedValue = normalizeSearchInput(value).replace(/\/+$/, '');
    if (!normalizedValue || /\s/.test(normalizedValue)) return '';

    const candidates = [normalizedValue];
    if (!/^[a-z][a-z0-9+.-]*:\/\//i.test(normalizedValue)) {
        candidates.push(`https://${normalizedValue}`);
    }

    for (const candidate of candidates) {
        try {
            const parsed = new URL(candidate);
            if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
                return normalizeHostname(parsed.hostname);
            }
        } catch (e) {
            // Continue with the next candidate; plain names are handled elsewhere.
        }
    }

    return '';
}

function siteUrlMatchesSearch(site, term) {
    const inputHostname = getInputHostname(term);
    if (!inputHostname || !inputHostname.includes('.')) return false;

    try {
        const siteHostname = normalizeHostname(new URL(site.url).hostname);
        return siteHostname === inputHostname || siteHostname.endsWith(`.${inputHostname}`);
    } catch (e) {
        return false;
    }
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
    exitSearch();

    activeCategory = categoryId;
    expandedCategory = categoryId === 'all' ? null : categoryId;
    updateSidebarTree();

    if (categoryId === 'all') {
        window.scrollTo({ top: 0, behavior: getScrollBehavior() });
    } else {
        const target = document.getElementById(`category-${categoryId}`);
        if (target) {
            target.scrollIntoView({ behavior: getScrollBehavior(), block: 'start' });
        }
    }

    closeSidebar();
}

function toggleCategory(categoryId) {
    exitSearch();
    expandedCategory = expandedCategory === categoryId ? null : categoryId;
    activeCategory = categoryId;
    updateSidebarTree();

    const target = document.getElementById(`category-${categoryId}`);
    if (target) {
        target.scrollIntoView({ behavior: getScrollBehavior(), block: 'start' });
    }

    closeSidebar();
}

function scrollToSubcategory(event, categoryId, subcategoryId) {
    event.preventDefault();
    exitSearch();
    activeCategory = categoryId;
    expandedCategory = categoryId;
    updateSidebarTree(`${categoryId}-${subcategoryId}`);
    const target = document.getElementById(`subcategory-${categoryId}-${subcategoryId}`);
    if (target) {
        target.scrollIntoView({ behavior: getScrollBehavior(), block: 'start' });
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
    sidebarToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
}

function closeSidebar() {
    sidebar.classList.remove('open');
    sidebarOverlay.classList.remove('show');
    sidebarToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
}

function bindEvents() {
    searchInput.addEventListener('compositionstart', () => {
        isComposingSearch = true;
        clearTimeout(searchTimer);
    });

    searchInput.addEventListener('compositionend', () => {
        isComposingSearch = false;
        clearTimeout(searchTimer);
        handleSearch();
    });

    searchInput.addEventListener('input', (event) => {
        if (isComposingSearch || event.isComposing) return;
        clearTimeout(searchTimer);
        searchTimer = setTimeout(() => handleSearch(), 300);
    });

    sidebarToggle.addEventListener('click', openSidebar);
    sidebarOverlay.addEventListener('click', closeSidebar);

    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: getScrollBehavior() });
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

    window.addEventListener('popstate', restoreSearchFromUrl);

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
