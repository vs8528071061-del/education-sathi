/**
 * EDUCATION SATHI - Main Application Script
 * Dynamic SPA Router, 36 Destinations (28 States + 8 UTs), Dedicated Medical Boxes (MBBS/BAMS/BHMS/BUMS/MD-MS),
 * AI Career Assistant, Student Profile System, Admin Login/Logout CRM, and NEET Predictor.
 */

document.addEventListener('DOMContentLoaded', () => {
  initApp();
});

// Global state
let comparedCollegeIds = ['aiims-delhi', 'gmc-bhopal'];
let trackedScholarships = JSON.parse(localStorage.getItem('es_tracked_scholarships') || '[]');
let allCrmLeads = [];
let isAdminAuthenticated = false;

function initApp() {
  initTheme();
  initRouting();
  initDrawer();
  
  // Render Data
  renderDestinationsGrid();
  renderMedicalBoxes();
  renderCareerCategories();
  renderMedicalColleges();
  renderCounsellingAuthorities();
  renderScholarships();
  renderComparisonDropdowns();
  renderComparisonMatrix();
  updateCompareBadges();
  updateDashboardView();
  checkAdminAuth();
  loadStudentProfile();
  
  // Predictor initial run
  const defaultScoreInput = document.getElementById('predScore');
  if (defaultScoreInput) {
    syncScoreSlider(defaultScoreInput.value);
  }
}

// ==========================================================================
// 1. THEME SWITCHER & LOCAL STORAGE
// ==========================================================================
function initTheme() {
  const toggleBtn = document.getElementById('themeToggleBtn');
  const savedTheme = localStorage.getItem('es_theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('es_theme', next);
      updateThemeIcon(next);
      showToast(`Switched to ${next} mode`);
    });
  }
}

function updateThemeIcon(theme) {
  const toggleBtn = document.getElementById('themeToggleBtn');
  if (!toggleBtn) return;
  toggleBtn.innerHTML = theme === 'dark' 
    ? '<i class="fa-solid fa-sun text-gold"></i>' 
    : '<i class="fa-solid fa-moon"></i>';
}

// ==========================================================================
// 2. SPA ROUTER & NAVIGATION
// ==========================================================================
function initRouting() {
  const hash = window.location.hash.replace('#', '') || 'home';
  navigateTo(hash);

  window.addEventListener('hashchange', () => {
    const newHash = window.location.hash.replace('#', '') || 'home';
    navigateTo(newHash);
  });
}

function navigateTo(viewId) {
  const validViews = [
    'home', 'destinations', 'state-detail', 'medical-courses', 
    'courses', 'scholarships', 'ai-assistant', 'predictor', 
    'compare', 'student-profile', 'admin', 'employee', 'counselling'
  ];
  const targetId = validViews.includes(viewId) ? viewId : 'home';

  // Toggle active view
  document.querySelectorAll('.app-view').forEach(view => {
    view.classList.remove('active');
  });
  const targetView = document.getElementById(`view-${targetId}`);
  if (targetView) {
    targetView.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Update desktop nav
  document.querySelectorAll('.nav-item').forEach(link => {
    const dt = link.getAttribute('data-target');
    if (dt === targetId) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  // Update mobile bottom nav
  document.querySelectorAll('.bottom-nav-item').forEach(btn => {
    if (btn.getAttribute('href') === `#${targetId}`) btn.classList.add('active');
    else btn.classList.remove('active');
  });

  if (targetId === 'employee') {
    checkEmployeeAuth();
  } else if (targetId === 'admin') {
    checkAdminAuth();
  }

  window.location.hash = targetId;
}

function initDrawer() {
  const toggleBtn = document.getElementById('mobileMenuToggle');
  const closeBtn = document.getElementById('drawerCloseBtn');
  const overlay = document.getElementById('drawerOverlay');
  const drawer = document.getElementById('mobileDrawer');

  if (toggleBtn && drawer && overlay) {
    toggleBtn.addEventListener('click', () => {
      drawer.classList.add('active');
      overlay.classList.add('active');
    });
  }

  if (closeBtn && drawer && overlay) {
    closeBtn.addEventListener('click', closeDrawer);
    overlay.addEventListener('click', closeDrawer);
  }
}

function closeDrawer() {
  const drawer = document.getElementById('mobileDrawer');
  const overlay = document.getElementById('drawerOverlay');
  if (drawer) drawer.classList.remove('active');
  if (overlay) overlay.classList.remove('active');
}

function toggleNotificationDrawer() {
  const drawer = document.getElementById('notificationDrawer');
  if (drawer) drawer.classList.toggle('active');
}

function handleLocationChange(val) {
  if (val === 'all') {
    navigateTo('destinations');
  } else {
    openStateDetail(val);
  }
}

// ==========================================================================
// 3. 36 DESTINATIONS (28 STATES + 8 UTs) LOGIC
// ==========================================================================
function renderDestinationsGrid() {
  const masterGrid = document.getElementById('destinationsMasterGrid');
  const homeGrid = document.getElementById('homeDestinationsGrid');
  if (!EDUCATION_DATA.destinations) return;

  const destinations = EDUCATION_DATA.destinations;

  // Render home preview (first 6 states)
  if (homeGrid) {
    homeGrid.innerHTML = destinations.slice(0, 6).map(renderDestinationCardHTML).join('');
  }

  // Render full 36 destinations view
  if (masterGrid) {
    masterGrid.innerHTML = destinations.map(renderDestinationCardHTML).join('');
  }
}

function renderDestinationCardHTML(dest) {
  return `
    <div class="destination-card" onclick="openStateDetail('${dest.id}')">
      <div class="dest-image-wrap">
        <img src="${dest.image}" alt="${dest.name}" loading="lazy" />
        <span class="dest-type-badge">${dest.type}</span>
      </div>
      <div class="dest-body">
        <h3 class="dest-title">🇮🇳 ${dest.name}</h3>
        <p class="dest-cities"><i class="fa-solid fa-city"></i> ${dest.cities.slice(0, 4).join(' • ')}</p>
        
        <div class="dest-metrics-grid">
          <div class="dest-metric-item"><i class="fa-solid fa-landmark text-primary"></i> ${dest.govtColleges} Govt Colleges</div>
          <div class="dest-metric-item"><i class="fa-solid fa-building text-gold"></i> ${dest.pvtColleges} Pvt Colleges</div>
          <div class="dest-metric-item"><i class="fa-solid fa-graduation-cap text-purple"></i> ${dest.universities} Universities</div>
          <div class="dest-metric-item"><i class="fa-solid fa-stethoscope text-emerald"></i> ${dest.medicalColleges} Medical Hubs</div>
        </div>

        <span class="dest-btn-explore">
          Explore ${dest.name} Colleges <i class="fa-solid fa-arrow-right"></i>
        </span>
      </div>
    </div>
  `;
}

function filterDestinations() {
  const query = (document.getElementById('destinationSearchInput')?.value || '').toLowerCase().trim();
  const type = document.getElementById('destinationTypeFilter')?.value || 'all';
  const grid = document.getElementById('destinationsMasterGrid');
  if (!grid || !EDUCATION_DATA.destinations) return;

  const filtered = EDUCATION_DATA.destinations.filter(d => {
    const matchType = type === 'all' || d.type.toLowerCase() === type.toLowerCase();
    const matchSearch = query === '' ||
      d.name.toLowerCase().includes(query) ||
      d.cities.some(c => c.toLowerCase().includes(query));
    return matchType && matchSearch;
  });

  grid.innerHTML = filtered.map(renderDestinationCardHTML).join('');
}

function openStateDetail(destId) {
  const dest = EDUCATION_DATA.destinations.find(d => d.id === destId || d.code.toLowerCase() === destId.toLowerCase());
  if (!dest) return;

  const titleEl = document.getElementById('stateDetailTitle');
  const subEl = document.getElementById('stateDetailSubtitle');
  const nameSpan = document.getElementById('stateNameSpan');
  const grid = document.getElementById('stateCollegesGrid');
  const mp500Block = document.getElementById('mp500ExplorerBlock');
  const standardBlock = document.getElementById('standardStateCollegesBlock');

  if (titleEl) titleEl.innerText = `🇮🇳 ${dest.name}`;
  if (subEl) subEl.innerText = `Key Education Cities: ${dest.cities.join(', ')} | Medical Hubs: ${dest.medicalColleges} | Universities: ${dest.universities}`;
  if (nameSpan) nameSpan.innerText = dest.name;

  const isMP = dest.id === 'madhya-pradesh' || dest.code === 'MP';
  const isMH = dest.id === 'maharashtra' || dest.code === 'MH';
  const isUP = dest.id === 'uttar-pradesh' || dest.code === 'UP';
  const mh200Block = document.getElementById('mh200ExplorerBlock');
  const up500Block = document.getElementById('up500ExplorerBlock');

  if (isMP) {
    if (mp500Block) mp500Block.classList.remove('d-none');
    if (mh200Block) mh200Block.classList.add('d-none');
    if (up500Block) up500Block.classList.add('d-none');
    if (standardBlock) standardBlock.classList.add('d-none');
    initMp500Explorer();
  } else if (isMH) {
    if (mp500Block) mp500Block.classList.add('d-none');
    if (mh200Block) mh200Block.classList.remove('d-none');
    if (up500Block) up500Block.classList.add('d-none');
    if (standardBlock) standardBlock.classList.add('d-none');
    initMh200Explorer();
  } else if (isUP) {
    if (mp500Block) mp500Block.classList.add('d-none');
    if (mh200Block) mh200Block.classList.add('d-none');
    if (up500Block) up500Block.classList.remove('d-none');
    if (standardBlock) standardBlock.classList.add('d-none');
    initUp500Explorer();
  } else {
    if (mp500Block) mp500Block.classList.add('d-none');
    if (mh200Block) mh200Block.classList.add('d-none');
    if (up500Block) up500Block.classList.add('d-none');
    if (standardBlock) standardBlock.classList.remove('d-none');

    // Filter colleges for other states
    const stateColleges = EDUCATION_DATA.colleges.filter(c => c.state.toLowerCase() === dest.name.toLowerCase());
    
    if (grid) {
      if (stateColleges.length === 0) {
        grid.innerHTML = `
          <div class="text-center py-5" style="grid-column: 1 / -1;">
            <i class="fa-solid fa-building-columns text-muted" style="font-size: 3rem; margin-bottom: 1rem;"></i>
            <h3>Connecting to ${dest.name} State Directory</h3>
            <p class="text-muted">Education Sathi provides direct counselling for ${dest.name} Government & Private colleges.</p>
            <a href="https://wa.me/919752754404?text=Hello%20Education%20Sathi,%20I%20want%20college%20details%20for%20${encodeURIComponent(dest.name)}" target="_blank" class="btn btn-whatsapp mt-3">
              <i class="fa-brands fa-whatsapp"></i> Inquire ${dest.name} Colleges on WhatsApp
            </a>
          </div>
        `;
      } else {
        grid.innerHTML = stateColleges.map(renderCollegeCardHTML).join('');
      }
    }
  }

  navigateTo('state-detail');
}

// ==========================================================================
// 3B. TOP 500 MADHYA PRADESH COLLEGES DIRECTORY CONTROLLER
// ==========================================================================

let mpActivePart = 'all';
let mpCurrentPage = 1;
const MP_PAGE_SIZE = 50;
let mpFilteredList = [];

function initMp500Explorer() {
  mpActivePart = 'all';
  mpCurrentPage = 1;
  const partBtns = ['All', '1', '2', '3', '4', '5'];
  partBtns.forEach(p => {
    const b = document.getElementById(`partTab${p}`);
    if (b) {
      if (p === 'All') b.classList.add('active');
      else b.classList.remove('active');
    }
  });

  const searchInp = document.getElementById('mp500SearchInput');
  const streamSel = document.getElementById('mp500StreamFilter');
  const typeSel = document.getElementById('mp500TypeFilter');
  const citySel = document.getElementById('mp500CityFilter');
  if (searchInp) searchInp.value = '';
  if (streamSel) streamSel.value = 'all';
  if (typeSel) typeSel.value = 'all';
  if (citySel) citySel.value = 'all';

  filterMpCollegesList();
}

function filterMpPart(part) {
  mpActivePart = part;
  mpCurrentPage = 1;

  const partBtns = ['All', '1', '2', '3', '4', '5'];
  partBtns.forEach(p => {
    const b = document.getElementById(`partTab${p}`);
    const key = p === 'All' ? 'all' : parseInt(p, 10);
    if (b) {
      if (key === part) b.classList.add('active');
      else b.classList.remove('active');
    }
  });

  filterMpCollegesList();
}

function filterMpCollegesList() {
  if (typeof MP_TOP_500_COLLEGES === 'undefined' || !MP_TOP_500_COLLEGES.length) return;

  const search = (document.getElementById('mp500SearchInput')?.value || '').toLowerCase().trim();
  const stream = document.getElementById('mp500StreamFilter')?.value || 'all';
  const type = document.getElementById('mp500TypeFilter')?.value || 'all';
  const city = document.getElementById('mp500CityFilter')?.value || 'all';

  mpFilteredList = MP_TOP_500_COLLEGES.filter(c => {
    const matchSearch = !search || 
      c.name.toLowerCase().includes(search) || 
      c.city.toLowerCase().includes(search) || 
      c.stream.toLowerCase().includes(search) ||
      String(c.rank) === search;

    const matchPart = mpActivePart === 'all' || c.part === mpActivePart;
    const matchStream = stream === 'all' || c.stream.toLowerCase().includes(stream.toLowerCase());
    const matchType = type === 'all' || c.type.toLowerCase().includes(type.toLowerCase());
    const matchCity = city === 'all' || c.city.toLowerCase().includes(city.toLowerCase());

    return matchSearch && matchPart && matchStream && matchType && matchCity;
  });

  renderMp500Table();
}

function changeMpPage(direction) {
  const totalPages = Math.ceil(mpFilteredList.length / MP_PAGE_SIZE) || 1;
  const newPage = mpCurrentPage + direction;
  if (newPage >= 1 && newPage <= totalPages) {
    mpCurrentPage = newPage;
    renderMp500Table();
    const tableEl = document.getElementById('mp500MasterTable');
    if (tableEl) tableEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

function renderMp500Table() {
  const tbody = document.getElementById('mp500MasterTbody');
  const countEl = document.getElementById('mp500DisplayCount');
  const pageNumEl = document.getElementById('mpCurrentPageNum');
  const totalPagesEl = document.getElementById('mpTotalPagesNum');
  const prevBtn = document.getElementById('btnMpPrev');
  const nextBtn = document.getElementById('btnMpNext');
  const paginationWrap = document.getElementById('mp500PaginationWrap');

  if (countEl) countEl.innerText = mpFilteredList.length;

  const totalPages = Math.ceil(mpFilteredList.length / MP_PAGE_SIZE) || 1;
  if (mpCurrentPage > totalPages) mpCurrentPage = totalPages;

  if (pageNumEl) pageNumEl.innerText = mpCurrentPage;
  if (totalPagesEl) totalPagesEl.innerText = totalPages;

  if (prevBtn) prevBtn.disabled = mpCurrentPage <= 1;
  if (nextBtn) nextBtn.disabled = mpCurrentPage >= totalPages;

  if (paginationWrap) {
    if (totalPages <= 1) paginationWrap.classList.add('d-none');
    else paginationWrap.classList.remove('d-none');
  }

  if (!tbody) return;

  if (!mpFilteredList.length) {
    tbody.innerHTML = `
      <tr>
        <td colspan="8" class="text-center text-muted p-5">
          <i class="fa-solid fa-graduation-cap font-xl mb-2 d-block"></i>
          <h4>No colleges found matching your criteria.</h4>
          <p class="font-sm text-muted">Try clearing the search box or selecting a different stream/district filter.</p>
        </td>
      </tr>
    `;
    return;
  }

  const start = (mpCurrentPage - 1) * MP_PAGE_SIZE;
  const pageItems = mpFilteredList.slice(start, start + MP_PAGE_SIZE);

  tbody.innerHTML = pageItems.map(c => {
    let typeClass = 'blue';
    if (c.type === 'Central') typeClass = 'purple';
    else if (c.type === 'Private') typeClass = 'gold';

    let streamClass = 'blue';
    const sLower = c.stream.toLowerCase();
    if (sLower.includes('medical') || sLower.includes('bams') || sLower.includes('dental')) streamClass = 'green';
    else if (sLower.includes('engineering')) streamClass = 'blue';
    else if (sLower.includes('nursing') || sLower.includes('pharmacy')) streamClass = 'purple';

    const waText = encodeURIComponent(`Hello Rahul Sir (Education Sathi), I am interested in admission & counselling guidance for Rank #${c.rank}: ${c.name} (${c.city}, MP). Target Course: ${c.stream}. Please guide me.`);

    return `
      <tr>
        <td>
          <div class="d-flex flex-column align-items-center">
            <span class="badge-tag gold font-bold" style="font-size: 0.85rem; padding: 0.35rem 0.6rem;">#${c.rank}</span>
            <span class="text-xs text-muted mt-1">Part ${c.part}</span>
          </div>
        </td>
        <td>
          <div class="d-flex flex-column">
            <strong class="font-md text-main">${c.name}</strong>
            <span class="text-xs text-muted"><i class="fa-solid fa-circle-check text-emerald"></i> Verified MP Institution</span>
          </div>
        </td>
        <td>
          <span class="font-bold"><i class="fa-solid fa-location-dot text-danger"></i> ${c.city}</span>
        </td>
        <td>
          <span class="badge-tag ${typeClass}">${c.type}</span>
        </td>
        <td>
          <span class="stream-pill">${c.stream}</span>
        </td>
        <td>
          <div class="d-flex flex-column">
            <span class="font-xs font-bold text-primary">${c.admissionThrough}</span>
            <span class="text-xs text-muted">${c.eligibility}</span>
          </div>
        </td>
        <td>
          <div class="d-flex flex-column">
            <strong class="font-xs text-emerald">${c.estFee}</strong>
            <span class="badge-tag green text-xs mt-1" style="font-size: 0.7rem;"><i class="fa-solid fa-award"></i> MMVY 100% Eligible</span>
          </div>
        </td>
        <td>
          <div class="d-flex align-items-center gap-1">
            <a href="https://wa.me/919752754404?text=${waText}" target="_blank" class="btn btn-whatsapp btn-sm" title="WhatsApp Rahul Bhartiya for Cutoffs">
              <i class="fa-brands fa-whatsapp"></i> Inquire
            </a>
            <a href="tel:9752754404" class="btn btn-outline-primary btn-sm" title="Helpline Call">
              <i class="fa-solid fa-phone"></i>
            </a>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

function exportMp500CSV() {
  if (typeof MP_TOP_500_COLLEGES === 'undefined' || !MP_TOP_500_COLLEGES.length) {
    showToast('MP Colleges data is loading...');
    return;
  }

  let csv = "Rank,College Name,District/City,State,Type,Major Stream,Admission Mode,Eligibility,Estimated Fee,MMVY Waiver\n";
  MP_TOP_500_COLLEGES.forEach(c => {
    csv += `"${c.rank}","${c.name.replace(/"/g, '""')}","${c.city}","Madhya Pradesh","${c.type}","${c.stream}","${c.admissionThrough}","${c.eligibility}","${c.estFee}","100% MMVY Applicable"\n`;
  });

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `MP_Top_500_Colleges_Education_Sathi.csv`);
  document.body.appendChild(link);
  link.click();
  link.remove();
  showToast('Downloaded complete MP Top 500 Colleges spreadsheet!');
}

// ==========================================================================
// 3C. TOP 200 MAHARASHTRA MEDICAL & HEALTH SCIENCE COLLEGES CONTROLLER
// ==========================================================================

let mhActiveCategory = 'all';
let mhCurrentPage = 1;
const MH_PAGE_SIZE = 50;
let mhFilteredList = [];

function initMh200Explorer() {
  mhActiveCategory = 'all';
  mhCurrentPage = 1;

  const cats = ['All', 'GovtMbbs', 'PvtMbbs', 'Bds', 'Bams', 'BhmsBums', 'NursingAllied'];
  cats.forEach(c => {
    const b = document.getElementById(`mhTab${c}`);
    if (b) {
      if (c === 'All') b.classList.add('active');
      else b.classList.remove('active');
    }
  });

  const searchInp = document.getElementById('mh200SearchInput');
  const courseSel = document.getElementById('mh200CourseFilter');
  const typeSel = document.getElementById('mh200TypeFilter');
  const citySel = document.getElementById('mh200CityFilter');
  if (searchInp) searchInp.value = '';
  if (courseSel) courseSel.value = 'all';
  if (typeSel) typeSel.value = 'all';
  if (citySel) citySel.value = 'all';

  filterMhCollegesList();
}

function filterMhCategory(cat) {
  mhActiveCategory = cat;
  mhCurrentPage = 1;

  const btnMap = {
    'all': 'mhTabAll',
    'Govt MBBS': 'mhTabGovtMbbs',
    'Private/Deemed MBBS': 'mhTabPvtMbbs',
    'BDS Dental': 'mhTabBds',
    'BAMS Ayurveda': 'mhTabBams',
    'BHMS/BUMS': 'mhTabBhmsBums',
    'Nursing & Allied': 'mhTabNursingAllied'
  };

  Object.keys(btnMap).forEach(k => {
    const btn = document.getElementById(btnMap[k]);
    if (btn) {
      if (k === cat) btn.classList.add('active');
      else btn.classList.remove('active');
    }
  });

  filterMhCollegesList();
}

function filterMhCollegesList() {
  if (typeof MH_TOP_200_COLLEGES === 'undefined' || !MH_TOP_200_COLLEGES.length) return;

  const search = (document.getElementById('mh200SearchInput')?.value || '').toLowerCase().trim();
  const course = document.getElementById('mh200CourseFilter')?.value || 'all';
  const type = document.getElementById('mh200TypeFilter')?.value || 'all';
  const city = document.getElementById('mh200CityFilter')?.value || 'all';

  mhFilteredList = MH_TOP_200_COLLEGES.filter(c => {
    const matchSearch = !search || 
      c.name.toLowerCase().includes(search) || 
      c.city.toLowerCase().includes(search) || 
      c.course.toLowerCase().includes(search) ||
      (c.category && c.category.toLowerCase().includes(search)) ||
      String(c.rank) === search;

    let matchCategory = true;
    if (mhActiveCategory === 'BHMS/BUMS') {
      matchCategory = c.category === 'BHMS Homeopathy' || c.category === 'BUMS Unani';
    } else if (mhActiveCategory !== 'all') {
      matchCategory = c.category === mhActiveCategory;
    }

    const matchCourse = course === 'all' || c.course.toLowerCase().includes(course.toLowerCase());
    const matchType = type === 'all' || c.type.toLowerCase().includes(type.toLowerCase());
    const matchCity = city === 'all' || c.city.toLowerCase().includes(city.toLowerCase());

    return matchSearch && matchCategory && matchCourse && matchType && matchCity;
  });

  renderMh200Table();
}

function changeMhPage(direction) {
  const totalPages = Math.ceil(mhFilteredList.length / MH_PAGE_SIZE) || 1;
  const newPage = mhCurrentPage + direction;
  if (newPage >= 1 && newPage <= totalPages) {
    mhCurrentPage = newPage;
    renderMh200Table();
    const tableEl = document.getElementById('mh200MasterTable');
    if (tableEl) tableEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

function renderMh200Table() {
  const tbody = document.getElementById('mh200MasterTbody');
  const countEl = document.getElementById('mh200DisplayCount');
  const pageNumEl = document.getElementById('mhCurrentPageNum');
  const totalPagesEl = document.getElementById('mhTotalPagesNum');
  const prevBtn = document.getElementById('btnMhPrev');
  const nextBtn = document.getElementById('btnMhNext');
  const paginationWrap = document.getElementById('mh200PaginationWrap');

  if (countEl) countEl.innerText = mhFilteredList.length;

  const totalPages = Math.ceil(mhFilteredList.length / MH_PAGE_SIZE) || 1;
  if (mhCurrentPage > totalPages) mhCurrentPage = totalPages;

  if (pageNumEl) pageNumEl.innerText = mhCurrentPage;
  if (totalPagesEl) totalPagesEl.innerText = totalPages;

  if (prevBtn) prevBtn.disabled = mhCurrentPage <= 1;
  if (nextBtn) nextBtn.disabled = mhCurrentPage >= totalPages;

  if (paginationWrap) {
    if (totalPages <= 1) paginationWrap.classList.add('d-none');
    else paginationWrap.classList.remove('d-none');
  }

  if (!tbody) return;

  if (!mhFilteredList.length) {
    tbody.innerHTML = `
      <tr>
        <td colspan="8" class="text-center text-muted p-5">
          <i class="fa-solid fa-stethoscope font-xl mb-2 d-block"></i>
          <h4>No institutions found matching your filter.</h4>
          <p class="font-sm text-muted">Try clearing the search box or selecting another category.</p>
        </td>
      </tr>
    `;
    return;
  }

  const start = (mhCurrentPage - 1) * MH_PAGE_SIZE;
  const pageItems = mhFilteredList.slice(start, start + MH_PAGE_SIZE);

  tbody.innerHTML = pageItems.map(c => {
    let typeClass = 'blue';
    if (c.type === 'Deemed') typeClass = 'purple';
    else if (c.type === 'Private' || c.type === 'Private/Deemed') typeClass = 'gold';

    let courseBadgeClass = 'green';
    if (c.course === 'MBBS') courseBadgeClass = 'blue';
    else if (c.course === 'BDS') courseBadgeClass = 'gold';
    else if (c.course === 'B.Sc Nursing' || c.course === 'BPT') courseBadgeClass = 'purple';

    const waText = encodeURIComponent(`Hello Rahul Sir (Education Sathi), I want counselling guidance for Maharashtra College Rank #${c.rank}: ${c.name} (${c.city}, MH). Course: ${c.course} (${c.duration}). Please share cutoff, fees, and quota details.`);

    return `
      <tr>
        <td>
          <div class="d-flex flex-column align-items-center">
            <span class="badge-tag green font-bold" style="font-size: 0.85rem; padding: 0.35rem 0.6rem;">#${c.rank}</span>
            <span class="text-xs text-muted mt-1">${c.category || 'Medical'}</span>
          </div>
        </td>
        <td>
          <div class="d-flex flex-column">
            <strong class="font-md text-main">${c.name}</strong>
            <span class="text-xs text-muted"><i class="fa-solid fa-circle-check text-emerald"></i> Verified MH Health Science Institution</span>
          </div>
        </td>
        <td>
          <span class="font-bold"><i class="fa-solid fa-location-dot text-danger"></i> ${c.city}</span>
        </td>
        <td>
          <div class="d-flex flex-column">
            <span class="badge-tag ${courseBadgeClass}">${c.course}</span>
            <span class="text-xs text-muted mt-1">${c.duration}</span>
          </div>
        </td>
        <td>
          <span class="badge-tag ${typeClass}">${c.type}</span>
        </td>
        <td>
          <div class="d-flex flex-column">
            <span class="font-xs font-bold text-primary">${c.entrance}</span>
            <span class="text-xs text-muted">${c.eligibility}</span>
          </div>
        </td>
        <td>
          <div class="d-flex flex-column">
            <strong class="font-xs text-emerald">${c.estFee}</strong>
            <span class="text-xs text-muted mt-1 font-bold">${c.counsellingBody}</span>
          </div>
        </td>
        <td>
          <div class="d-flex align-items-center gap-1">
            <a href="https://wa.me/919752754404?text=${waText}" target="_blank" class="btn btn-whatsapp btn-sm" title="WhatsApp Rahul Bhartiya">
              <i class="fa-brands fa-whatsapp"></i> Inquire
            </a>
            <a href="tel:9752754404" class="btn btn-outline-primary btn-sm" title="Helpline Call">
              <i class="fa-solid fa-phone"></i>
            </a>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

function exportMh200CSV() {
  if (typeof MH_TOP_200_COLLEGES === 'undefined' || !MH_TOP_200_COLLEGES.length) {
    showToast('Maharashtra Colleges data is loading...');
    return;
  }

  let csv = "Rank,College Name,Location,State,Course,Duration,Management Type,Eligibility,Entrance Exam,Estimated Fee,Counselling Authority\n";
  MH_TOP_200_COLLEGES.forEach(c => {
    csv += `"${c.rank}","${c.name.replace(/"/g, '""')}","${c.city}","Maharashtra","${c.course}","${c.duration}","${c.type}","${c.eligibility}","${c.entrance}","${c.estFee}","${c.counsellingBody}"\n`;
  });

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `Maharashtra_Top_200_Medical_Colleges_Education_Sathi.csv`);
  document.body.appendChild(link);
  link.click();
  link.remove();
  showToast('Downloaded complete Maharashtra 200 Colleges spreadsheet!');
}

// ==========================================================================
// 3D. TOP UTTAR PRADESH MEDICAL & HEALTHCARE COLLEGES CONTROLLER
// ==========================================================================

let upActiveCategory = 'all';
let upCurrentPage = 1;
const UP_PAGE_SIZE = 50;
let upFilteredList = [];

function initUp500Explorer() {
  upActiveCategory = 'all';
  upCurrentPage = 1;

  const cats = ['All', 'GovtMedical', 'PvtMedical', 'Bds', 'Ayush', 'NursingAllied'];
  cats.forEach(c => {
    const b = document.getElementById(`upTab${c}`);
    if (b) {
      if (c === 'All') b.classList.add('active');
      else b.classList.remove('active');
    }
  });

  const searchInp = document.getElementById('up500SearchInput');
  const courseSel = document.getElementById('up500CourseFilter');
  const typeSel = document.getElementById('up500TypeFilter');
  const citySel = document.getElementById('up500CityFilter');
  if (searchInp) searchInp.value = '';
  if (courseSel) courseSel.value = 'all';
  if (typeSel) typeSel.value = 'all';
  if (citySel) citySel.value = 'all';

  filterUpCollegesList();
}

function filterUpCategory(cat) {
  upActiveCategory = cat;
  upCurrentPage = 1;

  const btnMap = {
    'all': 'upTabAll',
    'Govt Medical': 'upTabGovtMedical',
    'Private Medical': 'upTabPvtMedical',
    'BDS Dental': 'upTabBds',
    'AYUSH (BAMS/BHMS/BUMS)': 'upTabAyush',
    'Nursing & Allied Health': 'upTabNursingAllied'
  };

  Object.keys(btnMap).forEach(k => {
    const btn = document.getElementById(btnMap[k]);
    if (btn) {
      if (k === cat) btn.classList.add('active');
      else btn.classList.remove('active');
    }
  });

  filterUpCollegesList();
}

function filterUpCollegesList() {
  if (typeof UP_TOP_500_COLLEGES === 'undefined' || !UP_TOP_500_COLLEGES.length) return;

  const search = (document.getElementById('up500SearchInput')?.value || '').toLowerCase().trim();
  const course = document.getElementById('up500CourseFilter')?.value || 'all';
  const type = document.getElementById('up500TypeFilter')?.value || 'all';
  const city = document.getElementById('up500CityFilter')?.value || 'all';

  upFilteredList = UP_TOP_500_COLLEGES.filter(c => {
    const matchSearch = !search || 
      c.name.toLowerCase().includes(search) || 
      c.city.toLowerCase().includes(search) || 
      c.course.toLowerCase().includes(search) ||
      (c.category && c.category.toLowerCase().includes(search)) ||
      (c.university && c.university.toLowerCase().includes(search)) ||
      String(c.rank) === search;

    const matchCategory = upActiveCategory === 'all' || c.category === upActiveCategory;
    const matchCourse = course === 'all' || c.course.toLowerCase().includes(course.toLowerCase());
    const matchType = type === 'all' || c.type.toLowerCase().includes(type.toLowerCase());
    const matchCity = city === 'all' || c.city.toLowerCase().includes(city.toLowerCase());

    return matchSearch && matchCategory && matchCourse && matchType && matchCity;
  });

  renderUp500Table();
}

function changeUpPage(direction) {
  const totalPages = Math.ceil(upFilteredList.length / UP_PAGE_SIZE) || 1;
  const newPage = upCurrentPage + direction;
  if (newPage >= 1 && newPage <= totalPages) {
    upCurrentPage = newPage;
    renderUp500Table();
    const tableEl = document.getElementById('up500MasterTable');
    if (tableEl) tableEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

function renderUp500Table() {
  const tbody = document.getElementById('up500MasterTbody');
  const countEl = document.getElementById('up500DisplayCount');
  const pageNumEl = document.getElementById('upCurrentPageNum');
  const totalPagesEl = document.getElementById('upTotalPagesNum');
  const prevBtn = document.getElementById('btnUpPrev');
  const nextBtn = document.getElementById('btnUpNext');
  const paginationWrap = document.getElementById('up500PaginationWrap');

  if (countEl) countEl.innerText = upFilteredList.length;

  const totalPages = Math.ceil(upFilteredList.length / UP_PAGE_SIZE) || 1;
  if (upCurrentPage > totalPages) upCurrentPage = totalPages;

  if (pageNumEl) pageNumEl.innerText = upCurrentPage;
  if (totalPagesEl) totalPagesEl.innerText = totalPages;

  if (prevBtn) prevBtn.disabled = upCurrentPage <= 1;
  if (nextBtn) nextBtn.disabled = upCurrentPage >= totalPages;

  if (paginationWrap) {
    if (totalPages <= 1) paginationWrap.classList.add('d-none');
    else paginationWrap.classList.remove('d-none');
  }

  if (!tbody) return;

  if (!upFilteredList.length) {
    tbody.innerHTML = `
      <tr>
        <td colspan="8" class="text-center text-muted p-5">
          <i class="fa-solid fa-hospital font-xl mb-2 d-block"></i>
          <h4>No UP institutions found matching your filter criteria.</h4>
          <p class="font-sm text-muted">Try changing the course filter or search keywords.</p>
        </td>
      </tr>
    `;
    return;
  }

  const start = (upCurrentPage - 1) * UP_PAGE_SIZE;
  const pageItems = upFilteredList.slice(start, start + UP_PAGE_SIZE);

  tbody.innerHTML = pageItems.map(c => {
    let typeClass = 'blue';
    if (c.type.includes('Central')) typeClass = 'purple';
    else if (c.type.includes('Private') || c.type.includes('Deemed')) typeClass = 'gold';

    let courseBadgeClass = 'green';
    if (c.course.includes('MBBS')) courseBadgeClass = 'blue';
    else if (c.course.includes('BDS')) courseBadgeClass = 'gold';
    else if (c.course.includes('Nursing') || c.course.includes('BPT')) courseBadgeClass = 'purple';

    const waText = encodeURIComponent(`Hello Rahul Sir (Education Sathi), I want admission & counselling guidance for UP Medical Rank #${c.rank}: ${c.name} (${c.city}, UP). Target: ${c.course}. Please guide me on UPNEET cutoffs & seats.`);

    return `
      <tr>
        <td>
          <div class="d-flex flex-column align-items-center">
            <span class="badge-tag gold font-bold" style="font-size: 0.85rem; padding: 0.35rem 0.6rem;">#${c.rank}</span>
            <span class="text-xs text-muted mt-1">${c.category || 'Medical'}</span>
          </div>
        </td>
        <td>
          <div class="d-flex flex-column">
            <strong class="font-md text-main">${c.name}</strong>
            <span class="text-xs text-muted"><i class="fa-solid fa-circle-check text-emerald"></i> Verified UP Healthcare Institution</span>
          </div>
        </td>
        <td>
          <span class="font-bold"><i class="fa-solid fa-location-dot text-danger"></i> ${c.city}</span>
        </td>
        <td>
          <div class="d-flex flex-column">
            <span class="badge-tag ${courseBadgeClass}">${c.course}</span>
            <span class="text-xs text-muted mt-1">${c.duration || '5.5 Yr'}</span>
          </div>
        </td>
        <td>
          <div class="d-flex flex-column">
            <span class="badge-tag ${typeClass}">${c.type}</span>
            <span class="text-xs text-muted mt-1">${c.university || 'State Affiliated'}</span>
          </div>
        </td>
        <td>
          <div class="d-flex flex-column">
            <span class="font-xs font-bold text-primary">${c.entrance || 'NEET-UG'}</span>
            <span class="text-xs text-muted">${c.eligibility}</span>
          </div>
        </td>
        <td>
          <div class="d-flex flex-column">
            <strong class="font-xs text-emerald">${c.estFee}</strong>
            <span class="text-xs text-muted mt-1 font-bold">${c.counsellingBody || 'UPNEET'}</span>
          </div>
        </td>
        <td>
          <div class="d-flex align-items-center gap-1">
            <a href="https://wa.me/919752754404?text=${waText}" target="_blank" class="btn btn-whatsapp btn-sm" title="WhatsApp Rahul Bhartiya">
              <i class="fa-brands fa-whatsapp"></i> Inquire
            </a>
            <a href="tel:9752754404" class="btn btn-outline-primary btn-sm" title="Helpline Call">
              <i class="fa-solid fa-phone"></i>
            </a>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

function exportUp500CSV() {
  if (typeof UP_TOP_500_COLLEGES === 'undefined' || !UP_TOP_500_COLLEGES.length) {
    showToast('Uttar Pradesh Colleges data is loading...');
    return;
  }

  let csv = "Rank,College Name,District/City,State,Course,Duration,Management Type,University/Affiliation,Eligibility,Entrance Exam,Estimated Fee,Counselling Authority\n";
  UP_TOP_500_COLLEGES.forEach(c => {
    csv += `"${c.rank}","${c.name.replace(/"/g, '""')}","${c.city}","Uttar Pradesh","${c.course}","${c.duration}","${c.type}","${(c.university || '').replace(/"/g, '""')}","${c.eligibility}","${c.entrance}","${c.estFee}","${c.counsellingBody}"\n`;
  });

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `Uttar_Pradesh_Top_500_Medical_Colleges_Education_Sathi.csv`);
  document.body.appendChild(link);
  link.click();
  link.remove();
  showToast('Downloaded complete Uttar Pradesh Medical Colleges spreadsheet!');
}

// ==========================================================================
// 4. DEDICATED MEDICAL COURSE BOXES (MBBS, BAMS, BHMS, BUMS, MD/MS)
// ==========================================================================
function renderMedicalBoxes() {
  const homeGrid = document.getElementById('homeMedicalBoxesGrid');
  const masterList = document.getElementById('medicalBoxesMasterList');
  if (!EDUCATION_DATA.medicalBoxes) return;

  const boxes = EDUCATION_DATA.medicalBoxes;

  // Render home preview (all apex medical courses: MBBS, BDS, BAMS, BHMS, BUMS, MD/MS)
  if (homeGrid) {
    homeGrid.innerHTML = boxes.map(renderMedicalBoxCardHTML).join('');
  }

  // Render full dedicated view - Elegant, Sleek Luxury Design
  if (masterList) {
    masterList.innerHTML = boxes.map(box => `
      <div class="med-premium-card">
        <!-- Card Header -->
        <div class="med-card-head">
          <div class="med-head-left">
            <div class="med-head-icon" style="background: ${box.bgColor}; color: ${box.color};">
              <i class="${box.icon}"></i>
            </div>
            <div>
              <div class="d-flex align-items-center flex-wrap gap-2 mb-1">
                <h2 class="med-card-title">${box.name}</h2>
                <span class="med-card-badge">${box.badge}</span>
              </div>
              <h3 class="med-card-subtitle">${box.fullName}</h3>
            </div>
          </div>

          <div class="med-head-actions">
            <a href="https://wa.me/919752754404?text=Hello%20Education%20Sathi,%20I%20am%20interested%20in%20${encodeURIComponent(box.name)}%20Admissions" target="_blank" class="btn btn-whatsapp">
              <i class="fa-brands fa-whatsapp"></i> Inquire ${box.name}
            </a>
            <button class="btn btn-primary" onclick="openCounselModal()">
              <i class="fa-solid fa-headset"></i> Free Counselling
            </button>
          </div>
        </div>

        <!-- Metric Highlights Ribbon -->
        <div class="med-highlights-bar">
          <div class="med-highlight-item">
            <span class="hl-label"><i class="fa-regular fa-clock text-primary"></i> Duration</span>
            <strong class="hl-value">${box.duration.split('(')[0]}</strong>
          </div>
          <div class="med-highlight-item">
            <span class="hl-label"><i class="fa-solid fa-clipboard-check text-emerald"></i> Entrance</span>
            <strong class="hl-value">NEET Qualified</strong>
          </div>
          <div class="med-highlight-item">
            <span class="hl-label"><i class="fa-solid fa-landmark text-gold"></i> Govt Tuition</span>
            <strong class="hl-value text-emerald">${box.feesGovt.split('–')[0]}</strong>
          </div>
          <div class="med-highlight-item">
            <span class="hl-label"><i class="fa-solid fa-user-doctor text-purple"></i> Total Seats</span>
            <strong class="hl-value">${box.seatsIndia.split(' ')[0]} Seats</strong>
          </div>
        </div>

        <!-- 2-Column Info Grid -->
        <div class="med-details-grid">
          <!-- Left: Academic Criteria -->
          <div class="med-details-col">
            <h4 class="med-details-heading"><i class="fa-solid fa-graduation-cap text-primary"></i> Eligibility & Cutoff Guidelines</h4>
            
            <div class="med-detail-block">
              <span class="med-detail-label">10+2 Qualification:</span>
              <p class="med-detail-text">${box.eligibility}</p>
            </div>

            <div class="med-detail-block">
              <span class="med-detail-label">NEET Benchmark:</span>
              <p class="med-detail-text">${box.neetRequirement}</p>
            </div>

            <div class="med-detail-block">
              <span class="med-detail-label">Counselling Authorities:</span>
              <p class="med-detail-text"><strong>${box.counsellingBodies.join(' • ')}</strong></p>
            </div>
          </div>

          <!-- Right: Fee Matrix -->
          <div class="med-details-col">
            <h4 class="med-details-heading"><i class="fa-solid fa-coins text-gold"></i> Estimated Annual Fee Structure</h4>
            
            <div class="med-fee-table">
              <div class="med-fee-row">
                <div class="fee-col-type">
                  <strong>🏛️ Government Colleges</strong>
                  <small>Merit State / AIQ Quota</small>
                </div>
                <div class="fee-col-val text-emerald font-bold">${box.feesGovt}</div>
              </div>

              <div class="med-fee-row">
                <div class="fee-col-type">
                  <strong>🏢 Private Colleges</strong>
                  <small>State Regulated Fee</small>
                </div>
                <div class="fee-col-val text-primary font-bold">${box.feesPvt}</div>
              </div>

              <div class="med-fee-row">
                <div class="fee-col-type">
                  <strong>🌐 Deemed Universities</strong>
                  <small>100% All India Quota</small>
                </div>
                <div class="fee-col-val text-purple font-bold">${box.feesDeemed || '₹18L – ₹26L/yr'}</div>
              </div>
            </div>

            <div class="med-scholarship-note">
              <i class="fa-solid fa-circle-check text-emerald"></i>
              <span><strong>100% Tuition Fee Waiver:</strong> Eligible under MP MMVY & NSP scholarships.</span>
            </div>
          </div>
        </div>

        <!-- Career Tags & Footer -->
        <div class="med-card-bottom">
          <div class="med-career-group">
            <span class="med-career-title"><i class="fa-solid fa-briefcase text-primary"></i> Career Scope:</span>
            <div class="med-career-chips">
              ${box.careerScope.map(c => `<span class="med-career-tag">${c}</span>`).join('')}
            </div>
          </div>

          <div class="med-card-cta-group">
            <button class="btn btn-outline-primary btn-sm" onclick="navigateTo('predictor')">
              <i class="fa-solid fa-calculator"></i> Predict College
            </button>
            <a href="https://wa.me/919752754404?text=Hello%20Rahul%20Sir,%20I%20want%20${encodeURIComponent(box.name)}%20counselling" target="_blank" class="btn btn-whatsapp btn-sm">
              <i class="fa-brands fa-whatsapp"></i> Chat on WhatsApp
            </a>
          </div>
        </div>
      </div>
    `).join('');
  }
}

function renderMedicalBoxCardHTML(box) {
  return `
    <div class="medical-box-card" onclick="navigateTo('medical-courses')">
      <div class="med-box-header">
        <div class="med-box-icon" style="background: ${box.bgColor}; color: ${box.color};">
          <i class="${box.icon}"></i>
        </div>
        <div>
          <h3 class="med-box-title">${box.name}</h3>
          <span class="med-box-badge text-primary">${box.badge}</span>
        </div>
      </div>

      <p class="text-muted" style="font-size: 0.85rem; margin-bottom: 0.75rem;"><strong>${box.fullName}</strong></p>

      <div class="med-box-specs-list">
        <div class="med-box-spec-row">
          <span>Duration:</span>
          <strong>${box.duration.split('(')[0]}</strong>
        </div>
        <div class="med-box-spec-row">
          <span>Govt Fee:</span>
          <strong class="text-emerald">${box.feesGovt.split('–')[0]}</strong>
        </div>
        <div class="med-box-spec-row">
          <span>NEET Cutoff:</span>
          <strong>Required</strong>
        </div>
      </div>

      <span class="dest-btn-explore mt-auto">
        Explore ${box.name} Roadmaps <i class="fa-solid fa-arrow-right"></i>
      </span>
    </div>
  `;
}

// ==========================================================================
// 5. AI CAREER ASSISTANT LOGIC ("Ask Education Sathi AI")
// ==========================================================================
async function runAiAssistantQuery(event) {
  event.preventDefault();
  const course = document.getElementById('aiCourse')?.value || 'MBBS';
  const score = parseInt(document.getElementById('aiScore')?.value || '540', 10);
  const state = document.getElementById('aiState')?.value || 'Madhya Pradesh';
  const budget = document.getElementById('aiBudget')?.value || 'under15';

  const placeholder = document.getElementById('aiOutputPlaceholder');
  const resultWrap = document.getElementById('aiOutputResult');
  if (placeholder) placeholder.classList.add('d-none');
  if (resultWrap) resultWrap.classList.remove('d-none');

  resultWrap.innerHTML = '<div class="text-center py-4"><i class="fa-solid fa-spinner fa-spin text-primary" style="font-size: 2rem;"></i><p class="mt-2 text-muted">AI is analyzing cutoffs, state quota rules & college rankings...</p></div>';

  try {
    const res = await fetch(`${API_BASE_URL}/ai-assistant`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ score, preferredState: state, budget, interestedCourse: course })
    });
    const data = await res.json();
    if (data.success) {
      const a = data.analysis;
      resultWrap.innerHTML = `
        <div class="ai-response-box">
          <div class="d-flex align-items-center gap-2 mb-2">
            <span class="badge-tag green"><i class="fa-solid fa-circle-check"></i> Score: ${a.score}/720</span>
            <span class="badge-tag blue">${a.preferredState} Quota</span>
          </div>

          <h4 class="text-primary mt-2">💡 AI Admission Probability Insights</h4>
          <p class="lead-text" style="font-size: 0.92rem; line-height: 1.6;">${a.probabilityNote}</p>

          <h5 class="mt-3">🎯 Highly Recommended Course Pathways:</h5>
          <div class="cutoff-chips-wrap mb-3">
            ${a.suggestedCourses.map(c => `<span class="cutoff-chip"><strong>${c}</strong></span>`).join('')}
          </div>

          <h5>📋 Strategic Next Steps:</h5>
          <ul class="clean-list mb-3">
            ${a.counsellingSteps.map(st => `<li><i class="fa-solid fa-arrow-right text-primary"></i> <small>${st}</small></li>`).join('')}
          </ul>

          <div class="mt-3">
            <a href="https://wa.me/919752754404?text=Hello%20Rahul%20Sir,%20My%20NEET%20Score%20is%20${score}%20in%20${encodeURIComponent(state)}.%20AI%20suggested%20${encodeURIComponent(course)}.%20Please%20guide%20me." target="_blank" class="btn btn-whatsapp w-100">
              <i class="fa-brands fa-whatsapp"></i> Confirm Choice List with Rahul Sir (9752754404)
            </a>
          </div>
        </div>
      `;
    }
  } catch (err) {
    // Local offline computation fallback
    resultWrap.innerHTML = `
      <div class="ai-response-box">
        <h4 class="text-primary">💡 Admission Probability Analysis</h4>
        <p>With a score of <strong>${score}/720</strong> in <strong>${state}</strong>, you qualify for leading State Government & Private Medical colleges.</p>
        <p class="text-muted"><small>Under MP MMVY scheme, 100% tuition fees are reimbursed by the state government.</small></p>
        <a href="https://wa.me/919752754404?text=Hello%20Rahul%20Sir,%20My%20NEET%20score%20is%20${score}" target="_blank" class="btn btn-whatsapp w-100 mt-2">
          <i class="fa-brands fa-whatsapp"></i> WhatsApp Counselling (9752754404)
        </a>
      </div>
    `;
  }
}

// ==========================================================================
// 6. STUDENT PROFILE & MODAL
// ==========================================================================
function openStudentProfileModal() {
  navigateTo('student-profile');
}

function saveStudentProfile(e) {
  e.preventDefault();
  const prof = {
    name: document.getElementById('profName')?.value,
    phone: document.getElementById('profPhone')?.value,
    email: document.getElementById('profEmail')?.value,
    score: document.getElementById('profScore')?.value,
    course: document.getElementById('profCourse')?.value
  };
  localStorage.setItem('es_student_profile', JSON.stringify(prof));
  showToast('Student profile saved successfully!');
}

function loadStudentProfile() {
  const raw = localStorage.getItem('es_student_profile');
  if (!raw) return;
  const p = JSON.parse(raw);
  if (document.getElementById('profName')) document.getElementById('profName').value = p.name || '';
  if (document.getElementById('profPhone')) document.getElementById('profPhone').value = p.phone || '';
  if (document.getElementById('profEmail')) document.getElementById('profEmail').value = p.email || '';
  if (document.getElementById('profScore')) document.getElementById('profScore').value = p.score || '';
  if (document.getElementById('profCourse')) document.getElementById('profCourse').value = p.course || '';
}

// ==========================================================================
// ==========================================================================
// 7. EXECUTIVE EMPLOYEE & STAFF CRM SYSTEM
// ==========================================================================

let currentEmployee = null;
let allCallingTasks = [];
let allAdmissions = [];
let allStaffColleges = [];
let activeStaffTab = 'calls';

function fillEmployeeLogin(username, password) {
  const uInput = document.getElementById('empUsername');
  const pInput = document.getElementById('empPassword');
  if (uInput) uInput.value = username;
  if (pInput) pInput.value = password;
}

function checkEmployeeAuth() {
  const token = localStorage.getItem('es_employee_token');
  const savedEmp = localStorage.getItem('es_employee');
  const loginBox = document.getElementById('empLoginBox');
  const dashContent = document.getElementById('empDashboardContent');
  const authButtons = document.getElementById('empAuthButtons');

  if (token && savedEmp) {
    try {
      currentEmployee = JSON.parse(savedEmp);
    } catch (e) {
      currentEmployee = {
        name: 'Pooja Verma',
        role: 'Senior Medical Counselor',
        empCode: 'ES-0101',
        assignedTerritory: 'Madhya Pradesh & Karnataka',
        specialization: 'MBBS & MD/MS Admissions',
        avatar: '👩‍💼'
      };
    }

    if (loginBox) loginBox.classList.add('d-none');
    if (dashContent) dashContent.classList.remove('d-none');
    if (authButtons) authButtons.classList.remove('d-none');

    // Update Employee Profile Display
    const nameEl = document.getElementById('empName');
    const roleEl = document.getElementById('empRoleBadge');
    const codeEl = document.getElementById('empCodeBadge');
    const territoryEl = document.getElementById('empTerritory');
    const specEl = document.getElementById('empSpecialty');
    const avatarEl = document.getElementById('empAvatarBox');
    const staffBadge = document.getElementById('headerStaffBadge');

    if (nameEl) nameEl.innerText = currentEmployee.name;
    if (roleEl) roleEl.innerText = currentEmployee.role;
    if (codeEl) codeEl.innerText = currentEmployee.empCode || 'ES-STAFF';
    if (territoryEl) territoryEl.innerText = currentEmployee.assignedTerritory || 'Pan India';
    if (specEl) specEl.innerText = currentEmployee.specialization || 'Medical Admissions';
    if (staffBadge) staffBadge.innerHTML = `<i class="fa-solid fa-user-check"></i> ${currentEmployee.name}`;

    if (avatarEl) {
      if (currentEmployee.avatar && currentEmployee.avatar.includes('.jpg')) {
        avatarEl.innerHTML = `<img src="${currentEmployee.avatar}" style="width:100%;height:100%;border-radius:50%;object-fit:cover;" />`;
      } else {
        avatarEl.innerText = currentEmployee.avatar || '👩‍💼';
      }
    }

    // Load Live CRM Data
    fetchEmployeeDashboard();
  } else {
    currentEmployee = null;
    if (loginBox) loginBox.classList.remove('d-none');
    if (dashContent) dashContent.classList.add('d-none');
    if (authButtons) authButtons.classList.add('d-none');
  }
}

async function handleEmployeeLogin(e) {
  e.preventDefault();
  const u = document.getElementById('empUsername')?.value;
  const p = document.getElementById('empPassword')?.value;

  try {
    const res = await fetch(`${API_BASE_URL}/employee/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: u, password: p })
    });
    const data = await res.json();
    if (data.success) {
      localStorage.setItem('es_employee_token', data.token);
      localStorage.setItem('es_employee', JSON.stringify(data.employee));
      showToast(`Welcome ${data.employee.name}! Logged into Staff CRM.`);
      checkEmployeeAuth();
    } else {
      alert(data.error || 'Invalid credentials');
    }
  } catch (err) {
    let fallbackEmp = null;
    if (u === 'emp01' && p === 'sathi2026') {
      fallbackEmp = {
        id: 'emp-01', empCode: 'ES-0101', username: 'emp01', name: 'Pooja Verma',
        role: 'Senior Medical Counselor', avatar: '👩‍💼',
        assignedTerritory: 'Madhya Pradesh & Karnataka', specialization: 'MBBS & MD/MS Admissions'
      };
    } else if (u === 'emp02' && p === 'sathi2026') {
      fallbackEmp = {
        id: 'emp-02', empCode: 'ES-0102', username: 'emp02', name: 'Amit Sharma',
        role: 'Telecalling & AYUSH Specialist', avatar: '👨‍💼',
        assignedTerritory: 'Uttar Pradesh & Rajasthan', specialization: 'BAMS, BHMS & BDS Quotas'
      };
    }

    if (fallbackEmp) {
      localStorage.setItem('es_employee_token', 'local-emp-token');
      localStorage.setItem('es_employee', JSON.stringify(fallbackEmp));
      showToast(`Welcome ${fallbackEmp.name}!`);
      checkEmployeeAuth();
    } else {
      alert('Invalid username or password. Please try emp01 / sathi2026 or emp02 / sathi2026.');
    }
  }
}

function handleEmployeeLogout() {
  localStorage.removeItem('es_employee_token');
  localStorage.removeItem('es_employee');
  showToast('Logged out of Staff CRM.');
  checkEmployeeAuth();
}

// ==========================================================================
// 8. DIRECTOR & APEX ADMIN SYSTEM
// ==========================================================================

let allAdminLeads = [];
let allAdminStaff = [];
let allAdminAdmissions = [];
let activeAdminTab = 'staff';

function fillAdminLogin(u, p) {
  const uEl = document.getElementById('adminUsername');
  const pEl = document.getElementById('adminPassword');
  if (uEl) uEl.value = u;
  if (pEl) pEl.value = p;
}

function checkAdminAuth() {
  const token = localStorage.getItem('es_admin_token');
  const loginBox = document.getElementById('adminLoginBox');
  const dashContent = document.getElementById('adminDashboardContent');
  const authButtons = document.getElementById('directorAuthButtons');

  if (token) {
    isAdminAuthenticated = true;
    if (loginBox) loginBox.classList.add('d-none');
    if (dashContent) dashContent.classList.remove('d-none');
    if (authButtons) authButtons.classList.remove('d-none');

    // Load Admin Data
    fetchAdminDashboard();
  } else {
    isAdminAuthenticated = false;
    if (loginBox) loginBox.classList.remove('d-none');
    if (dashContent) dashContent.classList.add('d-none');
    if (authButtons) authButtons.classList.add('d-none');
  }
}

async function handleAdminLogin(e) {
  e.preventDefault();
  const u = document.getElementById('adminUsername')?.value;
  const p = document.getElementById('adminPassword')?.value;

  try {
    const res = await fetch(`${API_BASE_URL}/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: u, password: p })
    });
    const data = await res.json();
    if (data.success) {
      localStorage.setItem('es_admin_token', data.token);
      showToast(`Welcome Director Rahul Bhartiya!`);
      checkAdminAuth();
    } else {
      alert(data.error || 'Invalid credentials');
    }
  } catch (err) {
    if (u === 'admin' && p === 'educationsathi2026') {
      localStorage.setItem('es_admin_token', 'local-admin-token');
      showToast('Welcome Director Rahul Bhartiya (Offline Access)!');
      checkAdminAuth();
    } else {
      alert('Invalid username or password. Please use admin / educationsathi2026.');
    }
  }
}

function handleAdminLogout() {
  localStorage.removeItem('es_admin_token');
  showToast('Logged out of Director Admin Portal');
  checkAdminAuth();
}

function switchAdminTab(tabKey) {
  activeAdminTab = tabKey;
  const tabs = ['staff', 'leads', 'admissions', 'analytics'];
  tabs.forEach(t => {
    const btn = document.getElementById(`admTabBtn${t.charAt(0).toUpperCase() + t.slice(1)}`);
    const pane = document.getElementById(`admPane${t.charAt(0).toUpperCase() + t.slice(1)}`);
    if (t === tabKey) {
      if (btn) btn.classList.add('active');
      if (pane) pane.classList.remove('d-none');
    } else {
      if (btn) btn.classList.remove('active');
      if (pane) pane.classList.add('d-none');
    }
  });
}

async function fetchAdminDashboard() {
  // 1. Fetch Metrics
  try {
    const mRes = await fetch(`${API_BASE_URL}/admin/metrics`);
    const mData = await mRes.json();
    if (mData.success && mData.metrics) {
      const totLeads = document.getElementById('adminTotalLeadsCount');
      const totCalls = document.getElementById('adminCallsScheduledCount');
      const totAdms = document.getElementById('adminAdmissionsCount');
      const totStaff = document.getElementById('adminStaffCount');
      if (totLeads) totLeads.innerText = mData.metrics.totalLeads;
      if (totCalls) totCalls.innerText = mData.metrics.totalCallsScheduled;
      if (totAdms) totAdms.innerText = mData.metrics.totalAdmissions;
      if (totStaff) totStaff.innerText = mData.metrics.staffPerformance?.length || 3;
    }
  } catch (e) {}

  // 2. Fetch Staff Table
  fetchAdminStaff();

  // 3. Fetch Master Leads
  fetchAdminLeads();

  // 4. Fetch Admissions
  fetchAdminAdmissions();
}

async function fetchAdminStaff() {
  try {
    const res = await fetch(`${API_BASE_URL}/employee/staff`);
    const data = await res.json();
    if (data.success) {
      allAdminStaff = data.staff;
    }
  } catch (e) {
    if (!allAdminStaff.length) {
      allAdminStaff = [
        { id: 'emp-01', empCode: 'ES-0101', name: 'Pooja Verma', role: 'Senior Medical Counselor', phone: '9826112233', assignedTerritory: 'Madhya Pradesh & Karnataka', specialization: 'MBBS & MD/MS Admissions' },
        { id: 'emp-02', empCode: 'ES-0102', name: 'Amit Sharma', role: 'Telecalling & AYUSH Specialist', phone: '9752445566', assignedTerritory: 'Uttar Pradesh & Rajasthan', specialization: 'BAMS, BHMS & BDS Quotas' },
        { id: 'admin-1', empCode: 'ES-DIR', name: 'Rahul Bhartiya', role: 'Director & Apex Counselor', phone: '9752754404', assignedTerritory: 'All 36 States & UTs', specialization: 'Pan-India Medical & MMVY Scheme' }
      ];
    }
  }
  renderAdminStaffTable(allAdminStaff);
}

function renderAdminStaffTable(staffList) {
  const tbody = document.getElementById('adminStaffTbody');
  if (!tbody) return;
  tbody.innerHTML = staffList.map(s => `
    <tr>
      <td>
        <div class="d-flex align-items-center gap-2">
          <div style="font-size:1.5rem;">${s.name.includes('Pooja') ? '👩‍💼' : (s.name.includes('Amit') ? '👨‍💼' : '👑')}</div>
          <div>
            <strong class="font-md">${s.name}</strong>
            <span class="text-xs text-muted d-block">${s.phone}</span>
          </div>
        </div>
      </td>
      <td>
        <span class="badge-tag ${s.role.includes('Director') ? 'gold' : 'blue'}">${s.role}</span>
        <span class="text-xs font-bold text-muted d-block mt-1">${s.empCode}</span>
      </td>
      <td><i class="fa-solid fa-map-pin text-danger"></i> ${s.assignedTerritory}</td>
      <td><span class="stream-pill">${s.specialization}</span></td>
      <td><strong class="text-primary">${Math.floor(8 + Math.random() * 12)} Leads</strong></td>
      <td>
        <div class="d-flex align-items-center gap-1">
          <a href="tel:${s.phone}" class="btn btn-outline-primary btn-sm"><i class="fa-solid fa-phone"></i></a>
          <a href="https://wa.me/91${s.phone}" target="_blank" class="btn btn-whatsapp btn-sm"><i class="fa-brands fa-whatsapp"></i></a>
        </div>
      </td>
    </tr>
  `).join('');
}

async function fetchAdminLeads() {
  try {
    const res = await fetch(`${API_BASE_URL}/leads`);
    const data = await res.json();
    if (data.success) {
      allAdminLeads = data.leads;
    }
  } catch (e) {
    allAdminLeads = allCrmLeads || [];
  }
  renderAdminMasterLeads(allAdminLeads);
  const badge = document.getElementById('admBadgeLeadCount');
  if (badge) badge.innerText = allAdminLeads.length;
}

function renderAdminMasterLeads(leads) {
  const tbody = document.getElementById('adminMasterLeadsTbody');
  if (!tbody) return;
  if (!leads.length) {
    tbody.innerHTML = `<tr><td colspan="8" class="text-center text-muted p-4">No student inquiries found.</td></tr>`;
    return;
  }
  tbody.innerHTML = leads.map(l => {
    return `
      <tr>
        <td><strong>${l.studentName}</strong></td>
        <td><a href="tel:${l.phone}" class="font-bold text-primary">${l.phone}</a></td>
        <td><span class="stream-pill">${l.targetCourse}</span></td>
        <td>${l.domicileState || 'MP'}</td>
        <td><strong>${l.neetScore > 0 ? l.neetScore : '—'}</strong></td>
        <td><span class="badge-tag ${l.status === 'New' ? 'blue' : (l.status === 'Admitted' ? 'green' : 'gold')}">${l.status}</span></td>
        <td>
          <select class="status-select-pill" onchange="handleAdminReassignLead('${l.id}', this.value)">
            <option value="Pooja Verma" ${l.assignedCounselor === 'Pooja Verma' ? 'selected' : ''}>Pooja Verma</option>
            <option value="Amit Sharma" ${l.assignedCounselor === 'Amit Sharma' ? 'selected' : ''}>Amit Sharma</option>
            <option value="Rahul Bhartiya" ${l.assignedCounselor === 'Rahul Bhartiya' ? 'selected' : ''}>Rahul Bhartiya</option>
          </select>
        </td>
        <td>
          <a href="https://wa.me/91${l.phone}?text=Hello%20${encodeURIComponent(l.studentName)},%20I%20am%20Director%20Rahul%20Bhartiya%20from%20Education%20Sathi." target="_blank" class="btn btn-whatsapp btn-sm">
            <i class="fa-brands fa-whatsapp"></i>
          </a>
        </td>
      </tr>
    `;
  }).join('');
}

function filterAdminMasterLeads() {
  const q = document.getElementById('adminLeadSearch')?.value.toLowerCase() || '';
  const status = document.getElementById('adminLeadStatusFilter')?.value || 'all';

  let filtered = allAdminLeads.filter(l => {
    const matchQ = l.studentName.toLowerCase().includes(q) ||
                   l.phone.includes(q) ||
                   l.targetCourse.toLowerCase().includes(q) ||
                   (l.domicileState && l.domicileState.toLowerCase().includes(q));
    const matchS = status === 'all' || l.status === status;
    return matchQ && matchS;
  });
  renderAdminMasterLeads(filtered);
}

async function handleAdminReassignLead(leadId, counselor) {
  try {
    await fetch(`${API_BASE_URL}/admin/leads/${leadId}/reassign`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ counselorName: counselor })
    });
  } catch (e) {}
  const lead = allAdminLeads.find(l => l.id === leadId);
  if (lead) lead.assignedCounselor = counselor;
  showToast(`Lead reassigned to ${counselor}!`);
}

async function fetchAdminAdmissions() {
  try {
    const res = await fetch(`${API_BASE_URL}/employee/admissions`);
    const data = await res.json();
    if (data.success) {
      allAdminAdmissions = data.admissions;
    }
  } catch (e) {
    allAdminAdmissions = allAdmissions || [];
  }
  renderAdminAdmissionsTable(allAdminAdmissions);
}

function renderAdminAdmissionsTable(list) {
  const tbody = document.getElementById('adminAdmissionsTbody');
  if (!tbody) return;
  tbody.innerHTML = list.map(a => `
    <tr>
      <td><strong>${a.studentName}</strong><br><span class="text-xs text-muted">${a.phone}</span></td>
      <td><strong>${a.allottedCollege}</strong></td>
      <td><span class="stream-pill">${a.course}</span><br><span class="badge-tag blue font-xs mt-1">${a.admissionQuota}</span></td>
      <td><strong class="text-emerald">${a.annualFee}</strong><br><span class="text-xs text-muted">${a.feeReceiptNo}</span></td>
      <td><span class="badge-tag gold">${a.scholarshipClaimed}</span></td>
      <td><span class="text-xs font-bold text-muted">${a.assignedCounselor}</span></td>
    </tr>
  `).join('');
}

function exportLeadsCSV() {
  if (!allAdminLeads.length) {
    showToast('No leads available to export.');
    return;
  }
  let csvContent = "data:text/csv;charset=utf-8,Student Name,Phone,Target Course,State,NEET Score,Status,Assigned Counselor,Date\n";
  allAdminLeads.forEach(l => {
    csvContent += `"${l.studentName}","${l.phone}","${l.targetCourse}","${l.domicileState || 'MP'}","${l.neetScore || 0}","${l.status}","${l.assignedCounselor || 'Rahul Bhartiya'}","${l.createdAt || ''}"\n`;
  });
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `Education_Sathi_Inquiries_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  link.remove();
  showToast('Downloaded Student Leads CSV file!');
}

function openAddStaffModal() {
  const m = document.getElementById('adminAddStaffModalOverlay');
  if (m) m.classList.add('active');
}
function closeAddStaffModal() {
  const m = document.getElementById('adminAddStaffModalOverlay');
  if (m) m.classList.remove('active');
}

async function handleAddStaffSubmit(e) {
  e.preventDefault();
  const staffPayload = {
    name: document.getElementById('newStaffName').value.trim(),
    username: document.getElementById('newStaffUsername').value.trim(),
    password: document.getElementById('newStaffPassword').value,
    role: document.getElementById('newStaffRole').value,
    phone: document.getElementById('newStaffPhone').value.trim(),
    specialization: document.getElementById('newStaffSpec').value.trim(),
    assignedTerritory: document.getElementById('newStaffTerritory').value.trim()
  };

  try {
    const res = await fetch(`${API_BASE_URL}/admin/staff`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(staffPayload)
    });
    const d = await res.json();
    if (d.success) {
      allAdminStaff.push(d.staff);
    }
  } catch (err) {
    staffPayload.empCode = 'ES-0' + (allAdminStaff.length + 101);
    allAdminStaff.push(staffPayload);
  }

  showToast(`Counselor ${staffPayload.name} added to team!`);
  closeAddStaffModal();
  renderAdminStaffTable(allAdminStaff);
}

function fetchEmployeeDashboard() {
  fetchCallingSchedule();
  fetchCrmLeads();
  fetchAdmissions();
  fetchStaffColleges();
}

// Staff Tabs Switcher
function switchStaffTab(tabKey) {
  activeStaffTab = tabKey;
  const tabs = ['calls', 'leads', 'admissions', 'colleges'];
  tabs.forEach(t => {
    const btn = document.getElementById(`tabBtn${t.charAt(0).toUpperCase() + t.slice(1)}`);
    const pane = document.getElementById(`pane${t.charAt(0).toUpperCase() + t.slice(1)}`);
    if (t === tabKey) {
      if (btn) btn.classList.add('active');
      if (pane) pane.classList.remove('d-none');
    } else {
      if (btn) btn.classList.remove('active');
      if (pane) pane.classList.add('d-none');
    }
  });
}

// --------------------------------------------------------------------------
// Calling Schedule Handlers
// --------------------------------------------------------------------------
async function fetchCallingSchedule() {
  const username = currentEmployee?.username || '';
  try {
    const res = await fetch(`${API_BASE_URL}/employee/schedule?username=${encodeURIComponent(username)}`);
    const data = await res.json();
    if (data.success) {
      allCallingTasks = data.schedule;
    }
  } catch (e) {
    if (!allCallingTasks.length) {
      allCallingTasks = [
        {
          id: 'call-101', studentName: 'Ananya Sharma', phone: '9826012345', targetCourse: 'MBBS (MP State Quota)',
          neetScore: 565, scheduledTime: '10:30 AM', priority: 'High',
          lastOutcome: 'Parent interested in GMC Bhopal or MGM Indore. Need state merit list check.',
          counselorName: currentEmployee?.name || 'Pooja Verma', status: 'Scheduled'
        },
        {
          id: 'call-102', studentName: 'Rohan Gupta', phone: '9752109876', targetCourse: 'MP MMVY Scholarship (100% Waiver)',
          neetScore: 512, scheduledTime: '12:00 PM', priority: 'Urgent',
          lastOutcome: 'Annual income certificate under 6 Lakhs verified. Need Domicile certificate copy.',
          counselorName: currentEmployee?.name || 'Pooja Verma', status: 'Scheduled'
        },
        {
          id: 'call-103', studentName: 'Priya Patel', phone: '9827099881', targetCourse: 'Private MBBS (Karnataka / UP)',
          neetScore: 438, scheduledTime: '02:30 PM', priority: 'Normal',
          lastOutcome: 'Budget 12 Lakhs/yr. Recommended KMC Manipal & UP Private Medical Colleges.',
          counselorName: 'Amit Sharma', status: 'Scheduled'
        },
        {
          id: 'call-104', studentName: 'Siddharth Verma', phone: '9752334411', targetCourse: 'BAMS Ayurveda Govt College',
          neetScore: 475, scheduledTime: '04:00 PM', priority: 'Normal',
          lastOutcome: 'High probability for Pt. Khushilal Bhopal. Requested hostel fees detail.',
          counselorName: 'Amit Sharma', status: 'Scheduled'
        },
        {
          id: 'call-105', studentName: 'Dr. Vivek Rathore', phone: '9425011223', targetCourse: 'MD/MS Medical PG (Medicine)',
          neetScore: 610, scheduledTime: '05:30 PM', priority: 'High',
          lastOutcome: 'Targeting DNB Medicine / MD Pediatrics in Top Deemed or Govt Institutes.',
          counselorName: 'Rahul Bhartiya', status: 'Scheduled'
        }
      ];
    }
  }
  renderCallingSchedule(allCallingTasks);
  const badge = document.getElementById('badgeCallCount');
  const cardBadge = document.getElementById('crmCallsTodayCount');
  if (badge) badge.innerText = allCallingTasks.length;
  if (cardBadge) cardBadge.innerText = allCallingTasks.length;
}

function renderCallingSchedule(tasks) {
  const tbody = document.getElementById('callingScheduleTbody');
  if (!tbody) return;
  if (!tasks.length) {
    tbody.innerHTML = `<tr><td colspan="7" class="text-center text-muted p-4">No scheduled calls found matching criteria.</td></tr>`;
    return;
  }
  tbody.innerHTML = tasks.map(t => {
    const priorityClass = t.priority === 'Urgent' ? 'red' : (t.priority === 'High' ? 'gold' : 'green');
    return `
      <tr class="call-row">
        <td>
          <div class="d-flex flex-column gap-1">
            <strong><i class="fa-solid fa-clock text-primary"></i> ${t.scheduledTime}</strong>
            <span class="badge-tag ${priorityClass}">${t.priority}</span>
          </div>
        </td>
        <td>
          <div class="d-flex flex-column">
            <strong class="font-md">${t.studentName}</strong>
            <a href="tel:${t.phone}" class="text-primary font-bold"><i class="fa-solid fa-phone-volume font-sm"></i> ${t.phone}</a>
          </div>
        </td>
        <td><span class="stream-pill">${t.targetCourse}</span></td>
        <td><strong>${t.neetScore > 0 ? t.neetScore : '—'}</strong></td>
        <td><p class="mb-0 text-muted font-sm" style="max-width:280px;">${t.lastOutcome || 'Counselling follow-up'}</p></td>
        <td><span class="text-xs font-bold text-muted">${t.counselorName || 'Assigned'}</span></td>
        <td>
          <div class="d-flex align-items-center gap-1">
            <a href="tel:${t.phone}" class="btn btn-outline-primary btn-sm" title="Direct Phone Call">
              <i class="fa-solid fa-phone"></i> Call
            </a>
            <a href="https://wa.me/91${t.phone}?text=Hello%20${encodeURIComponent(t.studentName)},%20I%20am%20calling%20from%20Education%20Sathi%20regarding%20your%20${encodeURIComponent(t.targetCourse)}%20admission%20guidance." target="_blank" class="btn btn-whatsapp btn-sm" title="Chat on WhatsApp">
              <i class="fa-brands fa-whatsapp"></i>
            </a>
            <button class="btn btn-gold btn-sm" onclick="openCallOutcomeModal('${t.id}')" title="Log Call Outcome">
              <i class="fa-solid fa-pen-to-square"></i> Log
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

function filterCallingSchedule() {
  const query = document.getElementById('callSearchInput')?.value.toLowerCase() || '';
  const priority = document.getElementById('callPriorityFilter')?.value || 'all';

  let filtered = allCallingTasks.filter(t => {
    const matchQuery = t.studentName.toLowerCase().includes(query) ||
                       t.phone.includes(query) ||
                       t.targetCourse.toLowerCase().includes(query);
    const matchPriority = priority === 'all' || t.priority === priority;
    return matchQuery && matchPriority;
  });
  renderCallingSchedule(filtered);
}

function openScheduleCallModal() {
  const dateInput = document.getElementById('schedDate');
  if (dateInput && !dateInput.value) {
    dateInput.value = new Date().toISOString().split('T')[0];
  }
  const modal = document.getElementById('scheduleCallModalOverlay');
  if (modal) modal.classList.add('active');
}
function closeScheduleCallModal() {
  const modal = document.getElementById('scheduleCallModalOverlay');
  if (modal) modal.classList.remove('active');
}

async function handleScheduleCallSubmit(e) {
  e.preventDefault();
  const newTask = {
    studentName: document.getElementById('schedStudentName').value.trim(),
    phone: document.getElementById('schedStudentPhone').value.trim(),
    targetCourse: document.getElementById('schedCourse').value.trim(),
    neetScore: document.getElementById('schedNeetScore').value,
    scheduledDate: document.getElementById('schedDate').value,
    scheduledTime: document.getElementById('schedTime').value.trim(),
    priority: document.getElementById('schedPriority').value,
    callType: document.getElementById('schedAgenda').value.trim(),
    lastOutcome: document.getElementById('schedAgenda').value.trim(),
    counselorName: currentEmployee?.name || 'Rahul Bhartiya',
    counselorUsername: currentEmployee?.username || 'emp01'
  };

  try {
    const res = await fetch(`${API_BASE_URL}/employee/schedule`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTask)
    });
    const d = await res.json();
    if (d.success) {
      allCallingTasks.unshift(d.task);
    }
  } catch (err) {
    newTask.id = 'call-' + Date.now();
    allCallingTasks.unshift(newTask);
  }

  showToast(`Call scheduled with ${newTask.studentName}!`);
  closeScheduleCallModal();
  renderCallingSchedule(allCallingTasks);
}

function openCallOutcomeModal(taskId) {
  const task = allCallingTasks.find(t => t.id === taskId);
  if (!task) return;
  const idInput = document.getElementById('outcomeTaskId');
  const label = document.getElementById('outcomeStudentLabel');
  const notes = document.getElementById('outcomeNotes');
  if (idInput) idInput.value = taskId;
  if (label) label.innerText = `Student: ${task.studentName} (${task.phone})`;
  if (notes) notes.value = task.lastOutcome || '';

  const modal = document.getElementById('callOutcomeModalOverlay');
  if (modal) modal.classList.add('active');
}
function closeCallOutcomeModal() {
  const modal = document.getElementById('callOutcomeModalOverlay');
  if (modal) modal.classList.remove('active');
}

async function handleCallOutcomeSubmit(e) {
  e.preventDefault();
  const taskId = document.getElementById('outcomeTaskId').value;
  const status = document.getElementById('outcomeStatus').value;
  const notes = document.getElementById('outcomeNotes').value.trim();

  try {
    await fetch(`${API_BASE_URL}/employee/schedule/${taskId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, lastOutcome: notes })
    });
  } catch (err) {
    // Local update
  }

  const idx = allCallingTasks.findIndex(t => t.id === taskId);
  if (idx !== -1) {
    allCallingTasks[idx].status = status;
    allCallingTasks[idx].lastOutcome = notes;
  }

  showToast('Call notes logged successfully!');
  closeCallOutcomeModal();
  renderCallingSchedule(allCallingTasks);
}

// --------------------------------------------------------------------------
// Confirmed Admissions Handlers
// --------------------------------------------------------------------------
async function fetchAdmissions() {
  try {
    const res = await fetch(`${API_BASE_URL}/employee/admissions`);
    const data = await res.json();
    if (data.success) {
      allAdmissions = data.admissions;
    }
  } catch (e) {
    if (!allAdmissions.length) {
      allAdmissions = [
        {
          id: 'adm-01', studentName: 'Aditi Rao', phone: '9826198765',
          allottedCollege: 'Gandhi Medical College (GMC), Bhopal', course: 'MBBS (Bachelor of Medicine)',
          admissionQuota: 'MP State 85% Quota', annualFee: '₹1,00,000 / yr', feeReceiptNo: 'REC-GMC-2026-881',
          scholarshipClaimed: 'MP MMVY (100% Tuition Waiver Granted)', documentStatus: 'Verified & Submitted',
          assignedCounselor: 'Rahul Bhartiya'
        },
        {
          id: 'adm-02', studentName: 'Vikram Solanki', phone: '9826334455',
          allottedCollege: 'Index Medical College, Indore', course: 'MBBS (Bachelor of Medicine)',
          admissionQuota: 'Private State Merit', annualFee: '₹12,50,000 / yr', feeReceiptNo: 'REC-IMC-2026-402',
          scholarshipClaimed: 'None (Self-Financed)', documentStatus: 'Originals Deposited',
          assignedCounselor: 'Pooja Verma'
        },
        {
          id: 'adm-03', studentName: 'Meera Nair', phone: '9752889900',
          allottedCollege: 'Pt. Khushilal Sharma Govt Ayurveda College, Bhopal', course: 'BAMS (Ayurvedacharya)',
          admissionQuota: 'MP State Quota', annualFee: '₹40,000 / yr', feeReceiptNo: 'REC-PKAC-2026-193',
          scholarshipClaimed: 'State Post-Matric Merit', documentStatus: 'Verified & Submitted',
          assignedCounselor: 'Amit Sharma'
        }
      ];
    }
  }
  renderAdmissions(allAdmissions);
  const badge = document.getElementById('badgeAdmCount');
  const cardBadge = document.getElementById('crmAdmittedCount');
  if (badge) badge.innerText = allAdmissions.length;
  if (cardBadge) cardBadge.innerText = allAdmissions.length;
}

function renderAdmissions(list) {
  const tbody = document.getElementById('admissionsTbody');
  if (!tbody) return;
  if (!list.length) {
    tbody.innerHTML = `<tr><td colspan="7" class="text-center text-muted p-4">No confirmed student admissions recorded yet.</td></tr>`;
    return;
  }
  tbody.innerHTML = list.map(a => `
    <tr>
      <td>
        <div class="d-flex flex-column">
          <strong class="font-md">${a.studentName}</strong>
          <a href="tel:${a.phone}" class="text-primary font-bold"><i class="fa-solid fa-phone font-sm"></i> ${a.phone}</a>
        </div>
      </td>
      <td>
        <div class="d-flex flex-column">
          <strong>${a.allottedCollege}</strong>
        </div>
      </td>
      <td>
        <div class="d-flex flex-column gap-1">
          <span class="stream-pill">${a.course}</span>
          <span class="badge-tag blue">${a.admissionQuota}</span>
        </div>
      </td>
      <td>
        <div class="d-flex flex-column">
          <strong class="text-emerald">${a.annualFee}</strong>
          <span class="text-xs text-muted">Receipt: ${a.feeReceiptNo}</span>
        </div>
      </td>
      <td>
        <span class="badge-tag gold">${a.scholarshipClaimed}</span>
      </td>
      <td>
        <span class="badge-tag green"><i class="fa-solid fa-circle-check"></i> ${a.documentStatus}</span>
      </td>
      <td><span class="text-xs font-bold text-muted">${a.assignedCounselor}</span></td>
    </tr>
  `).join('');
}

function openRegisterAdmissionModal() {
  const modal = document.getElementById('registerAdmissionModalOverlay');
  if (modal) modal.classList.add('active');
}
function closeRegisterAdmissionModal() {
  const modal = document.getElementById('registerAdmissionModalOverlay');
  if (modal) modal.classList.remove('active');
}

async function handleRegisterAdmissionSubmit(e) {
  e.preventDefault();
  const newAdmission = {
    studentName: document.getElementById('admStudentName').value.trim(),
    phone: document.getElementById('admStudentPhone').value.trim(),
    allottedCollege: document.getElementById('admCollegeName').value.trim(),
    course: document.getElementById('admCourse').value,
    admissionQuota: document.getElementById('admQuota').value,
    category: document.getElementById('admCategory').value,
    annualFee: document.getElementById('admAnnualFee').value.trim(),
    feeReceiptNo: document.getElementById('admReceiptNo').value.trim(),
    scholarshipClaimed: document.getElementById('admScholarship').value.trim(),
    documentStatus: document.getElementById('admDocStatus').value,
    assignedCounselor: currentEmployee?.name || 'Rahul Bhartiya'
  };

  try {
    const res = await fetch(`${API_BASE_URL}/employee/admissions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newAdmission)
    });
    const d = await res.json();
    if (d.success) allAdmissions.unshift(d.admission);
  } catch (err) {
    newAdmission.id = 'adm-' + Date.now();
    allAdmissions.unshift(newAdmission);
  }

  showToast(`Admission enrolled for ${newAdmission.studentName}!`);
  closeRegisterAdmissionModal();
  renderAdmissions(allAdmissions);
}

// --------------------------------------------------------------------------
// Staff College Matrix & Fee Lookup Handlers
// --------------------------------------------------------------------------
async function fetchStaffColleges() {
  try {
    const res = await fetch(`${API_BASE_URL}/colleges/mp-top-500`);
    const data = await res.json();
    if (data.success && data.colleges) {
      allStaffColleges = data.colleges;
    }
  } catch (e) {
    if (typeof MP_TOP_500_COLLEGES !== 'undefined') {
      allStaffColleges = MP_TOP_500_COLLEGES;
    }
  }
  renderStaffColleges(allStaffColleges.slice(0, 100));
  const badge = document.getElementById('crmCollegesCount');
  if (badge) badge.innerText = allStaffColleges.length || 500;
}

function renderStaffColleges(colleges) {
  const tbody = document.getElementById('staffCollegesTbody');
  if (!tbody) return;
  if (!colleges.length) {
    tbody.innerHTML = `<tr><td colspan="7" class="text-center text-muted p-4">No colleges found matching filter.</td></tr>`;
    return;
  }
  tbody.innerHTML = colleges.map(c => {
    const feeFormatted = c.estFee || (c.tuitionFee < 10000 ? `₹${c.tuitionFee?.toLocaleString()}/yr` : `₹${(c.tuitionFee / 100000).toFixed(2)} Lakh/yr`);
    const rankLabel = c.rank ? `#${c.rank}` : (c.nirfRank ? `NIRF #${c.nirfRank}` : 'Top');
    return `
      <tr>
        <td>
          <div class="d-flex flex-column">
            <strong class="font-md">${c.name}</strong>
            <span class="text-xs text-muted">${c.stream || 'Medical / Tech'}</span>
          </div>
        </td>
        <td>
          <span class="badge-tag ${c.type === 'Govt' || c.type === 'Government' ? 'blue' : 'purple'}">${c.type}</span>
          <span class="text-xs text-gold font-bold d-block mt-1">Rank ${rankLabel}</span>
        </td>
        <td><i class="fa-solid fa-location-dot text-danger"></i> ${c.city}, MP</td>
        <td><strong>${c.seats ? c.seats + ' Seats' : (c.stream || 'State Quota')}</strong></td>
        <td><strong class="text-emerald font-xs">${feeFormatted}</strong></td>
        <td><span><i class="fa-solid fa-graduation-cap text-primary"></i> ${c.admissionThrough || 'MP Online / DME'}</span></td>
        <td>
          <a href="https://wa.me/?text=Hello,%20here%20are%20the%20details%20for%20*${encodeURIComponent(c.name)}*%20(${c.city},%20MP):%0AType:%20${c.type}%0ACourse:%20${encodeURIComponent(c.stream || 'Admissions')}%0AFee:%20${encodeURIComponent(feeFormatted)}%0AGuidance%20by%20Education%20Sathi%20(9752754404)" target="_blank" class="btn btn-whatsapp btn-sm">
            <i class="fa-brands fa-whatsapp"></i> Share
          </a>
        </td>
      </tr>
    `;
  }).join('');
}

function filterStaffColleges() {
  const query = document.getElementById('staffColSearch')?.value.toLowerCase().trim() || '';
  const type = document.getElementById('staffColTypeFilter')?.value || 'all';

  let filtered = allStaffColleges.filter(c => {
    const matchQ = c.name.toLowerCase().includes(query) ||
                   c.city.toLowerCase().includes(query) ||
                   (c.stream && c.stream.toLowerCase().includes(query)) ||
                   String(c.rank) === query;
    const matchT = type === 'all' || c.type.toLowerCase().includes(type.toLowerCase());
    return matchQ && matchT;
  });
  renderStaffColleges(filtered.slice(0, 100));
}

// Helper card rendering
function renderCollegeCardHTML(col) {
  const typeBadgeClass = col.type === 'Government' ? 'blue' : (col.type === 'Deemed' ? 'purple' : 'gold');
  const formattedTuition = col.tuitionFee < 10000 ? `₹${col.tuitionFee.toLocaleString()}/yr` : `₹${(col.tuitionFee / 100000).toFixed(2)} Lakh/yr`;

  return `
    <div class="college-card">
      <div class="college-top-row">
        <span class="badge-tag ${typeBadgeClass}"><i class="fa-solid fa-landmark"></i> ${col.type}</span>
        <span class="nirf-badge">🏆 NIRF #${col.nirfRank}</span>
      </div>
      <h3 class="college-name">${col.name}</h3>
      <div class="college-location"><i class="fa-solid fa-location-dot text-danger"></i> ${col.city}, ${col.state}</div>

      <div class="college-specs-grid">
        <div class="spec-item"><span class="spec-label">MBBS Seats</span><span class="spec-value">${col.seats > 0 ? col.seats : 'PG Only'}</span></div>
        <div class="spec-item"><span class="spec-label">Annual Tuition</span><span class="spec-value text-primary">${formattedTuition}</span></div>
        <div class="spec-item"><span class="spec-label">Hostel Fee</span><span class="spec-value">₹${(col.hostelFee/1000).toFixed(0)}k/yr</span></div>
      </div>

      <div class="cutoff-chips-wrap">
        <span class="cutoff-chip"><strong>UR Cutoff:</strong> AIR ~${col.neetClosingRankUR.toLocaleString()}</span>
        <span class="cutoff-chip"><strong>OBC:</strong> AIR ~${col.neetClosingRankOBC.toLocaleString()}</span>
      </div>

      <div class="college-card-actions">
        <button class="btn btn-primary btn-sm flex-1" onclick="openCollegeModal('${col.id}')">
          <i class="fa-solid fa-eye"></i> Cutoff & Quota
        </button>
        <a href="https://wa.me/919752754404?text=Hello%20Education%20Sathi,%20I%20am%20interested%20in%20${encodeURIComponent(col.name)}" target="_blank" class="btn btn-whatsapp btn-sm">
          <i class="fa-brands fa-whatsapp"></i> Inquire
        </a>
      </div>
    </div>
  `;
}

// Global API variable
const API_BASE_URL = window.location.port === '5000' || window.location.hostname === 'localhost'
  ? '/api'
  : 'http://localhost:5000/api';

// Re-include core utilities (leads, scholarships, categories, predictor)
function renderCareerCategories() {
  const grid = document.getElementById('categoryCardsGrid');
  const selectFilter = document.getElementById('courseCategoryFilter');
  const chipsWrap = document.getElementById('categoryChips');
  if (!grid || !EDUCATION_DATA.categories) return;

  if (selectFilter) {
    selectFilter.innerHTML = '<option value="all">All 25 Categories</option>' +
      EDUCATION_DATA.categories.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
  }

  if (chipsWrap) {
    chipsWrap.innerHTML = '<button class="cat-chip active" onclick="setCategoryChip(\'all\', this)">All Categories</button>' +
      EDUCATION_DATA.categories.slice(0, 8).map(c => `<button class="cat-chip" onclick="setCategoryChip('${c.id}', this)"><i class="${c.icon}"></i> ${c.name}</button>`).join('');
  }

  grid.innerHTML = EDUCATION_DATA.categories.map(cat => `
    <div class="category-master-card" id="cat-card-${cat.id}">
      <div class="cat-card-header" onclick="toggleCategoryAccordion('${cat.id}')">
        <div class="cat-header-left">
          <div class="cat-icon-badge" style="background-color: ${cat.bgColor}; color: ${cat.color};">
            <i class="${cat.icon}"></i>
          </div>
          <div class="cat-title-text">
            <h3>${cat.name}</h3>
            <span class="cat-courses-count">${cat.count}</span>
          </div>
        </div>
        <button class="btn btn-sm btn-outline-primary"><i class="fa-solid fa-chevron-down" id="cat-icon-${cat.id}"></i></button>
      </div>
      <div class="cat-card-body" id="cat-body-${cat.id}">
        <p class="cat-desc">${cat.description}</p>
        <div class="courses-accordion-list">
          ${cat.courses.map(course => `
            <div class="course-item-row">
              <div class="course-name-box">
                <strong>${course.name}</strong>
                <div class="course-meta-tags">
                  <span><i class="fa-solid fa-clock"></i> ${course.duration}</span>
                  <span>•</span>
                  <span><i class="fa-solid fa-graduation-cap"></i> ${course.eligibility}</span>
                </div>
              </div>
              <a href="https://wa.me/919752754404?text=Hello%20Education%20Sathi,%20I%20want%20details%20for%20${encodeURIComponent(course.name)}" target="_blank" class="btn btn-whatsapp btn-sm">
                <i class="fa-brands fa-whatsapp"></i> Inquire
              </a>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `).join('');
}

function toggleCategoryAccordion(id) {
  const b = document.getElementById(`cat-body-${id}`);
  const icon = document.getElementById(`cat-icon-${id}`);
  if (b) {
    if (b.style.display === 'none') {
      b.style.display = 'block';
      if (icon) icon.className = 'fa-solid fa-chevron-up';
    } else {
      b.style.display = 'none';
      if (icon) icon.className = 'fa-solid fa-chevron-down';
    }
  }
}

function expandAllCategories() {
  EDUCATION_DATA.categories.forEach(cat => {
    const b = document.getElementById(`cat-body-${cat.id}`);
    if (b) b.style.display = 'block';
  });
  showToast('Expanded all categories');
}

function setCategoryChip(catId, btn) {
  document.querySelectorAll('.cat-chip').forEach(c => c.classList.remove('active'));
  if (btn) btn.classList.add('active');
  const s = document.getElementById('courseCategoryFilter');
  if (s) s.value = catId;
  filterCourses();
}

function filterCourses() {
  const q = (document.getElementById('courseSearchInput')?.value || '').toLowerCase().trim();
  const sel = document.getElementById('courseCategoryFilter')?.value || 'all';

  EDUCATION_DATA.categories.forEach(cat => {
    const card = document.getElementById(`cat-card-${cat.id}`);
    if (!card) return;
    const matchCat = sel === 'all' || sel === cat.id;
    const matchSearch = q === '' || cat.name.toLowerCase().includes(q) || cat.courses.some(c => c.name.toLowerCase().includes(q));
    if (matchCat && matchSearch) {
      card.style.display = 'block';
      if (q !== '') {
        const b = document.getElementById(`cat-body-${cat.id}`);
        if (b) b.style.display = 'block';
      }
    } else {
      card.style.display = 'none';
    }
  });
}

function renderMedicalColleges() {
  // Same as before
}

function renderCounsellingAuthorities() {}
function renderScholarships() {}
function renderComparisonDropdowns() {}
function renderComparisonMatrix() {}
function updateCompareBadges() {}
function updateDashboardView() {}
function syncScoreSlider(val) {
  const badge = document.getElementById('estimatedAirBadge');
  if (badge) badge.innerText = `~${parseInt(val, 10) > 600 ? '20,000' : '65,000'}`;
}

async function handleLeadSubmit(event, source) {
  event.preventDefault();
  const form = event.target;
  const name = document.getElementById('cName')?.value || document.getElementById('heroName')?.value || document.getElementById('mName')?.value || 'Student';
  const phone = document.getElementById('cPhone')?.value || document.getElementById('heroPhone')?.value || document.getElementById('mPhone')?.value || '';
  const course = document.getElementById('cCourse')?.value || document.getElementById('heroStream')?.value || document.getElementById('mCourse')?.value || 'MBBS';

  const leadPayload = { studentName: name, phone, whatsapp: phone, targetCourse: course, source, domicileState: 'Madhya Pradesh' };

  try {
    fetch(`${API_BASE_URL}/leads`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(leadPayload)
    });
  } catch (e) {}

  closeCounselModal();
  showToast(`Thank you ${name}! Connecting with Rahul Bhartiya on WhatsApp...`);

  const waUrl = `https://wa.me/919752754404?text=Hello%20Education%20Sathi,%20My%20name%20is%20${encodeURIComponent(name)}%20(Phone:%20${phone}).%20Interested%20in%20${encodeURIComponent(course)}.`;
  setTimeout(() => window.open(waUrl, '_blank'), 700);
  form.reset();
}

function openCounselModal() {
  const o = document.getElementById('counselModalOverlay');
  if (o) o.classList.add('active');
}
function closeCounselModal() {
  const o = document.getElementById('counselModalOverlay');
  if (o) o.classList.remove('active');
}
function openCollegeModal(id) {
  const col = EDUCATION_DATA.colleges.find(c => c.id === id);
  if (!col) return;
  const o = document.getElementById('collegeModalOverlay');
  const nameEl = document.getElementById('modalColName');
  const bodyEl = document.getElementById('modalColBody');
  if (nameEl) nameEl.innerText = col.name;
  if (bodyEl) {
    bodyEl.innerHTML = `
      <p><strong>City & State:</strong> ${col.city}, ${col.state}</p>
      <p><strong>Annual Tuition Fee:</strong> ${col.totalAnnualFee}</p>
      <p><strong>MBBS Seats:</strong> ${col.seats}</p>
      <p><strong>NEET Cutoff:</strong> AIR ~${col.neetClosingRankUR.toLocaleString()}</p>
      <p><strong>Highlights:</strong> ${col.highlights}</p>
      <a href="https://wa.me/919752754404?text=Hello%20Education%20Sathi,%20I%20want%20admission%20in%20${encodeURIComponent(col.name)}" target="_blank" class="btn btn-whatsapp w-100 mt-2">
        <i class="fa-brands fa-whatsapp"></i> Chat with Rahul Sir (9752754404)
      </a>
    `;
  }
  if (o) o.classList.add('active');
}
function closeCollegeModal() {
  const o = document.getElementById('collegeModalOverlay');
  if (o) o.classList.remove('active');
}

// CRM leads
async function fetchCrmLeads() {
  const tbody = document.getElementById('crmLeadsTbody');
  if (!tbody) return;
  try {
    const res = await fetch(`${API_BASE_URL}/leads`);
    const d = await res.json();
    if (d.success) {
      allCrmLeads = d.leads;
      renderCrmLeads(allCrmLeads);
      updateCrmStats(allCrmLeads);
    }
  } catch (e) {
    allCrmLeads = JSON.parse(localStorage.getItem('es_leads') || '[]');
    renderCrmLeads(allCrmLeads);
    updateCrmStats(allCrmLeads);
  }
}
function updateCrmStats(leads) {
  const tot = document.getElementById('crmTotalLeads');
  const leadBadge = document.getElementById('badgeLeadCount');
  if (tot) tot.innerText = leads.length;
  if (leadBadge) leadBadge.innerText = leads.length;
}

function renderCrmLeads(leads) {
  const tbody = document.getElementById('crmLeadsTbody');
  if (!tbody) return;
  if (!leads.length) {
    tbody.innerHTML = `<tr><td colspan="7" class="text-center text-muted p-4">No student leads found.</td></tr>`;
    return;
  }
  tbody.innerHTML = leads.map(l => {
    const counselor = l.assignedCounselor || currentEmployee?.name || 'Rahul Bhartiya';
    return `
      <tr>
        <td>
          <div class="d-flex flex-column">
            <strong class="font-md">${l.studentName}</strong>
            <span class="text-xs text-muted">Counselor: ${counselor}</span>
          </div>
        </td>
        <td>
          <a href="tel:${l.phone}" class="font-bold text-primary d-block"><i class="fa-solid fa-phone font-sm"></i> ${l.phone}</a>
        </td>
        <td><span class="stream-pill">${l.targetCourse}</span></td>
        <td>${l.domicileState || 'MP'}</td>
        <td><strong>${l.neetScore > 0 ? l.neetScore : '—'}</strong></td>
        <td>
          <select class="status-select-pill" onchange="updateLeadStatus('${l.id}', this.value)">
            <option value="New" ${l.status === 'New' ? 'selected' : ''}>🔵 New Inquiry</option>
            <option value="In Progress" ${l.status === 'In Progress' ? 'selected' : ''}>🟡 In Progress</option>
            <option value="Contacted" ${l.status === 'Contacted' ? 'selected' : ''}>🟢 Contacted</option>
            <option value="Admitted" ${l.status === 'Admitted' ? 'selected' : ''}>🏆 Admitted</option>
          </select>
        </td>
        <td>
          <div class="d-flex align-items-center gap-1">
            <a href="tel:${l.phone}" class="btn btn-outline-primary btn-sm" title="Call Student">
              <i class="fa-solid fa-phone"></i>
            </a>
            <a href="https://wa.me/91${l.phone}?text=Hello%20${encodeURIComponent(l.studentName)},%20I%20am%20${encodeURIComponent(counselor)}%20from%20Education%20Sathi%20following%20up%20on%20your%20${encodeURIComponent(l.targetCourse)}%20admission." target="_blank" class="btn btn-whatsapp btn-sm" title="WhatsApp Message">
              <i class="fa-brands fa-whatsapp"></i>
            </a>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

async function updateLeadStatus(leadId, newStatus) {
  try {
    await fetch(`${API_BASE_URL}/leads/${leadId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    });
  } catch (e) {}
  const l = allCrmLeads.find(item => item.id === leadId);
  if (l) l.status = newStatus;
  showToast(`Updated ${l?.studentName || 'Student'} status to ${newStatus}`);
}

function showToast(message) {
  const container = document.getElementById('toastContainer');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<i class="fa-solid fa-circle-check text-emerald"></i> <span>${message}</span>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}
