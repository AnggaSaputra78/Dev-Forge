/**
 * Eksekutor Kode untuk Tantangan Coding
 *
 * ⚠️ CATATAN KEAMANAN PENTING:
 * Implementasi ini menjalankan kode di dalam proses Node.js yang sama
 * menggunakan `new Function`. Ini CUKUP untuk lingkungan belajar/demo,
 * tetapi BUKAN isolasi keamanan penuh.
 *
 * Untuk PRODUCTION, jalankan kode di lingkungan terisolasi seperti:
 * - Docker container dengan resource limit
 * - Layanan pihak ketiga: Piston API, Judge0
 * - Worker terpisah dengan vm + timeout ketat
 *
 * Jangan pernah menganggap eksekusi ini aman untuk input publik
 * tanpa sandbox tambahan.
 */

/**
 * Jalankan kode pengguna terhadap test cases
 * @param {string} code - Kode yang berisi function solution()
 * @param {Array} testCases - Array of { input, expected }
 * @returns {Promise<{passed, total, testResults, executionTime}>}
 */
export const executeCode = async (code, testCases) => {
  const startTime = Date.now();
  const testResults = [];
  let passed = 0;

  // Langkah 1: Kompilasi kode dan ambil fungsi solution
  let solutionFn;
  try {
    const factory = new Function(
      `"use strict";\n${code}\n;return typeof solution === 'function' ? solution : null;`
    );
    solutionFn = factory();
  } catch (error) {
    throw new Error('Gagal mengkompilasi kode: ' + error.message);
  }

  if (!solutionFn) {
    throw new Error('Fungsi "solution" tidak ditemukan. Pastikan Anda mendefinisikan function solution(...)');
  }

  // Langkah 2: Jalankan setiap test case
  for (let i = 0; i < testCases.length; i++) {
    const tc = testCases[i];
    const inputCopy = JSON.parse(JSON.stringify(tc.input));

    try {
      const actual = solutionFn(inputCopy);
      const isCorrect = JSON.stringify(actual) === JSON.stringify(tc.expected);

      testResults.push({
        testCaseIndex: i,
        passed: isCorrect,
        input: tc.input,
        expected: tc.expected,
        actual,
        error: null,
      });

      if (isCorrect) passed++;
    } catch (error) {
      testResults.push({
        testCaseIndex: i,
        passed: false,
        input: tc.input,
        expected: tc.expected,
        actual: null,
        error: error.message,
      });
    }
  }

  return {
    passed,
    total: testCases.length,
    testResults,
    executionTime: Date.now() - startTime,
  };
};

/**
 * Jalankan kode bebas (untuk playground opsional di server)
 * Menangkap console.log ke array
 */
export const executeFreeCode = async (code) => {
  const logs = [];
  const fakeConsole = {
    log: (...args) => logs.push({ type: 'log', text: args.map(formatValue).join(' ') }),
    error: (...args) => logs.push({ type: 'error', text: args.map(formatValue).join(' ') }),
    warn: (...args) => logs.push({ type: 'warn', text: args.map(formatValue).join(' ') }),
  };

  try {
    const fn = new Function('console', `"use strict";\n${code}`);
    fn(fakeConsole);
    return { success: true, logs, error: null };
  } catch (error) {
    return { success: false, logs, error: error.message };
  }
};

function formatValue(value) {
  if (typeof value === 'object' && value !== null) {
    try {
      return JSON.stringify(value);
    } catch {
      return String(value);
    }
  }
  return String(value);
}