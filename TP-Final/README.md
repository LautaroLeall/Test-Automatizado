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

**Resultado:** ✅ 3/3 PASSING · Cobertura: ~75%

```bash
npm run test:unit      # Correr los 3 tests
npm run coverage       # Correr con reporte de cobertura NYC
```

👉 Ver documentación completa en [`unit-tests/README.md`](./unit-tests/README.md)

---

## 🟢 Parte 2: Tests de Integración (Postman + Newman)

**API probada:** `publicationRouter.js` — Módulo de publicaciones de Fleeswap en producción.

| Test | Endpoint                       | Método  | Qué valida                                             |
| ---- | ------------------------------ | ------- | ------------------------------------------------------ |
| IT01 | `/api/publications`            | `GET`   | Status 200 + Array `publications` con paginación       |
| IT02 | `/api/publications`            | `POST`  | Seguridad: 401 + mensaje `"Token no proporcionado"`    |
| IT03 | `/api/publications/1234567890` | `GET`   | Error: 400 + mensaje `"ID invalido"` (Mongo CastError) |
| IT04 | `/api/publications/:id/status` | `PATCH` | Seguridad: 401 + mensaje `"Token no proporcionado"`    |

**Resultado:** ✅ 4/4 Requests · 6/6 Assertions · 0 Failures

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

## ❓ Preguntas y Respuestas – Defensa del TP Final

### Q1: ¿Por qué no hiciste todos tus tests con Katalon Studio si es lo que ve el usuario real?

Los tests E2E son lentos, costosos de mantener y frágiles si cambia la UI. La base deben ser los tests **unitarios** (rápidos, sin dependencias), luego **integración** (API real), y E2E solo para flujos críticos. Esto se llama la **Pirámide de Testing**: muchos unitarios abajo, pocos E2E arriba.

---

### Q2: ¿Qué es el patrón Arrange-Act-Assert (AAA)?

Es la estructura de tres pasos para diseñar un test:

- **Arrange:** Preparar los datos de entrada (`titulo = "Silla gamer"`, `tipo = "trueque"`).
- **Act:** Ejecutar la función (`var resultado = main.validarPublicacion(...)`).
- **Assert:** Verificar el resultado (`assert.strictEqual(resultado.valido, true)`).

Aplicado en el **UT01** de los tests unitarios.

---

### Q3: ¿Qué es un Stub de Sinon y por qué lo usaste?

Un Stub es un "doble de prueba" que **reemplaza temporalmente** una función real para forzar un comportamiento controlado. Se usó en **UT02** para inyectar el valor ficticio `"canje"` en `getTiposValidos()`, aislando la lógica de validación del entorno real de Fleeswap y probando que funciona bien ante cualquier lista de valores.

---

### Q4: En UT03, ¿por qué envolvés la llamada en `function() { ... }`?

Porque si llamás directamente a una función que lanza un error, el test explota antes de que Chai pueda capturarlo. Al envolverla en una función anónima, **Chai la ejecuta en modo controlado**, atrapa el `throw new Error(...)` y verifica que el mensaje sea `"Tipo no válido"`. Es la sintaxis obligatoria de Chai para testear excepciones.

---

### Q5: Si NYC da 100% de Coverage, ¿el código no tiene bugs?

**No.** El coverage solo mide si el test "pasó por" todas las líneas del código. No garantiza que se hayan probado todos los casos lógicos del negocio, ni que el código haga lo que el usuario realmente necesita. Es una métrica de **alcance**, no de **calidad**.

---

### Q6: ¿Por qué probás el 401 en integración y no en un test unitario?

Porque el rechazo por falta de Token lo hace el **middleware `authenticate`** a nivel de la ruta HTTP de Express. Un test unitario solo prueba funciones aisladas y no puede levantar el servidor completo. El test de integración es el único que evalúa la **tubería completa**: Express → Middleware → Route → Controller → Service.

---

### Q7: ¿Qué ventaja te da usar `{{baseUrl}}` en el Environment de Postman?

Evita reescribir todos los tests si cambiás de entorno. Hoy probás contra OnRender (`https://fleeswap-backend.onrender.com`), mañana creás un entorno "Local" apuntando a `localhost:3000` y **reutilizás exactamente la misma colección** sin modificar ninguna petición.

---

### Q8: En E2E03, ¿por qué el Delay de 1 segundo antes de verificar el cartel de error?

Porque **React es asíncrono**. Al hacer clic en "Iniciar sesión", el frontend hace la petición al backend y tarda milisegundos en recibir el 401 y renderizar el componente de error en el DOM. Si Katalon buscara el elemento instantáneamente, el test fallaría porque el mensaje todavía no existe en el árbol HTML.

---

### Q9: ¿Qué es el Object Repository en Katalon?

Es la base de datos interna donde Katalon guarda las "identidades" de los elementos HTML de la página (agrupados en `Page_Fleeswap`). Usa **localizadores XPath o CSS** capturados automáticamente durante el Record & Playback. En el Groovy Script, `findTestObject('Page_Fleeswap/button_Inici sesin')` recupera ese localizador y el driver de Selenium sabe exactamente sobre qué elemento del DOM debe actuar.

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
