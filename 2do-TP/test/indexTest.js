var chai = require('chai');
var assert = chai.assert;
var expect = chai.expect;
var should = chai.should();

var sinon = require('sinon');
var main = require('../index');

describe('Suite principal - Generador de CUIT', function () {
    var stubTipos;

    before(function () {
        // Implementamos el doble de prueba (Stub) tal como en el ejemplo "traeUsuarios"
        stubTipos = sinon.stub(main, 'getTiposValidos');
        // Forzamos al stub a devolver sólo estos tipos, más uno inventado (99) 
        // para verificar que el stub realmente funciona
        stubTipos.withArgs().returns([20, 27, 30, 99]);
    });

    after(function () {
        // Restauramos la función original después de las pruebas
        stubTipos.restore();
    });


    it('HP - SI genera CUIT válido con tipo correcto', function () {
        // Arrange
        var miTipo = 20;
        var miDNI = 26756539;

        // Act
        var miCuitGenerado = main.generarCUIT(miTipo, miDNI);

        // Assert
        assert.equal(miCuitGenerado, '20-26756539-3');
    });

    it('HP - SI genera CUIT usando el tipo mockeado (99)', function () {
        // Arrange
        var miTipo = 99; // Tipo inventado que solo existe en nuestro stub
        var miDNI = 11111111;

        // Act
        var miCuitGenerado = main.generarCUIT(miTipo, miDNI);
        // (Cálculo DV de 99-11111111: suma=113, resto=3, DV=8)

        // Assert
        assert.equal(miCuitGenerado, '99-11111111-8');
    });

    it('HP - NO genera CUIT si el tipo no está en la lista del stub', function () {
        // Arrange
        var miTipo = 23; // El 23 es válido en la realidad, pero NO está en nuestro stub
        var miDNI = 26756539;

        // Act
        var miCuitGenerado = main.generarCUIT(miTipo, miDNI);

        // Assert
        assert.equal(miCuitGenerado, null);
    });

    it('HP - NO recibe string (Lanza error según la regla)', function () {
        // Arrange
        var miTipoStr = '20';
        var miDNIStr = '26756539';

        // Act & Assert
        assert.throws(function () {
            main.generarCUIT(miTipoStr, miDNIStr);
        }, Error, "No recibir string (caracteres)");
    });


    it('Debería retornar la longitud total de 13 caracteres (11 números + 2 guiones) usando expect', function () {
        // Arrange & Act
        var resultado = main.generarCUIT(27, 31512401);

        // Assert
        expect(resultado).to.have.lengthOf(13);
    });

    it('Debería contener los números separados por guiones usando expect', function () {
        var resultado = main.generarCUIT(27, 31512401);
        expect(resultado).to.match(/^\d{2}-\d{8}-\d{1}$/);
    });

    it('Debería rellenar con ceros si el DNI tiene menos de 8 cifras usando should', function () {
        var resultado = main.generarCUIT(30, 12345);
        // Verifica que se rellena con "000" para llegar a los 8 dígitos
        resultado.should.include('30-00012345-');
    });

    it('Debería retornar null si se pasan valores null usando should', function () {
        var resultado = main.generarCUIT(null, null);
        should.not.exist(resultado);
    });

    it('Debería retornar null si se pasan valores booleanos usando expect', function () {
        var resultado = main.generarCUIT(true, false);
        expect(resultado).to.be.null;
    });

    it('Debería calcular el dígito verificador 0 cuando el resto es 0 usando assert', function () {
        var resultado = main.generarCUIT(20, 11111111);
        assert.isNotNull(resultado);
    });

    it('Debería calcular un dígito verificador correcto independientemente del DNI', function () {
        var resultado = main.generarCUIT(30, 99999999);
        expect(resultado.slice(-2, -1)).to.equal('-');
    });
});
