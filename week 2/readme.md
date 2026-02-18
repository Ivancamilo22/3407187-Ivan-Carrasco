# 🚀 Proyecto Semana 2 – Gestor de Tareas
## JavaScript Moderno Bootcamp – Semana 2 de 28

Aplicación web interactiva para la gestión de registros desarrollada aplicando operadores y métodos modernos de ES2022+.

---

## 🎯 Objetivo del Proyecto

Demostrar dominio práctico de:

- Spread operator (...)
- Rest parameters
- Default parameters avanzados
- Métodos modernos de arrays (map, filter, reduce)
- Object enhancements
- Computed property names
- Encadenamiento de métodos
- Object.hasOwn() (ES2022)

---

## 🧠 Conceptos Aplicados

### ✅ 1. Spread Operator (...)

Uso para mantener inmutabilidad en arrays y objetos.

```js
items = [...items, createItem(formData)];
```

```js
items = items.map(i =>
  i.id === editingId ? { ...i, ...formData } : i
);
```

Permite:
- Copiar arrays
- Actualizar objetos sin mutar el original
- Combinar estructuras de datos

---

### ✅ 2. Rest Parameters

Permite recibir múltiples argumentos dinámicamente:

```js
const logEvent = (event, ...details) =>
  console.log(`[System | ${event}]`, ...details);
```

Diferencia clave:
- Spread → Expande
- Rest → Agrupa

---

### ✅ 3. Default Parameters Avanzados

Implementados en la fábrica de objetos:

```js
const createItem = ({
  name = 'Sin nombre',
  description = '',
  category = 'mausoleum',
  priority = 'medium',
  active = true,
  id = Date.now(),
  createdAt = new Date().toLocaleDateString('es-ES'),
} = {}) => ({
  id,
  name,
  description,
  category,
  priority,
  active,
  createdAt
});
```

Incluye:
- Valores por defecto
- Expresiones dinámicas
- Parámetros dependientes

---

### ✅ 4. Métodos Modernos de Arrays

#### 🔹 map()

Transformación de datos:

```js
const html = filtered.map(renderItem).join('');
```

---

#### 🔹 filter()

Filtrado dinámico:

```js
items = items.filter(i => i.id !== id);
```

---

#### 🔹 reduce()

Cálculo de estadísticas:

```js
const getStats = (arr) =>
  arr.reduce((acc, item) => {
    acc.total++;
    if (item.active) acc.active++;

    const key = `cat_${item.category}`;
    acc[key] = Object.hasOwn(acc, key)
      ? acc[key] + 1
      : 1;

    return acc;
  }, { total: 0, active: 0 });
```

---

### ✅ 5. Object Enhancements

#### 🔹 Property Shorthand

```js
({ id, name, description, category, priority, active, createdAt })
```

---

#### 🔹 Computed Property Names

```js
const key = `cat_${item.category}`;
```

---

#### 🔹 Object.hasOwn() (ES2022)

```js
Object.hasOwn(acc, key)
```

Evita problemas con propiedades heredadas.

---

### ✅ 6. Encadenamiento de Métodos

Uso combinado de múltiples métodos:

```js
Object.entries(CATEGORIES)
  .map(([key, { name, emoji }]) => {
    const count = stats[`cat_${key}`] ?? 0;
    return count > 0
      ? `<span>${emoji} ${name}: <strong>${count}</strong></span>`
      : '';
  })
  .filter(Boolean)
  .join(' · ');
```

Beneficio:
- Código declarativo
- Más legible que bucles tradicionales

---

## 🏗️ Estructura del Proyecto

```
week-02/
│
├── index.html
├── styles.css
├── starter/
│   └── script.js
├── pictures/
│   ├── logo.png
│   └── estrella.ico
└── README.md
```

---

## ⚙️ Funcionalidades

- Crear nuevos registros
- Editar registros
- Eliminar registros
- Archivar / Activar registros
- Filtrar por estado
- Filtrar por categoría
- Búsqueda en tiempo real
- Estadísticas dinámicas con reduce()
- Cambio de tema (Light / Dark)
- Eliminación de archivados

---

## 🧪 Criterios de Evaluación Cumplidos

✔ Uso correcto de spread  
✔ Uso de rest parameters  
✔ Default parameters avanzados  
✔ Uso correcto de map, filter y reduce  
✔ Uso de Object.hasOwn()  
✔ Encadenamiento de métodos  
✔ Código limpio y estructurado  
✔ Proyecto funcional  

---

## 💡 Principios Aplicados

- Inmutabilidad
- Programación funcional
- Separación de responsabilidades
- Código declarativo
- Buenas prácticas modernas de ES2022+

---

## 🎓 Conclusión

El proyecto demuestra dominio práctico de los operadores y métodos modernos de JavaScript aplicados en un entorno funcional.

Se priorizó:

- Legibilidad
- Inmutabilidad
- Uso correcto de ES2022+
- Organización del código
- Encadenamiento de métodos

---

**Semana 2 completada.**
