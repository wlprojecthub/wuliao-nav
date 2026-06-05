#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.resolve(__dirname, '..');
const DATA_FILE = path.join(ROOT, 'assets', 'js', 'data.js');
const MAIN_FILE = path.join(ROOT, 'assets', 'js', 'main.js');
const FAVICON_DIR = path.join(ROOT, 'assets', 'img', 'favicons');
const DEFAULT_ICON = path.join(ROOT, 'assets', 'img', 'default-icon.png');

const KEY_OFFICIAL_ICONS = [
  'chat.deepseek.com.png',
  'www.binance.com.png',
  'www.cnki.net.png',
  'www.damai.cn.png',
  'www.imdb.com.png',
  'www.o3de.org.png',
];

const EXPECTED_DEFAULT_ICON_SITES = [
  'Copilot',
  '慧言AI',
  'NotebookLM',
  'Phind',
  'Play.ht',
  'Redis Cloud',
  'Google Analytics',
  'SegmentFault',
  'CodeSandbox',
  'NOI',
  'CSES',
  'Husky',
  'Pixabay',
  'VCB-Studio',
  '动漫之家',
  'ZzzFun',
  'Gogoanime',
  '9Anime',
  'Kanopy',
  'Microsoft To Do',
  'Google Tasks',
  'Clockwise',
  '银联',
  'PuTTY',
  '汇率转换器',
  'WebPageTest',
  'Taro',
];

const REMOVED_SITE_NAMES = [
  'Pleasant AI',
  'Poj',
];

const REMOVED_WRONG_LETTER_ICONS = [
  '9anime.to.png',
  'analytics.google.com.png',
  'codesandbox.io.png',
  'codingcompetitions.withgoogle.com.png',
  'cses.fi.png',
  'currency.kejilion.pro.png',
  'gogoanime.gg.png',
  'notebooklm.google.com.png',
  'pixabay.com.png',
  'play.ht.png',
  'segmentfault.com.png',
  'tasks.google.com.png',
  'to.do.microsoft.com.png',
  'typicode.github.io.png',
  'vcb-s.com.png',
  'www.dmzj.com.png',
  'www.freewarefiles.com.png',
  'www.funimation.com.png',
  'www.getclockwise.com.png',
  'www.kanopy.com.png',
  'www.noi.cn.png',
  'www.phind.com.png',
  'www.unionpay.com.png',
  'www.webpagetest.org.png',
  'zzzfun.com.png',
  'bing.com.png',
  'chat.huiyan-ai.com.png',
  'poj.org.png',
  'redis.com.png',
  'www.pleasant.ai.png',
];

const SIGNATURES = [
  { type: 'png', matches: (buffer) => buffer.length >= 8 && buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) },
  { type: 'ico', matches: (buffer) => buffer.length >= 4 && buffer[0] === 0x00 && buffer[1] === 0x00 && buffer[2] === 0x01 && buffer[3] === 0x00 },
  { type: 'jpeg', matches: (buffer) => buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff },
  { type: 'gif', matches: (buffer) => buffer.length >= 6 && (buffer.subarray(0, 6).toString('ascii') === 'GIF87a' || buffer.subarray(0, 6).toString('ascii') === 'GIF89a') },
  { type: 'webp', matches: (buffer) => buffer.length >= 12 && buffer.subarray(0, 4).toString('ascii') === 'RIFF' && buffer.subarray(8, 12).toString('ascii') === 'WEBP' },
  { type: 'svg', matches: (buffer) => /^\s*(?:<\?xml[^>]*>\s*)?<svg[\s>]/i.test(buffer.subarray(0, 512).toString('utf8')) },
];

function loadData() {
  const source = fs.readFileSync(DATA_FILE, 'utf8');
  return new vm.Script(`${source}\n;({ SITES_DATA });`, {
    filename: DATA_FILE,
  }).runInNewContext({});
}

function loadDefaultIconHosts() {
  const source = fs.readFileSync(MAIN_FILE, 'utf8');
  const hosts = new Set();
  const pattern = /if\s*\(\s*domain\s*===\s*['"]([^'"]+)['"]\s*\)\s*{\s*return\s*['"]assets\/img\/default-icon\.png/gs;
  let match = pattern.exec(source);

  while (match) {
    hosts.add(match[1]);
    match = pattern.exec(source);
  }

  return hosts;
}

function faviconFileFor(site) {
  try {
    return `${new URL(site.url).hostname}.png`;
  } catch {
    return null;
  }
}

function identify(buffer) {
  const signature = SIGNATURES.find((candidate) => candidate.matches(buffer));
  return signature ? signature.type : null;
}

function main() {
  const problems = [];
  const { SITES_DATA } = loadData();
  const defaultIconHosts = loadDefaultIconHosts();
  const faviconFiles = fs.readdirSync(FAVICON_DIR, { withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .sort();
  const faviconSet = new Set(faviconFiles);

  if (!fs.existsSync(DEFAULT_ICON)) {
    problems.push('default icon is missing: assets/img/default-icon.png');
  } else if (fs.statSync(DEFAULT_ICON).size === 0) {
    problems.push('default icon is empty: assets/img/default-icon.png');
  }

  const missingReferences = [];
  for (const site of SITES_DATA) {
    if (site.icon === 'default') {
      continue;
    }

    let hostName;
    try {
      hostName = new URL(site.url).hostname;
    } catch {
      continue;
    }

    if (defaultIconHosts.has(hostName)) {
      continue;
    }

    const fileName = faviconFileFor(site);
    if (!fileName) {
      continue;
    }

    if (!faviconSet.has(fileName)) {
      missingReferences.push(`${site.name} -> assets/img/favicons/${fileName}`);
    }
  }

  if (missingReferences.length > 0) {
    problems.push(`missing favicon references: ${missingReferences.length}`);
  }

  for (const fileName of KEY_OFFICIAL_ICONS) {
    if (!faviconSet.has(fileName)) {
      problems.push(`key official icon is missing: assets/img/favicons/${fileName}`);
    }
  }

  for (const siteName of EXPECTED_DEFAULT_ICON_SITES) {
    const matches = SITES_DATA.filter((site) => site.name === siteName);
    if (matches.length !== 1) {
      problems.push(`default icon site "${siteName}" expected one entry, got ${matches.length}`);
      continue;
    }

    if (matches[0].icon !== 'default') {
      problems.push(`default icon site "${siteName}" expected icon=default, got ${matches[0].icon || '<auto>'}`);
    }
  }

  for (const siteName of REMOVED_SITE_NAMES) {
    const matches = SITES_DATA.filter((site) => site.name === siteName);
    if (matches.length !== 0) {
      problems.push(`removed site "${siteName}" expected zero entries, got ${matches.length}`);
    }
  }

  const reappearedWrongIcons = REMOVED_WRONG_LETTER_ICONS.filter((fileName) => faviconSet.has(fileName));
  if (reappearedWrongIcons.length > 0) {
    problems.push(`removed wrong-letter icons reappeared: ${reappearedWrongIcons.join(', ')}`);
  }

  const emptyFiles = [];
  const unknownFormatFiles = [];
  const formatCounts = new Map();
  for (const fileName of faviconFiles) {
    const absolutePath = path.join(FAVICON_DIR, fileName);
    const stat = fs.statSync(absolutePath);
    if (stat.size === 0) {
      emptyFiles.push(fileName);
      continue;
    }

    const buffer = fs.readFileSync(absolutePath);
    const type = identify(buffer);
    if (!type) {
      unknownFormatFiles.push(fileName);
      continue;
    }

    formatCounts.set(type, (formatCounts.get(type) || 0) + 1);
  }

  if (emptyFiles.length > 0) {
    problems.push(`empty favicon files: ${emptyFiles.join(', ')}`);
  }

  if (unknownFormatFiles.length > 0) {
    problems.push(`unrecognized favicon formats: ${unknownFormatFiles.join(', ')}`);
  }

  console.log('Favicon check');
  console.log(`- favicon file count: ${faviconFiles.length}`);
  console.log(`- default icon exists: ${fs.existsSync(DEFAULT_ICON) ? 'yes' : 'no'}`);
  console.log(`- special default icon hosts: ${[...defaultIconHosts].sort().join(', ') || '<none>'}`);
  console.log(`- missing favicon references: ${missingReferences.length}`);
  for (const item of missingReferences) {
    console.log(`  - ${item}`);
  }
  console.log('- key official icons:');
  for (const fileName of KEY_OFFICIAL_ICONS) {
    console.log(`  - ${fileName}: ${faviconSet.has(fileName) ? 'present' : 'missing'}`);
  }
  console.log(`- expected default icon sites: ${EXPECTED_DEFAULT_ICON_SITES.length}`);
  console.log(`- removed wrong-letter icons reappeared: ${reappearedWrongIcons.length}`);
  console.log(`- empty files: ${emptyFiles.length}`);
  console.log(`- unrecognized formats: ${unknownFormatFiles.length}`);
  console.log('- detected formats:');
  for (const [type, count] of [...formatCounts.entries()].sort((a, b) => a[0].localeCompare(b[0]))) {
    console.log(`  - ${type}: ${count}`);
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
