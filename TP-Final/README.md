# 🎯 TP Final – Testeo Automatizado

## UNSTA 2026 | Leal Del Prete, Lautaro

**Aplicación bajo prueba:** [Fleeswap](https://fleeswap.vercel.app/) — plataforma de intercambio y venta de objetos entre usuarios  
**Backend:** [https://fleeswap-backend.onrender.com](https://fleeswap-backend.onrender.com) (Node.js + Express + MongoDB + JWT)  
**Repositorio Frontend:** [github.com/BenjaZelaya/Fleeswap-Frontend](https://github.com/BenjaZelaya/Fleeswap-Frontend)

---

## 📐 Estructura General del Proyecto

```
TP-Final/
  ├── package.json                   ← Scripts para correr unit tests + integración
  ├── .gitignore                     ← Excluye node_modules, coverage, Reports, etc.
  │
  ├── unit-tests/                    🔵 PARTE 1: Tests Unitarios
  │    ├── validarPublicacion.js     ← Módulo lógico espejo del backend (sin dependencias)
  │    ├── test/
  │    │    └── validarPublicacion.test.js  ← 3 tests: Mocha + Chai + Sinon
  │    └── README.md                ← Documentación, trazabilidad y Q&A Unitarios
  │
  ├── integration-tests/             🟢 PARTE 2: Tests de Integración
  │    ├── Fleeswap_Collection.json ← Colección Newman (4 requests + assertions)
  │    ├── Fleeswap_Environment.json← Variable {{baseUrl}}
  │    ├── postman/                 ← Carpeta de sincronización Postman v11 (YAML)
  │    ├── newman/                  ← Reporte HTML generado automáticamente
  │    └── README.md               ← Documentación, scripts y Q&A Integración
  │
  └── e2e-katalon/                   🔴 PARTE 3: Tests E2E
       ├── TP-Final.prj             ← Archivo de proyecto Katalon Studio
       ├── Test Cases/              ← 3 casos de prueba (.tc)
       ├── Scripts/                 ← Scripts Groovy grabados
       ├── Object Repository/       ← Localizadores de elementos HTML
       ├── Test Suites/             ← Suite que agrupa los 3 tests
       └── README.md               ← Documentación, trazabilidad y Q&A E2E
```

---

## 🛠️ Stack Tecnológico

| Herramienta                   | Versión | Capa        | Uso                                           |
| ----------------------------- | ------- | ----------- | --------------------------------------------- |
| **Mocha**                     | ^11     | Unitaria    | Framework de ejecución de tests en Node.js    |
| **Chai**                      | ^6      | Unitaria    | Aserciones: `assert`, `expect`, `should`      |
| **Sinon.js**                  | ^21     | Unitaria    | Dobles de prueba: `Stub` para aislamiento     |
| **NYC (Istanbul)**            | ^18     | Unitaria    | Cobertura de código (Coverage Report)         |
| **Postman**                   | v11     | Integración | Diseño visual de requests y scripts de test   |
| **Newman**                    | ^6      | Integración | Ejecución CLI de colecciones Postman          |
| **newman-reporter-htmlextra** | ^1      | Integración | Reporte HTML interactivo post-ejecución       |
| **Katalon Studio**            | v10+    | E2E         | Record & Playback + Groovy Scripts + Selenium |

---

## 🔵 Parte 1: Tests Unitarios (Mocha + Chai + Sinon + NYC)

**Módulo probado:** `validarPublicacion.js` — replica la lógica de validación de publicaciones de Fleeswap (reglas reales de `publication.model.js`).

| Test | Tipo       | Descripción                                          | Chai Style |
| ---- | ---------- | ---------------------------------------------------- | ---------- |
| UT01 | Happy Path | Publicación válida (tipo: trueque, condición: bueno) | `assert`   |
| UT02 | Stub       | Tipo ficticio `"canje"` inyectado por Sinon          | `should`   |
| UT03 | Edge Path  | Tipo inválido `"regalo"` lanza `Error` controlado    | `expect`   |
| UT04 | Edge Path  | Título vacío `""` lanza `Error` controlado           | `expect`   |
| UT05 | Edge Path  | Título > 100 caracteres lanza `Error` controlado     | `expect`   |
| UT06 | Edge Path  | Condición inválida lanza `Error` controlado          | `expect`   |
| UT07 | Happy Path | Función pura `getCategoriasValidas()`                | `assert`   |
| UT08 | Happy Path | Función `getTiposValidos()` restaurando el Stub      | `assert`   |

**Resultado:** ✅ 8/8 PASSING · Cobertura: 100%

```bash
npm run test:unit      # Correr los 8 tests
npm run coverage       # Correr con reporte de cobertura NYC
```

👉 Ver documentación completa en [`unit-tests/README.md`](./unit-tests/README.md)

---

## 🟢 Parte 2: Tests de Integración (Postman + Newman)

**API probada:** `publicationRouter.js` — Módulo de publicaciones de Fleeswap en producción.

| Test | Endpoint                       | Método | Qué valida                                             |
| ---- | ------------------------------ | ------ | ------------------------------------------------------ |
| IT01 | `/api/publications`            | `GET`  | Status 200 + Array `publications` con paginación       |
| IT02 | `/api/publications`            | `POST` | Seguridad: 401 + mensaje `"Token no proporcionado"`    |
| IT03 | `/api/publications/1234567890` | `GET`  | Error: 400 + mensaje `"ID inválido"` (Mongo CastError) |

**Resultado:** ✅ 3/3 Requests · 6/6 Assertions · 0 Failures

```bash
npm run test:integration   # Correr Newman + generar reporte HTML
```

👉 Ver documentación completa en [`integration-tests/README.md`](./integration-tests/README.md)

---

## 🔴 Parte 3: Tests E2E (Katalon Studio)

**App probada:** [https://fleeswap.vercel.app](https://fleeswap.vercel.app) — Flujos de usuario real en Chrome.

| Test  | Flujo                           | Tipo       | Verificación clave                                       |
| ----- | ------------------------------- | ---------- | -------------------------------------------------------- |
| E2E01 | Home → Explorar → Filtros       | Happy Path | El catálogo carga y responde a los filtros de tipo       |
| E2E02 | Login → Perfil                  | Happy Path | Autenticación exitosa y navegación a zona privada        |
| E2E03 | Login con contraseña incorrecta | Edge Path  | Aparición del mensaje `"Email o contraseña incorrectos"` |

**Resultado:** ✅ 3/3 scripts grabados con `verifyElementVisible` y `STOP_ON_FAILURE`

👉 Abrir `TP-Final.prj` en Katalon Studio y ejecutar la Test Suite desde la app.  
👉 Ver documentación completa en [`e2e-katalon/README.md`](./e2e-katalon/README.md)

---

## ▶️ Guía Rápida de Ejecución

```bash
# 1. Instalar dependencias
npm install

# 2. Correr tests unitarios
npm run test:unit

# 3. Correr tests unitarios con cobertura
npm run coverage

# 4. Correr tests de integración (requiere internet)
npm run test:integration

# 5. Tests E2E → Abrir TP-Final.prj en Katalon Studio y ejecutar la Test Suite
```
