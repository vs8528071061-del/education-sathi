/**
 * EDUCATION SATHI - Master Backend Express Server
 * REST API Endpoints for:
 * - 36 Destinations & State Dashboards
 * - Dedicated Medical Course Boxes (MBBS, BAMS, BHMS, BUMS, MD/MS)
 * - AI Career Assistant (Ask Education Sathi AI)
 * - Admin Authentication & Session Management (Login/Logout)
 * - Leads CRM, Colleges, Courses, Scholarships & Static Assets
 */

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const DB = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '..')));

// Simple in-memory token store for admin session
const activeSessions = new Set(['admin-session-default-token']);

// ==========================================================================
// 1. ADMIN AUTHENTICATION (LOGIN / LOGOUT / VERIFY)
// ==========================================================================

app.post('/api/admin/login', (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ success: false, error: 'Username and password are required.' });
    }

    const admin = DB.validateAdmin(username.trim(), password.trim());
    if (!admin) {
      return res.status(401).json({ success: false, error: 'Invalid Director/Admin credentials.' });
    }

    const token = 'token-' + Date.now() + '-' + Math.random().toString(36).substr(2);
    activeSessions.add(token);

    console.log(`🔐 Admin Logged In: ${admin.name} (${admin.username})`);
    res.json({
      success: true,
      message: 'Welcome Rahul Bhartiya! Login successful.',
      token,
      admin: {
        name: admin.name,
        role: admin.role,
        username: admin.username,
        phone: admin.phone
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/admin/logout', (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (token) activeSessions.delete(token);
  res.json({ success: true, message: 'Logged out successfully.' });
});

// Admin System Metrics & Performance
app.get('/api/admin/metrics', (req, res) => {
  try {
    const metrics = DB.getAdminMetrics();
    res.json({ success: true, metrics });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Admin Add New Staff Member
app.post('/api/admin/staff', (req, res) => {
  try {
    const { name, username, password, role, phone, specialization, assignedTerritory } = req.body;
    if (!name || !username) {
      return res.status(400).json({ success: false, error: 'Staff name and username are required.' });
    }
    const newStaff = DB.addEmployee({
      name,
      username,
      password: password || 'sathi2026',
      role: role || 'Admission Counselor',
      phone: phone || '9752754404',
      specialization: specialization || 'General Medical Admissions',
      assignedTerritory: assignedTerritory || 'Madhya Pradesh'
    });
    res.status(201).json({ success: true, message: `Staff member ${newStaff.name} created.`, staff: newStaff });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Admin Reassign Lead to Counselor
app.patch('/api/admin/leads/:id/reassign', (req, res) => {
  try {
    const { counselorName } = req.body;
    if (!counselorName) return res.status(400).json({ success: false, error: 'counselorName is required.' });
    const updated = DB.reassignLead(req.params.id, counselorName);
    if (!updated) return res.status(404).json({ success: false, error: 'Lead not found.' });
    res.json({ success: true, message: `Lead reassigned to ${counselorName}.`, lead: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ==========================================================================
// 2. 36 INDIAN DESTINATIONS API
// ==========================================================================

app.get('/api/destinations', (req, res) => {
  try {
    const { type, search } = req.query;
    let list = DB.getDestinations();

    if (type && type !== 'all') {
      list = list.filter(d => d.type.toLowerCase() === type.toLowerCase());
    }
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(d => 
        d.name.toLowerCase().includes(q) ||
        d.cities.some(c => c.toLowerCase().includes(q))
      );
    }

    res.json({ success: true, count: list.length, destinations: list });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/destinations/:id', (req, res) => {
  try {
    const dest = DB.getDestinationById(req.params.id);
    if (!dest) return res.status(404).json({ success: false, error: 'Destination not found' });
    
    // Attach state-specific colleges
    const allColleges = DB.getColleges();
    const stateColleges = allColleges.filter(c => c.state.toLowerCase() === dest.name.toLowerCase());

    res.json({ success: true, destination: dest, colleges: stateColleges });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ==========================================================================
// 3. DEDICATED MEDICAL COURSE BOXES API
// ==========================================================================

app.get('/api/medical-boxes', (req, res) => {
  res.json({ success: true, count: DB.getMedicalBoxes().length, medicalBoxes: DB.getMedicalBoxes() });
});

app.get('/api/medical-boxes/:id', (req, res) => {
  const box = DB.getMedicalBoxById(req.params.id);
  if (!box) return res.status(404).json({ success: false, error: 'Medical course not found' });
  res.json({ success: true, medicalBox: box });
});

// ==========================================================================
// 4. AI CAREER ASSISTANT API ("Ask Education Sathi AI")
// ==========================================================================

app.post('/api/ai-assistant', (req, res) => {
  try {
    const { qualification = '12th PCB', score = 520, budget = 'under15', preferredState = 'Madhya Pradesh', interestedCourse = 'MBBS' } = req.body;
    const s = parseInt(score, 10) || 500;

    let suggestedCourses = [];
    let probabilityNote = '';
    let counsellingSteps = [];

    if (s >= 620) {
      suggestedCourses = ['MBBS (AIQ Top Government)', 'MBBS (State Government Top Rank)', 'MD/MS Direct Pathway'];
      probabilityNote = `With a splendid score of ${s}/720, you have an exceptionally high chance of getting top Government Medical Colleges like AIIMS, GMC Bhopal, KGMU Lucknow, or SMS Jaipur with nominal government fees.`;
    } else if (s >= 500) {
      suggestedCourses = ['MBBS (State Quota Government Colleges)', 'BAMS (Top Govt Ayurveda Institutes)', 'BHMS (Govt)', 'MBBS (Top Tier Private)'];
      probabilityNote = `With a score of ${s}/720, you are well-positioned for State Government Medical College seats under ${preferredState} state quota, or leading private medical colleges with MP MMVY 100% scholarship reimbursement!`;
    } else if (s >= 350) {
      suggestedCourses = ['MBBS (Private & Deemed Universities)', 'BAMS (Ayurvedic Medicine)', 'BHMS', 'B.Sc Nursing', 'BPT Physiotherapy'];
      probabilityNote = `With a score of ${s}/720, you qualify for leading Private Medical Colleges (People's Bhopal, LNMC Bhopal, Sharda Noida), BAMS, or premier Deemed Universities.`;
    } else {
      suggestedCourses = ['BAMS / BHMS (Alternative Medicine)', 'B.Sc Nursing', 'B.Pharm (Pharmacy)', 'Allied Paramedical (BPT, BMLT, OTT)'];
      probabilityNote = `Based on your score, BAMS, BHMS, B.Pharm, and Allied Healthcare programs (BPT/OTT) offer high-growth clinical careers with immediate hospital employment.`;
    }

    counsellingSteps = [
      `1. Register for ${preferredState === 'Madhya Pradesh' ? 'MP DME Online Portal' : 'State / MCC Counselling Portal'} with verified domicile certificate.`,
      `2. Prepare choice filling order prioritizing dream Govt colleges followed by secure safe options.`,
      `3. Apply for fee-reimbursement schemes (MMVY, Post-Matric, NSP Central Sector) before reporting.`,
      `4. Connect with Director Rahul Bhartiya on WhatsApp (9752754404) for expert round-wise seat tracking.`
    ];

    res.json({
      success: true,
      analysis: {
        score: s,
        preferredState,
        interestedCourse,
        budget,
        probabilityNote,
        suggestedCourses,
        counsellingSteps,
        disclaimer: "Note: Cutoffs vary annually based on total test-takers, exam difficulty, and state seat reservation rules."
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ==========================================================================
// 5. LEADS & COUNSELLING CRM API
// ==========================================================================

app.post('/api/leads', (req, res) => {
  try {
    const { studentName, phone } = req.body;
    if (!studentName || !phone) {
      return res.status(400).json({ success: false, error: 'Student name and phone are required.' });
    }
    const newLead = DB.createLead(req.body);
    console.log(`🎯 New Student Lead: ${newLead.studentName} (${newLead.phone}) for ${newLead.targetCourse}`);
    res.status(201).json({ success: true, message: 'Inquiry saved successfully!', lead: newLead });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/leads', (req, res) => {
  try {
    const { status, course, search } = req.query;
    let leads = DB.getLeads();
    if (status && status !== 'all') leads = leads.filter(l => l.status.toLowerCase() === status.toLowerCase());
    if (course && course !== 'all') leads = leads.filter(l => l.targetCourse.toLowerCase().includes(course.toLowerCase()));
    if (search) {
      const q = search.toLowerCase();
      leads = leads.filter(l => l.studentName.toLowerCase().includes(q) || l.phone.includes(q) || l.domicileState.toLowerCase().includes(q));
    }
    res.json({ success: true, count: leads.length, leads });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.patch('/api/leads/:id', (req, res) => {
  try {
    const updated = DB.updateLead(req.params.id, req.body);
    if (!updated) return res.status(404).json({ success: false, error: 'Lead not found' });
    res.json({ success: true, message: 'Lead updated', lead: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.delete('/api/leads/:id', (req, res) => {
  try {
    const ok = DB.deleteLead(req.params.id);
    if (!ok) return res.status(404).json({ success: false, error: 'Lead not found' });
    res.json({ success: true, message: 'Lead deleted.' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ==========================================================================
// 6. COLLEGES, COURSES, SCHOLARSHIPS & STATS API
// ==========================================================================

app.get('/api/colleges', (req, res) => {
  res.json({ success: true, count: DB.getColleges().length, colleges: DB.getColleges() });
});

// Top 500 MP Colleges Search & Directory API
app.get('/api/colleges/mp-top-500', (req, res) => {
  try {
    const { search, stream, type, part, city } = req.query;
    let list = DB.getMpTop500Colleges();

    if (search) {
      const q = search.toLowerCase().trim();
      list = list.filter(c => 
        c.name.toLowerCase().includes(q) || 
        c.city.toLowerCase().includes(q) || 
        c.stream.toLowerCase().includes(q) ||
        String(c.rank) === q
      );
    }
    if (stream && stream !== 'all') {
      list = list.filter(c => c.stream.toLowerCase().includes(stream.toLowerCase()));
    }
    if (type && type !== 'all') {
      list = list.filter(c => c.type.toLowerCase().includes(type.toLowerCase()));
    }
    if (part && part !== 'all') {
      list = list.filter(c => c.part === parseInt(part, 10));
    }
    if (city && city !== 'all') {
      list = list.filter(c => c.city.toLowerCase().includes(city.toLowerCase()));
    }

    res.json({
      success: true,
      total: 500,
      count: list.length,
      colleges: list
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Top 200 Maharashtra Medical & Health Science Colleges API
app.get('/api/colleges/maharashtra-top-200', (req, res) => {
  try {
    const { search, course, category, type, city } = req.query;
    let list = DB.getMhTop200Colleges();

    if (search) {
      const q = search.toLowerCase().trim();
      list = list.filter(c => 
        c.name.toLowerCase().includes(q) || 
        c.city.toLowerCase().includes(q) || 
        c.course.toLowerCase().includes(q) ||
        (c.category && c.category.toLowerCase().includes(q)) ||
        String(c.rank) === q
      );
    }
    if (course && course !== 'all') {
      list = list.filter(c => c.course.toLowerCase().includes(course.toLowerCase()));
    }
    if (category && category !== 'all') {
      list = list.filter(c => c.category.toLowerCase().includes(category.toLowerCase()));
    }
    if (type && type !== 'all') {
      list = list.filter(c => c.type.toLowerCase().includes(type.toLowerCase()));
    }
    if (city && city !== 'all') {
      list = list.filter(c => c.city.toLowerCase().includes(city.toLowerCase()));
    }

    res.json({
      success: true,
      total: 200,
      count: list.length,
      colleges: list
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/courses', (req, res) => {
  res.json({ success: true, categories: DB.getCourses() });
});

app.get('/api/scholarships', (req, res) => {
  res.json({ success: true, scholarships: DB.getScholarships() });
});

app.get('/api/counselling', (req, res) => {
  res.json({ success: true, authorities: DB.getCounselling() });
});

// ==========================================================================
// 8. EMPLOYEE & COUNSELOR PORTAL APIS
// ==========================================================================

// Employee Login
app.post('/api/employee/login', (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ success: false, error: 'Employee username and password are required.' });
    }

    const employee = DB.validateEmployee(username.trim(), password.trim());
    if (!employee) {
      return res.status(401).json({ success: false, error: 'Invalid Employee ID or Password.' });
    }

    const token = 'emp-token-' + Date.now() + '-' + Math.random().toString(36).substr(2);
    activeSessions.add(token);

    console.log(`👨‍💼 Employee Logged In: ${employee.name} (${employee.role})`);
    res.json({
      success: true,
      message: `Welcome back, ${employee.name}!`,
      token,
      employee: {
        id: employee.id,
        empCode: employee.empCode,
        username: employee.username,
        name: employee.name,
        role: employee.role,
        phone: employee.phone,
        email: employee.email,
        avatar: employee.avatar,
        specialization: employee.specialization,
        assignedTerritory: employee.assignedTerritory
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/employee/logout', (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (token) activeSessions.delete(token);
  res.json({ success: true, message: 'Employee logged out successfully.' });
});

// Calling Schedule & Tasks
app.get('/api/employee/schedule', (req, res) => {
  try {
    const { username } = req.query;
    const schedule = DB.getCallingSchedule(username);
    res.json({ success: true, count: schedule.length, schedule });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/employee/schedule', (req, res) => {
  try {
    const newTask = DB.addCallingTask(req.body);
    res.status(201).json({ success: true, message: 'Calling task scheduled successfully.', task: newTask });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.patch('/api/employee/schedule/:id', (req, res) => {
  try {
    const updated = DB.updateCallingTask(req.params.id, req.body);
    if (!updated) return res.status(404).json({ success: false, error: 'Task not found' });
    res.json({ success: true, message: 'Calling task updated.', task: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Confirmed Admissions & Student Enrollment Tracker
app.get('/api/employee/admissions', (req, res) => {
  try {
    const list = DB.getAdmissions();
    res.json({ success: true, count: list.length, admissions: list });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/employee/admissions', (req, res) => {
  try {
    const newAdm = DB.addAdmission(req.body);
    res.status(201).json({ success: true, message: 'Student admission enrolled successfully.', admission: newAdm });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.patch('/api/employee/admissions/:id', (req, res) => {
  try {
    const updated = DB.updateAdmission(req.params.id, req.body);
    if (!updated) return res.status(404).json({ success: false, error: 'Admission record not found' });
    res.json({ success: true, message: 'Admission record updated.', admission: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Employee Staff Directory
app.get('/api/employee/staff', (req, res) => {
  try {
    const list = DB.getEmployees().map(e => ({
      id: e.id,
      empCode: e.empCode,
      name: e.name,
      role: e.role,
      phone: e.phone,
      email: e.email,
      specialization: e.specialization,
      assignedTerritory: e.assignedTerritory
    }));
    res.json({ success: true, staff: list });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.listen(PORT, () => {
  console.log('====================================================');
  console.log(`🎓 EDUCATION SATHI - BACKEND SERVER ACTIVE`);
  console.log(`🚀 API Base URL: http://localhost:${PORT}/api`);
  console.log(`🌐 Website URL:  http://localhost:${PORT}`);
  console.log(`📞 Director Hotline: 9752754404`);
  console.log('====================================================');
});
