// Zonder dependencies: node server.js
const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'data.json');
const PUBLIC = path.join(__dirname, 'public');

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.json': 'application/json',
};

const load = () => {
  try { return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8')); } catch { return []; }
};
const save = (items) => fs.writeFileSync(DATA_FILE, JSON.stringify(items, null, 2));

const send = (res, code, body, type = 'application/json') => {
  res.writeHead(code, { 'Content-Type': type, 'Cache-Control': 'no-store' });
  res.end(typeof body === 'string' || Buffer.isBuffer(body) ? body : JSON.stringify(body));
};

const readBody = (req) =>
  new Promise((resolve, reject) => {
    let data = '';
    req.on('data', (c) => { data += c; if (data.length > 1e5) req.destroy(); });
    req.on('end', () => { try { resolve(JSON.parse(data || '{}')); } catch (e) { reject(e); } });
  });

http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://x');
  const p = url.pathname;

  if (p === '/api/schedule') {
    if (req.method === 'GET') {
      // opruimen: alles wat >1 dag geleden afgelopen is
      const cutoff = Date.now() - 24 * 3600e3;
      const items = load().filter((i) => new Date(i.end).getTime() > cutoff);
      return send(res, 200, { now: Date.now(), items });
    }
    if (req.method === 'POST') {
      try {
        const b = await readBody(req);
        const start = new Date(b.start), end = new Date(b.end);
        const name = String(b.name || '').trim().slice(0, 60);
        if (!name || isNaN(start) || isNaN(end) || end <= start) return send(res, 400, { error: 'Ongeldige invoer' });
        const item = {
          id: crypto.randomUUID(),
          name,
          message: String(b.message || '').trim().slice(0, 100),
          theme: ['auto', '1', '2', '3', '4'].includes(String(b.theme)) ? String(b.theme) : 'auto',
          start: start.toISOString(),
          end: end.toISOString(),
        };
        const items = load(); items.push(item); save(items);
        return send(res, 201, item);
      } catch { return send(res, 400, { error: 'Ongeldige JSON' }); }
    }
  }

  const del = p.match(/^\/api\/schedule\/([\w-]+)$/);
  if (del && req.method === 'DELETE') {
    save(load().filter((i) => i.id !== del[1]));
    return send(res, 200, { ok: true });
  }

  // statische bestanden: / = welcome screen, /plan = inplannen
  const file = p === '/' ? 'index.html' : p === '/plan' ? 'plan.html' : p.slice(1);
  const full = path.join(PUBLIC, path.normalize(file));
  if (!full.startsWith(PUBLIC)) return send(res, 403, 'Forbidden', 'text/plain');
  fs.readFile(full, (err, buf) => {
    if (err) return send(res, 404, 'Niet gevonden', 'text/plain');
    send(res, 200, buf, MIME[path.extname(full)] || 'application/octet-stream');
  });
}).listen(PORT, () => {
  console.log(`Welcome screen: http://localhost:${PORT}/`);
  console.log(`Inplannen:      http://localhost:${PORT}/plan`);
});
