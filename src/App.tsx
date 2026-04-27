/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Trophy, 
  Play, 
  HelpCircle, 
  ArrowLeft, 
  Dice1, 
  Dice2,
  Dice3,
  Dice4,
  Dice5,
  Dice6,
  ChevronRight,
  RefreshCw,
  Volume2,
  VolumeX,
  BookOpen,
  Users,
  Timer,
  CheckCircle2,
  XCircle,
  Home,
  ChevronDown,
  ChevronUp,
  Share2,
  Copy,
  AlertCircle
} from 'lucide-react';
import { 
  Subject, 
  EducationLevel,
  Question, 
  Player, 
  GameScreen, 
  AvatarOption 
} from './types';
import { 
  AVATAR_OPTIONS, 
  SNAKES, 
  LADDERS, 
  TOTAL_SQUARES,
  AUDIO_URLS
} from './constants';
import { getGridCoords } from './utils';
import { generateQuestions } from './services/geminiService';

const DECORATIONS = ['🌸', '🍀', '✨', '☁️', '🍄'];
const SQUARE_COLORS = [
  'bg-red-100', 'bg-orange-100', 'bg-yellow-100', 'bg-green-100', 
  'bg-blue-100', 'bg-indigo-100', 'bg-purple-100', 'bg-pink-100',
  'bg-teal-100', 'bg-cyan-100'
];

// --- Components ---

const HomeScreen = ({ onStart, onInstructions }: { onStart: () => void, onInstructions: () => void }) => (
  <div className="flex flex-col items-center justify-center h-full space-y-12 p-8">
    <motion.div 
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="text-center space-y-4"
    >
      <h1 className="text-6xl md:text-8xl font-black text-blue-600 drop-shadow-xl tracking-tight">
        EDU SNAKE <span className="text-orange-500">LADDER</span>
      </h1>
      <p className="text-2xl text-gray-500 font-medium italic">Belajar jadi seru & penuh tantangan!</p>
    </motion.div>

    <div className="flex flex-col md:flex-row gap-6 w-full max-w-2xl">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onStart}
        className="flex-1 bg-green-500 hover:bg-green-600 text-white text-3xl font-bold py-8 rounded-3xl shadow-2xl flex items-center justify-center gap-4 border-b-8 border-green-700 active:border-b-0 active:translate-y-2 transition-all cursor-pointer"
      >
        <Play size={40} /> Mulai Permainan
      </motion.button>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onInstructions}
        className="flex-1 bg-blue-500 hover:bg-blue-600 text-white text-3xl font-bold py-8 rounded-3xl shadow-2xl flex items-center justify-center gap-4 border-b-8 border-blue-700 active:border-b-0 active:translate-y-2 transition-all cursor-pointer"
      >
        <HelpCircle size={40} /> Petunjuk
      </motion.button>
    </div>

    <motion.div 
      animate={{ y: [0, -20, 0] }}
      transition={{ repeat: Infinity, duration: 2 }}
      className="absolute bottom-10 right-10 opacity-20 pointer-events-none"
    >
      <Trophy size={200} className="text-yellow-500" />
    </motion.div>

    <div className="absolute bottom-4 flex flex-col items-center gap-2">
      <div className="text-center text-gray-400 text-sm font-medium">
        Created by <span className="text-blue-500 font-bold">SUTEJA</span>
      </div>
      <button 
        onClick={() => {
          const url = window.location.href;
          navigator.clipboard.writeText(url);
          alert('Link aplikasi disalin! Silakan bagikan ke teman-teman.');
        }}
        className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition-colors font-bold text-sm"
      >
        <Share2 size={16} /> Bagikan Link Game
      </button>
    </div>
  </div>
);

const SubjectScreen = ({ onSelect, onBack }: { onSelect: (subject: Subject, level: EducationLevel, objective: string) => void, onBack: () => void }) => {
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<EducationLevel | null>(null);
  const [objective, setObjective] = useState('');
  const [customSubject, setCustomSubject] = useState('');
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const subjects = [
    'Bahasa Inggris', 
    'Bahasa Indonesia', 
    'Agama Hindu', 
    'Matematika', 
    'IPA', 
    'IPS', 
    'Olahraga', 
    'Bahasa Bali', 
    'TIK'
  ];
  const levels: EducationLevel[] = ['SD', 'SMP', 'SMA/SMK'];

  const finalSubject = isCustomMode ? customSubject : selectedSubject;
  const canContinue = finalSubject && finalSubject.trim().length > 0 && selectedLevel && objective.trim().length > 5;

  return (
    <div className="flex flex-col items-center justify-center min-h-full py-12 px-8 space-y-8 max-w-4xl mx-auto">
      <div className="w-full flex justify-between items-center">
        <button 
          onClick={onBack}
          className="bg-white text-gray-600 px-6 py-3 rounded-xl border-b-4 border-gray-200 hover:bg-gray-50 flex items-center gap-2 font-bold transition-all active:translate-y-1 active:border-b-0"
        >
          <ArrowLeft size={24} /> Kembali
        </button>
        <h2 className="text-4xl font-bold text-gray-800 flex items-center gap-3">
          <BookOpen className="text-blue-500" /> Konfigurasi Permainan
        </h2>
        <div className="w-32"></div> {/* Spacer balance */}
      </div>

      {/* Subject Selection */}
      <div className="w-full space-y-3 relative">
        <label className="text-xl font-semibold text-gray-600">Pilih Mata Pelajaran:</label>
        
        {/* Dropdown Toggle */}
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className={`w-full p-5 rounded-2xl border-4 text-left flex justify-between items-center transition-all ${
            isDropdownOpen ? 'border-blue-500 bg-blue-50' : 'border-gray-100 bg-white hover:border-blue-200'
          }`}
        >
          <span className="text-xl font-bold text-gray-700">
            {isCustomMode 
              ? (customSubject || 'Tulis Sendiri...') 
              : (selectedSubject || '--- Pilih Mata Pelajaran ---')}
          </span>
          {isDropdownOpen ? <ChevronUp size={28} className="text-blue-500" /> : <ChevronDown size={28} className="text-gray-400" />}
        </button>

        {/* Dropdown Menu */}
        <AnimatePresence>
          {isDropdownOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="absolute z-50 left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-2xl border-4 border-blue-100 overflow-hidden"
            >
              <div className="max-h-72 overflow-y-auto custom-scrollbar p-2 space-y-1">
                {subjects.map((sub) => (
                  <button
                    key={sub}
                    onClick={() => {
                      setSelectedSubject(sub);
                      setIsCustomMode(false);
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full p-4 rounded-xl text-lg font-bold transition-all flex items-center justify-between ${
                      !isCustomMode && selectedSubject === sub 
                        ? 'bg-blue-600 text-white shadow-md' 
                        : 'text-gray-700 hover:bg-blue-50'
                    }`}
                  >
                    <span>{sub}</span>
                    {!isCustomMode && selectedSubject === sub && <CheckCircle2 size={24} />}
                  </button>
                ))}
                
                <div className="h-px bg-gray-100 my-1" />
                
                <button
                  onClick={() => {
                    setIsCustomMode(true);
                    setIsDropdownOpen(false);
                  }}
                  className={`w-full p-4 rounded-xl text-lg font-bold transition-all flex items-center justify-between ${
                    isCustomMode 
                      ? 'bg-blue-600 text-white shadow-md' 
                      : 'text-gray-700 hover:bg-blue-50'
                  }`}
                >
                  <span>Tulis Sendiri</span>
                  {isCustomMode && <CheckCircle2 size={24} />}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {isCustomMode && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-4"
          >
            <input 
              type="text"
              placeholder="Ketik mata pelajaran di sini..."
              value={customSubject}
              onChange={(e) => setCustomSubject(e.target.value)}
              autoFocus
              className="w-full p-5 text-xl border-4 border-blue-500 rounded-2xl bg-white shadow-inner outline-none focus:ring-4 focus:ring-blue-100 transition-all"
            />
          </motion.div>
        )}
      </div>

      {/* Level Selection */}
      <div className="w-full space-y-3">
        <label className="text-xl font-semibold text-gray-600">Pilih Jenjang Pendidikan:</label>
        <div className="grid grid-cols-3 gap-4 w-full">
          {levels.map((lvl) => (
            <button
              key={lvl}
              onClick={() => setSelectedLevel(lvl)}
              className={`p-4 rounded-xl text-xl font-bold transition-all border-4 ${
                selectedLevel === lvl 
                  ? 'bg-orange-500 text-white border-orange-700 scale-105 shadow-lg' 
                  : 'bg-white text-gray-700 border-gray-100 hover:border-orange-200 hover:bg-orange-50'
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>
      </div>

      {/* Objective Input */}
      <div className="w-full space-y-3">
        <label className="text-xl font-semibold text-gray-600">
          Tujuan Pembelajaran <span className="text-red-500">*Wajib</span>:
        </label>
        <textarea
          placeholder="Contoh: Siswa mampu memahami pemuaian benda karena kalor..."
          value={objective}
          onChange={(e) => setObjective(e.target.value)}
          className="w-full p-4 text-xl border-4 border-gray-100 rounded-2xl focus:border-blue-300 outline-none h-24 resize-none"
        />
        {objective.trim().length > 0 && objective.trim().length <= 5 && (
          <p className="text-red-500 text-sm">Tujuan pembelajaran terlalu pendek.</p>
        )}
      </div>

      <button
        disabled={!canContinue}
        onClick={() => canContinue && onSelect(finalSubject!, selectedLevel!, objective)}
        className={`w-full py-6 rounded-2xl text-3xl font-bold flex items-center justify-center gap-3 transition-all ${
          canContinue 
            ? 'bg-green-500 text-white hover:bg-green-600 cursor-pointer shadow-xl border-b-8 border-green-700 active:border-b-0 active:translate-y-2' 
            : 'bg-gray-200 text-gray-400 cursor-not-allowed border-gray-300'
        }`}
      >
        Lanjut ke Setup Pemain <ChevronRight size={32} />
      </button>
    </div>
  );
};

const SetupScreen = ({ onComplete, onBack }: { onComplete: (players: Player[]) => void, onBack: () => void }) => {
  const [p1Name, setP1Name] = useState('Tim Merah');
  const [p2Name, setP2Name] = useState('Tim Kuning');
  const [p1Avatar, setP1Avatar] = useState(AVATAR_OPTIONS[0]);
  const [p2Avatar, setP2Avatar] = useState(AVATAR_OPTIONS[1]);

  return (
    <div className="flex flex-col items-center justify-center min-h-full py-12 px-8 space-y-12 max-w-5xl mx-auto">
      <div className="w-full flex justify-between items-center">
        <button 
          onClick={onBack}
          className="bg-white text-gray-600 px-6 py-3 rounded-xl border-b-4 border-gray-200 hover:bg-gray-50 flex items-center gap-2 font-bold transition-all active:translate-y-1 active:border-b-0"
        >
          <ArrowLeft size={24} /> Kembali
        </button>
        <h2 className="text-4xl font-bold text-gray-800 flex items-center gap-3">
          <Users className="text-orange-500" /> Siapkan Pemain
        </h2>
        <div className="w-32"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 w-full">
        {/* Team 1 */}
        <div className="bg-red-50 p-8 rounded-3xl border-b-8 border-red-200 space-y-6">
          <input
            className="w-full text-2xl font-bold bg-transparent border-b-2 border-red-300 p-2 outline-none"
            value={p1Name}
            onChange={(e) => setP1Name(e.target.value)}
          />
          <div className="flex flex-wrap gap-4">
            {AVATAR_OPTIONS.map(ava => (
              <button
                key={ava.id}
                onClick={() => setP1Avatar(ava)}
                className={`text-4xl p-3 rounded-xl transition-all ${p1Avatar.id === ava.id ? 'bg-red-500 scale-125 shadow-lg' : 'bg-white opacity-50 grayscale hover:opacity-100 hover:grayscale-0'}`}
              >
                {ava.icon}
              </button>
            ))}
          </div>
        </div>

        {/* Team 2 */}
        <div className="bg-yellow-50 p-8 rounded-3xl border-b-8 border-yellow-200 space-y-6">
          <input
            className="w-full text-2xl font-bold bg-transparent border-b-2 border-yellow-300 p-2 outline-none"
            value={p2Name}
            onChange={(e) => setP2Name(e.target.value)}
          />
          <div className="flex flex-wrap gap-4">
            {AVATAR_OPTIONS.map(ava => (
              <button
                key={ava.id}
                onClick={() => setP2Avatar(ava)}
                className={`text-4xl p-3 rounded-xl transition-all ${p2Avatar.id === ava.id ? 'bg-yellow-500 scale-125 shadow-lg' : 'bg-white opacity-50 grayscale hover:opacity-100 hover:grayscale-0'}`}
              >
                {ava.icon}
              </button>
            ))}
          </div>
        </div>
      </div>

      <button
        onClick={() => onComplete([
          { id: 1, name: p1Name, avatar: p1Avatar.icon, position: 1, score: 0 },
          { id: 2, name: p2Name, avatar: p2Avatar.icon, position: 1, score: 0 }
        ])}
        className="w-full bg-green-500 hover:bg-green-600 text-white text-3xl font-bold py-6 rounded-2xl shadow-xl border-b-8 border-green-700 active:border-b-0 active:translate-y-2 cursor-pointer transition-all"
      >
        Mulai Game!
      </button>
    </div>
  );
};

const QuestionPreviewScreen = ({ questions, onStart, error }: { questions: Question[], onStart: () => void, error: string | null }) => (
  <div className="flex flex-col items-center justify-center min-h-full py-12 px-8 space-y-8 max-w-5xl mx-auto">
    <div className="text-center space-y-2">
      <h2 className="text-4xl font-bold text-gray-800 flex items-center justify-center gap-3">
        <CheckCircle2 className="text-green-500" /> Tinjau Soal Tantangan
      </h2>
      <p className="text-xl text-gray-500 italic">
        Berhasil menyiapkan <span className="text-blue-600 font-bold">{questions.length} soal</span> untuk petualangan papan!
      </p>
      
    {error && (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`px-6 py-3 rounded-2xl text-sm font-bold border-2 mt-4 flex items-center gap-3 shadow-sm ${
          error.includes('LOKAL') ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-orange-100 text-orange-700 border-orange-200'
        }`}
      >
        <AlertCircle size={20} />
        {error}
      </motion.div>
    )}
    </div>

    <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 overflow-y-auto max-h-[60vh] p-4 bg-white/50 rounded-3xl border-2 border-dashed border-gray-200">
      {questions.map((q, idx) => (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1 }}
          key={q.id} 
          className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex gap-4 items-start"
        >
          <div className="bg-blue-100 text-blue-600 w-8 h-8 rounded-full flex items-center justify-center font-bold shrink-0">
            {idx + 1}
          </div>
          <div className="space-y-2">
            <p className="font-bold text-gray-800 leading-tight">{q.text}</p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {q.options.map((opt, oIdx) => (
                <div key={oIdx} className={`px-2 py-1 rounded ${oIdx === q.correctAnswer ? 'bg-green-100 text-green-700 font-bold' : 'bg-gray-50 text-gray-400'}`}>
                   {String.fromCharCode(65 + oIdx)}. {opt}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      ))}
    </div>

    <button
      onClick={onStart}
      className="w-full bg-green-500 hover:bg-green-600 text-white text-3xl font-bold py-8 rounded-3xl shadow-xl border-b-8 border-green-700 active:border-b-0 active:translate-y-2 cursor-pointer transition-all flex items-center justify-center gap-4"
    >
      <Play size={40} /> Mulai Petualangan Papan
    </button>
  </div>
);

export default function App() {
  const [screen, setScreen] = useState<GameScreen>('Home');
  const [subject, setSubject] = useState<Subject | null>(null);
  const [level, setLevel] = useState<EducationLevel | null>(null);
  const [objective, setObjective] = useState('');
  const [players, setPlayers] = useState<Player[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [usedQuestionIds, setUsedQuestionIds] = useState<Set<string>>(new Set());
  const [pendingMove, setPendingMove] = useState<{ steps: number } | null>(null);
  const [moveDelayTimer, setMoveDelayTimer] = useState<number | null>(null);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(false);
  const [questionError, setQuestionError] = useState<string | null>(null);
  const [currentPlayerIdx, setCurrentPlayerIdx] = useState(0);
  const [isRolling, setIsRolling] = useState(false);
  const [diceValue, setDiceValue] = useState(1);
  const [showQuestion, setShowQuestion] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [timer, setTimer] = useState(20);
  const [isAnswering, setIsAnswering] = useState(false);
  const [winner, setWinner] = useState<Player | null>(null);
  const [showInstructions, setShowInstructions] = useState(false);
  const [answerFeedback, setAnswerFeedback] = useState<{ message: string, type: 'correct' | 'wrong' | null }>({ message: '', type: null });
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [bgmVolume, setBgmVolume] = useState(0.6);
  const bgmRef = useRef<HTMLAudioElement | null>(null);

  // Initialize Audio
  useEffect(() => {
    bgmRef.current = new Audio(AUDIO_URLS.BGM);
    bgmRef.current.loop = true;
    bgmRef.current.volume = bgmVolume;

    return () => {
      if (bgmRef.current) {
        bgmRef.current.pause();
        bgmRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (bgmRef.current) {
      bgmRef.current.volume = isAudioMuted ? 0 : bgmVolume;
    }
  }, [bgmVolume, isAudioMuted]);

  useEffect(() => {
    if (bgmRef.current) {
      if (!isAudioMuted) {
        const playPromise = bgmRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {
            // Handle browsers that block autoplay
            console.log('Autoplay blocked. Waiting for user interaction.');
          });
        }
      } else {
        bgmRef.current.pause();
      }
    }
  }, [isAudioMuted, screen]);

  const playSfx = (url: string) => {
    if (!isAudioMuted) {
      const audio = new Audio(url);
      audio.volume = 0.5;
      audio.play().catch(() => {});
    }
  };

  const handleInteraction = () => {
    if (bgmRef.current && bgmRef.current.paused && !isAudioMuted) {
      bgmRef.current.play().catch(() => {});
    }
    playSfx(AUDIO_URLS.CLICK);
  };

  // Setup grid data
  const gridSquares = Array.from({ length: TOTAL_SQUARES }, (_, i) => i + 1).reverse();

  // Handle Game Reset
  const resetGame = () => {
    setScreen('Home');
    setSubject(null);
    setPlayers([]);
    setQuestions([]);
    setUsedQuestionIds(new Set());
    setCurrentPlayerIdx(0);
    setWinner(null);
    setDiceValue(1);
  };

  // Turn management
  const nextTurn = () => {
    setCurrentPlayerIdx((prev) => (prev + 1) % players.length);
    setIsRolling(false);
    setShowQuestion(false);
    setIsAnswering(false);
    setTimer(20);
  };

  // Move player
  const movePlayer = (playerId: number, newPos: number) => {
    setPlayers(prev => prev.map(p => p.id === playerId ? { ...p, position: Math.min(newPos, TOTAL_SQUARES) } : p));
    playSfx(AUDIO_URLS.CLICK);
  };

  // Roll Dice
  const rollDice = () => {
    if (isRolling || showQuestion || isAnswering || pendingMove || moveDelayTimer) return;
    setIsRolling(true);
    playSfx(AUDIO_URLS.DICE);

    let rolls = 0;
    const interval = setInterval(() => {
      setDiceValue(Math.floor(Math.random() * 6) + 1);
      rolls++;
      if (rolls > 10) {
        clearInterval(interval);
        const finalValue = Math.floor(Math.random() * 6) + 1;
        setDiceValue(finalValue);
        setIsRolling(false);
        
        setTimeout(() => {
          if (level === 'SD') {
            handleMove(finalValue);
          } else {
            setPendingMove({ steps: finalValue });
          }
        }, 1200); // 1.2s pause for player to see the final dice value
      }
    }, 100);
  };

  // Execute actual movement (Step-by-step for consistency)
  const executeMove = (steps: number) => {
    setPendingMove(null);
    let stepLeft = steps;

    const moveOneStep = () => {
      if (stepLeft > 0) {
        setPlayers(prev => {
          const currentPlayer = prev[currentPlayerIdx];
          if (currentPlayer.position >= TOTAL_SQUARES) {
            stepLeft = 0; // Stop if already at finish
            return prev;
          }
          
          return prev.map((p, idx) => {
            if (idx === currentPlayerIdx) {
              return { ...p, position: Math.min(p.position + 1, TOTAL_SQUARES) };
            }
            return p;
          });
        });
        
        playSfx(AUDIO_URLS.CLICK);
        stepLeft--;
        
        if (stepLeft > 0) {
          setTimeout(moveOneStep, 400);
        } else {
          // Movement finished, check for snakes/ladders
          setTimeout(() => {
            setPlayers(currentPlayers => {
              const posAfterNormalMove = currentPlayers[currentPlayerIdx].position;
              finalizeMoveAfterStepByStep(posAfterNormalMove);
              return currentPlayers;
            });
          }, 400);
        }
      }
    };

    moveOneStep();
  };

  const finalizeMoveAfterStepByStep = (position: number) => {
    const player = players[currentPlayerIdx];
    
    // Check for Snakes or Ladders
    const snakeDest = SNAKES[position];
    const ladderDest = LADDERS[position];

    if (snakeDest) {
      setTimeout(() => {
        playSfx(AUDIO_URLS.FAIL);
        movePlayer(player.id, snakeDest);
        // Turn ends after snake drop
        setTimeout(nextTurn, 1500);
      }, 300);
      return;
    }

    if (ladderDest) {
      setTimeout(() => {
        playSfx(AUDIO_URLS.SUCCESS);
        movePlayer(player.id, ladderDest);
        setTimeout(afterMovementCleanup, 1000);
      }, 300);
      return;
    }

    afterMovementCleanup();
  };

  const afterMovementCleanup = () => {
    if (level === 'SD') {
      setTimeout(() => triggerQuestion(), 500);
    } else {
      setMoveDelayTimer(3);
    }
  };

  // Move delay effect for SMP/SMA
  useEffect(() => {
    if (moveDelayTimer !== null && moveDelayTimer > 0) {
      const t = setTimeout(() => setMoveDelayTimer(moveDelayTimer - 1), 1000);
      return () => clearTimeout(t);
    } else if (moveDelayTimer === 0) {
      setMoveDelayTimer(null);
      triggerQuestion();
    }
  }, [moveDelayTimer]);

  const triggerQuestion = () => {
    // Find a question that hasn't been used yet
    const availableQuestions = questions.filter(q => !usedQuestionIds.has(q.id));
    
    if (availableQuestions.length === 0) {
      setUsedQuestionIds(new Set());
      const fallbackQ = questions[0];
      if (fallbackQ) {
        setCurrentQuestion(fallbackQ);
        setShowQuestion(true);
        setIsAnswering(true);
        setTimer(20);
        setUsedQuestionIds(new Set([fallbackQ.id]));
      } else {
        answerQuestion(0);
      }
      return;
    }

    const nextQ = availableQuestions[0];
    setUsedQuestionIds(prev => new Set([...Array.from(prev), nextQ.id]));
    setCurrentQuestion(nextQ);
    setShowQuestion(true);
    setIsAnswering(true);
    setTimer(20);
  };

  // Handle Move (Fallback for SD)
  const handleMove = (steps: number) => {
    executeMove(steps);
  };

  // Handle Question Answer
  const answerQuestion = (answerIdx: number) => {
    if (!currentQuestion) return;
    setIsAnswering(false);
    
    const isCorrect = answerIdx === currentQuestion.correctAnswer;
    const player = players[currentPlayerIdx];

    if (isCorrect) {
      playSfx(AUDIO_URLS.SUCCESS);
      setAnswerFeedback({ message: 'jawaban benar, silahkan melempar dadu', type: 'correct' });
      // Update score
      setPlayers(prev => prev.map(p => p.id === player.id ? { ...p, score: p.score + 10 } : p));
      
      // Check for Ladder
      if (LADDERS[player.position]) {
        setTimeout(() => {
          movePlayer(player.id, LADDERS[player.position]);
        }, 1000);
      }
    } else {
      playSfx(AUDIO_URLS.FAIL);
      setAnswerFeedback({ message: 'jawaban salah, silahkan dadu dilempar oleh pemain lawan', type: 'wrong' });
      // Penalty: Move back 1 step OR drop if at snake
      const penaltyPos = Math.max(1, player.position - 1);
      movePlayer(player.id, penaltyPos);
      
      // If landing on snake head after move? Or just snake check
      if (SNAKES[player.position]) {
        setTimeout(() => {
          movePlayer(player.id, SNAKES[player.position]);
        }, 1000);
      }
    }

    // Win check
    const updatedPlayer = players[currentPlayerIdx];
    if (updatedPlayer.position >= TOTAL_SQUARES || (isCorrect && LADDERS[player.position] === TOTAL_SQUARES)) {
       setTimeout(() => {
         setWinner(players[currentPlayerIdx]);
         setScreen('Win');
         setAnswerFeedback({ message: '', type: null });
       }, 2000);
    } else {
       // If correct, keep same turn, otherwise nextTurn
       if (isCorrect) {
         setTimeout(() => {
           setShowQuestion(false);
           setIsRolling(false);
           setIsAnswering(false);
           setTimer(20);
           setAnswerFeedback({ message: '', type: null });
         }, 3000); // Give bit more time for feedback
       } else {
         setTimeout(() => {
           nextTurn();
           setAnswerFeedback({ message: '', type: null });
         }, 3000);
       }
    }
  };

  // Timer Effect
  useEffect(() => {
    if (isAnswering && timer > 0) {
      const t = setTimeout(() => setTimer(timer - 1), 1000);
      return () => clearTimeout(t);
    } else if (isAnswering && timer === 0) {
      answerQuestion(-1); // Automatically wrong
    }
  }, [isAnswering, timer]);

  return (
    <div className="min-h-screen w-screen bg-slate-50 overflow-auto font-sans select-none relative" onClick={handleInteraction}>
      <div className="fixed top-4 right-4 z-50 flex items-center gap-3">
        {/* Volume Slider */}
        <div className="bg-white/80 backdrop-blur-sm p-3 rounded-2xl border border-white shadow-lg flex items-center gap-3">
          <input 
            type="range" 
            min="0" 
            max="1" 
            step="0.05" 
            value={bgmVolume}
            onChange={(e) => {
              e.stopPropagation();
              setBgmVolume(parseFloat(e.target.value));
              if (isAudioMuted) setIsAudioMuted(false);
            }}
            className="w-24 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
          <button 
            onClick={(e) => { e.stopPropagation(); setIsAudioMuted(!isAudioMuted); }}
            className="hover:scale-110 transition-transform active:scale-95"
          >
            {isAudioMuted || bgmVolume === 0 ? <VolumeX size={24} className="text-red-500" /> : <Volume2 size={24} className="text-blue-500" />}
          </button>
        </div>

        <button 
          onClick={(e) => { 
            e.stopPropagation(); 
            const url = window.location.href;
            navigator.clipboard.writeText(url);
            alert('Link aplikasi disalin! Silakan bagikan ke teman-teman.');
          }}
          className="p-3 bg-white/80 backdrop-blur-sm rounded-full shadow-lg border border-white hover:scale-110 transition-transform active:scale-95 text-blue-500"
          title="Bagikan Game"
        >
          <Share2 size={24} />
        </button>
      </div>
      <AnimatePresence mode="wait">
        {screen === 'Home' && (
          <motion.div 
            key="home" 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="min-h-full"
          >
            <HomeScreen 
              onStart={() => setScreen('Subject')} 
              onInstructions={() => setShowInstructions(true)} 
            />
          </motion.div>
        )}

        {screen === 'Subject' && (
          <motion.div 
            key="sub" 
            initial={{ x: 300, opacity: 0 }} 
            animate={{ x: 0, opacity: 1 }} 
            exit={{ x: -300, opacity: 0 }}
            className="min-h-full"
          >
            <SubjectScreen 
              onBack={() => setScreen('Home')}
              onSelect={(s, l, o) => { 
                setSubject(s); 
                setLevel(l);
                setObjective(o); 
                setScreen('Setup'); 
              }} 
            />
          </motion.div>
        )}

        {screen === 'Setup' && (
          <motion.div 
            key="setup" 
            initial={{ x: 300, opacity: 0 }} 
            animate={{ x: 0, opacity: 1 }} 
            exit={{ x: -300, opacity: 0 }}
            className="min-h-full"
          >
            <SetupScreen 
              onBack={() => setScreen('Subject')}
              onComplete={async (p) => { 
                setPlayers(p); 
                setScreen('QuestionPreview');
                setIsLoadingQuestions(true);
                setQuestionError(null);
                try {
                  const generated = await generateQuestions(subject!, level!, objective);
                  
                  if (generated.length === 0) {
                    setQuestionError("AI sedang sibuk. Menggunakan mode simulasi.");
                    // If absolutely nothing came back, use a default set
                    const defaultQuestions: Question[] = Array(5).fill(null).map((_, i) => ({
                      id: `default_${i}`,
                      subject: subject!,
                      text: `[MODE SIMULASI] Pertanyaan contoh ${i+1}: Apa kunci utama dalam belajar ${subject}?`,
                      options: ["Rajin Belajar", "Banyak Tidur", "Main Game", "Lupa Makan"],
                      correctAnswer: 0
                    }));
                    setQuestions(defaultQuestions);
                  } else {
                    if (generated.some(q => q.text.includes('[MODE LOKAL]'))) {
                      setQuestionError("Kuota AI habis. Menggunakan bank soal lokal yang tersedia.");
                    } else if (generated.some(q => q.text.includes('[MODE SIMULASI]'))) {
                      setQuestionError("Kuota AI sedang terlampaui. Menjalankan mode simulasi edukasi umum.");
                    }
                    // Shuffle options for each question and update correctAnswer index
                    const processed = generated.map(q => {
                      const originalOptions = [...q.options];
                      const correctOptionText = originalOptions[q.correctAnswer];
                      
                      // Shuffle options
                      const shuffledOptions = [...originalOptions].sort(() => Math.random() - 0.5);
                      const newCorrectAnswerIndex = shuffledOptions.indexOf(correctOptionText);
                      
                      return {
                        ...q,
                        options: shuffledOptions,
                        correctAnswer: newCorrectAnswerIndex !== -1 ? newCorrectAnswerIndex : q.correctAnswer
                      };
                    });

                    // Shuffle the questions themselves
                    const shuffled = [...processed].sort(() => Math.random() - 0.5);
                    setQuestions(shuffled);
                  }
                } catch (err) {
                  console.error("Setup question generated error:", err);
                } finally {
                  setUsedQuestionIds(new Set());
                  setIsLoadingQuestions(false);
                }
              }} 
            />
          </motion.div>
        )}

        {screen === 'QuestionPreview' && (
          <motion.div 
            key="preview" 
            initial={{ opacity: 0, scale: 0.9 }} 
            animate={{ opacity: 1, scale: 1 }} 
            className="min-h-full"
          >
            {isLoadingQuestions ? (
              <div className="flex flex-col items-center justify-center h-full space-y-8 bg-blue-50">
                 <motion.div 
                   animate={{ rotate: 360 }}
                   transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                   className="relative"
                 >
                   <Dice1 size={120} className="text-blue-500" />
                   <motion.div
                     animate={{ opacity: [0, 1, 0] }}
                     transition={{ repeat: Infinity, duration: 1.5 }}
                     className="absolute inset-0 flex items-center justify-center"
                   >
                     <HelpCircle size={40} className="text-white" />
                   </motion.div>
                 </motion.div>
                 <div className="text-center space-y-2">
                    <h2 className="text-4xl font-black text-gray-800 animate-pulse">Meracik Tantangan AI...</h2>
                    <p className="text-xl text-gray-500 italic">Gemini sedang membuat soal khusus untukmu!</p>
                 </div>
              </div>
            ) : (
              <QuestionPreviewScreen 
                questions={questions} 
                onStart={() => setScreen('Game')} 
                error={questionError}
              />
            )}
          </motion.div>
        )}

        {screen === 'Game' && (
          <motion.div 
            key="game" 
            initial={{ opacity: 0, scale: 0.9 }} 
            animate={{ opacity: 1, scale: 1 }} 
            className="min-h-full flex "
          >
            {/* Sidebar Stats */}
            <div className="w-80 bg-white border-r border-gray-200 p-6 flex flex-col gap-6 shadow-2xl">
              <div className="p-4 bg-blue-50 rounded-2xl">
                <h3 className="text-xl font-bold text-blue-800 uppercase tracking-wider">{subject}</h3>
                <p className="text-xs text-blue-600 line-clamp-2">{objective}</p>
              </div>

              {players.map((p, idx) => (
                <div 
                  key={p.id}
                  className={`p-6 rounded-3xl transition-all relative ${idx === currentPlayerIdx ? 'ring-8 ring-blue-500 scale-105 bg-white z-10' : 'bg-gray-50 opacity-50'}`}
                >
                  <div className="text-5xl mb-2">{p.avatar}</div>
                  <div className="font-black text-xl truncate">{p.name}</div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-gray-500 font-bold">Posisi: {p.position}</span>
                    <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold">{p.score} pt</span>
                  </div>
                </div>
              ))}

              <div className="mt-auto space-y-4">
                <div className="flex flex-col items-center gap-4 bg-slate-100 p-6 rounded-3xl">
                   <motion.div 
                     animate={isRolling ? { rotate: 360 } : {}}
                     transition={isRolling ? { repeat: Infinity, duration: 0.2 } : {}}
                     className="text-8xl bg-white p-4 rounded-2xl shadow-inner border-b-4 border-slate-300"
                   >
                     {diceValue === 1 && <Dice1 className="text-slate-800" size={80} />}
                     {diceValue === 2 && <Dice2 className="text-slate-800" size={80} />}
                     {diceValue === 3 && <Dice3 className="text-slate-800" size={80} />}
                     {diceValue === 4 && <Dice4 className="text-slate-800" size={80} />}
                     {diceValue === 5 && <Dice5 className="text-slate-800" size={80} />}
                     {diceValue === 6 && <Dice6 className="text-slate-800" size={80} />}
                     {!diceValue && <Dice1 className="text-slate-200" size={80} />}
                   </motion.div>
                   <button
                     disabled={isRolling || isAnswering}
                     onClick={rollDice}
                     className={`w-full py-6 rounded-2xl text-2xl font-black shadow-lg transition-all border-b-8 ${isRolling || isAnswering ? 'bg-gray-200 cursor-not-allowed border-gray-400' : 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer active:border-b-0 active:translate-y-2 border-blue-800'}`}
                   >
                     LEMPAR DADU
                   </button>
                </div>
                <button onClick={resetGame} className="flex items-center gap-2 text-gray-400 hover:text-red-500 transition-colors py-2 px-4 rounded-xl hover:bg-red-50">
                   <RefreshCw size={18} /> Permainan Baru
                </button>
                <button onClick={() => setScreen('Home')} className="flex items-center gap-2 text-gray-400 hover:text-blue-500 transition-colors py-2 px-4 rounded-xl hover:bg-blue-50">
                   <ArrowLeft size={18} /> Menu Utama
                </button>
              </div>
            </div>

            {/* Board Area */}
            <div className="flex-1 p-4 md:p-8 bg-sky-400 relative overflow-auto flex flex-col items-center justify-center min-h-[500px]">
              {/* Sky Decorations */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                 <div className="absolute top-10 left-10 w-32 h-16 bg-white rounded-full opacity-60 blur-xl animate-pulse"></div>
                 <div className="absolute top-40 right-20 w-48 h-20 bg-white rounded-full opacity-40 blur-2xl"></div>
                 <div className="absolute bottom-20 left-1/4 w-40 h-16 bg-white rounded-full opacity-50 blur-xl"></div>
              </div>

              <div className="relative w-full max-w-[600px] aspect-square bg-blue-600 rounded-lg shadow-[0_0_50px_rgba(0,0,0,0.3)] p-4 grid grid-cols-7 grid-rows-7 border-4 md:border-8 border-blue-500 overflow-hidden">
                  {/* Visual Connections (Snakes & Ladders) */}
                  <svg 
                    viewBox="0 0 70 70" 
                    preserveAspectRatio="none"
                    className="absolute inset-0 z-20 pointer-events-none w-full h-full p-4 overflow-visible"
                  >
                    <defs>
                      <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
                        <feGaussianBlur in="SourceAlpha" stdDeviation="0.5" />
                        <feOffset dx="0.2" dy="0.2" result="offsetblur" />
                        <feComponentTransfer>
                          <feFuncA type="linear" slope="0.5" />
                        </feComponentTransfer>
                        <feMerge>
                          <feMergeNode />
                          <feMergeNode in="SourceGraphic" />
                        </feMerge>
                      </filter>
                    </defs>

                    {/* Ladders */}
                    {Object.entries(LADDERS).map(([start, end]) => {
                      const s = getGridCoords(Number(start));
                      const e = getGridCoords(Number(end));
                      const x1 = s.col * 10 + 5;
                      const y1 = (6 - s.row) * 10 + 5;
                      const x2 = e.col * 10 + 5;
                      const y2 = (6 - e.row) * 10 + 5;

                      const angle = Math.atan2(y2 - y1, x2 - x1);
                      const distance = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
                      const rungsCount = Math.floor(distance / 2.5);

                      return (
                        <g key={`ladder-${start}`} filter="url(#shadow)">
                          {/* Main Rails */}
                          <line x1={x1 - 1.5} y1={y1} x2={x2 - 1.5} y2={y2} stroke="#5D4037" strokeWidth="1.2" strokeLinecap="round" />
                          <line x1={x1 + 1.5} y1={y1} x2={x2 + 1.5} y2={y2} stroke="#5D4037" strokeWidth="1.2" strokeLinecap="round" />
                          
                          {/* Inner rails for depth */}
                          <line x1={x1 - 1} y1={y1} x2={x2 - 1} y2={y2} stroke="#8D6E63" strokeWidth="0.5" />
                          <line x1={x1 + 1} y1={y1} x2={x2 + 1} y2={y2} stroke="#8D6E63" strokeWidth="0.5" />
                          
                          {Array.from({ length: rungsCount }).map((_, i) => {
                            const ratio = (i + 1) / (rungsCount + 1);
                            const rx = x1 + (x2 - x1) * ratio;
                            const ry = y1 + (y2 - y1) * ratio;
                            const dx = Math.sin(angle) * 2;
                            const dy = -Math.cos(angle) * 2;
                            return (
                              <line 
                                key={i}
                                x1={rx - dx} y1={ry - dy} 
                                x2={rx + dx} y2={ry + dy} 
                                stroke="#795548" strokeWidth="0.8" 
                                strokeLinecap="round"
                              />
                            );
                          })}
                        </g>
                      );
                    })}

                    {/* Snakes */}
                    {Object.entries(SNAKES).map(([start, end]) => {
                      const s = getGridCoords(Number(start));
                      const e = getGridCoords(Number(end));
                      const x1 = s.col * 10 + 5;
                      const y1 = (6 - s.row) * 10 + 5;
                      const x2 = e.col * 10 + 5;
                      const y2 = (6 - e.row) * 10 + 5;

                      const numStart = Number(start);
                      
                      // Wavy Snake Path Calculation
                      const dx = x2 - x1;
                      const dy = y2 - y1;
                      const dist = Math.sqrt(dx * dx + dy * dy);
                      const unitDx = dx / dist;
                      const unitDy = dy / dist;
                      const perpDx = -unitDy;
                      const perpDy = unitDx;

                      const segments = 10;
                      let pathParts = [`M ${x1} ${y1}`];
                      for (let i = 1; i <= segments; i++) {
                        const t = i / segments;
                        const bx = x1 + dx * t;
                        const by = y1 + dy * t;
                        // Frequency and amplitude
                        const wave = Math.sin(t * Math.PI * 3) * (dist * 0.1);
                        // Taper amplitude at ends
                        const envelope = Math.sin(t * Math.PI); 
                        const finalWave = wave * envelope;
                        
                        pathParts.push(`L ${bx + perpDx * finalWave} ${by + perpDy * finalWave}`);
                      }
                      const wavyPath = pathParts.join(' ');
                      
                      const snakeThemes = [
                        { color: '#22c55e', accent: '#14532d' }, // Green
                        { color: '#eab308', accent: '#713f12' }, // Yellow
                        { color: '#ef4444', accent: '#450a0a' }, // Red
                        { color: '#a855f7', accent: '#3b0764' }, // Purple
                        { color: '#f97316', accent: '#7c2d12' }  // Orange
                      ];
                      const theme = snakeThemes[numStart % snakeThemes.length];

                      return (
                        <g key={`snake-${start}`} filter="url(#shadow)">
                           {/* Snake Body Shadow */}
                           <path 
                             d={wavyPath} 
                             fill="none" 
                             stroke="black" 
                             strokeWidth="1.5" 
                             strokeLinecap="round"
                             strokeLinejoin="round"
                             className="opacity-10"
                           />
                           
                           {/* Main Body */}
                           <path 
                             d={wavyPath} 
                             fill="none" 
                             stroke={theme.color} 
                             strokeWidth="1.4" 
                             strokeLinecap="round"
                             strokeLinejoin="round"
                           />
                           
                           {/* Skin Pattern */}
                           <path 
                             d={wavyPath} 
                             fill="none" 
                             stroke={theme.accent} 
                             strokeWidth="0.8" 
                             strokeLinecap="round"
                             strokeLinejoin="round"
                             strokeDasharray="2 4"
                             className="opacity-40"
                           />

                           {/* Snake Tail */}
                           <circle cx={x2} cy={y2} r="0.4" fill={theme.color} />

                           {/* Snake Head */}
                           <g transform={`translate(${x1},${y1})`}>
                              <circle cx="0" cy="0" r="1.6" fill={theme.color} />
                              <circle cx="-0.8" cy="-0.6" r="0.4" fill="white" />
                              <circle cx="0.8" cy="-0.6" r="0.4" fill="white" />
                              <circle cx="-0.8" cy="-0.6" r="0.2" fill="black" />
                              <circle cx="0.8" cy="-0.6" r="0.2" fill="black" />
                              
                              <path 
                                d="M 0 1.5 L 0 3.5 L -0.5 4.5 M 0 3.5 L 0.5 4.5" 
                                fill="none" 
                                stroke="#ef4444" 
                                strokeWidth="0.3"
                                className="animate-pulse"
                              />
                           </g>
                        </g>
                      );
                    })}
                  </svg>

                    {Array.from({ length: TOTAL_SQUARES }, (_, i) => TOTAL_SQUARES - i).map((num) => {
                      const { row, col } = getGridCoords(num);
                      const gridRow = 7 - row;
                      const gridCol = col + 1;

                      const isSnakeHead = SNAKES[num];
                      const isLadderStart = LADDERS[num];

                      // Diverse square colors
                      const colorIndex = (num - 1) % SQUARE_COLORS.length;
                      const bgColor = SQUARE_COLORS[colorIndex];
                      
                      // Decorative elements on some squares
                      const decoration = (num % 7 === 0) ? DECORATIONS[num % DECORATIONS.length] : null;

                      // Target square for manual move (SMP/SMA)
                      const currentPlayer = players[currentPlayerIdx];
                      const targetPosRaw = pendingMove ? currentPlayer?.position + pendingMove.steps : null;
                      const targetPos = targetPosRaw ? (targetPosRaw > TOTAL_SQUARES ? TOTAL_SQUARES : targetPosRaw) : null;
                      const isTarget = targetPos === num && level !== 'SD';

                      // Map subject to theme icon
                      const getThemeIcon = (sub: Subject | null) => {
                        switch (sub) {
                          case 'Matematika': return (num % 3 === 0) ? '📐' : (num % 2 === 0 ? '➕' : '🔢');
                          case 'IPA': return (num % 3 === 0) ? '🔬' : (num % 2 === 0 ? '🧬' : '🧪');
                          case 'IPS': return (num % 3 === 0) ? '🌍' : (num % 2 === 0 ? '🏛️' : '🗺️');
                          case 'Bahasa Indonesia': return (num % 3 === 0) ? '📚' : (num % 2 === 0 ? '🖋️' : '📝');
                          default: return null;
                        }
                      };

                      return (
                        <div 
                          key={num}
                          style={{ gridRow, gridCol }}
                          onClick={() => {
                            if (isTarget && pendingMove) {
                              playSfx(AUDIO_URLS.CLICK);
                              executeMove(pendingMove.steps);
                            }
                          }}
                          className={`flex flex-col items-center justify-center relative p-1 transition-all hover:brightness-105 border border-white/20 ${bgColor} ${isTarget ? 'cursor-pointer ring-4 ring-yellow-400 ring-inset z-20' : ''}`}
                        >
                          <span className="text-2xl font-black text-black/20 absolute inset-0 flex items-center justify-center pointer-events-none">
                            {getThemeIcon(subject)}
                          </span>
                          <span className="text-[10px] font-bold text-black/10 absolute top-0.5 left-1 pointer-events-none">
                            {num}
                          </span>

                          <div className="z-10 flex flex-col items-center justify-center">
                            {decoration && <span className="text-xl opacity-40 absolute bottom-1 right-1">{decoration}</span>}
                            {num === 49 && (
                              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <Trophy className="text-yellow-500 w-1/2 h-1/2 opacity-60 animate-bounce" />
                                <span className="text-[10px] font-black text-yellow-600/40 absolute bottom-1 uppercase tracking-widest">FINISH</span>
                              </div>
                            )}
                            {num === 1 && (
                              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                <Play className="text-green-500 opacity-20 mb-4" size={40} />
                                <span className="text-[10px] font-black text-green-600/40 uppercase tracking-widest mt-8">MULAI</span>
                              </div>
                            )}
                            
                            {isTarget && (
                              <motion.div 
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-white/90 text-blue-700 text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm border border-blue-200 mt-4"
                              >
                                PINDAH KE SINI 
                              </motion.div>
                            )}
                          </div>
                        </div>
                      );
                    })}

                    {/* Player Pawns */}
                    {players.map((p, idx) => {
                      const { row, col } = getGridCoords(p.position);
                      const isCurrentPlayer = idx === currentPlayerIdx;
                      const isManualMoveRequired = isCurrentPlayer && pendingMove !== null;
                      
                      // Calculate offset if players are on the same square
                      const otherPlayer = players.find(op => op.id !== p.id && op.position === p.position);
                      const offsetX = otherPlayer ? (idx === 0 ? '-15%' : '15%') : '0%';
                      const offsetY = otherPlayer ? (idx === 0 ? '-10%' : '10%') : '0%';

                      return (
                        <motion.div
                          key={p.id}
                          layoutId={`player-${p.id}`}
                          initial={false}
                          animate={{ 
                            bottom: `${(row / 7) * 100}%`, 
                            left: `${(col / 7) * 100}%`,
                            x: offsetX,
                            y: offsetY,
                            scale: isCurrentPlayer ? 1.3 : 0.9,
                            zIndex: 40 + idx
                          }}
                          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                          onClick={() => {
                            if (isManualMoveRequired) {
                              playSfx(AUDIO_URLS.CLICK);
                              executeMove(pendingMove.steps);
                            }
                          }}
                          className={`absolute w-[14.28%] h-[14.28%] flex items-center justify-center text-3xl md:text-4xl drop-shadow-2xl ${isManualMoveRequired ? 'cursor-pointer' : 'pointer-events-none'}`}
                        >
                          <div className={`p-1 rounded-full border-2 relative ${idx === 0 ? 'bg-white border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.3)]' : 'bg-white border-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.3)]'}`}>
                            {p.avatar}
                            {isManualMoveRequired && (
                              <motion.div 
                                animate={{ scale: [1, 1.1, 1] }}
                                transition={{ repeat: Infinity, duration: 1.5 }}
                                className="absolute -top-16 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none"
                              >
                                <div className="bg-blue-600 text-white text-xs font-black px-3 py-1.5 rounded-full shadow-xl whitespace-nowrap mb-1">
                                  Langkah: {pendingMove.steps}
                                </div>
                                <div className="bg-white text-blue-600 text-[10px] font-bold px-2 py-0.5 rounded-lg shadow-md border border-blue-200">
                                  Klik Target
                                </div>
                                <div className="w-2 h-2 bg-blue-600 rotate-45 -mt-1 shadow-sm"></div>
                              </motion.div>
                            )}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>

                  {/* Delay Countdown Overlay - Hidden as requested */}
                  <AnimatePresence>
                    {false && moveDelayTimer !== null && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 z-[60] flex items-center justify-center bg-black/30 backdrop-blur-[2px] rounded-lg"
                      >
                         <div className="bg-white p-8 rounded-full shadow-2xl flex flex-col items-center justify-center border-8 border-orange-500 animate-bounce">
                            <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">Pertanyaan dalam...</span>
                            <span className="text-8xl font-black text-orange-600 leading-none">{moveDelayTimer}</span>
                         </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Grass Footer Decoration */}
                  <div className="w-full h-24 bg-green-600 mt-8 rounded-t-[100px] flex items-center justify-center overflow-hidden relative border-t-8 border-green-500 shadow-inner">
                    <div className="absolute inset-0 opacity-20 flex justify-around items-end pb-4">
                      {[...Array(10)].map((_, i) => (
                        <div key={i} className="w-4 h-8 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.2}s` }}></div>
                      ))}
                    </div>
                    <p className="text-white/40 font-bold italic z-10 text-xl tracking-widest">EDU SNAKE LADDER GARDEN</p>
                  </div>
                </div>
            </motion.div>
          )}

        {screen === 'Win' && (
          <motion.div 
            key="win" 
            initial={{ opacity: 0, y: 100 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="h-full flex flex-col items-center justify-center space-y-12 bg-gradient-to-br from-yellow-100 to-orange-100"
          >
             <div className="relative">
                <Trophy size={200} className="text-yellow-500 drop-shadow-2xl" />
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-4 -right-4 text-7xl"
                >
                  🎉
                </motion.div>
             </div>

             <div className="text-center space-y-4">
                <h2 className="text-6xl font-black text-gray-800 uppercase tracking-tighter">
                  SELAMAT {winner?.name}!
                </h2>
                <p className="text-3xl text-gray-600 font-medium italic">Kamu Berhasil Mencapai Garis Finis!</p>
                <p className="text-sm text-gray-400 mt-4">Created by <span className="text-blue-500 font-bold">SUTEJA</span></p>
                <button 
                  onClick={() => {
                    const url = window.location.href;
                    navigator.clipboard.writeText(url);
                    alert('Link kemenangan disalin! Bagikan pencapaianmu.');
                  }}
                  className="mt-4 flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors font-bold shadow-lg"
                >
                  <Share2 size={20} /> Bagikan Kemenangan
                </button>
             </div>

             <div className="flex flex-col md:flex-row gap-6">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={resetGame}
                  className="bg-green-600 text-white text-2xl md:text-3xl font-bold py-6 px-12 rounded-3xl shadow-xl flex items-center justify-center gap-3 border-b-8 border-green-800"
                >
                   <RefreshCw size={32} /> Main Lagi
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={() => setScreen('Home')}
                  className="bg-blue-600 text-white text-2xl md:text-3xl font-bold py-6 px-12 rounded-3xl shadow-xl flex items-center justify-center gap-3 border-b-8 border-blue-800"
                >
                   <Home size={32} /> Halaman Utama
                </motion.button>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Popups & Modals */}
      
      {/* Question Modal */}
      <AnimatePresence>
        {showQuestion && currentQuestion && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          >
            <motion.div 
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-white w-full max-w-3xl rounded-[40px] shadow-2xl overflow-hidden flex flex-col"
            >
              <div className="bg-blue-600 p-8 text-white flex justify-between items-center">
                 <div>
                    <h3 className="text-2xl font-bold uppercase tracking-widest opacity-80">{subject}</h3>
                    <p className="text-4xl font-black">Pertanyaan!</p>
                 </div>
                 <div className={`w-24 h-24 rounded-full border-8 flex items-center justify-center text-4xl font-black ${timer <= 5 ? 'border-red-400 bg-red-500 animate-pulse' : 'border-blue-400 opacity-100'}`}>
                    {timer}
                 </div>
              </div>

              <div className="p-10 space-y-8 flex-1 overflow-y-auto">
                 <p className="text-3xl font-bold text-gray-800 leading-tight">
                    {currentQuestion.text}
                 </p>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {currentQuestion.options.map((opt, idx) => (
                      <button
                        key={idx}
                        disabled={!isAnswering}
                        onClick={() => answerQuestion(idx)}
                        className={`p-6 text-xl font-bold rounded-2xl flex items-center gap-4 transition-all border-4 text-left ${isAnswering ? 'hover:bg-blue-50 hover:border-blue-200 cursor-pointer border-gray-100' : (idx === currentQuestion.correctAnswer ? 'bg-green-100 border-green-500 text-green-700' : 'opacity-40 grayscale border-gray-100')}`}
                      >
                         <div className="bg-blue-100 text-blue-600 w-10 h-10 rounded-full flex items-center justify-center text-lg">{String.fromCharCode(65 + idx)}</div>
                         {opt}
                      </button>
                    ))}
                 </div>
              </div>

              {!isAnswering && (
                <div className={`p-8 flex justify-center text-center animate-bounce ${answerFeedback.type === 'correct' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                   <div className="flex flex-col items-center gap-2">
                      <div className="text-4xl">
                        {answerFeedback.type === 'correct' ? '🎉' : '❌'}
                      </div>
                      <div className="text-2xl font-black uppercase italic">
                         {answerFeedback.message}
                      </div>
                   </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Instructions Modal */}
      <AnimatePresence>
        {showInstructions && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-lg p-8"
            onClick={() => setShowInstructions(false)}
          >
             <motion.div 
               initial={{ y: 100 }}
               animate={{ y: 0 }}
               className="bg-white max-w-2xl rounded-[40px] p-12 space-y-8 shadow-2xl relative"
               onClick={e => e.stopPropagation()}
             >
                <button onClick={() => setShowInstructions(false)} className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100">
                   <XCircle size={32} className="text-gray-400" />
                </button>
                <h2 className="text-5xl font-black text-gray-800">Cara Bermain</h2>
                <div className="space-y-6 text-2xl text-gray-600 leading-relaxed">
                   <p className="flex gap-4">
                      <span className="font-black text-blue-500">1.</span> Pilih Mapel dan tentukan tim.
                   </p>
                   <p className="flex gap-4">
                      <span className="font-black text-blue-500">2.</span> Klik "Lempar Dadu" untuk berpindah di papan 1-49.
                   </p>
                   <p className="flex gap-4">
                      <span className="font-black text-blue-500">3.</span> Jawab pertanyaan dengan benar agar tetap di posisi dan <span className="text-blue-600 font-bold underline">boleh melempar dadu lagi</span>.
                   </p>
                   <p className="flex gap-4">
                      <span className="font-black text-blue-500">4.</span> Jika salah, kamu harus mundur 1 langkah dan <span className="text-red-500 font-bold underline">giliran berpindah ke lawan</span>.
                   </p>
                   <p className="flex gap-4">
                      <span className="font-black text-blue-500">5.</span> Tim pertama yang sampai di kotak 49 adalah pemenangnya!
                   </p>
                </div>
                <button
                  onClick={() => setShowInstructions(false)}
                  className="w-full bg-blue-600 text-white text-3xl font-bold py-6 rounded-3xl shadow-xl border-b-8 border-blue-800"
                >
                   SIAP MAIN!
                </button>
             </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
