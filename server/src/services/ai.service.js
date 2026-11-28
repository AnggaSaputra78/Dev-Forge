import dotenv from 'dotenv';
dotenv.config();

class AIService {
  constructor() {
    this.provider = process.env.AI_PROVIDER || 'openai';
    this.apiKey = process.env.AI_API_KEY;
    this.model = process.env.AI_MODEL || 'openai/gpt-oss-120b';
    this.baseUrl = process.env.AI_BASE_URL || 'https://api.openai.com/v1';
    this.isConfigured = Boolean(this.apiKey) && this.apiKey !== 'your-api-key-here';
  }

  async generateResponse(action, userMessage, codeSnippet = '') {
    if (!this.isConfigured) return this.getStaticResponse(action);
    try {
      return await this.callAI(action, userMessage, codeSnippet);
    } catch (error) {
      console.error('Error memanggil AI:', error.message);
      return this.getStaticResponse(action);
    }
  }

  async callAI(action, userMessage, codeSnippet) {
    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: this.model,
        messages: [
          { role: 'system', content: this.getSystemPrompt(action) },
          {
            role: 'user',
            content: `${userMessage}${codeSnippet ? `\n\nKode:\n${codeSnippet}` : ''}`,
          },
        ],
        temperature: 0.7,
        max_tokens: 800,
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`API ${response.status}: ${text.slice(0, 200)}`);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || this.getStaticResponse(action);
  }

  getSystemPrompt(action) {
    const prompts = {
      'Jelaskan Kode': 'Anda mentor pemrograman Indonesia. Jelaskan kode dengan bahasa sederhana, fokus konsep, ajukan pertanyaan panduan, jangan beri solusi jadi.',
      'Asisten Debug': 'Anda asisten debugging. Bantu siswa menemukan bug sendiri dengan petunjuk area yang diperiksa, bukan solusi langsung.',
      'Buat Petunjuk': 'Anda pembuat petunjuk. Berikan petunjuk bertahap menuju solusi tanpa memberikannya langsung.',
      'Tinjauan Kode': 'Anda reviewer kode. Beri feedback konstruktif: keterbacaan, praktik terbaik, potensi perbaikan.',
      'Penjelasan Konsep': 'Anda pengajar konsep. Jelaskan dengan analogi sederhana dan contoh praktis dalam bahasa Indonesia.',
      'Pertanyaan Bebas': 'Anda mentor ramah. Bantu siswa belajar dengan pertanyaan panduan, bukan jawaban langsung.',
    };
    return prompts[action] || prompts['Pertanyaan Bebas'];
  }

  getStaticResponse(action) {
    const responses = {
      'Jelaskan Kode': 'Coba identifikasi setiap input, ikuti perubahan nilai baris demi baris, dan prediksi output sebelum menjalankan. Bagian mana yang paling membingungkan?',
      'Asisten Debug': 'Temukan input terkecil yang gagal. Bandingkan nilai harapan dan aktual di tiap langkah. Asumsi apa yang Anda buat tentang input?',
      'Buat Petunjuk': 'Mulai dari contoh yang bisa Anda selesaikan manual, lalu ubah langkahnya menjadi kode. Apa yang terjadi jika input kosong?',
      'Tinjauan Kode': 'Periksa penamaan variabel, kasus tepi, logika berulang, dan apakah pembaca bisa mengikuti maksud kode.',
      'Penjelasan Konsep': 'Hubungkan ide baru dengan sebuah nilai, sebuah operasi, dan satu kasus penggunaan praktis.',
      'Pertanyaan Bebas': 'Coba jelaskan masalah dengan kata-kata Anda sendiri, lalu identifikasi bagian terkecil yang bisa diuji dulu.',
    };
    return responses[action] || responses['Pertanyaan Bebas'];
  }
}

export default new AIService();
