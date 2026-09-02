/**
 * EDUCATION SATHI - Master Database Engine
 * Persistent JSON Database supporting:
 * - 36 Destinations (28 States + 8 UTs)
 * - 5 Dedicated Medical Course Boxes (MBBS, BAMS, BHMS, BUMS, MD/MS)
 * - 25+ Career Categories (500+ Courses)
 * - Medical Colleges & Top Universities
 * - Scholarships & Counselling Authorities
 * - Student Profiles & Enquiries CRM
 * - Admin Authentication & Sessions
 */

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, 'data');
const LEADS_FILE = path.join(DATA_DIR, 'leads.json');
const COLLEGES_FILE = path.join(DATA_DIR, 'colleges.json');
const COURSES_FILE = path.join(DATA_DIR, 'courses.json');
const SCHOLARSHIPS_FILE = path.join(DATA_DIR, 'scholarships.json');
const COUNSELLING_FILE = path.join(DATA_DIR, 'counselling.json');
const DESTINATIONS_FILE = path.join(DATA_DIR, 'destinations.json');
const MEDICAL_BOXES_FILE = path.join(DATA_DIR, 'medical_boxes.json');
const ADMINS_FILE = path.join(DATA_DIR, 'admins.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

function readJson(filePath, defaultValue = []) {
  try {
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify(defaultValue, null, 2), 'utf-8');
      return defaultValue;
    }
    const raw = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(raw);
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error.message);
    return defaultValue;
  }
}

function writeJson(filePath, data) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error(`Error writing to ${filePath}:`, error.message);
    return false;
  }
}

function initAndSeed() {
  const masterDataPath = path.join(__dirname, '..', 'js', 'data.js');
  let masterData = null;

  try {
    masterData = require(masterDataPath);
  } catch (err) {
    console.warn('Could not load ../js/data.js for initial seed.');
  }

  // 1. Destinations (28 States + 8 UTs)
  if (masterData && masterData.destinations) {
    writeJson(DESTINATIONS_FILE, masterData.destinations);
    console.log(`✅ Seeded ${masterData.destinations.length} Indian States & Union Territories into Database.`);
  }

  // 2. Medical Boxes (MBBS, BAMS, BHMS, BUMS, MD/MS)
  if (masterData && masterData.medicalBoxes) {
    writeJson(MEDICAL_BOXES_FILE, masterData.medicalBoxes);
    console.log(`✅ Seeded ${masterData.medicalBoxes.length} Dedicated Medical Course Boxes.`);
  }

  // 3. Colleges
  if (masterData && masterData.colleges) {
    writeJson(COLLEGES_FILE, masterData.colleges);
    console.log(`✅ Seeded ${masterData.colleges.length} Top Medical Colleges & Universities.`);
  }

  // 4. Courses
  if (masterData && masterData.categories) {
    writeJson(COURSES_FILE, masterData.categories);
  }

  // 5. Scholarships
  if (masterData && masterData.scholarships) {
    writeJson(SCHOLARSHIPS_FILE, masterData.scholarships);
  }

  // 6. Counselling
  if (masterData && masterData.counsellingAuthorities) {
    writeJson(COUNSELLING_FILE, masterData.counsellingAuthorities);
  }

  // 7. Default Admin Credentials for Director Rahul Bhartiya
  if (!fs.existsSync(ADMINS_FILE) || readJson(ADMINS_FILE).length === 0) {
    const defaultAdmins = [
      {
        id: 'admin-1',
        username: 'admin',
        password: 'educationsathi2026',
        name: 'Rahul Bhartiya',
        role: 'Director & Senior Counselor',
        phone: '9752754404',
        email: 'hn247educationsthi@gmail.com',
        createdAt: new Date().toISOString()
      }
    ];
    writeJson(ADMINS_FILE, defaultAdmins);
    console.log('✅ Created Director Admin Account (Username: admin)');
  }

  // 8. Sample Leads if needed
  if (!fs.existsSync(LEADS_FILE) || readJson(LEADS_FILE).length === 0) {
    const sampleLeads = [
      {
        id: 'lead-1001',
        studentName: 'Ananya Sharma',
        phone: '9826012345',
        whatsapp: '9826012345',
        targetCourse: 'MBBS Medical Admission',
        domicileState: 'Madhya Pradesh',
        neetScore: 565,
        budget: 'Govt / Semi-Govt Fee',
        query: 'Looking for GMC Bhopal or MGM Indore through MP DME state counselling.',
        status: 'In Progress',
        assignedCounselor: 'Rahul Bhartiya',
        source: 'Website Hero Form',
        createdAt: new Date(Date.now() - 3600000 * 4).toISOString()
      },
      {
        id: 'lead-1002',
        studentName: 'Rohan Gupta',
        phone: '9752109876',
        whatsapp: '9752109876',
        targetCourse: 'Scholarship Application (MMVY)',
        domicileState: 'Madhya Pradesh',
        neetScore: 0,
        budget: 'Scholarship / Free',
        query: 'Need guidance for 100% fee waiver under Mukhyamantri Medhavi Vidhyarthi Yojana.',
        status: 'New',
        assignedCounselor: 'Rahul Bhartiya',
        source: 'Scholarship Portal',
        createdAt: new Date(Date.now() - 3600000 * 1).toISOString()
      }
    ];
    writeJson(LEADS_FILE, sampleLeads);
  }
}

const DB = {
  // Destinations
  getDestinations: () => readJson(DESTINATIONS_FILE),
  getDestinationById: (id) => readJson(DESTINATIONS_FILE).find(d => d.id === id || d.code.toLowerCase() === id.toLowerCase()),

  // Medical Boxes
  getMedicalBoxes: () => readJson(MEDICAL_BOXES_FILE),
  getMedicalBoxById: (id) => readJson(MEDICAL_BOXES_FILE).find(m => m.id === id),

  // Leads
  getLeads: () => readJson(LEADS_FILE),
  createLead: (leadData) => {
    const leads = readJson(LEADS_FILE);
    const newLead = {
      id: 'lead-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
      studentName: leadData.studentName || 'Anonymous Student',
      phone: leadData.phone || '',
      whatsapp: leadData.whatsapp || leadData.phone || '',
      targetCourse: leadData.targetCourse || 'General Counselling',
      domicileState: leadData.domicileState || 'Madhya Pradesh',
      neetScore: parseInt(leadData.neetScore, 10) || 0,
      budget: leadData.budget || 'Any Budget',
      query: leadData.query || '',
      source: leadData.source || 'Website Form',
      status: 'New',
      assignedCounselor: 'Rahul Bhartiya',
      createdAt: new Date().toISOString()
    };
    leads.unshift(newLead);
    writeJson(LEADS_FILE, leads);
    return newLead;
  },
  updateLead: (id, updates) => {
    const leads = readJson(LEADS_FILE);
    const index = leads.findIndex(l => l.id === id);
    if (index === -1) return null;
    leads[index] = { ...leads[index], ...updates, updatedAt: new Date().toISOString() };
    writeJson(LEADS_FILE, leads);
    return leads[index];
  },
  deleteLead: (id) => {
    let leads = readJson(LEADS_FILE);
    const beforeLen = leads.length;
    leads = leads.filter(l => l.id !== id);
    if (leads.length !== beforeLen) {
      writeJson(LEADS_FILE, leads);
      return true;
    }
    return false;
  },

  // Colleges
  getColleges: () => readJson(COLLEGES_FILE),
  addCollege: (colData) => {
    const colleges = readJson(COLLEGES_FILE);
    const newCol = { id: colData.id || ('col-' + Date.now()), ...colData };
    colleges.push(newCol);
    writeJson(COLLEGES_FILE, colleges);
    return newCol;
  },

  // Courses
  getCourses: () => readJson(COURSES_FILE),

  // Scholarships
  getScholarships: () => readJson(SCHOLARSHIPS_FILE),

  // Counselling
  getCounselling: () => readJson(COUNSELLING_FILE),

  // Admins
  getAdmins: () => readJson(ADMINS_FILE),
  validateAdmin: (username, password) => {
    const admins = readJson(ADMINS_FILE);
    return admins.find(a => a.username === username && a.password === password) || null;
  }
};

initAndSeed();

module.exports = DB;
