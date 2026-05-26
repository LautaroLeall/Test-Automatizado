// cypress/e2e/fleeswap.cy.js
//
// TP N°4 – Tests End to End – Cypress
// Proyecto: FleeSwap (https://fleeswap.vercel.app/)
// Materia:  Testeo Automatizado – UNSTA
// Alumno:   Leal Del Prete, Lautaro

describe('Suite E2E - FleeSwap', () => {

  // ────────────────────────────────────────────────────────────
  // CASO 1: Carga correcta de la página principal (Home)
  // Prioridad: ALTA — Si el home no carga, nada del sitio funciona.
  // ────────────────────────────────────────────────────────────
  it('CP01 - La página principal carga correctamente', () => {
    cy.visit('/');

    // Verifica que la URL sea la raíz del sitio
    cy.url().should('include', 'fleeswap.vercel.app');

    // Verifica que el contenedor principal de la app existe
    cy.get('#root').should('exist');

    // Verifica que haya al menos un elemento visible en el cuerpo
    cy.get('body').should('be.visible');
  });

  // ────────────────────────────────────────────────────────────
  // CASO 2: La página de Login existe y tiene el formulario
  // Prioridad: ALTA — El login es el punto de entrada de usuarios.
  // ────────────────────────────────────────────────────────────
  it('CP02 - La página de Login carga y muestra el formulario', () => {
    cy.visit('/login');

    // Verifica que la URL contenga "login"
    cy.url().should('include', '/login');

    // Verifica que existan un input de email y uno de contraseña
    cy.get('input[type="email"]').should('be.visible');
    cy.get('input[type="password"]').should('be.visible');

    // Verifica que exista el botón de submit
    cy.get('button[type="submit"]').should('be.visible');
  });

  // ────────────────────────────────────────────────────────────
  // CASO 3: Validación de Login con credenciales inválidas
  // Prioridad: ALTA — El sistema no debe permitir el acceso con datos incorrectos.
  // ────────────────────────────────────────────────────────────
  it('CP03 - Login con credenciales inválidas muestra mensaje de error', () => {
    cy.visit('/login');

    // Ingresamos credenciales incorrectas
    cy.get('input[type="email"]').type('usuario_invalido@test.com');
    cy.get('input[type="password"]').type('contraseña_incorrecta');
    cy.get('button[type="submit"]').click();

    // La URL no debería cambiar a /home o /dashboard tras un login fallido
    cy.url().should('include', '/login');
  });

  // ────────────────────────────────────────────────────────────
  // CASO 4: La página de Registro existe y muestra el formulario
  // Prioridad: ALTA — El registro es el flujo de alta de nuevos usuarios.
  // ────────────────────────────────────────────────────────────
  it('CP04 - La página de Registro carga y muestra el formulario', () => {
    cy.visit('/register');

    // Verifica que la URL contenga "register"
    cy.url().should('include', '/register');

    // Verifica que el formulario de registro tenga inputs visibles
    cy.get('input').should('have.length.at.least', 2);

    // Verifica que exista el botón de submit
    cy.get('button[type="submit"]').should('exist');
  });

  // ────────────────────────────────────────────────────────────
  // CASO 5: El link de "Registrarse" desde Login redirige correctamente
  // Prioridad: MEDIA — Navegación entre páginas públicas clave.
  // ────────────────────────────────────────────────────────────
  it('CP05 - Desde Login se puede navegar a la página de Registro', () => {
    cy.visit('/login');

    // Buscamos un link que lleve al registro (puede ser <a> con /register)
    cy.get('a[href*="register"]').first().click();

    // Verificamos que la nueva URL sea la de registro
    cy.url().should('include', '/register');
  });

  // ────────────────────────────────────────────────────────────
  // CASO 6: Validación de campos vacíos en el formulario de Login
  // Prioridad: MEDIA — El formulario no debe enviarse con campos vacíos.
  // ────────────────────────────────────────────────────────────
  it('CP06 - El formulario de Login no permite envío con campos vacíos', () => {
    cy.visit('/login');

    // Hacemos click en submit sin completar ningún campo
    cy.get('button[type="submit"]').click();

    // La URL debe seguir en /login (no hubo redirección)
    cy.url().should('include', '/login');

    // Los campos de email y password deben seguir visibles (no hubo navegación)
    cy.get('input[type="email"]').should('be.visible');
    cy.get('input[type="password"]').should('be.visible');
  });

});
