// cypress/support/e2e.js
// Este archivo se ejecuta antes de cada spec.

// Silencia errores de Uncaught Exception del sitio bajo prueba
// para que no interrumpan los tests de Cypress
Cypress.on('uncaught:exception', (err, runnable) => {
  return false;
});
