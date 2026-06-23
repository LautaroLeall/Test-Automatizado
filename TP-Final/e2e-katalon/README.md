# 🔴 Tests E2E (End-to-End) – TP Final

## Testeo Automatizado – UNSTA 2026

**Frontend bajo prueba:** [Fleeswap](https://fleeswap.vercel.app/)  
**Herramientas:** `Katalon Studio` (Record & Playback / Groovy Scripts)

---

## 📌 ¿Qué es un Test E2E?

Un **test E2E (End-to-End)** evalúa la aplicación en su totalidad, exactamente como la experimentaría un usuario real desde un navegador.
A diferencia de las pruebas unitarias o de integración, los tests E2E cargan la interfaz gráfica (React), simulan clics de ratón, tipean texto e interactúan directamente con el DOM, verificando que los flujos completos funcionen en conjunto (Frontend + Backend + BD).

---

## 🎯 Análisis de los Test Cases Grabados

Se grabaron con éxito 3 flujos clave utilizando Katalon Studio y variables globales configuradas en el Profile (`G_UserName`, `G_UserPassword`, `G_UserXPassword`).

### 1️⃣ E2E01 — Carga de Home y Exploración (Filtros)

**Objetivo:** Validar que el catálogo de productos responde correctamente a los filtros de tipo que presionaría un usuario común.
**Flujo grabado (Groovy Script):**

1. Se abre el navegador y navega a `https://fleeswap.vercel.app/`.
2. Hace clic en el botón **"Explorar"** para ver todos los productos del catálogo.
3. Selecciona el filtro **"Venta"** y espera 3 segundos para que el backend cargue los resultados.
4. Selecciona el filtro **"Trueque"** y espera nuevamente 3 segundos.
5. Selecciona el filtro **"Ambos"** y finaliza el test.

_Demuestra que el frontend se conecta correctamente al backend y filtra las publicaciones según los tipos reales del dominio (`trueque`, `venta`, `ambos`)._

### 2️⃣ E2E02 — Login Exitoso (Happy Path)

**Objetivo:** Validar el inicio de sesión exitoso y la redirección al perfil privado del usuario.
**Flujo grabado (Groovy Script):**

1. Abre la página y hace clic en **"Iniciar sesión"**.
2. Completa el input de Email desde la variable global `GlobalVariable.G_UserName`.
3. Completa el input de Password desde `GlobalVariable.G_UserPassword`.
4. Hace clic en el botón **"Iniciar sesión"**.
5. Verifica el éxito haciendo clic en el avatar del usuario (botón "Lautaro") y seleccionando **"Ver perfil"**, confirmando que la sesión persiste y redirige correctamente a la zona privada.

### 3️⃣ E2E03 — Login Fallido (Edge Path)

**Objetivo:** Validar el manejo de errores del Frontend cuando el backend responde con 401 Unauthorized.
**Flujo grabado (Groovy Script):**

1. Abre la página y entra al formulario de Login.
2. Ingresa el Email correcto (`G_UserName`).
3. Ingresa un Password **INVÁLIDO** usando `GlobalVariable.G_UserXPassword`.
4. Hace clic en el botón de login.
5. Espera `1 segundo` (delay) para dar tiempo al backend a responder el rechazo.
6. **Aserción final:** Usa `verifyElementVisible` con `FailureHandling.STOP_ON_FAILURE` para confirmar que el párrafo con el texto `"Email o contraseña incorrectos"` aparece en pantalla. Si el backend dejara entrar al usuario con clave errónea, el test explotaría de inmediato.

---

## ▶️ Ejecución del Proyecto en Katalon

1. Abre Katalon Studio.
2. Seleccioná **"Open Project"** y elegí el archivo `TP-Final.prj`.
3. Ve a la sección **Test Suites** en el panel izquierdo.
4. Abre la Suite y presioná el botón ▶️ **Run** seleccionando **Chrome**.
5. Katalon abrirá instancias automatizadas del navegador y ejecutará los 3 flujos, generando el reporte final en la carpeta `Reports/`.
