// src/helpers/SortData.js
const sortData = (data, sortBy, order = "asc") => {
  // Guardas para evitar data[0] undefined
  if (!Array.isArray(data) || data.length === 0) return [];
  if (!sortBy) return [...data];

  const dir = order === "desc" ? -1 : 1;

  return [...data].sort((a, b) => {
    const va = a?.[sortBy];
    const vb = b?.[sortBy];

    // Nulos/undefined al final
    if (va == null && vb == null) return 0;
    if (va == null) return 1;
    if (vb == null) return -1;

    // Números reales
    if (typeof va === "number" && typeof vb === "number") {
      return dir * (va - vb);
    }

    // Números en string (por si vienen como "3384")
    const na = Number(va);
    const nb = Number(vb);
    if (!Number.isNaN(na) && !Number.isNaN(nb)) {
      return dir * (na - nb);
    }

    // Fechas (por si sortBy es fecha_inicio_reporte)
    const da = new Date(va);
    const db = new Date(vb);
    if (!Number.isNaN(da.getTime()) && !Number.isNaN(db.getTime())) {
      return dir * (da.getTime() - db.getTime());
    }

    // Strings / fallback
    return (
      dir *
      String(va).localeCompare(String(vb), "es", {
        numeric: true,
        sensitivity: "base",
      })
    );
  });
};

export default sortData;
