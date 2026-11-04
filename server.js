const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 5500;
const ROOT = __dirname;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webm': 'video/webm',
  '.mp4': 'video/mp4',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff'
};

const server = http.createServer((req, res) => {
  let reqPath = decodeURI(req.url.split('?')[0]);

  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': '*'
    });
    return res.end();
  }

  // Handle direct video upload from client
  if (req.method === 'POST' && reqPath === '/save-video') {
    const chunks = [];
    req.on('data', chunk => chunks.push(chunk));
    req.on('end', () => {
      const buffer = Buffer.concat(chunks);
      const destPath1 = path.join(ROOT, 'abhay-singh-upwork-intro.webm');
      const downloadsDir = path.join(process.env.USERPROFILE || 'C:\\Users\\ASUS', 'Downloads');
      const destPath2 = path.join(downloadsDir, 'abhay-singh-upwork-intro.webm');

      try {
        fs.writeFileSync(destPath1, buffer);
        try { fs.writeFileSync(destPath2, buffer); } catch (_) {}
        console.log(`Video saved to: ${destPath1} and ${destPath2} (${buffer.length} bytes)`);
        res.writeHead(200, {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        });
        res.end(JSON.stringify({ success: true, size: buffer.length, path: destPath2 }));
      } catch (err) {
        console.error('Error saving video:', err);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      }
    });
    return;
  }

  if (reqPath === '/') reqPath = '/index.html';
  
  let filePath = path.join(ROOT, reqPath);

  // Security check: stay inside ROOT
  const resolved = path.resolve(filePath);
  if (!resolved.startsWith(path.resolve(ROOT))) {
    res.writeHead(403);
    return res.end('Forbidden');
  }

  fs.stat(resolved, (err, stats) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      return res.end('404 Not Found');
    }

    let targetFile = resolved;
    if (stats.isDirectory()) {
      targetFile = path.join(resolved, 'index.html');
    }

    fs.readFile(targetFile, (readErr, content) => {
      if (readErr) {
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        return res.end('404 Not Found');
      }
      const ext = path.extname(targetFile).toLowerCase();
      const contentType = MIME[ext] || 'application/octet-stream';
      res.writeHead(200, {
        'Content-Type': contentType,
        'Access-Control-Allow-Origin': '*'
      });
      res.end(content);
    });
  });
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT} and http://127.0.0.1:${PORT}`);
});
