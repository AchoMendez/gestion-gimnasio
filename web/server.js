// API REST del gimnasio + servidor de las dos vistas (web y móvil).
// Issue #1 - HU-07: "Como socio del gimnasio, quiero reservar un cupo
// en una clase grupal, para asegurar mi lugar antes de que se llene."
const express = require("express");
const path = require("path");

const app = express();
app.use(express.json());

// ---- Datos en memoria (suficiente para la demo funcional) ----
let clases = [
  { id: 1, nombre: "Spinning", horario: "Lunes 18:00", cupo_total: 5, cupo_disponible: 5 },
  { id: 2, nombre: "Yoga", horario: "Martes 19:00", cupo_total: 3, cupo_disponible: 3 },
  { id: 3, nombre: "Funcional", horario: "Miércoles 07:00", cupo_total: 1, cupo_disponible: 1 },
];
let reservas = [];
let nextReservaId = 1;

// ---- API REST (CU-03 / HU-07) ----

// Listar clases y sus cupos disponibles.
app.get("/api/clases", (req, res) => {
  res.json(clases);
});

// Reservar un cupo en una clase.
app.post("/api/reservas", (req, res) => {
  const { clase_id, socio } = req.body;

  const clase = clases.find((c) => c.id === Number(clase_id));
  if (!clase) {
    return res.status(404).json({ error: "La clase no existe." });
  }
  if (!socio || !socio.trim()) {
    return res.status(400).json({ error: "Debe indicar el nombre del socio." });
  }

  // Flujo alterno 5a: reserva repetida en la misma clase.
  const yaReservo = reservas.find((r) => r.clase_id === clase.id && r.socio === socio);
  if (yaReservo) {
    return res.status(409).json({ error: `${socio} ya tiene una reserva activa en ${clase.nombre}.` });
  }

  // Flujo alterno 4a: sin cupos disponibles.
  if (clase.cupo_disponible <= 0) {
    return res.status(400).json({ error: `No hay cupos disponibles en ${clase.nombre}.` });
  }

  // Flujo básico: registrar la reserva y actualizar el cupo.
  clase.cupo_disponible -= 1;
  const reserva = {
    id: nextReservaId++,
    clase_id: clase.id,
    clase_nombre: clase.nombre,
    socio,
    fecha: new Date().toISOString(),
  };
  reservas.push(reserva);

  res.status(201).json({ reserva, clase });
});

// Listar reservas (para evidencia / depuración).
app.get("/api/reservas", (req, res) => {
  res.json(reservas);
});

// ---- Vistas estáticas ----
// Panel de recepción (producto web) en "/".
app.use("/", express.static(path.join(__dirname, "public")));
// App del socio (producto móvil) en "/app".
app.use("/app", express.static(path.join(__dirname, "..", "movil", "public")));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Gestión de Gimnasio corriendo en http://localhost:${PORT}`);
  console.log(`  Panel de recepción (web):   http://localhost:${PORT}/`);
  console.log(`  App del socio (móvil):      http://localhost:${PORT}/app`);
});
