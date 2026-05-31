const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const projectRoot = path.resolve(__dirname, '..');

const resources = [
    'assets/css/style.css',
    'assets/js/data.js',
    'assets/js/main.js'
];

function contentHash(relativePath) {
    const contents = fs.readFileSync(path.join(projectRoot, relativePath));
    return crypto.createHash('sha256').update(contents).digest('hex').slice(0, 12);
}

function updateHtml(fileName, resourceVersions) {
    const filePath = path.join(projectRoot, fileName);
    let html = fs.readFileSync(filePath, 'utf8');

    resourceVersions.forEach(({ resource, version }) => {
        const resourcePattern = resource.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        html = html.replace(
            new RegExp(`(${resourcePattern})(?:\\?v=[a-f0-9]+)?`, 'g'),
            `$1?v=${version}`
        );
    });

    fs.writeFileSync(filePath, html, 'utf8');
}

const resourceVersions = resources.map(resource => ({
    resource,
    version: contentHash(resource)
}));

updateHtml('index.html', resourceVersions);
updateHtml('404.html', resourceVersions);

resourceVersions.forEach(({ resource, version }) => {
    console.log(`${resource}?v=${version}`);
});
