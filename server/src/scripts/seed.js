import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '../../.env') });

import User from '../models/User.js';
import LearningPath from '../models/LearningPath.js';
import Course from '../models/Course.js';
import Module from '../models/Module.js';
import Lesson from '../models/Lesson.js';
import CodingChallenge from '../models/CodingChallenge.js';
import Project from '../models/Project.js';
import Assessment from '../models/Assessment.js';
import Activity from '../models/Activity.js';

const isReset = process.argv.includes('--reset');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Terhubung ke MongoDB');
  } catch (error) {
    console.error('❌ Gagal koneksi:', error.message);
    process.exit(1);
  }
};

const seed = async () => {
  try {
    console.log('🌱 Memulai seeding database...\n');

    if (isReset) {
      console.log('🗑️  Mode RESET: membersihkan database...');
      await Promise.all([
        User.deleteMany(),
        LearningPath.deleteMany(),
        Course.deleteMany(),
        Module.deleteMany(),
        Lesson.deleteMany(),
        CodingChallenge.deleteMany(),
        Project.deleteMany(),
        Assessment.deleteMany(),
        Activity.deleteMany(),
      ]);
      console.log('✅ Database dibersihkan\n');
    }

    // ============ 1. PENGGUNA ============
    const existingAdmin = await User.findOne({ email: 'admin@devforge.id' });
    if (!existingAdmin) {
      await User.create({
        name: 'Admin DevForge',
        email: 'admin@devforge.id',
        password: 'admin123',
        role: 'admin',
        bio: 'Administrator platform DevForge Academy',
      });
      console.log('👤 Admin dibuat: admin@devforge.id / admin123');
    } else {
      console.log('⏭️  Admin sudah ada, dilewati');
    }

    const existingStudent = await User.findOne({ email: 'siswa@devforge.id' });
    if (!existingStudent) {
      await User.create({
        name: 'Siswa Demo',
        email: 'siswa@devforge.id',
        password: 'siswa123',
        role: 'student',
        bio: 'Siswa yang sedang belajar rekayasa perangkat lunak',
      });
      console.log('👤 Siswa dibuat: siswa@devforge.id / siswa123\n');
    } else {
      console.log('⏭️  Siswa sudah ada, dilewati\n');
    }

    // ============ 2. JALUR PEMBELAJARAN ============
    const pathCount = await LearningPath.countDocuments();
    let paths;
    if (pathCount === 0) {
      paths = await LearningPath.insertMany([
        { title: 'Dasar-dasar Pemrograman', slug: 'dasar-dasar-pemrograman', description: 'Konsep inti, pemecahan masalah, dan kode yang mudah dibaca.', level: 'Pemula', order: 1, estimatedHours: 8, icon: 'book-open' },
        { title: 'Rekayasa JavaScript', slug: 'rekayasa-javascript', description: 'Fitur bahasa, perilaku asinkron, dan pola desain.', level: 'Pemula', order: 2, estimatedHours: 12, icon: 'code' },
        { title: 'Struktur Data & Algoritma', slug: 'struktur-data-algoritma', description: 'Modelkan data dan analisis efisiensi.', level: 'Menengah', order: 3, estimatedHours: 16, icon: 'git-branch' },
        { title: 'Rekayasa Frontend', slug: 'rekayasa-frontend', description: 'Bangun antarmuka yang aksesibel dan responsif.', level: 'Menengah', order: 4, estimatedHours: 14, icon: 'layout' },
        { title: 'Rekayasa Backend', slug: 'rekayasa-backend', description: 'Desain layanan dan logika aplikasi yang andal.', level: 'Menengah', order: 5, estimatedHours: 15, icon: 'server' },
        { title: 'Rekayasa Database', slug: 'rekayasa-database', description: 'Modelkan, query, dan rawat data terstruktur.', level: 'Menengah', order: 6, estimatedHours: 11, icon: 'database' },
        { title: 'Rekayasa Perangkat Lunak', slug: 'rekayasa-perangkat-lunak', description: 'Uji, tinjau, dan rawat kode produksi.', level: 'Menengah', order: 7, estimatedHours: 12, icon: 'package' },
        { title: 'DevOps', slug: 'devops', description: 'Pahami pipeline delivery dan operasional.', level: 'Lanjutan', order: 8, estimatedHours: 12, icon: 'cloud' },
        { title: 'Desain Sistem', slug: 'desain-sistem', description: 'Analisis arsitektur dan trade-off.', level: 'Lanjutan', order: 9, estimatedHours: 16, icon: 'network' },
        { title: 'Rekayasa Berbantuan AI', slug: 'rekayasa-berbantuan-ai', description: 'Gunakan AI secara kritis dalam alur kerja rekayasa.', level: 'Lanjutan', order: 10, estimatedHours: 9, icon: 'sparkles' },
      ]);
      console.log(`📚 ${paths.length} jalur pembelajaran dibuat`);
    } else {
      paths = await LearningPath.find().sort({ order: 1 });
      console.log('⏭️  Jalur pembelajaran sudah ada, dilewati');
    }

    // ============ 3. KURSUS ============
    const courseCount = await Course.countDocuments();
    let fundamentalsCourse;
    if (courseCount === 0) {
      fundamentalsCourse = await Course.create({
        title: 'Dasar-dasar Pemrograman',
        slug: 'dasar-dasar-pemrograman-kursus',
        description: 'Pelajari konsep inti pemrograman melalui pelajaran singkat dan latihan yang disengaja.',
        learningPath: paths[0]._id,
        level: 'Pemula',
        order: 1,
        estimatedHours: 8,
        objectives: [
          'Jelaskan variabel, nilai, dan tipe data',
          'Pecah masalah menjadi fungsi',
          'Gunakan kondisi dan perulangan dengan tujuan',
          'Baca error dan uji asumsi',
        ],
        tags: ['pemrograman', 'dasar', 'javascript'],
      });
      console.log('📖 Kursus dasar dibuat');
    } else {
      fundamentalsCourse = await Course.findOne({ slug: 'dasar-dasar-pemrograman-kursus' });
      console.log('⏭️  Kursus sudah ada, dilewati');
    }

    // ============ 4. MODUL ============
    const moduleCount = await Module.countDocuments();
    let modules;
    if (moduleCount === 0) {
      modules = await Module.insertMany([
        { title: 'Berpikir dalam Kode', description: 'Variabel, nilai, dan model mental kode.', course: fundamentalsCourse._id, order: 1 },
        { title: 'Kondisi dan Alur Kontrol', description: 'Membuat keputusan dalam program.', course: fundamentalsCourse._id, order: 2 },
        { title: 'Fungsi dan Komposisi', description: 'Membangun perilaku yang dapat digunakan kembali.', course: fundamentalsCourse._id, order: 3 },
        { title: 'Debugging dan Latihan', description: 'Membaca error dan menguji asumsi.', course: fundamentalsCourse._id, order: 4 },
      ]);
      console.log(`📦 ${modules.length} modul dibuat`);
    } else {
      modules = await Module.find({ course: fundamentalsCourse._id }).sort({ order: 1 });
      console.log('⏭️  Modul sudah ada, dilewati');
    }

    // ============ 5. PELAJARAN ============
    const lessonCount = await Lesson.countDocuments();
    if (lessonCount === 0) {
      await Lesson.insertMany([
        {
          title: 'Variabel dan Nilai',
          slug: 'variabel-dan-nilai',
          module: modules[0]._id,
          course: fundamentalsCourse._id,
          order: 1,
          content: 'Variabel memberi nama yang bermakna pada nilai. Gunakan const ketika nilai tidak akan ditetapkan ulang, dan let ketika nilainya perlu berubah. Nama yang baik membuat kode lebih mudah dibaca dan dipelihara. Ketika Anda kembali ke kode beberapa minggu kemudian, nama variabel yang jelas membantu Anda memahami tujuan setiap bagian tanpa harus menelusuri logikanya dari awal.',
          objectives: [
            'Deklarasikan nilai dengan const atau let',
            'Pilih nama variabel yang bermakna',
            'Prediksi nilai yang dihasilkan oleh ekspresi singkat',
          ],
          codeExample: {
            language: 'javascript',
            code: `const namaKursus = 'Dasar-dasar Pemrograman';\nlet pelajaranSelesai = 0;\npelajaranSelesai += 1;\nconsole.log(namaKursus, pelajaranSelesai);`,
          },
          duration: 15,
          isPreview: true,
        },
        {
          title: 'Tipe dan Ekspresi',
          slug: 'tipe-dan-ekspresi',
          module: modules[0]._id,
          course: fundamentalsCourse._id,
          order: 2,
          content: 'JavaScript memiliki beberapa tipe data dasar: string, number, boolean, null, undefined, dan object. Memahami tipe membantu Anda memprediksi bagaimana sebuah ekspresi akan dievaluasi. Ekspresi adalah kombinasi nilai dan operator yang menghasilkan nilai baru.',
          objectives: [
            'Sebutkan tipe data dasar di JavaScript',
            'Evaluasi ekspresi sederhana secara manual',
            'Gunakan operator dengan tepat',
          ],
          codeExample: {
            language: 'javascript',
            code: `const umur = 21;\nconst nama = 'Budi';\nconst sudahCukupUmur = umur >= 17;\nconsole.log(sudahCukupUmur);`,
          },
          duration: 20,
        },
        {
          title: 'Fungsi dan Input',
          slug: 'fungsi-dan-input',
          module: modules[0]._id,
          course: fundamentalsCourse._id,
          order: 3,
          content: 'Fungsi adalah blok perilaku yang dapat digunakan kembali. Fungsi menerima input melalui parameter dan mengembalikan output. Fungsi yang baik melakukan satu hal dengan jelas dan diberi nama yang menjelaskan tujuannya.',
          objectives: [
            'Definisikan fungsi dengan parameter',
            'Kembalikan nilai dari fungsi',
            'Jelaskan mengapa fungsi membantu organisasi kode',
          ],
          codeExample: {
            language: 'javascript',
            code: `function sapa(nama) {\n  return 'Halo, ' + nama + '!';\n}\nconsole.log(sapa('Budi'));`,
          },
          duration: 25,
        },
      ]);
      console.log('📝 3 pelajaran dibuat');
    } else {
      console.log('⏭️  Pelajaran sudah ada, dilewati');
    }

    // ============ 6. TANTANGAN CODING ============
    const challengeCount = await CodingChallenge.countDocuments();
    if (challengeCount === 0) {
      await CodingChallenge.insertMany([
        {
          title: 'Jumlahkan Array',
          slug: 'jumlahkan-array',
          description: 'Tulis fungsi bernama solution yang mengembalikan jumlah semua angka dalam array.',
          difficulty: 'Pemula',
          category: 'Array',
          order: 1,
          constraints: 'Input adalah array berisi angka. Array kosong mengembalikan 0.',
          example: { input: 'solution([2, 4, 6])', output: '12' },
          hint: 'Mulailah dengan total 0, lalu kunjungi setiap angka dan tambahkan ke total.',
          starterCode: {
            language: 'javascript',
            code: 'function solution(numbers) {\n  // Kembalikan jumlah dari numbers\n  return 0;\n}',
          },
          solutionCode: {
            language: 'javascript',
            code: 'function solution(numbers) {\n  return numbers.reduce((total, n) => total + n, 0);\n}',
          },
          testCases: [
            { input: [], expected: 0, description: 'Array kosong' },
            { input: [2, 4, 6], expected: 12, description: 'Array angka positif' },
            { input: [-2, 5], expected: 3, description: 'Array dengan angka negatif' },
          ],
          points: 10,
          tags: ['array', 'loop', 'reduce'],
        },
        {
          title: 'Balik String',
          slug: 'balik-string',
          description: 'Tulis fungsi bernama solution yang mengembalikan string dalam urutan terbalik.',
          difficulty: 'Pemula',
          category: 'String',
          order: 2,
          constraints: 'Input adalah string. String kosong mengembalikan string kosong.',
          example: { input: 'solution("forge")', output: '"egrof"' },
          hint: 'Pertimbangkan memecah string menjadi karakter, membaliknya, lalu menggabungkannya kembali.',
          starterCode: {
            language: 'javascript',
            code: 'function solution(text) {\n  // Kembalikan string terbalik\n  return text;\n}',
          },
          solutionCode: {
            language: 'javascript',
            code: 'function solution(text) {\n  return text.split("").reverse().join("");\n}',
          },
          testCases: [
            { input: 'forge', expected: 'egrof', description: 'String biasa' },
            { input: 'abc', expected: 'cba', description: 'String pendek' },
            { input: '', expected: '', description: 'String kosong' },
          ],
          points: 10,
          tags: ['string', 'reverse'],
        },
        {
          title: 'Temukan Nilai Maksimum',
          slug: 'temukan-nilai-maksimum',
          description: 'Tulis fungsi bernama solution yang mengembalikan angka terbesar dalam array.',
          difficulty: 'Menengah',
          category: 'Array',
          order: 3,
          constraints: 'Input adalah array tidak kosong berisi angka.',
          example: { input: 'solution([3, 7, 2])', output: '7' },
          hint: 'Simpan nilai maksimum sementara, lalu bandingkan dengan setiap angka berikutnya.',
          starterCode: {
            language: 'javascript',
            code: 'function solution(numbers) {\n  // Kembalikan angka terbesar\n  return 0;\n}',
          },
          testCases: [
            { input: [3, 7, 2], expected: 7 },
            { input: [5], expected: 5 },
            { input: [-1, -5, -3], expected: -1 },
          ],
          points: 15,
          tags: ['array', 'math', 'max'],
        },
      ]);
      console.log('🧩 3 tantangan coding dibuat');
    } else {
      console.log('⏭️  Tantangan coding sudah ada, dilewati');
    }

    // ============ 7. PROYEK ============
    const projectCount = await Project.countDocuments();
    if (projectCount === 0) {
      await Project.insertMany([
        {
          title: 'Aplikasi Todo', slug: 'aplikasi-todo',
          description: 'Buat dan kelola tugas dengan perubahan state yang jelas.',
          level: 'Pemula', order: 1,
          requirements: 'Buat, perbarui, selesaikan, dan hapus item. Jaga konsistensi state di setiap pembaruan antarmuka.',
          technicalSpecs: 'Entitas yang disarankan: task dengan id, title, completed, dan created_at.',
          architecture: 'Komponen UI → state dan aturan bisnis → penyimpanan data.',
          milestones: [
            { title: 'Rencanakan kebutuhan', order: 1 },
            { title: 'Desain arsitektur', order: 2 },
            { title: 'Implementasikan fitur inti', order: 3 },
            { title: 'Uji dan tinjau', order: 4 },
          ],
          estimatedHours: 8, tags: ['todo', 'state', 'pemula'],
        },
        {
          title: 'Aplikasi Catatan', slug: 'aplikasi-catatan',
          description: 'Tangkap, edit, dan temukan catatan yang berguna.',
          level: 'Pemula', order: 2,
          milestones: [
            { title: 'Rencanakan kebutuhan', order: 1 },
            { title: 'Bangun editor catatan', order: 2 },
            { title: 'Tambahkan pencarian', order: 3 },
            { title: 'Uji dan tinjau', order: 4 },
          ],
          estimatedHours: 8, tags: ['catatan', 'search'],
        },
        {
          title: 'REST API', slug: 'rest-api',
          description: 'Modelkan endpoint, validasi, dan penanganan error.',
          level: 'Menengah', order: 3,
          milestones: [
            { title: 'Rancang resource', order: 1 },
            { title: 'Bangun endpoint CRUD', order: 2 },
            { title: 'Tambahkan validasi', order: 3 },
            { title: 'Tulis pengujian', order: 4 },
            { title: 'Dokumentasikan API', order: 5 },
          ],
          estimatedHours: 12, tags: ['api', 'rest', 'backend'],
        },
      ]);
      console.log('🚀 3 proyek dibuat');
    } else {
      console.log('⏭️  Proyek sudah ada, dilewati');
    }

    // ============ 8. ASESMEN ============
    const assessmentCount = await Assessment.countDocuments();
    if (assessmentCount === 0) {
      await Assessment.create({
        title: 'Checkpoint Dasar Pemrograman',
        slug: 'checkpoint-dasar-pemrograman',
        description: 'Uji pemahaman Anda tentang variabel dan fungsi.',
        course: fundamentalsCourse._id,
        type: 'checkpoint',
        passingScore: 70,
        maxAttempts: 3,
        questions: [
          {
            question: 'Deklarasi mana yang paling tepat untuk binding yang tidak akan ditetapkan ulang?',
            type: 'pilihan_ganda',
            options: ['let', 'const', 'var'],
            correctAnswer: 'const',
            explanation: 'const menandakan binding tidak akan ditetapkan ulang, membuat intent kode lebih jelas.',
            points: 50,
            order: 1,
          },
          {
            question: 'Apa yang dibantu oleh fungsi?',
            type: 'pilihan_ganda',
            options: [
              'Mengorganisir perilaku yang dapat digunakan kembali',
              'Secara otomatis menghapus semua error',
            ],
            correctAnswer: 'Mengorganisir perilaku yang dapat digunakan kembali',
            explanation: 'Fungsi membantu memecah masalah menjadi unit perilaku yang dapat digunakan kembali, bukan menghapus error secara otomatis.',
            points: 50,
            order: 2,
          },
        ],
      });
      console.log('📋 1 asesmen dibuat\n');
    } else {
      console.log('⏭️  Asesmen sudah ada, dilewati\n');
    }

    console.log('═══════════════════════════════════════════');
    console.log('✅ SEEDING BERHASIL DISELESAIKAN!');
    console.log('═══════════════════════════════════════════');
    console.log('👤 Admin : admin@devforge.id / admin123');
    console.log('👤 Siswa : siswa@devforge.id / siswa123');
    console.log('═══════════════════════════════════════════\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error saat seeding:', error);
    process.exit(1);
  }
};

connectDB().then(seed);