/**
 * GESTOR DE NECRÓPOLIS - Semana 2: Operadores y Métodos Modernos
 * Demuestra: spread, rest, default params, map/filter/reduce,
 *            object enhancements, computed properties, ES2022 methods
 */

// ─── Estado global ───────────────────────────────────────────────────────────
let items = [];
let editingItemId = null;

// ─── Datos de categorías (computed property names + shorthand) ───────────────
const buildCategory = (name, emoji) => ({ name, emoji }); // shorthand properties

const CATEGORIES = {
  mausoleum: buildCategory('Mausoleo', '🛕'),
  crypt:     buildCategory('Cripta',   '🗝️'),
  garden:    buildCategory('Jardín',   '🌿'),
  ossuary:   buildCategory('Osario',   '💀'),
};

const PRIORITY_LABELS = {
  high:   '🔴 Urgente',
  medium: '🟡 Regular',
  low:    '🟢 Baja',
};

// ─── Persistencia ─────────────────────────────────────────────────────────────
const DB_KEY = 'cementerio_db';

const loadItems  = ()      => JSON.parse(localStorage.getItem(DB_KEY) ?? '[]');
const saveItems  = (data)  => localStorage.setItem(DB_KEY, JSON.stringify(data));

// ─── Fábrica de items (default parameters) ───────────────────────────────────
const createItem = ({
  id          = Date.now(),
  name        = 'Sin nombre',
  description = '',
  category    = 'mausoleum',
  priority    = 'medium',
  active      = true,
  createdAt   = new Date().toLocaleDateString('es-ES'),
} = {}) => ({ id, name, description, category, priority, active, createdAt }); // shorthand

// ─── Estadísticas con reduce ──────────────────────────────────────────────────
const getStats = (arr) =>
  arr.reduce(
    (acc, item) => {
      acc.total++;
      if (item.active) acc.active++;

      // computed property name para contar por categoría
      const key = `cat_${item.category}`;
      acc[key] = Object.hasOwn(acc, key) ? acc[key] + 1 : 1; // ES2022: Object.hasOwn()

      return acc;
    },
    { total: 0, active: 0 }
  );

// ─── Filtrado con filter + encadenamiento ─────────────────────────────────────
const applyFilters = (arr, { search = '', status = 'all', category = 'all' } = {}) =>
  arr
    .filter(item => {
      const matchSearch   = item.name.toLowerCase().includes(search.toLowerCase()) ||
                            item.description.toLowerCase().includes(search.toLowerCase());
      const matchStatus   = status === 'all'     ||
                            (status === 'active'   &&  item.active) ||
                            (status === 'inactive' && !item.active);
      const matchCategory = category === 'all'   || item.category === category;
      return matchSearch && matchStatus && matchCategory;
    });

// ─── Renderizar lista con map ─────────────────────────────────────────────────
const renderItem = ({ id, name, description, category, active, priority, createdAt }) => {
  const cat = CATEGORIES[category];
  return `
    <div class="task-item ${active ? '' : 'completed'} priority-${priority}" data-item-id="${id}">
      <input type="checkbox" class="task-checkbox" ${active ? '' : 'checked'} aria-label="Archivar">
      <div class="task-content">
        <h3 class="task-name">${name}</h3>
        <p class="task-desc">${description || '<em>Sin epitafio...</em>'}</p>
        <div class="task-meta">
          <span class="task-badge badge-cat">${cat.emoji} ${cat.name}</span>
          <span class="task-badge badge-pri">${PRIORITY_LABELS[priority]}</span>
          <span class="task-date">📅 ${createdAt}</span>
        </div>
      </div>
      <div class="task-actions">
        <button class="btn-edit"  title="Editar">✏️</button>
        <button class="btn-delete" title="Eliminar">🗑️</button>
      </div>
    </div>`;
};

// ─── Render principal ─────────────────────────────────────────────────────────
const refreshUI = () => {
  const search   = document.getElementById('search-input').value;
  const status   = document.getElementById('filter-status').value;
  const category = document.getElementById('filter-category').value;

  const filtered = applyFilters(items, { search, status, category });
  const listEl   = document.getElementById('item-list');
  const emptyEl  = document.getElementById('empty-state');

  if (filtered.length === 0) {
    listEl.innerHTML = '';
    emptyEl.style.display = 'block';
  } else {
    // map para convertir items en HTML, join para concatenar
    listEl.innerHTML = filtered.map(renderItem).join('');
    emptyEl.style.display = 'none';
  }

  renderStats();
  logEvent('refreshUI', `${filtered.length} items renderizados de ${items.length} totales`);
};

// ─── Render de estadísticas ───────────────────────────────────────────────────
const renderStats = () => {
  const stats = getStats(items);
  document.getElementById('stat-total').textContent  = stats.total;
  document.getElementById('stat-active').textContent = stats.active;

  // Object.entries() para iterar categorías dinámicamente
  const details = Object.entries(CATEGORIES)
    .map(([key, { name, emoji }]) => {
      const count = stats[`cat_${key}`] ?? 0;
      return count > 0 ? `<span>${emoji} ${name}: <strong>${count}</strong></span>` : '';
    })
    .filter(Boolean)   // filter para eliminar cadenas vacías
    .join(' · ');

  document.getElementById('stats-details').innerHTML = details || '<em>Sin registros</em>';
};

// ─── Formulario: submit ───────────────────────────────────────────────────────
const handleFormSubmit = (e) => {
  e.preventDefault();

  const formData = {
    name:        document.getElementById('item-name').value.trim(),
    description: document.getElementById('item-description').value.trim(),
    category:    document.getElementById('item-category').value,
    priority:    document.getElementById('item-priority').value,
  };

  if (editingItemId) {
    // spread para mantener propiedades existentes (createdAt, active, id)
    items = items.map(i =>
      i.id === editingItemId ? { ...i, ...formData } : i
    );
    showToast('Registro actualizado ✅');
  } else {
    // spread para agregar nuevo item al array sin mutar el original
    items = [...items, createItem(formData)];
    showToast('Nuevo registro inscrito ⚖️');
  }

  saveItems(items);
  resetForm();
  refreshUI();
};

// ─── Acciones sobre items ─────────────────────────────────────────────────────
const toggleActive = (id) => {
  // map para crear nuevo array con el item modificado (spread)
  items = items.map(i => i.id === id ? { ...i, active: !i.active } : i);
  saveItems(items);
  refreshUI();
};

const deleteItem = (id) => {
  // filter para excluir el item eliminado
  items = items.filter(i => i.id !== id);
  saveItems(items);
  refreshUI();
  showToast('Registro eliminado 🗑️');
};

const startEdit = (id) => {
  // find para localizar el item
  const item = items.find(i => i.id === id);
  if (!item) return;

  editingItemId = id;

  // Poblar formulario con datos del item
  document.getElementById('item-name').value        = item.name;
  document.getElementById('item-description').value = item.description;
  document.getElementById('item-category').value    = item.category;
  document.getElementById('item-priority').value    = item.priority;
  document.getElementById('form-title').textContent = '✏️ Editar Inscripción';
  document.getElementById('submit-btn').textContent = 'Actualizar';
  document.getElementById('cancel-btn').style.display = 'inline-block';

  document.getElementById('item-name').focus();
};

const resetForm = () => {
  editingItemId = null;
  document.getElementById('item-form').reset();
  document.getElementById('form-title').textContent   = '➕ Nueva Inscripción';
  document.getElementById('submit-btn').textContent   = 'Inscribir';
  document.getElementById('cancel-btn').style.display = 'none';
};

// ─── Limpiar archivados ───────────────────────────────────────────────────────
const clearInactive = () => {
  // filter para quedarnos solo con los activos
  const before = items.length;
  items = items.filter(i => i.active);
  const removed = before - items.length;
  saveItems(items);
  refreshUI();
  showToast(removed > 0 ? `${removed} archivo(s) eliminado(s) 🧹` : 'No hay archivados');
};

// ─── Rest parameters: función utilitaria de log ───────────────────────────────
const logEvent = (event, ...details) => {
  // rest parameters captura cualquier cantidad de detalles adicionales
  console.log(`[Necrópolis | ${event}]`, ...details);
};

// ─── Toast ────────────────────────────────────────────────────────────────────
const showToast = (msg = 'Operación exitosa') => {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
  logEvent('Toast', msg);
};

// ─── Tema ─────────────────────────────────────────────────────────────────────
const initTheme = () => {
  const saved = localStorage.getItem('theme') ?? 'light';
  document.documentElement.setAttribute('data-theme', saved);
  document.getElementById('theme-toggle').textContent = saved === 'dark' ? '☀️' : '🌙';
};

const toggleTheme = () => {
  const current = document.documentElement.getAttribute('data-theme');
  const next    = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
  document.getElementById('theme-toggle').textContent = next === 'dark' ? '☀️' : '🌙';
};

// ─── Delegación de eventos en la lista ───────────────────────────────────────
const handleListClick = (e) => {
  const itemEl = e.target.closest('[data-item-id]');
  if (!itemEl) return;

  const id = Number(itemEl.dataset.itemId);

  // Usar closest() para detectar el botón aunque el clic sea en el emoji hijo
  if      (e.target.closest('.btn-edit'))        startEdit(id);
  else if (e.target.closest('.btn-delete'))      deleteItem(id);
  else if (e.target.closest('.task-checkbox'))   toggleActive(id);
};

// ─── Init ─────────────────────────────────────────────────────────────────────
const init = () => {
  items = loadItems();

  // Eventos del formulario
  document.getElementById('item-form').addEventListener('submit', handleFormSubmit);
  document.getElementById('cancel-btn').addEventListener('click', resetForm);
  document.getElementById('clear-inactive').addEventListener('click', clearInactive);

  // Delegación de eventos en lista
  document.getElementById('item-list').addEventListener('click', handleListClick);

  // Filtros en tiempo real
  ['search-input', 'filter-status', 'filter-category'].forEach(id => {
    document.getElementById(id).addEventListener('input', refreshUI);
  });

  // Tema
  document.getElementById('theme-toggle').addEventListener('click', toggleTheme);
  initTheme();

  refreshUI();
  logEvent('Sistema iniciado', `${items.length} registros cargados`);
};

document.addEventListener('DOMContentLoaded', init);