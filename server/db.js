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
const EMPLOYEES_FILE = path.join(DATA_DIR, 'employees.json');
const CALLING_SCHEDULE_FILE = path.join(DATA_DIR, 'calling_schedule.json');
const ADMISSIONS_FILE = path.join(DATA_DIR, 'admissions.json');
const MP_500_FILE = path.join(DATA_DIR, 'mp_colleges_500.json');
const MH_200_FILE = path.join(DATA_DIR, 'maharashtra_colleges_200.json');
const UP_500_FILE = path.join(DATA_DIR, 'up_colleges_500.json');

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

  // 9. Employees Directory
  if (!fs.existsSync(EMPLOYEES_FILE) || readJson(EMPLOYEES_FILE).length === 0) {
    const defaultEmployees = [
      {
        id: 'emp-01',
        empCode: 'ES-0101',
        username: 'emp01',
        password: 'sathi2026',
        name: 'Pooja Verma',
        role: 'Senior Medical Counselor',
        phone: '9826112233',
        email: 'pooja.counselor@educationsathi.com',
        avatar: '👩‍💼',
        specialization: 'MBBS & MD/MS Admissions',
        assignedTerritory: 'Madhya Pradesh & Karnataka',
        activeLeadsCount: 14,
        callsTodayCount: 6,
        createdAt: new Date().toISOString()
      },
      {
        id: 'emp-02',
        empCode: 'ES-0102',
        username: 'emp02',
        password: 'sathi2026',
        name: 'Amit Sharma',
        role: 'Telecalling & AYUSH Specialist',
        phone: '9752445566',
        email: 'amit.telecall@educationsathi.com',
        avatar: '👨‍💼',
        specialization: 'BAMS, BHMS & BDS Quotas',
        assignedTerritory: 'Uttar Pradesh & Rajasthan',
        activeLeadsCount: 19,
        callsTodayCount: 9,
        createdAt: new Date().toISOString()
      },
      {
        id: 'admin-1',
        empCode: 'ES-DIR',
        username: 'admin',
        password: 'educationsathi2026',
        name: 'Rahul Bhartiya',
        role: 'Director & Apex Counselor',
        phone: '9752754404',
        email: 'hn247educationsathi@gmail.com',
        avatar: 'images/director_rahul_bhartiya.jpg',
        specialization: 'Pan-India Medical & MMVY Scheme',
        assignedTerritory: 'All 36 States & UTs',
        activeLeadsCount: 32,
        callsTodayCount: 12,
        createdAt: new Date().toISOString()
      }
    ];
    writeJson(EMPLOYEES_FILE, defaultEmployees);
    console.log('✅ Seeded Employee & Counselor Accounts (Pooja Verma, Amit Sharma, Rahul Bhartiya).');
  }

  // 10. Calling Schedule & Follow-up Tasks
  if (!fs.existsSync(CALLING_SCHEDULE_FILE) || readJson(CALLING_SCHEDULE_FILE).length === 0) {
    const todayStr = new Date().toISOString().split('T')[0];
    const defaultSchedule = [
      {
        id: 'call-101',
        studentName: 'Ananya Sharma',
        phone: '9826012345',
        targetCourse: 'MBBS (MP State Quota)',
        neetScore: 565,
        scheduledDate: todayStr,
        scheduledTime: '10:30 AM',
        priority: 'High',
        callType: 'Round 1 Choice Filling Review',
        counselorName: 'Pooja Verma',
        counselorUsername: 'emp01',
        lastOutcome: 'Parent interested in GMC Bhopal or MGM Indore. Need state merit list check.',
        status: 'Scheduled',
        createdAt: new Date().toISOString()
      },
      {
        id: 'call-102',
        studentName: 'Rohan Gupta',
        phone: '9752109876',
        targetCourse: 'MP MMVY Scholarship (100% Waiver)',
        neetScore: 512,
        scheduledDate: todayStr,
        scheduledTime: '12:00 PM',
        priority: 'Urgent',
        callType: 'Scholarship Document Verification',
        counselorName: 'Pooja Verma',
        counselorUsername: 'emp01',
        lastOutcome: 'Annual income certificate under 6 Lakhs verified. Need Domicile certificate copy.',
        status: 'Scheduled',
        createdAt: new Date().toISOString()
      },
      {
        id: 'call-103',
        studentName: 'Priya Patel',
        phone: '9827099881',
        targetCourse: 'Private MBBS (Karnataka / UP)',
        neetScore: 438,
        scheduledDate: todayStr,
        scheduledTime: '02:30 PM',
        priority: 'Normal',
        callType: 'Fee Structure & Budget Consultation',
        counselorName: 'Amit Sharma',
        counselorUsername: 'emp02',
        lastOutcome: 'Budget 12 Lakhs/yr. Recommended KMC Manipal & UP Private Medical Colleges.',
        status: 'Scheduled',
        createdAt: new Date().toISOString()
      },
      {
        id: 'call-104',
        studentName: 'Siddharth Verma',
        phone: '9752334411',
        targetCourse: 'BAMS Ayurveda Govt College',
        neetScore: 475,
        scheduledDate: todayStr,
        scheduledTime: '04:00 PM',
        priority: 'Normal',
        callType: 'State Merit Rank Probability',
        counselorName: 'Amit Sharma',
        counselorUsername: 'emp02',
        lastOutcome: 'High probability for Pt. Khushilal Bhopal. Requested hostel fees detail.',
        status: 'Scheduled',
        createdAt: new Date().toISOString()
      },
      {
        id: 'call-105',
        studentName: 'Dr. Vivek Rathore',
        phone: '9425011223',
        targetCourse: 'MD/MS Medical PG (General Medicine)',
        neetScore: 610,
        scheduledDate: todayStr,
        scheduledTime: '05:30 PM',
        priority: 'High',
        callType: 'MCC AIQ 50% Round 1 Strategy',
        counselorName: 'Rahul Bhartiya',
        counselorUsername: 'admin',
        lastOutcome: 'Targeting DNB Medicine / MD Pediatrics in Top Deemed or Govt Institutes.',
        status: 'Scheduled',
        createdAt: new Date().toISOString()
      }
    ];
    writeJson(CALLING_SCHEDULE_FILE, defaultSchedule);
    console.log('✅ Seeded Counselor Calling Schedule & Tasks Queue.');
  }

  // 11. Confirmed Student Admissions & Enrollment Tracker
  if (!fs.existsSync(ADMISSIONS_FILE) || readJson(ADMISSIONS_FILE).length === 0) {
    const defaultAdmissions = [
      {
        id: 'adm-2026-01',
        studentName: 'Aditi Rao',
        phone: '9826198765',
        allottedCollege: 'Gandhi Medical College (GMC), Bhopal',
        course: 'MBBS (Bachelor of Medicine)',
        admissionQuota: 'MP State 85% Quota',
        neetScore: 624,
        category: 'OBC',
        annualFee: '₹1,00,000 / yr',
        scholarshipClaimed: 'MP MMVY (100% Tuition Fee Waiver Granted)',
        feeReceiptNo: 'REC-GMC-2026-881',
        admissionStatus: 'Confirmed & Enrolled',
        documentStatus: 'Verified & Submitted',
        documents: ['10th Marksheet', '12th PCB Marksheet', 'NEET Scorecard', 'MP Domicile', 'Allotment Letter'],
        assignedCounselor: 'Rahul Bhartiya',
        enrollmentDate: '2026-08-28'
      },
      {
        id: 'adm-2026-02',
        studentName: 'Vikram Solanki',
        phone: '9826334455',
        allottedCollege: 'Index Medical College, Indore',
        course: 'MBBS (Bachelor of Medicine)',
        admissionQuota: 'Private State Merit Quota',
        neetScore: 495,
        category: 'General',
        annualFee: '₹12,50,000 / yr',
        scholarshipClaimed: 'None (Self-Financed)',
        feeReceiptNo: 'REC-IMC-2026-402',
        admissionStatus: 'Confirmed & Enrolled',
        documentStatus: 'Originals Deposited',
        documents: ['10th Marksheet', '12th PCB Marksheet', 'NEET Scorecard', 'Aadhaar Card', 'Medical Fitness'],
        assignedCounselor: 'Pooja Verma',
        enrollmentDate: '2026-08-25'
      },
      {
        id: 'adm-2026-03',
        studentName: 'Meera Nair',
        phone: '9752889900',
        allottedCollege: 'Pt. Khushilal Sharma Govt Ayurveda College, Bhopal',
        course: 'BAMS (Ayurvedacharya)',
        admissionQuota: 'MP State Quota',
        neetScore: 508,
        category: 'General',
        annualFee: '₹40,000 / yr',
        scholarshipClaimed: 'State Post-Matric Merit',
        feeReceiptNo: 'REC-PKAC-2026-193',
        admissionStatus: 'Confirmed & Enrolled',
        documentStatus: 'Verified & Submitted',
        documents: ['10th Marksheet', '12th Marksheet', 'NEET Scorecard', 'Allotment Slip'],
        assignedCounselor: 'Amit Sharma',
        enrollmentDate: '2026-08-22'
      }
    ];
    writeJson(ADMISSIONS_FILE, defaultAdmissions);
    console.log('✅ Seeded Confirmed Student Admissions Tracker.');
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
      assignedCounselor: leadData.assignedCounselor || 'Pooja Verma',
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

  // Admins & Employees Authentication
  getAdmins: () => readJson(ADMINS_FILE),
  getEmployees: () => readJson(EMPLOYEES_FILE),
  validateAdmin: (username, password) => {
    const admins = readJson(ADMINS_FILE);
    return admins.find(a => a.username === username && a.password === password) || null;
  },
  validateEmployee: (username, password) => {
    const employees = readJson(EMPLOYEES_FILE);
    const emp = employees.find(e => e.username === username && e.password === password);
    if (emp) return emp;
    // Allow admin to also login as employee
    const admin = readJson(ADMINS_FILE).find(a => a.username === username && a.password === password);
    if (admin) {
      return {
        id: admin.id,
        empCode: 'ES-DIR',
        username: admin.username,
        name: admin.name,
        role: admin.role,
        phone: admin.phone,
        email: admin.email,
        avatar: 'images/director_rahul_bhartiya.jpg',
        specialization: 'Director & Senior Counselor',
        assignedTerritory: 'All 36 States & UTs'
      };
    }
    return null;
  },

  // Calling Schedule
  getCallingSchedule: (username = null) => {
    const tasks = readJson(CALLING_SCHEDULE_FILE);
    if (username && username !== 'admin') {
      return tasks.filter(t => t.counselorUsername === username || !t.counselorUsername);
    }
    return tasks;
  },
  addCallingTask: (taskData) => {
    const tasks = readJson(CALLING_SCHEDULE_FILE);
    const newTask = {
      id: 'call-' + Date.now(),
      studentName: taskData.studentName || 'Student Callback',
      phone: taskData.phone || '',
      targetCourse: taskData.targetCourse || 'Medical Admission',
      neetScore: parseInt(taskData.neetScore, 10) || 0,
      scheduledDate: taskData.scheduledDate || new Date().toISOString().split('T')[0],
      scheduledTime: taskData.scheduledTime || '11:00 AM',
      priority: taskData.priority || 'Normal',
      callType: taskData.callType || 'General Follow-up',
      counselorName: taskData.counselorName || 'Assigned Counselor',
      counselorUsername: taskData.counselorUsername || 'emp01',
      lastOutcome: taskData.lastOutcome || 'Scheduled for follow-up.',
      status: 'Scheduled',
      createdAt: new Date().toISOString()
    };
    tasks.unshift(newTask);
    writeJson(CALLING_SCHEDULE_FILE, tasks);
    return newTask;
  },
  updateCallingTask: (id, updates) => {
    const tasks = readJson(CALLING_SCHEDULE_FILE);
    const idx = tasks.findIndex(t => t.id === id);
    if (idx === -1) return null;
    tasks[idx] = { ...tasks[idx], ...updates, updatedAt: new Date().toISOString() };
    writeJson(CALLING_SCHEDULE_FILE, tasks);
    return tasks[idx];
  },

  // Confirmed Admissions
  getAdmissions: () => readJson(ADMISSIONS_FILE),
  addAdmission: (admissionData) => {
    const list = readJson(ADMISSIONS_FILE);
    const newAdm = {
      id: 'adm-' + Date.now(),
      studentName: admissionData.studentName || '',
      phone: admissionData.phone || '',
      allottedCollege: admissionData.allottedCollege || '',
      course: admissionData.course || 'MBBS',
      admissionQuota: admissionData.admissionQuota || 'State Quota',
      neetScore: parseInt(admissionData.neetScore, 10) || 0,
      category: admissionData.category || 'General',
      annualFee: admissionData.annualFee || 'State Regulatory Fee',
      scholarshipClaimed: admissionData.scholarshipClaimed || 'None',
      feeReceiptNo: admissionData.feeReceiptNo || ('REC-' + Math.floor(1000 + Math.random() * 9000)),
      admissionStatus: 'Confirmed & Enrolled',
      documentStatus: admissionData.documentStatus || 'Verified & Submitted',
      documents: admissionData.documents || ['10th Marksheet', '12th Marksheet', 'NEET Scorecard'],
      assignedCounselor: admissionData.assignedCounselor || 'Rahul Bhartiya',
      enrollmentDate: new Date().toISOString().split('T')[0]
    };
    list.unshift(newAdm);
    writeJson(ADMISSIONS_FILE, list);
    return newAdm;
  },
  updateAdmission: (id, updates) => {
    const list = readJson(ADMISSIONS_FILE);
    const idx = list.findIndex(a => a.id === id);
    if (idx === -1) return null;
    list[idx] = { ...list[idx], ...updates, updatedAt: new Date().toISOString() };
    writeJson(ADMISSIONS_FILE, list);
    return list[idx];
  },

  // Staff Management (Admin Only)
  addEmployee: (empData) => {
    const employees = readJson(EMPLOYEES_FILE);
    const newEmp = {
      id: 'emp-' + Date.now(),
      empCode: 'ES-0' + (employees.length + 101),
      username: empData.username.trim().toLowerCase(),
      password: empData.password || 'sathi2026',
      name: empData.name || 'New Counselor',
      role: empData.role || 'Admission Counselor',
      phone: empData.phone || '9752754404',
      email: empData.email || '',
      avatar: empData.avatar || '👩‍💼',
      specialization: empData.specialization || 'General Medical Admissions',
      assignedTerritory: empData.assignedTerritory || 'Madhya Pradesh',
      activeLeadsCount: 0,
      callsTodayCount: 0,
      createdAt: new Date().toISOString()
    };
    employees.push(newEmp);
    writeJson(EMPLOYEES_FILE, employees);
    return newEmp;
  },
  reassignLead: (leadId, newCounselor) => {
    const leads = readJson(LEADS_FILE);
    const idx = leads.findIndex(l => l.id === leadId);
    if (idx === -1) return null;
    leads[idx].assignedCounselor = newCounselor;
    leads[idx].updatedAt = new Date().toISOString();
    writeJson(LEADS_FILE, leads);
    return leads[idx];
  },
  getAdminMetrics: () => {
    const leads = readJson(LEADS_FILE);
    const admissions = readJson(ADMISSIONS_FILE);
    const schedule = readJson(CALLING_SCHEDULE_FILE);
    const employees = readJson(EMPLOYEES_FILE);

    // Calculate staff stats
    const staffStats = employees.map(e => {
      const assignedLeads = leads.filter(l => l.assignedCounselor === e.name || l.assignedCounselor === e.username).length;
      const completedCalls = schedule.filter(s => (s.counselorName === e.name || s.counselorUsername === e.username) && s.status === 'Completed').length;
      const totalCalls = schedule.filter(s => s.counselorName === e.name || s.counselorUsername === e.username).length;
      const enrolled = admissions.filter(a => a.assignedCounselor === e.name).length;
      return {
        ...e,
        assignedLeads,
        totalCalls,
        completedCalls,
        enrolled
      };
    });

    return {
      totalLeads: leads.length,
      newLeads: leads.filter(l => l.status === 'New').length,
      inProgressLeads: leads.filter(l => l.status === 'In Progress' || l.status === 'Contacted').length,
      totalAdmissions: admissions.length,
      totalCallsScheduled: schedule.length,
      staffPerformance: staffStats
    };
  },

  // Top 500 Madhya Pradesh Colleges Master Dataset
  getMpTop500Colleges: () => readJson(MP_500_FILE, []),

  // Top 200 Maharashtra Medical & Health Science Colleges Master Dataset
  getMhTop200Colleges: () => readJson(MH_200_FILE, []),

  // Top 500 Uttar Pradesh Medical & Healthcare Colleges Master Dataset
  getUpTop500Colleges: () => readJson(UP_500_FILE, [])
};

initAndSeed();

module.exports = DB;
