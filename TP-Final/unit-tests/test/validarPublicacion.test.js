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

});
