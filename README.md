# Test Automatizado – 3er Año 🚀

Repositorio de la materia **Test Automatizado** (UNSTA – 2026).
Cada carpeta es un Trabajo Práctico independiente con su propio entorno Node.js.

**Alumno:** Leal Del Prete, Lautaro

---

## 🛠️ Stack tecnológico

| Herramienta                                                                            | Versión | Uso                                      |
| -------------------------------------------------------------------------------------- | ------- | ---------------------------------------- |
| [Node.js](https://nodejs.org/)                                                         | v20+    | Entorno de ejecución base                |
| [Mocha](https://mochajs.org/)                                                          | ^11     | Framework de pruebas unitarias           |
| [Chai](https://www.chaijs.com/)                                                        | ^6      | Aserciones: `assert`, `expect`, `should` |
| [Sinon.js](https://sinonjs.org/)                                                       | ^21     | Dobles de prueba: _Spies_, _Stubs_       |
| [Istanbul (NYC)](https://istanbul.js.org/)                                             | ^18     | Cobertura de código                      |
| [Newman](https://github.com/postmanlabs/newman)                                        | ^6      | Runner de colecciones Postman por CLI    |
| [newman-reporter-htmlextra](https://github.com/DannyDainton/newman-reporter-htmlextra) | ^1      | Reportes HTML de Newman                  |
| [Cypress](https://www.cypress.io/)                                                     | ^15     | Tests End-to-End (E2E)                   |
| [Katalon Studio](https://katalon.com/)                                                 | 9+      | Tests E2E con Groovy + Object Repository |

---

## 📁 Trabajos Prácticos

---

### 📂 TP N°1 – TDD (Test Driven Development)

> **Carpeta:** `1er-TP/`  
> **Metodología:** TDD  
> **Función implementada:** `factorial(n)` — calcula el factorial de un número entero.

**Tecnologías:** `mocha` · `chai`

**Estructura:**

```
1er-TP/
  ├── index.js           ← Función factorial
  └── test/
       └── indexTest.js  ← 6 pruebas unitarias (assert, expect, should)
```

**Pruebas implementadas:**

- `assert` → factorial(0) = 1, factorial(5) = 120
- `expect` → factorial(1) = 1, factorial(6) = 720
- `should` → factorial(4) = 24, lanza error para negativos

**▶️ Cómo correrlo:**

```bash
cd 1er-TP
npm install
npm test
```

---

### 📂 TP N°2 – Tests Unitarios con Dobles de Prueba y Cobertura

> **Carpeta:** `2do-TP/`  
> **Función implementada:** `generarCUIT(tipo, dni)` — genera un CUIT argentino válido en formato `NN-NNNNNNNN-N`.

**Tecnologías:** `mocha` · `chai` · `sinon` · `nyc (Istanbul)`

**Estructura:**

```
2do-TP/
  ├── index.js           ← Función generarCUIT + getTiposValidos
  └── test/
       └── indexTest.js  ← 11 pruebas unitarias + stub con Sinon
```

**Pruebas implementadas (11 en total):**

- `assert` → CUIT válido, con guiones, con letras, dígito verificador incorrecto
- `expect` → formato numérico, longitud, separadores con guiones
- `should` → null, tipo inválido, relleno con ceros
- `sinon.stub` → controla `getTiposValidos()` para simular tipos ficticios

**▶️ Cómo correrlo:**

```bash
cd 2do-TP
npm install
# Solo los tests:
npm test
# Tests + reporte de cobertura de código:
npm run coverage
```

---

### 📂 TP N°3 – Tests de Integración con Postman y Newman

> **Carpeta:** `3er-TP/`  
> **API bajo prueba:** [JSONPlaceholder](https://jsonplaceholder.typicode.com/) (API REST pública)

**Tecnologías:** `newman` · `newman-reporter-htmlextra` · Postman Collections

**Estructura:**

```
3er-TP/
  ├── JSONPlaceholder_Collection.json    ← Colección Postman (5 requests, 8 tests)
  ├── JSONPlaceholder_Environment.json   ← Entorno con variables: url, postId
  └── newman/                            ← Reportes HTML generados (ignorados en git)
```

**Requests y tests (8 assertions):**
| Método | Endpoint | Tests |
|--------|----------|-------|
| `GET` | `/posts/{{postId}}` | Status 200, body tiene `userId` |
| `POST` | `/posts` | Status 201, `id` = 101 |
| `PUT` | `/posts/{{postId}}` | Status 200 |
| `PATCH` | `/posts/{{postId}}` | Status 200, `title` actualizado |
| `DELETE` | `/posts/{{postId}}` | Status 200 |

**▶️ Cómo correrlo:**

```bash
cd 3er-TP
npm install
# Corre las pruebas y genera reporte HTML en /newman:
npm test
```

> El reporte HTML se genera automáticamente en la carpeta `newman/`. Abrí el archivo `.html` con el navegador para verlo.

---

### 📂 TP N°4 – Tests End to End con Cypress

> **Carpeta:** `4to-TP/`  
> **Sitio bajo prueba:** [FleeSwap](https://fleeswap.vercel.app/) — plataforma de intercambio

**Tecnologías:** `cypress` v15 · Electron (browser headless)

**Estructura:**

```
4to-TP/
  ├── cypress.config.js         ← Config: baseUrl, viewportWidth, timeouts
  └── cypress/
       ├── e2e/
       │    └── fleeswap.cy.js  ← 6 casos de prueba E2E ⭐
       └── support/
            └── e2e.js          ← Configuración base de soporte
```

**Casos de prueba E2E (6 en total, 6/6 ✅):**
| # | Caso | Prioridad |
|---|------|-----------|
| CP01 | La página principal carga correctamente | 🔴 Alta |
| CP02 | La página de Login muestra el formulario | 🔴 Alta |
| CP03 | Login con credenciales inválidas no redirige | 🔴 Alta |
| CP04 | La página de Registro muestra el formulario | 🔴 Alta |
| CP05 | El link "Registrarse" navega a `/register` | 🟡 Media |
| CP06 | Submit con campos vacíos no sale de `/login` | 🟡 Media |

**▶️ Cómo correrlo:**

```bash
cd 4to-TP
npm install
# Modo consola (headless) — muestra tabla de resultados:
npm test

# Modo interfaz gráfica — abre el dashboard de Cypress:
npm run cypress:open
```

> Con `cypress:open` podés ver los tests corriendo en vivo en el browser. Ideal para capturas de pantalla para el PDF. 📸

---

### 📂 TP N°5 – Tests End to End con Katalon Studio

> **Carpeta:** `5to-TP/`  
> **Sitio bajo prueba:** [Demoblaze](https://www.demoblaze.com) — e-commerce de práctica  
> **Herramienta:** Katalon Studio (Groovy + Object Repository)

**Tecnologías:** `Katalon Studio` · `Groovy` · `WebUI Keywords` · `GlobalVariables`

**Estructura del proyecto Katalon:**

```
5to-TP/
  ├── TP5_Demoblaze.prj                          ← Archivo de proyecto Katalon
  ├── Profiles/
  │    └── default.glbl                          ← Variables globales (G_URL, G_Timeout, credenciales)
  ├── Object Repository/
  │    └── Page_Demoblaze/
  │         ├── lnk_LogIn.rs                     ← Selectores robustos (sin XPath absoluto)
  │         ├── txt_LoginUsername.rs
  │         ├── btn_LoginSubmit.rs
  │         └── ... (13 objetos en total)
  ├── Test Cases/
  │    ├── TC01 Flujode Compra Completo.tc
  │    ├── TC02 Inicio de Sesión Exitoso.tc
  │    ├── TC03 Validación de Login con Credenciales Inválidas.tc
  │    └── TC04 Navegación y Filtrado Dinámico por Categorías.tc
  ├── Scripts/
  │    ├── TC01 Flujode Compra Completo/Script*.groovy
  │    ├── TC02 Inicio de Sesión Exitoso/Script*.groovy
  │    ├── TC03 Validación de Login con Credenciales Inválidas/Script*.groovy
  │    └── TC04 Navegación y Filtrado Dinámico por Categorías/Script*.groovy
  └── Test Suites/
       └── TS_TrabajoPractico5.ts                ← Suite con los 4 TCs en orden secuencial
```

**Casos de prueba E2E (4 en total):**
| # | Caso | Descripción |
|---|------|-------------|
| TC01 | Flujode Compra Completo | Login → Seleccionar producto → Agregar al carrito → Completar formulario de pago → Confirmación |
| TC02 | Inicio de Sesión Exitoso | Ingresar credenciales válidas → Enviar formulario → Validar acceso al sistema |
| TC03 | Validación de Login con Credenciales Inválidas | Ingresar credenciales erróneas → Enviar formulario → Validar mensaje de rechazo (alerta) |
| TC04 | Navegación y Filtrado Dinámico por Categorías | Clic en categoría → Esperar petición (AJAX) → Validar actualización correcta de productos |

**▶️ Cómo correrlo en Katalon Studio:**

```text
1. Abrir Katalon Studio
2. File > Open Project > seleccionar la carpeta 5to-TP/
3. En el panel izquierdo ir a Test Suites > TS_TrabajoPractico5
4. Hacer doble clic → Run → seleccionar Chrome
5. Ver resultados en el Log Viewer (todos deben terminar en PASSED)
```

> **⚠️ Importante antes de ejecutar:**  
> Abrí `Profiles/default.glbl` y actualizá `G_User_Valido` y `G_Password_Valida`  
> con un usuario **que ya esté registrado en Demoblaze**.
