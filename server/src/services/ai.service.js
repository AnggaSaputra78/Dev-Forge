import dotenv from 'dotenv';
dotenv.config();

class AIService {
  constructor() {
    this.provider = process.env.AI_PROVIDER || 'openai';
    this.apiKey = process.env.AI_API_KEY;
    this.model = process.env.AI_MODEL || 'llama-3.3-70b-versatile';
    this.baseUrl = process.env.AI_BASE_URL || 'https://api.openai.com/v1';
    this.isConfigured = Boolean(this.apiKey) && this.apiKey !== '';
  }

  async generateResponse(action, userMessage, codeSnippet = '') {
    if (!this.isConfigured) {
      console.log('⚠️ AI tidak dikonfigurasi, menggunakan respons statis');
      return this.getStaticResponse(action);
    }

    try {
      const response = await this.callOpenAICompatible(action, userMessage, codeSnippet);
      console.log('✅ Respons AI berhasil dihasilkan');
      return response;
    } catch (error) {
      console.error('❌ Error memanggil AI:', error.message);
      return this.getStaticResponse(action);
    }
  }

  async callOpenAICompatible(action, userMessage, codeSnippet) {
    const systemPrompt = this.getSystemPrompt(action);
    const url = `${this.baseUrl}/chat/completions`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: this.model,
        messages: [
          { role: 'system', content: systemPrompt },
          {
            role: 'user',
            content: `${userMessage}${codeSnippet ? `\n\nKode:\n\`\`\`javascript\n${codeSnippet}\n\`\`\`` : ''}`,
          },
        ],
        temperature: 0.7,
        max_tokens: 800,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API mengembalikan status ${response.status}: ${errorText.slice(0, 200)}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    
    if (!content) throw new Error('Respons AI kosong');
    return content;
  }

  getSystemPrompt(action) {
    const prompts = {
      'Jelaskan Kode':
        'Anda adalah mentor pemrograman Indonesia yang sabar. Jelaskan kode dengan bahasa Indonesia sederhana, fokus pada konsep. Ajukan pertanyaan panduan, jangan berikan solusi jadi. Gunakan format yang rapi dengan bullet points bila perlu.',
      'Asisten Debug':
        'Anda adalah asisten debugging yang membantu siswa menemukan bug mereka sendiri. Berikan petunjuk tentang area yang perlu diperiksa, bukan langsung memberi solusi. Ajak siswa berpikir kritis dengan pertanyaan panduan.',
      'Buat Petunjuk':
        'Anda adalah pembuat petunjuk pembelajaran. Berikan petunjuk bertahap (step-by-step) yang memandu siswa menuju solusi tanpa memberikannya langsung. Gunakan analogi yang relatable.',
      'Tinjauan Kode':
        'Anda adalah reviewer kode profesional. Berikan feedback konstruktif tentang: (1) keterbacaan, (2) praktik terbaik, (3) potensi bug, (4) saran perbaikan konkret. Gunakan bahasa Indonesia.',
      'Penjelasan Konsep':
        'Anda adalah pengajar konsep pemrograman senior. Jelaskan dengan analogi sederhana dan contoh praktis dalam bahasa Indonesia. Hubungkan konsep dengan kasus penggunaan dunia nyata.',
      'Pertanyaan Bebas':
        'Anda adalah mentor pemrograman yang ramah dan membantu. Jawab dengan pendekatan Socratic - bantu siswa menemukan jawaban sendiri melalui pertanyaan dan petunjuk, bukan memberi jawaban langsung.',
    };
    return prompts[action] || prompts['Pertanyaan Bebas'];
  }

  getStaticResponse(action) {
    const responses = {
      'Jelaskan Kode':
        'Coba identifikasi setiap input, ikuti bagaimana nilai berubah baris demi baris, dan prediksi output sebelum menjalankannya. Bagian mana yang paling membingungkan Anda?',
      'Asisten Debug':
        'Temukan input terkecil yang gagal. Bandingkan nilai yang diharapkan dan nilai aktual di setiap langkah. Asumsi apa yang Anda buat tentang data input?',
      'Buat Petunjuk':
        'Mulailah dengan contoh yang dapat Anda selesaikan secara manual, lalu ubah langkah-langkah itu menjadi kode. Apa yang terjadi jika input kosong?',
      'Tinjauan Kode':
        'Periksa penamaan variabel, kasus tepi, logika berulang, dan apakah pembaca dapat mengikuti maksud kode. Apakah ada cara yang lebih sederhana?',
      'Penjelasan Konsep':
        'Hubungkan ide baru dengan sebuah nilai, sebuah operasi, dan satu kasus penggunaan praktis. Bisakah Anda memikirkan situasi nyata yang menggunakan konsep ini?',
      'Pertanyaan Bebas':
        'Coba jelaskan masalahnya dengan kata-kata Anda sendiri, lalu identifikasi bagian terkecil yang dapat Anda uji terlebih dahulu.',
    };
    return responses[action] || responses['Pertanyaan Bebas'];
  }
}

export default new AIService();