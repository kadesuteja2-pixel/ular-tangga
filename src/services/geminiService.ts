import { GoogleGenerativeAI } from "@google/generative-ai";
import { Subject, EducationLevel, Question } from "../types";
import { SUBJECT_QUESTIONS } from "../constants";

const GEN_AI_KEY = process.env.GEMINI_API_KEY || "";
const genAI = GEN_AI_KEY ? new GoogleGenerativeAI(GEN_AI_KEY) : null;

async function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function generateQuestions(
  subject: Subject,
  level: EducationLevel,
  objective: string,
  retryCount = 0
): Promise<Question[]> {
  // 1. Check for API key first
  if (!genAI) {
    console.warn("No Gemini API key found, skipping directly to fallback");
    return getFallbackQuestions(subject);
  }

  // 2. Check Cache
  const cacheKey = `edu_snake_questions_${subject}_${level}_${objective.replace(/\s+/g, '_').toLowerCase()}`;
  try {
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      console.log("Using cached questions for", subject);
      return JSON.parse(cached);
    }
  } catch (e) {
    console.warn("Cache access error:", e);
  }

  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const prompt = `
    Anda adalah ahli materi pendidikan profesional (Instructional Designer) di Indonesia. 
    Tugas Anda adalah membuat 20 soal pilihan ganda yang AKURAT, BERKUALITAS, dan MENARIK untuk permainan ular tangga edukasi.
    (Hanya 20 agar respon lebih cepat dan hemat kuota).

    KONTEKS:
    - Mata Pelajaran: ${subject}
    - Jenjang: ${level}
    - Tujuan Pembelajaran: ${objective}
    
    KRITERIA KUALITAS SOAL (WAJIB):
    1. AKURASI MUTLAK: Setiap pertanyaan dan kunci jawaban harus diverifikasi kebenarannya. Jangan buat soal yang ambigu atau memiliki lebih dari satu jawaban benar.
    2. RELEVANSI KURIKULUM: Soal harus sesuai dengan standar kurikulum Merdeka/KTSP di Indonesia untuk jenjang ${level}.
    3. PENGECOH BERKUALITAS: Pilihan salah harus tampak masuk akal (tidak asal-asalan) sehingga benar-benar menguji pemahaman siswa.
    4. KEDALAMAN MATERI:
       - SD: Fokus pada pengenalan istilah, fakta dasar, dan contoh nyata.
       - SMP: Fokus pada pemahaman konsep, sebab-akibat, dan klasifikasi.
       - SMA: Fokus pada analisis, aplikasi rumus/teori, dan penalaran tingkat tinggi (HOTS).
    5. BAHASA: Gunakan kalimat yang efektif, tidak bermakna ganda, dan sesuai PUEBI.

    CONTOH STRUKTUR (Pastikan correctAnswer sesuai):
    {
      "id": "q_math_1",
      "subject": "Matematika",
      "text": "Jika x + 5 = 12, berapakah nilai x?",
      "options": ["5", "7", "12", "17"],
      "correctAnswer": 1
    }

    PENTING: Anda harus bertindak sebagai pengawas kualitas yang memeriksa ulang setiap soal. Jika soal salah, pemain akan merasa dicurangi.
    Hanya kembalikan JSON valid array tanpa teks lain.
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    // Some models might wrap JSON in markdown blocks, strip if necessary
    const cleanJson = text.replace(/```json/g, "").replace(/```/g, "").trim();
    const questions = JSON.parse(cleanJson);
    
    // Save to cache
    try {
      localStorage.setItem(cacheKey, JSON.stringify(questions));
    } catch (e) {
      console.warn("Failed to save to cache:", e);
    }
    
    return questions;
  } catch (error: any) {
    console.error("Gagal generate soal:", error);
    
    // Retry logic for 429
    if ((error?.message?.includes("429") || error?.message?.includes("RESOURCE_EXHAUSTED") || error?.message?.includes("quota")) && retryCount < 2) {
      console.log(`Retrying question generation (attempt ${retryCount + 1})...`);
      await delay(2000 * (retryCount + 1));
      return generateQuestions(subject, level, objective, retryCount + 1);
    }
    
    return getFallbackQuestions(subject);
  }
}

function getFallbackQuestions(subject: Subject): Question[] {
  // Fallback system
  const localFallback = SUBJECT_QUESTIONS[subject] || [];
  if (localFallback.length > 0) {
    console.log("Using local static fallback for", subject);
    return localFallback.map(q => ({ ...q, text: `[MODE LOKAL] ${q.text}` }));
  }

  const fallbackQuestions = [
    { id: "f1", text: "Apa ibukota Indonesia?", options: ["Jakarta", "Surabaya", "Bandung", "Medan"], correctAnswer: 0 },
    { id: "f2", text: "Siapa presiden pertama Indonesia?", options: ["BJ Habibie", "Soeharto", "Soekarno", "Gus Dur"], correctAnswer: 2 },
    { id: "f3", text: "Berapakah hasil dari 25 + 75?", options: ["90", "100", "110", "120"], correctAnswer: 1 },
    { id: "f4", text: "Lambang negara Indonesia adalah...", options: ["Pancasila", "Garuda Pancasila", "Bhinneka Tunggal Ika", "Merah Putih"], correctAnswer: 1 },
    { id: "f5", text: "Pulau terbesar di Indonesia adalah...", options: ["Jawa", "Sumatera", "Kalimantan", "Papua"], correctAnswer: 3 },
    { id: "f6", text: "Apa warna dasar bendera Indonesia?", options: ["Merah Putih", "Putih Merah", "Merah Kuning", "Biru Putih"], correctAnswer: 0 },
    { id: "f7", text: "Pancasila memiliki berapa sila?", options: ["3", "4", "5", "6"], correctAnswer: 2 },
    { id: "f8", text: "Siapa penemu gaya gravitasi?", options: ["Einstein", "Newton", "Tesla", "Galileo"], correctAnswer: 1 },
    { id: "f9", text: "Samudera terluas di dunia adalah...", options: ["Hindia", "Atlantik", "Pasifik", "Arktik"], correctAnswer: 2 },
    { id: "f10", text: "Gunung tertinggi di Indonesia adalah...", options: ["Merapi", "Jayawijaya", "Semeru", "Rinjani"], correctAnswer: 1 }
  ];
  
  return fallbackQuestions.map(q => ({
    ...q,
    subject: subject,
    text: `[MODE SIMULASI] ${q.text}`
  }));
}
