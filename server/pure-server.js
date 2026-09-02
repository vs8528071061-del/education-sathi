/**
 * EDUCATION SATHI - Pure Node.js Zero-Dependency Server
 * Runs out of the box with built-in 'http', 'fs', 'url', and 'path' modules.
 * No 'npm install' required!
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const DB = require('./db');

const PORT = process.env.PORT || 5000;
const PUBLIC_DIR = path.join(__dirname, '..');

const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

// Helper: send JSON
function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  });
  res.end(JSON.stringify(data));
}

// Helper: parse POST body
function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (err) {
        resolve({});
      }
    });
    req.on('error', reject);
  });
}

const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const method = req.method;

  // Handle CORS Preflight
  if (method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    });
    return res.end();
  }

  // Log
  console.log(`[${new Date().toLocaleTimeString()}] ${method} ${pathname}`);

  // ----------------------------------------------------
  // API ROUTING
  // ----------------------------------------------------
  if (pathname.startsWith('/api/')) {
    
    // 1. LEADS API
    if (pathname === '/api/leads' && method === 'GET') {
      const { status, course, search } = parsedUrl.query;
      let leads = DB.getLeads();
      if (status && status !== 'all') leads = leads.filter(l => l.status.toLowerCase() === status.toLowerCase());
      if (course && course !== 'all') leads = leads.filter(l => l.targetCourse.toLowerCase().includes(course.toLowerCase()));
      if (search) {
        const q = search.toLowerCase();
        leads = leads.filter(l => l.studentName.toLowerCase().includes(q) || l.phone.includes(q) || l.domicileState.toLowerCase().includes(q));
      }
      return sendJson(res, 200, { success: true, count: leads.length, leads });
    }

    if (pathname === '/api/leads' && method === 'POST') {
      const body = await parseBody(req);
      if (!body.studentName || !body.phone) {
        return sendJson(res, 400, { success: false, error: 'Student name and phone number are required.' });
      }
      const newLead = DB.createLead(body);
      console.log(`🎯 New Student Lead Saved: ${newLead.studentName} (${newLead.phone})`);
      return sendJson(res, 201, { success: true, message: 'Inquiry saved successfully!', lead: newLead });
    }

    if (pathname.startsWith('/api/leads/') && method === 'PATCH') {
      const id = pathname.replace('/api/leads/', '');
      const body = await parseBody(req);
      const updated = DB.updateLead(id, body);
      if (!updated) return sendJson(res, 404, { success: false, error: 'Lead not found' });
      return sendJson(res, 200, { success: true, lead: updated });
    }

    if (pathname.startsWith('/api/leads/') && method === 'DELETE') {
      const id = pathname.replace('/api/leads/', '');
      const ok = DB.deleteLead(id);
      if (!ok) return sendJson(res, 404, { success: false, error: 'Lead not found' });
      return sendJson(res, 200, { success: true, message: 'Lead deleted' });
    }

    // 2. COLLEGES API
    if (pathname === '/api/colleges' && method === 'GET') {
      const { type, state, search, sort } = parsedUrl.query;
      let colleges = DB.getColleges();
      if (type && type !== 'all') colleges = colleges.filter(c => c.type.toLowerCase() === type.toLowerCase());
      if (state && state !== 'all') colleges = colleges.filter(c => c.state.toLowerCase() === state.toLowerCase());
      if (search) {
        const q = search.toLowerCase();
        colleges = colleges.filter(c => c.name.toLowerCase().includes(q) || c.city.toLowerCase().includes(q) || c.state.toLowerCase().includes(q));
      }
      if (sort === 'nirf') colleges.sort((a, b) => a.nirfRank - b.nirfRank);
      else if (sort === 'feeAsc') colleges.sort((a, b) => a.tuitionFee - b.tuitionFee);
      else if (sort === 'feeDesc') colleges.sort((a, b) => b.tuitionFee - a.tuitionFee);
      return sendJson(res, 200, { success: true, count: colleges.length, colleges });
    }

    // 3. COURSES API
    if (pathname === '/api/courses' && method === 'GET') {
      return sendJson(res, 200, { success: true, categories: DB.getCourses() });
    }

    // 4. SCHOLARSHIPS API
    if (pathname === '/api/scholarships' && method === 'GET') {
      return sendJson(res, 200, { success: true, scholarships: DB.getScholarships() });
    }

    // 5. COUNSELLING AUTHORITIES API
    if (pathname === '/api/counselling' && method === 'GET') {
      return sendJson(res, 200, { success: true, authorities: DB.getCounselling() });
    }

    // 6. STATS API
    if (pathname === '/api/stats' && method === 'GET') {
      const leads = DB.getLeads();
      return sendJson(res, 200, {
        success: true,
        stats: {
          totalLeads: leads.length,
          newLeads: leads.filter(l => l.status === 'New').length,
          inProgressLeads: leads.filter(l => l.status === 'In Progress').length,
          admittedLeads: leads.filter(l => l.status === 'Admitted').length
        }
      });
    }

    return sendJson(res, 404, { success: false, error: 'Endpoint not found' });
  }

  // ----------------------------------------------------
  // STATIC FILE SERVING (Frontend: HTML, CSS, JS)
  // ----------------------------------------------------
  let filePath = path.join(PUBLIC_DIR, pathname === '/' ? 'index.html' : pathname);
  const ext = path.extname(filePath).toLowerCase();

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        // Fallback to index.html for SPA routing
        fs.readFile(path.join(PUBLIC_DIR, 'index.html'), (err2, fallbackContent) => {
          if (err2) {
            res.writeHead(404);
            return res.end('File Not Found');
          }
          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end(fallbackContent, 'utf-8');
        });
      } else {
        res.writeHead(500);
        res.end(`Server Error: ${err.code}`);
      }
    } else {
      res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] || 'application/octet-stream' });
      res.end(content, 'utf-8');
    }
  });
});

server.listen(PORT, () => {
  console.log('====================================================');
  console.log(`🎓 EDUCATION SATHI - BACKEND RUNNING ON PORT ${PORT}`);
  console.log(`🚀 API Base: http://localhost:${PORT}/api`);
  console.log(`🌐 Website:  http://localhost:${PORT}`);
  console.log(`📞 Director Hotline: 9752754404`);
  console.log('====================================================');
});
