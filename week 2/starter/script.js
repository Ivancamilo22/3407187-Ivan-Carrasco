// ─── Estado ───────────────────────────────────────────────────────────────
    let items = [];
    let editingId = null;

    // ─── Categorías (shorthand properties) ───────────────────────────────────
    const buildCategory = (name, emoji) => ({ name, emoji });

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

    // ─── Fábrica de items (default parameters) ────────────────────────────────
    const createItem = ({
      name        = 'Sin nombre',
      description = '',
      category    = 'mausoleum',
      priority    = 'medium',
      active      = true,
      id          = Date.now(),
      createdAt   = new Date().toLocaleDateString('es-ES'),
    } = {}) => ({ id, name, description, category, priority, active, createdAt });

    // ─── Stats con reduce ─────────────────────────────────────────────────────
    const getStats = (arr) =>
      arr.reduce((acc, item) => {
        acc.total++;
        if (item.active) acc.active++;
        // computed property name
        const key = `cat_${item.category}`;
        acc[key] = Object.hasOwn(acc, key) ? acc[key] + 1 : 1; // ES2022
        return acc;
      }, { total: 0, active: 0 });

    // ─── Filtros encadenados ──────────────────────────────────────────────────
    const applyFilters = (arr, { search = '', status = 'all', category = 'all' } = {}) =>
      arr.filter(item => {
        const q = search.toLowerCase();
        const matchSearch   = item.name.toLowerCase().includes(q) || item.description.toLowerCase().includes(q);
        const matchStatus   = status === 'all' || (status === 'active' && item.active) || (status === 'inactive' && !item.active);
        const matchCategory = category === 'all' || item.category === category;
        return matchSearch && matchStatus && matchCategory;
      });

    // ─── Render de un item con map ────────────────────────────────────────────
    const renderItem = ({ id, name, description, category, active, priority, createdAt }) => {
      const cat = CATEGORIES[category];
      return `
        <div class="task-item ${active ? '' : 'completed'} priority-${priority}" data-id="${id}">
          <input type="checkbox" class="chk" ${active ? '' : 'checked'}>
          <div class="task-content">
            <h3 class="task-name">${name}</h3>
            <p class="task-desc">${description || '<em>Sin epitafio...</em>'}</p>
            <div class="task-meta">
              <span class="task-badge">${cat.emoji} ${cat.name}</span>
              <span class="task-badge">${PRIORITY_LABELS[priority]}</span>
              <span class="task-date">📅 ${createdAt}</span>
            </div>
          </div>
          <div class="task-actions">
            <button class="btn-icon edit-btn" data-id="${id}">✏️</button>
            <button class="btn-icon danger del-btn" data-id="${id}">🗑️</button>
          </div>
        </div>`;
    };

    // ─── Render principal ─────────────────────────────────────────────────────
    const render = () => {
      const search   = document.getElementById('search-input').value;
      const status   = document.getElementById('filter-status').value;
      const category = document.getElementById('filter-category').value;

      // filter + map + join encadenados
      const filtered = applyFilters(items, { search, status, category });
      const html     = filtered.map(renderItem).join('');

      document.getElementById('item-list').innerHTML   = html;
      document.getElementById('empty-state').style.display = filtered.length === 0 ? 'block' : 'none';

      // Stats
      const stats   = getStats(items);
      document.getElementById('stat-total').textContent  = stats.total;
      document.getElementById('stat-active').textContent = stats.active;

      // Object.entries + map + filter + join
      const details = Object.entries(CATEGORIES)
        .map(([key, { name, emoji }]) => {
          const count = stats[`cat_${key}`] ?? 0;
          return count > 0 ? `<span>${emoji} ${name}: <strong>${count}</strong></span>` : '';
        })
        .filter(Boolean)
        .join(' · ');

      document.getElementById('stats-details').innerHTML = details || '<em>Sin registros</em>';
    };

    // ─── Agregar o editar item ────────────────────────────────────────────────
    const submitItem = () => {
      const name = document.getElementById('item-name').value.trim();
      if (!name) {
        showToast('El nombre es obligatorio ⚠️');
        document.getElementById('item-name').focus();
        return;
      }

      const formData = {
        name,
        description: document.getElementById('item-description').value.trim(),
        category:    document.getElementById('item-category').value,
        priority:    document.getElementById('item-priority').value,
      };

      if (editingId !== null) {
        // spread mantiene propiedades originales, sobreescribe con formData
        items = items.map(i => i.id === editingId ? { ...i, ...formData } : i);
        showToast('Registro actualizado ✅');
      } else {
        // spread para agregar sin mutar el array original
        items = [...items, createItem(formData)];
        showToast('Nuevo registro inscrito ⚖️');
      }

      clearForm();
      render();
    };

    // ─── Limpiar formulario ───────────────────────────────────────────────────
    const clearForm = () => {
      editingId = null;
      document.getElementById('item-name').value        = '';
      document.getElementById('item-description').value = '';
      document.getElementById('item-category').value    = 'mausoleum';
      document.getElementById('item-priority').value    = 'medium';
      document.getElementById('form-title').textContent = '➕ Nueva Inscripción';
      document.getElementById('btn-submit').textContent = 'Inscribir';
      document.getElementById('btn-cancel').style.display = 'none';
    };

    // ─── Editar ───────────────────────────────────────────────────────────────
    const startEdit = (id) => {
      const item = items.find(i => i.id === id); // find
      if (!item) return;
      editingId = id;
      document.getElementById('item-name').value        = item.name;
      document.getElementById('item-description').value = item.description;
      document.getElementById('item-category').value    = item.category;
      document.getElementById('item-priority').value    = item.priority;
      document.getElementById('form-title').textContent = '✏️ Editar Inscripción';
      document.getElementById('btn-submit').textContent = 'Actualizar';
      document.getElementById('btn-cancel').style.display = 'inline-block';
      document.getElementById('item-name').focus();
    };

    // ─── Eliminar ─────────────────────────────────────────────────────────────
    const deleteItem = (id) => {
      items = items.filter(i => i.id !== id); // filter
      render();
      showToast('Registro eliminado 🗑️');
    };

    // ─── Archivar/activar ─────────────────────────────────────────────────────
    const toggleItem = (id) => {
      items = items.map(i => i.id === id ? { ...i, active: !i.active } : i); // spread
      render();
    };

    // ─── Limpiar archivados ───────────────────────────────────────────────────
    const clearInactive = () => {
      const before  = items.length;
      items         = items.filter(i => i.active); // filter
      const removed = before - items.length;
      render();
      showToast(removed > 0 ? `${removed} archivado(s) eliminado(s) 🧹` : 'No hay archivados');
    };

    // ─── Rest parameters: log ─────────────────────────────────────────────────
    const logEvent = (event, ...details) =>
      console.log(`[Necrópolis | ${event}]`, ...details);

    // ─── Toast ────────────────────────────────────────────────────────────────
    const showToast = (msg) => {
      const el = document.getElementById('toast');
      el.textContent = msg;
      el.classList.add('show');
      setTimeout(() => el.classList.remove('show'), 2500);
    };

    // ─── Tema ─────────────────────────────────────────────────────────────────
    const toggleTheme = () => {
      const html = document.documentElement;
      const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      html.setAttribute('data-theme', next);
      document.getElementById('theme-toggle').textContent = next === 'dark' ? '☀️' : '🌙';
    };

    // ─── Inicializar ──────────────────────────────────────────────────────────
    document.getElementById('btn-submit').addEventListener('click', submitItem);
    document.getElementById('btn-cancel').addEventListener('click', clearForm);
    document.getElementById('btn-clear').addEventListener('click', clearInactive);
    document.getElementById('theme-toggle').addEventListener('click', toggleTheme);

    // Enter en el input de nombre también hace submit
    document.getElementById('item-name').addEventListener('keydown', (e) => {
      if (e.key === 'Enter') submitItem();
    });

    // Filtros en tiempo real
    ['search-input', 'filter-status', 'filter-category'].forEach(id => {
      document.getElementById(id).addEventListener('input', render);
    });

    // Delegación de eventos en la lista
    document.getElementById('item-list').addEventListener('click', (e) => {
      const editBtn = e.target.closest('.edit-btn');
      const delBtn  = e.target.closest('.del-btn');
      const chk     = e.target.closest('.chk');

      if (editBtn) startEdit(Number(editBtn.dataset.id));
      else if (delBtn) deleteItem(Number(delBtn.dataset.id));
      else if (chk) {
        const itemEl = e.target.closest('[data-id]');
        if (itemEl) toggleItem(Number(itemEl.dataset.id));
      }
    });

    // Render inicial
    render();
    logEvent('Sistema iniciado');