const chai = require('chai');
const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();

const index = require('../index.js');

describe('Factorial Function', () => {
  // Pruebas usando assert
  it('Debería retornar 1 cuando el valor es 0 (usando assert)', () => {
    assert.equal(index.factorial(0), 1);
  });

  it('Debería retornar 120 cuando el valor es 5 (usando assert)', () => {
    assert.equal(index.factorial(5), 120);
  });

  // Pruebas usando expect
  it('Debería retornar 1 cuando el valor es 1 (usando expect)', () => {
    expect(index.factorial(1)).to.equal(1);
  });

  it('Debería retornar 720 cuando el valor es 6 (usando expect)', () => {
    expect(index.factorial(6)).to.equal(720);
  });

  // Pruebas usando should
  it('Debería retornar 24 cuando el valor es 4 (usando should)', () => {
    index.factorial(4).should.equal(24);
  });

  it('Debería lanzar un error para números negativos (usando should)', () => {
    (() => index.factorial(-1)).should.throw('Factorial no definido para números negativos');
  });
});
