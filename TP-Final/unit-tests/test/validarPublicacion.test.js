// =============================================================
// TP Final – Testeo Automatizado – UNSTA 2026
// Suite: Tests Unitarios – validarPublicacion.js
// Módulo bajo prueba: Validación de publicaciones de Fleeswap
// Herramientas: Mocha + Chai (assert, expect, should) + Sinon
// =============================================================

var chai = require('chai');
var assert = chai.assert;
var expect = chai.expect;
var should = chai.should();

var sinon = require('sinon');
var main = require('../validarPublicacion');

// ─────────────────────────────────────────────────────────────
// SUITE PRINCIPAL
// ─────────────────────────────────────────────────────────────
describe('Suite – Validar Publicación Fleeswap', function () {

    var stubTipos;

    // ── Doble de prueba (Stub) – aplicado igual que en el TP2 ──
    // Reemplazamos getTiposValidos() para inyectar un tipo ficticio ('canje')
    // que no existe en producción. Esto nos permite verificar que la función
    // valida según los valores que LE ENVIAMOS NOSOTROS, no los reales de la app.
    before(function () {
        stubTipos = sinon.stub(main, 'getTiposValidos');
        stubTipos.withArgs().returns(['trueque', 'venta', 'ambos', 'canje']);
    });

    after(function () {
        // Restauramos la función original para no contaminar otros tests
        stubTipos.restore();
    });


    // ─────────────────────────────────────────────────────────
    // UT01 – Happy Path: publicación válida con tipo 'trueque'
    // Estilo: assert
    // Input: datos completamente válidos según el backend de Fleeswap
    // Expected: objeto { valido: true, titulo, tipo, condicion }
    // ─────────────────────────────────────────────────────────
    it('UT01 – HP – Crea publicación válida tipo trueque (assert)', function () {
        // Arrange — datos válidos según publication.model.js
        var titulo = 'Silla gamer en buen estado';
        var tipo = 'trueque';   // valor real del backend
        var condicion = 'bueno';     // valor real del backend

        // Act
        var resultado = main.validarPublicacion(titulo, tipo, condicion);

        // Assert
        assert.isObject(resultado, 'El resultado debe ser un objeto');
        assert.strictEqual(resultado.valido, true, 'El campo valido debe ser true');
        assert.strictEqual(resultado.titulo, titulo, 'El título debe coincidir con el ingresado');
        assert.strictEqual(resultado.tipo, 'trueque', 'El tipo debe ser trueque');
        assert.strictEqual(resultado.condicion, 'bueno', 'La condición debe ser bueno');
    });


    // ─────────────────────────────────────────────────────────
    // UT02 – Happy Path con Stub: tipo ficticio 'canje'
    // Estilo: should
    // El tipo 'canje' NO existe en producción en Fleeswap.
    // El Stub lo inyecta en la lista para probar el aislamiento:
    // la lógica de validación debe aceptar 'canje' porque su
    // fuente de verdad (getTiposValidos) ahora lo incluye.
    // ─────────────────────────────────────────────────────────
    it('UT02 – HP – Acepta tipo ficticio "canje" inyectado por el Stub de Sinon (should)', function () {
        // Arrange
        var titulo = 'Monitor 27 pulgadas curvo';
        var tipo = 'canje';       // tipo que SOLO existe en el stub, no en producción
        var condicion = 'como_nuevo';  // valor real del backend

        // Act
        var resultado = main.validarPublicacion(titulo, tipo, condicion);

        // Assert
        resultado.should.be.an('object');
        resultado.should.have.property('valido', true);
        resultado.should.have.property('tipo', 'canje');
    });


    // ─────────────────────────────────────────────────────────
    // UT03 – Edge Path: tipo inválido lanza Error
    // Estilo: expect
    // El tipo 'regalo' no existe ni en producción ni en el stub.
    // La función debe lanzar un Error con el mensaje correcto.
    // Caso real: si el usuario pudiera enviar 'regalo' al backend,
    // recibiría un 422 "Tipo de publicación inválido".
    // ─────────────────────────────────────────────────────────
    it('UT03 – EP – Lanza Error cuando el tipo no es válido en Fleeswap (expect)', function () {
        // Arrange
        var titulo = 'Teclado mecánico RGB';
        var tipo = 'regalo';  // no existe ni en producción ni en el stub
        var condicion = 'nuevo';   // valor real del backend

        // Act & Assert
        expect(function () {
            main.validarPublicacion(titulo, tipo, condicion);
        }).to.throw(Error, 'Tipo no válido');
    });

    // ─────────────────────────────────────────────────────────
    // TESTS PARA ALCANZAR EL 100% DE COVERAGE
    // ─────────────────────────────────────────────────────────

    // ─────────────────────────────────────────────────────────
    // UT04 – Edge Path: título vacío lanza Error
    // Estilo: expect
    // La función exige que el título sea un string y no esté vacío.
    // Cubre la validación inicial de titulo.trim() === ''.
    // ─────────────────────────────────────────────────────────
    it('UT04 – EP – Lanza Error si el título está vacío (expect)', function () {
        // Arrange
        var titulo = '';
        var tipo = 'venta';
        var condicion = 'nuevo';

        // Act & Assert
        expect(function () {
            main.validarPublicacion(titulo, tipo, condicion);
        }).to.throw(Error, 'El título es obligatorio');
    });

    // ─────────────────────────────────────────────────────────
    // UT05 – Edge Path: título súper largo lanza Error
    // Estilo: expect
    // Verifica el límite de longitud impuesto por el backend.
    // El título no puede tener más de 100 caracteres.
    // ─────────────────────────────────────────────────────────
    it('UT05 – EP – Lanza Error si el título supera los 100 caracteres (expect)', function () {
        // Arrange
        var titulo = 'A'.repeat(101);
        var tipo = 'venta';
        var condicion = 'nuevo';

        // Act & Assert
        expect(function () {
            main.validarPublicacion(titulo, tipo, condicion);
        }).to.throw(Error, 'superar los 100 caracteres');
    });

    // ─────────────────────────────────────────────────────────
    // UT06 – Edge Path: condición inválida lanza Error
    // Estilo: expect
    // Si el usuario enviara un valor fuera del enum de condición.
    // ─────────────────────────────────────────────────────────
    it('UT06 – EP – Lanza Error cuando la condición no es válida en Fleeswap (expect)', function () {
        // Arrange
        var titulo = 'Celular usado';
        var tipo = 'venta';
        var condicion = 'roto_destruido'; // No existe en producción

        // Act & Assert
        expect(function () {
            main.validarPublicacion(titulo, tipo, condicion);
        }).to.throw(Error, 'Condición no válida');
    });

    // ─────────────────────────────────────────────────────────
    // UT07 – Happy Path: verificar funciones de arrays puros
    // Estilo: assert
    // Cubre la ejecución de getCategoriasValidas() sin pasar 
    // por la lógica principal de validarPublicacion.
    // ─────────────────────────────────────────────────────────
    it('UT07 – HP – Retorna el array de categorías correctamente (assert)', function () {
        // Act
        var categorias = main.getCategoriasValidas();

        // Assert
        assert.isArray(categorias, 'Debe devolver un array de categorías');
        assert.include(categorias, 'electronica', 'Debe contener la categoría electronica');
    });

    // ─────────────────────────────────────────────────────────
    // UT08 – Happy Path: verificar array de tipos reales
    // Estilo: assert
    // Apagamos temporalmente el Stub de Sinon para permitir
    // que Node.js lea la línea original del código fuente
    // ─────────────────────────────────────────────────────────
    it('UT08 – HP – Retorna el array de tipos originales del backend (assert)', function () {
        // Arrange: Apagamos el Stub temporalmente
        stubTipos.restore();

        // Act
        var tipos = main.getTiposValidos();

        // Assert
        assert.isArray(tipos);
        assert.include(tipos, 'venta');

        // Arrange (Restore): Volvemos a encender el Stub 
        // para aislar los tests si se agregan más abajo
        stubTipos = sinon.stub(main, 'getTiposValidos');
        stubTipos.withArgs().returns(['trueque', 'venta', 'ambos', 'canje']);
    });

});
