# Gestión de Gimnasio

Sistema de Gestión de Gimnasio — Proyecto de Sistemas III.

Funcionalidad demostrada en esta actividad: **Reserva de Clases Grupales** (Issue #1),
aplicando el flujo de trabajo Git/GitHub para equipos XP: Issue → rama → commits → Pull Request → revisión del compañero → merge a `develop`.

## Estructura

- `web/` — API REST (Node/Express) + panel de recepción (HTML/JS) que consume la API.
- `movil/` — Vista del socio (HTML/JS, formato app) que consume la misma API REST.
- `docs/` — Caso de Uso (CU-03) e Historia de Usuario (HU-07) que originan la funcionalidad.

## Cómo correrlo

```bash
cd web
npm install
npm start   # http://localhost:3000       -> panel de recepción
            # http://localhost:3000/app   -> vista del socio (móvil)
```

Ambas vistas consumen la misma API (`/api/clases`, `/api/reservas`), por lo que una reserva hecha en una se refleja en la otra.
