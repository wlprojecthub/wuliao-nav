#!/usr/bin/env node

const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const rootDir = path.resolve(__dirname, '..');
const notFoundPath = path.join(rootDir, '404.html');

const mimeTypes = new Map([
    ['.html', 'text/html; charset=utf-8'],
    ['.css', 'text/css; charset=utf-8'],
    ['.js', 'text/javascript; charset=utf-8'],
    ['.json', 'application/json; charset=utf-8'],
    ['.png', 'image/png'],
    ['.jpg', 'image/jpeg'],
    ['.jpeg', 'image/jpeg'],
    ['.gif', 'image/gif'],
    ['.svg', 'image/svg+xml'],
    ['.ico', 'image/x-icon'],
    ['.webp', 'image/webp'],
    ['.txt', 'text/plain; charset=utf-8'],
]);

function getArgValue(name, fallback) {
    const index = process.argv.indexOf(name);
    if (index !== -1 && process.argv[index + 1]) {
        return process.argv[index + 1];
    }
    const prefix = `${name}=`;
    const inline = process.argv.find(arg => arg.startsWith(prefix));
    return inline ? inline.slice(prefix.length) : fallback;
}

function getContentType(filePath) {
    return mimeTypes.get(path.extname(filePath).toLowerCase()) || 'application/octet-stream';
}

function resolveRequestPath(urlPath) {
    let decodedPath;
    try {
        decodedPath = decodeURIComponent(urlPath.split('?')[0]);
    } catch (error) {
        return null;
    }

    const normalizedPath = decodedPath === '/' ? '/index.html' : decodedPath;
    const filePath = path.resolve(rootDir, `.${normalizedPath}`);
    if (!filePath.startsWith(rootDir + path.sep) && filePath !== rootDir) {
        return null;
    }
    return filePath;
}

function sendFile(response, filePath, statusCode) {
    fs.readFile(filePath, (error, content) => {
        if (error) {
            response.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
            response.end('Internal Server Error');
            return;
        }

        response.writeHead(statusCode, { 'Content-Type': getContentType(filePath) });
        response.end(content);
    });
}

const port = Number.parseInt(getArgValue('--port', process.env.PORT || '8765'), 10);
if (!Number.isInteger(port) || port <= 0 || port > 65535) {
    console.error('Invalid port. Usage: node scripts/preview-server.js --port 8765');
    process.exit(1);
}

const server = http.createServer((request, response) => {
    const filePath = resolveRequestPath(request.url || '/');
    if (!filePath) {
        sendFile(response, notFoundPath, 404);
        return;
    }

    fs.stat(filePath, (error, stats) => {
        if (!error && stats.isFile()) {
            sendFile(response, filePath, 200);
            return;
        }

        sendFile(response, notFoundPath, 404);
    });
});

server.listen(port, '127.0.0.1', () => {
    console.log(`Preview server running at http://127.0.0.1:${port}/`);
});
