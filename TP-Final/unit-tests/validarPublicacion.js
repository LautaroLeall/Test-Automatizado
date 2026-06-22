// =============================================================
// TP Final – Testeo Automatizado – UNSTA 2026
// Módulo: validarPublicacion.js
// Descripción: 
// Replica la lógica de validación de publicaciones de Fleeswap (https://fleeswap.vercel.app/) antes de enviar los datos al backend.
// Valores basados en el modelo real del backend: src/models/publication.model.js
// =============================================================

/**
 * Devuelve los tipos de publicación válidos en Fleeswap.
 * Valores reales del backend: publication.model.js → type.enum
 * Se expone en module.exports para poder ser stubbeada con Sinon.
 */
function getTiposValidos() {
    return ['trueque', 'venta', 'ambos'];
}

/**
 * Devuelve las condiciones de objeto válidas en Fleeswap.
 * Valores reales del backend: publication.model.js → condition.enum
 */
function getCondicionesValidas() {
    return ['nuevo', 'como_nuevo', 'bueno', 'regular', 'deteriorado'];
}

/**
 * Devuelve las categorías válidas en Fleeswap.
 * Valores reales del backend: publication.model.js → category.enum
 */
function getCategoriasValidas() {
    return [
        'electronica', 'ropa_accesorios', 'coleccionables', 'libros_comics',
        'deportes', 'hogar_deco', 'juguetes', 'arte', 'musica', 'otros'
    ];
}

/**
 * Valida los datos de una publicación antes de enviarla al backend.
 *
 * Reglas de negocio (espejo de publication.validator.js → crearValidator):
 *  1. El título es obligatorio, string no vacío, máx 100 caracteres.
 *  2. El tipo debe pertenecer a getTiposValidos() → ['trueque','venta','ambos'].
 *  3. La condición debe pertenecer a getCondicionesValidas().
 *
 * Nota: La autenticación (JWT) es responsabilidad del middleware del backend.
 *       Esta función valida únicamente la estructura del objeto publicación.
 */
function validarPublicacion(titulo, tipo, condicion) {
    // Regla 1: título obligatorio y tipo string
    if (typeof titulo !== 'string' || titulo.trim() === '') {
        throw new Error('El título es obligatorio y debe ser un texto no vacío');
    }
    if (titulo.trim().length > 100) {
        throw new Error('El título no puede superar los 100 caracteres');
    }

    // Regla 2: tipo debe estar en la lista (via module.exports para permitir stub)
    const tiposValidos = module.exports.getTiposValidos();
    if (!tiposValidos.includes(tipo)) {
        throw new Error(`Tipo no válido. Valores aceptados: ${tiposValidos.join(', ')}`);
    }

    // Regla 3: condición debe estar en la lista
    const condicionesValidas = module.exports.getCondicionesValidas();
    if (!condicionesValidas.includes(condicion)) {
        throw new Error(`Condición no válida. Valores aceptados: ${condicionesValidas.join(', ')}`);
    }

    return { valido: true, titulo: titulo.trim(), tipo, condicion };
}

module.exports = {
    getTiposValidos,
    getCondicionesValidas,
    getCategoriasValidas,
    validarPublicacion,
};
