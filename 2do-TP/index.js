function getTiposValidos() {
    return [20, 23, 24, 27, 30, 33, 34];
}

function generarCUIT(tipo, dni) {
    // 1. "No recibir string (caracteres)"
    if (typeof tipo === 'string' || typeof dni === 'string') {
        throw new Error("No recibir string (caracteres)");
    }

    if (typeof tipo !== 'number' || typeof dni !== 'number') {
        return null;
    }

    // 2. "Verificar 2 numeros principales (fijos)"
    // Usamos la función interna para luego poder hacerle "stub" en los tests
    const tiposValidos = module.exports.getTiposValidos();
    if (!tiposValidos.includes(tipo)) {
        return null;
    }

    // 3. "Números de DNI"
    // Rellenamos con ceros por si el DNI tiene menos de 8 números
    let dniStr = dni.toString().padStart(8, '0');
    let tipoStr = tipo.toString();

    // Los primeros 10 dígitos base para el cálculo
    let baseCuit = tipoStr + dniStr;

    // 4. "Último Número DV (dígito verificador) (verificación dependiendo del dni)"
    const multiplicadores = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2];
    let suma = 0;
    for (let i = 0; i < 10; i++) {
        suma += parseInt(baseCuit[i], 10) * multiplicadores[i];
    }

    const resto = suma % 11;
    let dv = resto === 0 ? 0 : (resto === 1 ? 9 : 11 - resto);

    // Retornamos el CUIT generado (Longitud de números = 11, formato NN-NNNNNNNN-N)
    return `${tipoStr}-${dniStr}-${dv}`;
}

module.exports = {
    getTiposValidos,
    generarCUIT
};
