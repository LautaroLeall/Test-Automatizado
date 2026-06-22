# 🟢 Tests de Integración (API) – TP Final

## Testeo Automatizado – UNSTA 2026

**Módulo bajo prueba:** `Publications API` — Catálogo e Intercambio de Fleeswap  
**API en Producción:** [https://fleeswap-backend.onrender.com/api](https://fleeswap-backend.onrender.com/api)  
**Herramientas:** `Postman` · `Newman` · `newman-reporter-htmlextra`

---

## 📌 ¿Qué es un Test de Integración?

A diferencia de los tests unitarios (que prueban código aislado en Node.js local), los **tests de integración** prueban cómo interactúan diferentes partes del sistema juntas. En este caso, probamos el **Contrato de la API REST** (Endpoints HTTP reales).

El objetivo es hacer peticiones reales al servidor de Fleeswap y verificar que:

1. El servidor responde con el **Status Code HTTP correcto**.
2. La respuesta contiene la **estructura de datos correcta** (JSON válido).
3. Las rutas privadas **rechazan** correctamente a los usuarios sin token (HTTP 401).
4. Los mensajes de error devueltos son **exactamente** los que el código del backend define.

---

## 🎯 ¿Qué se testea y por qué (Justificación)?

Se eligió enfocar el esfuerzo **exclusivamente en el Módulo de Publicaciones (`publicationRouter.js`)** ya que es el núcleo transaccional de la plataforma Fleeswap (donde ocurre el trueque y la venta).

Se diseñaron **4 tests robustos** que cubren rutas públicas, seguridad de middleware y manejo de errores:

| #        | Endpoint                       | Método  | Acción                           | Justificación                                                                                                                                                                          |
| -------- | ------------------------------ | ------- | -------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **IT01** | `/api/publications`            | `GET`   | Listar publicaciones públicas    | Endpoint principal que alimenta la Home. Se valida que devuelva 200 OK y que el campo `publications` sea un Array, verificando que MongoDB y el Service estén operativos.              |
| **IT02** | `/api/publications`            | `POST`  | Crear publicación sin Token      | Prueba del middleware `authenticate`. Sin JWT, el backend devuelve `401` con el mensaje exacto `"Token no proporcionado"`. Se valida el mensaje real del código fuente.                |
| **IT03** | `/api/publications/:id`        | `GET`   | ID de MongoDB inválido           | Manejo de Errores. Si el ID no tiene formato de ObjectId (24 hex), el backend devuelve `400` con el mensaje exacto `"ID invalido"`, validando el ErrorHandler global de Express.       |
| **IT04** | `/api/publications/:id/status` | `PATCH` | Cambiar estado sin autenticación | El `status` solo puede cambiarlo el dueño (`req.user._id` en el service). Sin sesión, `authenticate` bloquea con `401` y el mensaje `"Token no proporcionado"` antes de llegar al ORM. |

---

## 📄 Scripts de Postman (Código de Aserciones)

### IT01 — GET Listar Publicaciones

```javascript
pm.test("Status code es 200 OK", function () {
  pm.response.to.have.status(200);
});

pm.test("La respuesta devuelve un array de publicaciones", function () {
  var jsonData = pm.response.json();
  // El backend usa paginación: { publications: [...], pagination: {...} }
  var hasData = Array.isArray(jsonData.publications);
  pm.expect(hasData).to.be.true;
});
```

### IT02 — POST Crear sin Auth Token

```javascript
pm.test("Status code es 401 Unauthorized", function () {
  pm.response.to.have.status(401);
});

pm.test("El servidor rechaza la petición por falta de Token", function () {
  var jsonData = pm.response.json();
  pm.expect(jsonData).to.have.property("message");
  pm.expect(jsonData.message).to.eql("Token no proporcionado");
});
```

### IT03 — GET Detalle con ID de Mongo inválido

```javascript
pm.test("Status code es 400 Bad Request", function () {
  pm.response.to.have.status(400);
});

pm.test(
  "El servidor detecta que el formato del ID no es de MongoDB",
  function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property("message");
    pm.expect(jsonData.message).to.eql("ID invalido");
  },
);
```

### IT04 — PATCH Cambiar Estado sin Auth

```javascript
pm.test("Status code es 401 Unauthorized", function () {
  pm.response.to.have.status(401);
});

pm.test(
  "El middleware 'authenticate' bloquea el cambio de estado",
  function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property("message");
    pm.expect(jsonData.message).to.eql("Token no proporcionado");
  },
);
```

---

## 🚦 Flujo Paso a Paso de cada Test (Trazabilidad)

El proceso de Newman es automático y secuencial:

1. **Configuración de Entorno**: Newman lee `Fleeswap_Environment.json` y extrae `baseUrl = https://fleeswap-backend.onrender.com`.
2. **IT01**: Emite GET a `/api/publications`. Valida Status 200 y que `response.json().publications` sea un Array real de objetos publicados.
3. **IT02**: Envía un JSON válido (Silla Gamer, tipo venta) a POST `/api/publications` **sin adjuntar token JWT**. El middleware `authenticate` intercepta y responde `401 + "Token no proporcionado"`. El test afirma ambas cosas.
4. **IT03**: Hace GET a `/api/publications/1234567890`. Mongoose falla al hacer el Cast del ID, el ErrorHandler global de Express lo captura y devuelve `400 + "ID invalido"`. El test verifica el mensaje exacto.
5. **IT04**: Intenta PATCH `/api/publications/:id/status` sin token. Idéntico al IT02, `authenticate` bloquea antes de que el Service verifique ownership, devolviendo `401 + "Token no proporcionado"`.

---

## ❓ Preguntas y Respuestas Técnicas

### Q6: En el IT02 e IT04 probás el error 401. ¿Por qué es importante probar esto en integración y no en un test unitario?

Porque el rechazo por falta de Token lo hace el **middleware `authenticate`** a nivel de la ruta HTTP de Express. Un test unitario aisla funciones puras, pero **no puede levantar el servidor completo**. El test de integración es el único que pone a prueba la "tubería" completa Express → Middleware → Route → Controller → Service, evaluando si el **contrato de seguridad de la API funciona en la vida real**.

---

### Q7: Usaste `{{baseUrl}}` en el Environment. ¿Qué ventaja te da frente a escribir la URL a mano?

Evita tener que reescribir todos los tests si cambiás de entorno. Hoy se prueban contra OnRender (`https://fleeswap-backend.onrender.com`), pero mañana se puede crear un entorno "Local" apuntando a `http://localhost:3000` y **reutilizar exactamente la misma colección** sin modificar ni una sola petición. Esto es la base de la portabilidad en testing de APIs.

---

## ▶️ Cómo ejecutar estas Pruebas

```bash
# Desde la carpeta TP-Final
npm run test:integration
```

> _(El servidor de Fleeswap en OnRender gratuito se "duerme". Si hay Timeout en el primer intento, volvé a correr el comando de inmediato)._

### Ver el Reporte Visual HTML

Una vez corrido el comando, se genera `integration-tests/newman/reporte.html`.  
Hacé doble clic en ese archivo para abrirlo en el navegador con el Dashboard completo de **newman-reporter-htmlextra**.
