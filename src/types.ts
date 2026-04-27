
export type Subject = string;
export type EducationLevel = 'SD' | 'SMP' | 'SMA/SMK';

export interface Question {
  id: string;
  subject: Subject;
  text: string;
  options: string[];
  correctAnswer: number; // index of options
}

export interface Player {
  id: number;
  name: string;
  avatar: string;
  position: number; // 1 to 100
  score: number;
}

export type GameScreen = 'Home' | 'Subject' | 'Setup' | 'QuestionPreview' | 'Game' | 'Win';

export interface AvatarOption {
  id: string;
  name: string;
  icon: string;
}
