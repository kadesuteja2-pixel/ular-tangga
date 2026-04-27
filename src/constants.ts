import { Question, Subject, AvatarOption } from './types';

export const AVATAR_OPTIONS: AvatarOption[] = [
  { id: 'cat', name: 'Kucing', icon: '🐱' },
  { id: 'lion', name: 'Singa', icon: '🦁' },
  { id: 'elephant', name: 'Gajah', icon: '🐘' },
  { id: 'panda', name: 'Panda', icon: '🐼' },
  { id: 'rabbit', name: 'Kelinci', icon: '🐰' },
];

export const BOARD_SIZE = 7;
export const TOTAL_SQUARES = 49;

export const AUDIO_URLS = {
  BGM: 'https://cdn.pixabay.com/audio/2022/01/26/audio_2773419965.mp3', // Sweet and happy children's music
  CLICK: 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3', // Soft click
  SUCCESS: 'https://assets.mixkit.co/active_storage/sfx/2013/2013-preview.mp3', // Applause
  FAIL: 'https://assets.mixkit.co/active_storage/sfx/529/529-preview.mp3', // Wrong Buzzer/Tetot
  DICE: 'https://assets.mixkit.co/active_storage/sfx/2573/2573-preview.mp3', // Dice roll
};

// Snakes (start -> end, start > end)
export const SNAKES: Record<number, number> = {
  48: 30,
  35: 14,
  24: 5,
  18: 2,
};

// Ladders (start -> end, start < end)
export const LADDERS: Record<number, number> = {
  4: 17,
  7: 24,
  13: 28,
  22: 41,
  33: 47,
};

export const SUBJECT_QUESTIONS: Record<Subject, Question[]> = {
  Matematika: [
    {
      id: 'm1',
      subject: 'Matematika',
      text: 'Berapakah hasil dari 12 x 5?',
      options: ['50', '60', '70', '80'],
      correctAnswer: 1,
    },
    {
      id: 'm2',
      subject: 'Matematika',
      text: 'Berapakah 25% dari 200?',
      options: ['25', '40', '50', '60'],
      correctAnswer: 2,
    },
    {
      id: 'm3',
      subject: 'Matematika',
      text: 'Bentuk sederhana dari 3/6 adalah...',
      options: ['1/2', '1/3', '2/3', '1/4'],
      correctAnswer: 0,
    },
    {
      id: 'm4',
      subject: 'Matematika',
      text: 'Hasil dari 150 + 250 - 100 adalah...',
      options: ['200', '300', '400', '500'],
      correctAnswer: 1,
    },
  ],
  IPA: [
    {
      id: 'i1',
      subject: 'IPA',
      text: 'Planet yang dijuluki si Merah adalah...',
      options: ['Venus', 'Mars', 'Jupiter', 'Saturnus'],
      correctAnswer: 1,
    },
    {
      id: 'i2',
      subject: 'IPA',
      text: 'Hewan yang memakan segalanya (tumbuhan dan daging) disebut...',
      options: ['Herbivora', 'Karnivora', 'Omnivora', 'Insektivora'],
      correctAnswer: 2,
    },
    {
      id: 'i3',
      subject: 'IPA',
      text: 'Proses tumbuhan hijau membuat makanan sendiri disebut...',
      options: ['Respirasi', 'Fotosintesis', 'Oksidasi', 'Transpirasi'],
      correctAnswer: 1,
    },
  ],
  IPS: [
    {
      id: 's1',
      subject: 'IPS',
      text: 'Ibukota negara Indonesia saat ini adalah...',
      options: ['Surabaya', 'Bandung', 'Jakarta', 'Ibukota Nusantara'],
      correctAnswer: 2,
    },
    {
      id: 's2',
      subject: 'IPS',
      text: 'Benua terkecil di dunia adalah...',
      options: ['Asia', 'Eropa', 'Australia', 'Afrika'],
      correctAnswer: 2,
    },
    {
      id: 's3',
      subject: 'IPS',
      text: 'Candi Borobudur terletak di provinsi...',
      options: ['Jawa Barat', 'Jawa Tengah', 'Jawa Timur', 'DI Yogyakarta'],
      correctAnswer: 1,
    },
  ],
  'Bahasa Indonesia': [
    {
      id: 'b1',
      subject: 'Bahasa Indonesia',
      text: 'Lawan kata dari "Rajin" adalah...',
      options: ['Pintar', 'Malas', 'Banyak', 'Sering'],
      correctAnswer: 1,
    },
    {
      id: 'b2',
      subject: 'Bahasa Indonesia',
      text: 'Huruf kapital digunakan pada awal...',
      options: ['Kalimat', 'Kata benda', 'Kata kerja', 'Kata sifat'],
      correctAnswer: 0,
    },
    {
      id: 'b3',
      subject: 'Bahasa Indonesia',
      text: 'Persamaan kata dari "Pandai" adalah...',
      options: ['Bodoh', 'Rajin', 'Pintar', 'Tekun'],
      correctAnswer: 2,
    },
  ],
  'Bahasa Inggris': [
    {
      id: 'en1',
      subject: 'Bahasa Inggris',
      text: 'What is the color of the sky?',
      options: ['Green', 'Blue', 'Red', 'Yellow'],
      correctAnswer: 1,
    },
    {
      id: 'en2',
      subject: 'Bahasa Inggris',
      text: 'I ... a student.',
      options: ['is', 'am', 'are', 'be'],
      correctAnswer: 1,
    },
    {
      id: 'en3',
      subject: 'Bahasa Inggris',
      text: 'The color of a ripe banana is...',
      options: ['Red', 'Yellow', 'Green', 'Purple'],
      correctAnswer: 1,
    },
  ],
  'Agama Hindu': [
    {
      id: 'ah1',
      subject: 'Agama Hindu',
      text: 'Kitab suci agama Hindu adalah...',
      options: ['Tripitaka', 'Weda', 'Al-Quran', 'Alkitab'],
      correctAnswer: 1,
    },
    {
      id: 'ah2',
      subject: 'Agama Hindu',
      text: 'Hari raya umat Hindu yang dirayakan dengan keheningan adalah...',
      options: ['Galungan', 'Kuningan', 'Nyepi', 'Saraswati'],
      correctAnswer: 2,
    },
  ],
  Olahraga: [
    {
      id: 'ol1',
      subject: 'Olahraga',
      text: 'Jumlah pemain sepak bola dalam satu tim adalah...',
      options: ['5', '7', '11', '12'],
      correctAnswer: 2,
    },
    {
      id: 'ol2',
      subject: 'Olahraga',
      text: 'Induk organisasi sepak bola dunia adalah...',
      options: ['FIFA', 'PSSI', 'NBA', 'BWF'],
      correctAnswer: 0,
    },
  ],
  'Bahasa Bali': [
    {
      id: 'bb1',
      subject: 'Bahasa Bali',
      text: 'Om Swastyastu adalah salam dalam bahasa...',
      options: ['Jawa', 'Sunda', 'Bali', 'Madura'],
      correctAnswer: 2,
    },
    {
      id: 'bb2',
      subject: 'Bahasa Bali',
      text: 'Angka satu dalam bahasa Bali alus adalah...',
      options: ['Besik', 'Siki', 'Kalih', 'Tiga'],
      correctAnswer: 1,
    },
  ],
  TIK: [
    {
      id: 'tik1',
      subject: 'TIK',
      text: 'Alat untuk mengetik pada komputer adalah...',
      options: ['Mouse', 'Monitor', 'Keyboard', 'Printer'],
      correctAnswer: 2,
    },
    {
      id: 'tik2',
      subject: 'TIK',
      text: 'Otak dari sebuah komputer disebut...',
      options: ['RAM', 'Harddisk', 'CPU', 'Monitor'],
      correctAnswer: 2,
    },
  ],
};
