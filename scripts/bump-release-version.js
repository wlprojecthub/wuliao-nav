const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const projectRoot = path.resolve(__dirname, '..');

const defaultIcon = 'assets/img/default-icon.png';
const versionedResources = [
    'assets/css/style.css',
    'assets/js/data.js',
    defaultIcon
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

function updateResourceReferences(fileName, resourceVersions) {
    const filePath = path.join(projectRoot, fileName);
    let contents = fs.readFileSync(filePath, 'utf8');

    resourceVersions.forEach(({ resource, version }) => {
        const resourcePattern = resource.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        contents = contents.replace(
            new RegExp(`(${resourcePattern})(?:\\?v=[a-f0-9]+)?`, 'g'),
            `$1?v=${version}`
        );
    });

    fs.writeFileSync(filePath, contents, 'utf8');
}

const defaultIconVersion = {
    resource: defaultIcon,
    version: contentHash(defaultIcon)
};

updateResourceReferences('assets/js/main.js', [defaultIconVersion]);

const resourceVersions = versionedResources.map(resource => ({
    resource,
    version: contentHash(resource)
})).concat({
    resource: 'assets/js/main.js',
    version: contentHash('assets/js/main.js')
});

updateHtml('index.html', resourceVersions);
updateHtml('404.html', resourceVersions);

resourceVersions.forEach(({ resource, version }) => {
    console.log(`${resource}?v=${version}`);
});
