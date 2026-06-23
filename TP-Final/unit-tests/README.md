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

## 🎯 ¿Qué se testea y por qué?

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

### 4. UT04 a UT08 — 100% de Cobertura

Se añadieron 5 tests adicionales para probar casos límite que originalmente no se testeaban:

- `UT04`: Título vacío `""`
- `UT05`: Título > 100 caracteres
- `UT06`: Condición de uso inválida
- `UT07`: Llamada directa a `getCategoriasValidas()`
- `UT08`: Uso de `stubTipos.restore()` para ejecutar `getTiposValidos()` original.

---

## ▶️ Cómo ejecutar estas Pruebas (Setup Completo)

```bash
# 1. Instalar dependencias (desde la carpeta TP-Final)
npm install

# 2. Correr los 8 tests unitarios
npm run test:unit

# 3. Correr los tests con análisis de cobertura (NYC)
npm run coverage
```

> 🏆 **Resultado final:** El reporte de coverage muestra un **100% perfecto** en Statements, Branches, Functions y Lines. No quedó ni una sola línea de lógica suelta sin evaluar.
