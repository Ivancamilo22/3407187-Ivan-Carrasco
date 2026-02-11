/* ============================================
   PROYECTO SEMANA 01 - FICHA DE INFORMACIÓN INTERACTIVA
   Dominio: Sistema de Gestión de Cementerio
   ============================================ */

// ============================================
// 1. Objeto principal del dominio
// ============================================

const cemeteryData = {
  name: 'Sistema de Gestión Cementerio Central',
  title: 'Plataforma Administrativa — CEM-001',
  description: 'Sistema integral para la administración de parcelas, registros de difuntos y servicios funerarios del Cementerio Central.',
  identifier: 'CEM-001',

  contact: {
    email: 'contacto@cementeriocentral.com',
    phone: '+57 601 555 5555',
    location: 'Bogotá, Colombia'
  },

  items: [
    { name: 'Gestión de Parcelas',        level: 90, category: 'Administración' },
    { name: 'Registros de Sepultura',     level: 85, category: 'Registros' },
    { name: 'Programación de Mantenimiento', level: 70, category: 'Operaciones' },
    { name: 'Registro de Visitantes',     level: 65, category: 'Seguridad' },
    { name: 'Control de Pagos',           level: 80, category: 'Finanzas' },
    { name: 'Certificados Digitales',     level: 75, category: 'Documentación' }
  ],

  links: [
    { platform: 'Sitio Web',  url: 'https://cemetery.example.com',         icon: '🌐' },
    { platform: 'Soporte',    url: 'https://cemetery.example.com/support',  icon: '🛠️' }
  ],

  stats: {
    total:  1200,
    active: 980,
    rating: 4.6,
    custom: 35
  }
};

// ============================================
// 2. Referencias al DOM
// ============================================

const userName       = document.getElementById('userName');
const userTitle      = document.getElementById('userTitle');
const userLocation   = document.getElementById('userLocation');
const userBio        = document.getElementById('userBio');
const userEmail      = document.getElementById('userEmail');
const userPhone      = document.getElementById('userPhone');

const skillsList     = document.getElementById('skillsList');
const toggleSkills   = document.getElementById('toggleSkills');

const socialLinks    = document.getElementById('socialLinks');
const statsContainer = document.getElementById('stats');

const themeToggle    = document.getElementById('themeToggle');
const copyEmailBtn   = document.getElementById('copyEmailBtn');

const toast          = document.getElementById('toast');
const toastMessage   = document.getElementById('toastMessage');

// ============================================
// 3. Renderizar información básica
// ============================================

const renderBasicInfo = () => {
  const { name, title, description, contact } = cemeteryData;

  userName.textContent     = name;
  userTitle.textContent    = title;
  userLocation.textContent = '📍 ' + contact.location;
  userBio.textContent      = description;
  userEmail.textContent    = contact.email;
  userPhone.textContent    = contact.phone;
};

// ============================================
// 4. Renderizar módulos / servicios
// ============================================

let showingAllItems = false;

const renderItems = (showAll = false) => {
  const { items } = cemeteryData;
  const itemsToShow = showAll ? items : items.slice(0, 4);

  skillsList.innerHTML = itemsToShow.map(({ name, level }) => `
    <div class="skill-item">
      <div class="skill-name">${name}</div>
      <div class="skill-level">
        <span>${level}%</span>
        <div class="skill-bar">
          <div class="skill-bar-fill" style="width: ${level}%"></div>
        </div>
      </div>
    </div>
  `).join('');
};

const handleToggleItems = () => {
  showingAllItems = !showingAllItems;
  renderItems(showingAllItems);
  toggleSkills.textContent = showingAllItems ? 'Mostrar Menos' : 'Mostrar Más';
};

// ============================================
// 5. Renderizar enlaces externos
// ============================================

const renderLinks = () => {
  socialLinks.innerHTML = cemeteryData.links.map(({ platform, url, icon }) => `
    <a href="${url}" target="_blank" class="social-link">
      ${icon} ${platform}
    </a>
  `).join('');
};

// ============================================
// 6. Renderizar estadísticas
// ============================================

const renderStats = () => {
  const { stats } = cemeteryData;

  const statsArray = [
    { label: 'Parcelas Totales',   value: stats.total  },
    { label: 'Parcelas Activas',   value: stats.active },
    { label: 'Calificación',       value: stats.rating },
    { label: 'Años de Operación',  value: stats.custom }
  ];

  statsContainer.innerHTML = statsArray.map(({ label, value }) => `
    <div class="stat-item">
      <span class="stat-value">${value}</span>
      <span class="stat-label">${label}</span>
    </div>
  `).join('');
};

// ============================================
// 7. Cambio de tema claro / oscuro
// ============================================

const toggleTheme = () => {
  const current  = document.documentElement.dataset.theme ?? 'light';
  const newTheme = current === 'dark' ? 'light' : 'dark';

  document.documentElement.dataset.theme = newTheme;
  themeToggle.querySelector('.theme-icon').textContent = newTheme === 'dark' ? '☀' : '☽';
  localStorage.setItem('theme', newTheme);
};

const loadTheme = () => {
  const saved = localStorage.getItem('theme') ?? 'light';
  document.documentElement.dataset.theme = saved;
  themeToggle.querySelector('.theme-icon').textContent = saved === 'dark' ? '☀' : '☽';
};

// ============================================
// 8. Copiar email
// ============================================

const copyEmail = () => {
  const { email } = cemeteryData.contact;
  navigator.clipboard.writeText(email).then(() => {
    showToast('📋 Email copiado correctamente');
  });
};

// ============================================
// 9. Toast de notificación
// ============================================

const showToast = (message) => {
  toastMessage.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
};

// ============================================
// 10. Event listeners
// ============================================

themeToggle.addEventListener('click', toggleTheme);
copyEmailBtn.addEventListener('click', copyEmail);
toggleSkills.addEventListener('click', handleToggleItems);

// ============================================
// 11. Inicialización
// ============================================

const init = () => {
  loadTheme();
  renderBasicInfo();
  renderItems();
  renderLinks();
  renderStats();
  console.log('✅ Sistema de Gestión de Cementerio inicializado correctamente');
};

init();