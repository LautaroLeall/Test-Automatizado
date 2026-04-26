# Test Automatizado - 3er Año 🚀

Trabajos Prácticos realizados durante el cursado, aplicando metodologías como TDD (Test-Driven Development), dobles de prueba y análisis de cobertura.

---

## 🛠️ Tecnologías y Herramientas Utilizadas

El stack principal utilizado en los trabajos prácticos se basa en el ecosistema de **Node.js**:

- **[Mocha](https://mochajs.org/)**: Framework de pruebas asíncrono para Node.js.
- **[Chai](https://www.chaijs.com/)**: Librería de aserciones (`assert`, `expect`, `should`).
- **[Sinon.js](https://sinonjs.org/)**: Librería para crear dobles de prueba (_Spys, Stubs y Mocks_).
- **[Istanbul (NYC)](https://istanbul.js.org/)**: Herramienta para calcular y generar reportes de cobertura de código.

---

## 📁 Estructura del Repositorio

El repositorio está organizado en carpetas independientes para cada Trabajo Práctico. Cada carpeta funciona como un proyecto Node.js propio.

### Trabajos Prácticos Actuales:

- 📂 **[1er-TP](./1er-TP/)** - _Introducción a TDD_
  - Implementación de la función matemática Factorial (`x!`).
  - Aplicación de la metodología TDD con 6 pruebas unitarias combinando las tres interfaces de Chai.
- 📂 **[2do-TP](./2do-TP/)** - _Dobles de Prueba y Cobertura_
  - Implementación de un Generador/Validador de CUIT.
  - Más de 10 pruebas unitarias superadas.
  - Incorporación de **Sinon** (uso de `stub` para controlar el flujo de funciones).
  - Reporte de cobertura del 100% utilizando **NYC**.

---

## 💻 ¿Cómo ejecutar los TPs?

Para ejecutar las pruebas de cualquier Trabajo Práctico, sigue estos pasos:

1. Clona el repositorio:
   ```bash
   git clone https://github.com/LautaroLeall/Test-Automatizado.git
   ```
2. Accede a la carpeta del Trabajo Práctico que deseas evaluar, por ejemplo:
   ```bash
   cd 2do-TP
   ```
3. Instala las dependencias necesarias:
   ```bash
   npm install
   ```
4. Ejecuta las pruebas:
   ```bash
   npm test
   ```
5. _(Solo para TPs que lo requieran)_ Ejecuta el reporte de cobertura de código:
   ```bash
   npm run coverage
   ```
