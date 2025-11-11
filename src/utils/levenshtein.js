/**
 * Brújula Security - Levenshtein Distance Algorithm
 * Calcula la distancia de edición entre dos strings
 * Complejidad: O(m × n)
 */

/**
 * Calcula la distancia de Levenshtein entre dos strings
 * @param {string} str1 - Primer string (dominio actual)
 * @param {string} str2 - Segundo string (dominio verificado)
 * @returns {number} - Número de operaciones para transformar str1 en str2
 */
function levenshteinDistance(str1, str2) {
  if (!str1 || !str2) {
    return Math.max(str1 ? str1.length : 0, str2 ? str2.length : 0);
  }

  const len1 = str1.length;
  const len2 = str2.length;

  // Early exit optimization: si la diferencia de longitud es > 20%, no es typosquatting
  if (Math.abs(len1 - len2) > Math.max(len1, len2) * 0.2) {
    return Math.max(len1, len2);
  }

  // Crear matriz de distancias
  const matrix = Array(len2 + 1).fill(null).map(() => Array(len1 + 1).fill(0));

  // Inicializar primera fila y columna
  for (let i = 0; i <= len2; i++) {
    matrix[i][0] = i;
  }
  for (let j = 0; j <= len1; j++) {
    matrix[0][j] = j;
  }

  // Llenar matriz con algoritmo de programación dinámica
  for (let i = 1; i <= len2; i++) {
    for (let j = 1; j <= len1; j++) {
      const cost = str2.charAt(i - 1) === str1.charAt(j - 1) ? 0 : 1;
      
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,      // Eliminación
        matrix[i][j - 1] + 1,      // Inserción
        matrix[i - 1][j - 1] + cost // Sustitución
      );
    }
  }

  return matrix[len2][len1];
}

/**
 * Calcula el porcentaje de similitud entre dos strings
 * @param {string} str1 - Primer string
 * @param {string} str2 - Segundo string
 * @returns {number} - Porcentaje de similitud (0-100)
 */
function calculateSimilarity(str1, str2) {
  const distance = levenshteinDistance(str1, str2);
  const maxLength = Math.max(str1.length, str2.length);
  
  if (maxLength === 0) {
    return 100;
  }
  
  return ((1 - (distance / maxLength)) * 100);
}

// Exportar para uso en otros módulos
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { levenshteinDistance, calculateSimilarity };
}
