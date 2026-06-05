#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.resolve(__dirname, '..');
const DATA_FILE = path.join(ROOT, 'assets', 'js', 'data.js');

const EXPECTED_TOTAL = 988;
const ALLOWED_RISKS = new Set(['需要科学上网', '可能需要科学上网']);

const REQUIRED_SITE_NAMES = [
  'Crunchyroll',
  '拷贝漫画',
  'Crackhub',
  'PuTTY',
  'Play.ht',
];

const REMOVED_SITE_NAMES = [
  'Pleasant AI',
  'Poj',
];

const ALLOWED_ALIAS_SITE_NAMES = new Set(['Bilibili', 'DeepSeek']);

const KEY_ENTRIES = [
  {
    label: 'PuTTY URL',
    name: 'PuTTY',
    expected: { url: 'https://putty.software/', category: 'software', icon: 'default' },
  },
  {
    label: 'HostHatch URL',
    name: 'HostHatch',
    expected: { url: 'https://cloud.hosthatch.com', category: 'cloud' },
  },
  {
    label: 'DeepSeek category',
    name: 'DeepSeek',
    expected: { url: 'https://chat.deepseek.com', category: 'recommend' },
  },
  {
    label: 'NotebookLM default icon',
    name: 'NotebookLM',
    expected: { url: 'https://notebooklm.google.com', icon: 'default' },
  },
  {
    label: 'Phind default icon',
    name: 'Phind',
    expected: { url: 'https://www.phind.com', icon: 'default' },
  },
  {
    label: 'WeChat Mini Program URL',
    name: 'WeChat Mini Program',
    expected: { url: 'https://developers.weixin.qq.com/miniprogram/dev/framework/', category: 'dev' },
  },
  {
    label: 'Redis Cloud URL',
    name: 'Redis Cloud',
    expected: { url: 'https://redis.io/cloud/', category: 'cloud', icon: 'default' },
  },
  {
    label: '慧言AI URL',
    name: '慧言AI',
    expected: { url: 'https://huiyan-ai.cn/', category: 'ai', icon: 'default' },
  },
  {
    label: 'Copilot URL',
    name: 'Copilot',
    expected: { url: 'https://copilot.microsoft.com/', category: 'ai', icon: 'default' },
  },
  {
    label: 'Taro URL',
    name: 'Taro',
    expected: { url: 'https://docs.taro.zone/docs/', category: 'dev', icon: 'default' },
  },
  {
    label: 'Play.ht retained',
    name: 'Play.ht',
    expected: { url: 'https://play.ht', category: 'ai', icon: 'default' },
  },
];

function loadData() {
  const source = fs.readFileSync(DATA_FILE, 'utf8');
  return new vm.Script(`${source}\n;({ CATEGORIES, SUBCATEGORIES, SITES_DATA });`, {
    filename: DATA_FILE,
  }).runInNewContext({});
}

function isValidUrl(value) {
  if (typeof value !== 'string' || value.trim() !== value || value.length === 0) {
    return false;
  }

  try {
    const parsed = new URL(value);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

function formatSite(site, index) {
  const name = site && site.name ? site.name : '<missing name>';
  const url = site && site.url ? site.url : '<missing url>';
  return `#${index + 1} ${name} <${url}>`;
}

function main() {
  const problems = [];
  const { CATEGORIES, SUBCATEGORIES, SITES_DATA } = loadData();

  const categoryIds = new Set(CATEGORIES.map((category) => category.id));
  const categoryCounts = new Map(CATEGORIES.map((category) => [category.id, 0]));
  const urlOwners = new Map();
  let defaultIconCount = 0;
  const defaultIconSites = [];

  if (SITES_DATA.length !== EXPECTED_TOTAL) {
    problems.push(`site total expected ${EXPECTED_TOTAL}, got ${SITES_DATA.length}`);
  }

  for (const [index, site] of SITES_DATA.entries()) {
    if (!site || typeof site !== 'object') {
      problems.push(`#${index + 1} is not an object`);
      continue;
    }

    if (typeof site.name !== 'string' || site.name.trim() === '') {
      problems.push(`${formatSite(site, index)} has invalid name`);
    }

    if (!isValidUrl(site.url)) {
      problems.push(`${formatSite(site, index)} has invalid url`);
    } else {
      const normalizedUrl = site.url.toLowerCase();
      const owners = urlOwners.get(normalizedUrl) || [];
      owners.push(formatSite(site, index));
      urlOwners.set(normalizedUrl, owners);
    }

    if (!categoryIds.has(site.category)) {
      problems.push(`${formatSite(site, index)} has invalid category "${site.category}"`);
    } else {
      categoryCounts.set(site.category, categoryCounts.get(site.category) + 1);
    }

    if (Object.prototype.hasOwnProperty.call(site, 'risk') && !ALLOWED_RISKS.has(site.risk)) {
      problems.push(`${formatSite(site, index)} has invalid risk "${site.risk}"`);
    }

    if (Object.prototype.hasOwnProperty.call(site, 'icon')) {
      if (site.icon === 'default') {
        defaultIconCount += 1;
        defaultIconSites.push(site.name);
      } else {
        problems.push(`${formatSite(site, index)} has invalid icon "${site.icon}"`);
      }
    }

    if (Object.prototype.hasOwnProperty.call(site, 'aliases')) {
      if (!ALLOWED_ALIAS_SITE_NAMES.has(site.name)) {
        problems.push(`${formatSite(site, index)} has aliases but is not allowed for this phase`);
      }

      if (!Array.isArray(site.aliases)) {
        problems.push(`${formatSite(site, index)} has invalid aliases value`);
      } else {
        const normalizedAliases = new Set();
        for (const alias of site.aliases) {
          if (typeof alias !== 'string' || alias.trim() === '') {
            problems.push(`${formatSite(site, index)} has invalid alias "${alias}"`);
            continue;
          }

          const normalizedAlias = alias.normalize('NFKC').toLowerCase();
          if (normalizedAliases.has(normalizedAlias)) {
            problems.push(`${formatSite(site, index)} has duplicate alias "${alias}"`);
          }
          normalizedAliases.add(normalizedAlias);
        }
      }
    }
  }

  for (const [url, owners] of urlOwners.entries()) {
    if (owners.length > 1) {
      problems.push(`duplicate url ${url}: ${owners.join(' | ')}`);
    }
  }

  for (const category of CATEGORIES) {
    if (!Object.prototype.hasOwnProperty.call(SUBCATEGORIES, category.id)) {
      problems.push(`category "${category.id}" has no SUBCATEGORIES entry`);
    }
  }

  for (const siteName of REQUIRED_SITE_NAMES) {
    const matches = SITES_DATA.filter((site) => site.name === siteName);
    if (matches.length !== 1) {
      problems.push(`required site "${siteName}" expected one entry, got ${matches.length}`);
    }
  }

  for (const siteName of REMOVED_SITE_NAMES) {
    const matches = SITES_DATA.filter((site) => site.name === siteName);
    if (matches.length !== 0) {
      problems.push(`removed site "${siteName}" expected zero entries, got ${matches.length}`);
    }
  }

  for (const keyEntry of KEY_ENTRIES) {
    const matches = SITES_DATA.filter((site) => site.name === keyEntry.name);
    if (matches.length !== 1) {
      problems.push(`${keyEntry.label}: expected one "${keyEntry.name}" entry, got ${matches.length}`);
      continue;
    }

    const site = matches[0];
    for (const [field, expectedValue] of Object.entries(keyEntry.expected)) {
      if (site[field] !== expectedValue) {
        problems.push(`${keyEntry.label}: expected ${field}=${expectedValue}, got ${site[field]}`);
      }
    }
  }

  console.log('Data check');
  console.log(`- site total: ${SITES_DATA.length}`);
  console.log('- category counts:');
  for (const category of CATEGORIES) {
    console.log(`  - ${category.id}: ${categoryCounts.get(category.id) || 0}`);
  }
  console.log(`- icon default count: ${defaultIconCount}`);
  console.log('- icon default sites:');
  for (const siteName of defaultIconSites) {
    console.log(`  - ${siteName}`);
  }
  console.log('- phase 1 key entries:');
  for (const keyEntry of KEY_ENTRIES) {
    const site = SITES_DATA.find((candidate) => candidate.name === keyEntry.name);
    if (!site) {
      console.log(`  - ${keyEntry.label}: missing`);
      continue;
    }
    console.log(`  - ${keyEntry.label}: ${site.name} | ${site.url} | category=${site.category} | icon=${site.icon || '<auto>'}`);
  }

  if (problems.length === 0) {
    console.log('Result: OK');
    return;
  }

  console.log('Result: FAIL');
  console.log('Problems:');
  for (const problem of problems) {
    console.log(`- ${problem}`);
  }
  process.exitCode = 1;
}

main();
