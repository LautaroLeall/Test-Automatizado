# 🔵 Tests Unitarios – TP Final

## Testeo Automatizado – UNSTA 2026

**Proyecto bajo prueba:** [Fleeswap](https://fleeswap.vercel.app/) — plataforma de intercambio y venta de objetos  
**Herramientas:** `Mocha` · `Chai` (`assert`, `expect`, `should`) · `Sinon.js` (Stub) · `NYC` (cobertura)

---

## 📌 ¿Qué es un Test Unitario?

Un **test unitario** prueba una única unidad de código (función o módulo) **en completo aislamiento**, sin depender de bases de datos, APIs externas ni otros módulos.

El objetivo es verificar que la **lógica de negocio** funciona correctamente ante distintos escenarios (casos felices, casos límite y casos negativos). Se aisla totalmente cualquier dependencia con el frontend o el backend; simplemente le entregamos datos de entrada y validamos la salida.

La metodología usada es **TDD (Test-Driven Development)**: estructurar el test, realizar la acción y validar su resultado con el patrón **Arrange-Act-Assert** (Preparar, Actuar, Afirmar).

---

## 🎯 ¿Qué se testea y por qué (Justificación)?

### Módulo: `validarPublicacion.js`

Fleeswap permite a sus usuarios publicar objetos para intercambiar o vender. Basado **exactamente** en las reglas del backend de Fleeswap (`publication.model.js` y validadores), para crear una publicación es obligatoria cierta información clave.

Esta lógica de validación replica las reglas de negocio reales de Fleeswap:

| Regla                           | Detalle                                                               |
| ------------------------------- | --------------------------------------------------------------------- |
| **Título obligatorio**          | Debe ser un `string` no vacío y no mayor a 100 caracteres.            |
| **Tipo de publicación válido**  | Solo acepta: `trueque`, `venta`, `ambos`                              |
| **Condición del objeto válida** | Solo acepta: `nuevo`, `como_nuevo`, `bueno`, `regular`, `deteriorado` |

**¿Por qué se testea esta función?**

- Porque es el núcleo de la creación de publicaciones. Si esto falla, los usuarios ingresarían basura a la base de datos o experimentarían errores crípticos.
- Contiene **lógica de negocio estricta** — un tipo como `"regalo"` generaría errores en el backend (HTTP 422 Unprocessable Entity).
- Es **pura y determinista**: dado el mismo input, produce siempre el mismo output (ideal para tests unitarios).
- Nos permite usar **Stubs con Sinon.js** aislando la dependencia interna `getTiposValidos()` y probando su inyección.

_(Aclaración: Iniciar sesión en la app real de Fleeswap es requerido para publicar, pero eso es autenticación. Un test unitario no realiza un flujo de login ni se comunica con el servidor, solo testea la función lógica aislada en Node.js)._

---

## 📄 Código del Módulo a Testear

### `unit-tests/validarPublicacion.js`

```javascript
function getTiposValidos() {
  return ["trueque", "venta", "ambos"];
}

function getCondicionesValidas() {
  return ["nuevo", "como_nuevo", "bueno", "regular", "deteriorado"];
}

function validarPublicacion(titulo, tipo, condicion) {
  if (typeof titulo !== "string" || titulo.trim() === "") {
    throw new Error("El título es obligatorio y debe ser un texto no vacío");
  }
  if (titulo.trim().length > 100) {
    throw new Error("El título no puede superar los 100 caracteres");
  }

  // Llamada via module.exports para permitir stub con Sinon
  const tiposValidos = module.exports.getTiposValidos();
  if (!tiposValidos.includes(tipo)) {
    throw new Error(
      `Tipo no válido. Valores aceptados: ${tiposValidos.join(", ")}`,
    );
  }

  const condicionesValidas = module.exports.getCondicionesValidas();
  if (!condicionesValidas.includes(condicion)) {
    throw new Error(
      `Condición no válida. Valores aceptados: ${condicionesValidas.join(", ")}`,
    );
  }

  return { valido: true, titulo: titulo.trim(), tipo, condicion };
}

module.exports = { getTiposValidos, getCondicionesValidas, validarPublicacion };
```

> **¿Por qué usamos `module.exports.getTiposValidos()` y no lo llamamos directamente?**  
> Para que Sinon.js pueda interceptar (Stubbear) la función en tiempo de ejecución desde los tests. Este es el mismo patrón arquitectónico utilizado en el **TP2** de la materia.

---

## 🧪 Código de los Tests

### `unit-tests/test/validarPublicacion.test.js`

```javascript
var chai = require("chai");
var assert = chai.assert;
var expect = chai.expect;
var should = chai.should();

var sinon = require("sinon");
var main = require("../validarPublicacion");

describe("Suite – Validar Publicación Fleeswap", function () {
  var stubTipos;

  // Arrange global: Stub aplicado antes de todos los tests
  before(function () {
    stubTipos = sinon.stub(main, "getTiposValidos");
    stubTipos.withArgs().returns(["trueque", "venta", "ambos", "canje"]);
  });

  after(function () {
    stubTipos.restore(); // restaurar función original
  });

  // UT01 – assert
  it("UT01 – HP – Crea publicación válida tipo trueque (assert)", function () {
    var titulo = "Silla gamer en buen estado"; // Arrange
    var resultado = main.validarPublicacion(titulo, "trueque", "bueno"); // Act
    assert.isObject(resultado); // Assert
    assert.strictEqual(resultado.valido, true);
    assert.strictEqual(resultado.tipo, "trueque");
  });

  // UT02 – should (con Sinon Stub activo)
  it('UT02 – HP – Acepta tipo ficticio "canje" inyectado por el Stub (should)', function () {
    var resultado = main.validarPublicacion(
      "Monitor 27 pulgadas",
      "canje",
      "como_nuevo",
    );
    resultado.should.be.an("object");
    resultado.should.have.property("valido", true);
    resultado.should.have.property("tipo", "canje");
  });

  // UT03 – expect (caso negativo)
  it("UT03 – EP – Lanza Error cuando el tipo no es válido (expect)", function () {
    expect(function () {
      main.validarPublicacion("Teclado RGB", "regalo", "nuevo");
    }).to.throw(Error, "Tipo no válido");
  });
});
```

---

## 🚦 Flujo Paso a Paso de cada Test (Trazabilidad)

### 1. UT01 — Happy Path con `assert`

**Objetivo:** Verificar que el sistema acepta datos 100% legales según las reglas reales de Fleeswap.

1. **(Arrange)**: Se preparan las variables: Título: "Silla gamer en buen estado", Tipo: "trueque", Condición: "bueno" — todos valores reales del `publication.model.js`.
2. **(Act)**: Se ejecuta `validarPublicacion()` con esos datos y se guarda el resultado.
3. **(Assert)**: Chai evalúa con `assert` que sea un Objeto, que `valido` sea `true` y que el tipo devuelto sea `"trueque"`.

### 2. UT02 — Doble de Prueba (Sinon Stub) con `should`

**Objetivo:** Verificar el comportamiento del software en **aislamiento**, modificando temporalmente la fuente de datos del módulo.

1. **(Antes del test)**: El bloque `before()` intercepta `getTiposValidos` con `sinon.stub()` e inyecta el valor ficticio `"canje"` en la lista de tipos.
2. **(Arrange)**: Se preparan datos con tipo `"canje"` — un valor que no existe en producción de Fleeswap.
3. **(Act)**: Se llama a `validarPublicacion()`. Como el Stub está activo, la función "cree" que `"canje"` es válido.
4. **(Assert)**: Chai (usando `.should`) verifica que el resultado aceptó el valor ficticio.
5. **(Restore)**: El bloque `after()` remueve el Stub y todo vuelve a la normalidad.

### 3. UT03 — Edge Path (Caso Negativo) con `expect`

**Objetivo:** Verificar que el sistema rechaza automáticamente entradas prohibidas.

1. **(Arrange)**: Tipo: `"regalo"` — no existe ni en producción ni en el Stub.
2. **(Act & Assert combinados)**: La llamada a la función se **envuelve en `expect(function(){ ... })`** para que Chai la ejecute en modo controlado. Esto es necesario porque si llamáramos la función directamente, el error no sería capturado por Chai y el test explotaría. Al envolverla, Chai atrapa el `throw` y verifica que su mensaje incluya `"Tipo no válido"`.

---

## ❓ Preguntas y Respuestas Técnicas

### Q1: ¿Por qué no hiciste todos tus tests directamente con Katalon Studio, si al final es lo que ve el usuario real?

Los tests E2E (Katalon) son **lentos de ejecutar, costosos de mantener y frágiles** ("flaky") si cambia la interfaz gráfica. La base deben ser los tests unitarios (rápidos, precisos, cero dependencias externas), luego integración, y E2E **solo para los flujos críticos de negocio**. Esto es lo que se conoce como la **Pirámide de Testing**: muchos tests unitarios en la base, algunos de integración en el medio, y pocos E2E en la punta.

---

### Q2: ¿Qué significa el patrón Arrange-Act-Assert (AAA) y dónde lo aplicaste?

Es la estructura de tres pasos para diseñar un test:

- **Arrange (Preparar):** Se definen las variables de entrada. En UT01: `titulo = "Silla gamer"`, `tipo = "trueque"`, `condicion = "bueno"`.
- **Act (Actuar):** Se ejecuta la función bajo prueba. En UT01: `var resultado = main.validarPublicacion(titulo, tipo, condicion)`.
- **Assert (Afirmar):** Se verifica el resultado. En UT01: `assert.strictEqual(resultado.valido, true)`.

---

### Q3: En tu UT02 usaste Sinon.js para crear un "Stub". ¿Qué es exactamente un Stub y por qué no probaste la función original?

Un **Stub** es un "doble de prueba" (Test Double) que reemplaza una función interna real para **forzar un comportamiento específico en un entorno controlado**. Se usó para inyectar el valor ficticio `"canje"` en `getTiposValidos()` y comprobar que la lógica de validación general sigue funcionando bien ante un cambio en el diccionario de datos, **aislando la prueba del resto del sistema** (principio de aislamiento de los tests unitarios).

---

### Q4: En el UT03 usaste `expect` envolviendo la llamada en `function() { ... }`. ¿Por qué?

Porque si llamás a la función que lanza un error **directamente**, el test explota antes de que Chai pueda capturar nada. Al envolverla en una función anónima, **Chai la ejecuta en un entorno controlado**, atrapa el `throw new Error(...)` y verifica que el mensaje (`"Tipo no válido"`) sea el correcto. Esto es la sintaxis oficial de Chai para testear excepciones.

---

### Q5: Si NYC te diera un 100% de Coverage, ¿significa que tu código no tiene bugs?

**No.** El 100% de coverage solo significa que el test pasó por todas las líneas y condicionales de `validarPublicacion.js`, pero **no garantiza** que hayas probado todos los casos de uso lógicos del negocio, ni te asegura que el código haga realmente lo que el usuario necesita. El coverage es una métrica de alcance del código, no de calidad o correctitud de la lógica.

---

## ▶️ Cómo ejecutar estas Pruebas (Setup Completo)

```bash
# 1. Instalar dependencias (desde la carpeta TP-Final)
npm install

# 2. Correr los 3 tests unitarios
npm run test:unit

# 3. Correr los tests con análisis de cobertura (NYC)
npm run coverage
```

> El reporte de coverage mostrará alrededor del **75%**, indicando en rojo las líneas que podrían testearse con más casos adicionales (ej: el validador de longitud de título > 100 caracteres).
