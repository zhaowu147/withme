import { useState } from 'react';
import type { AIGender } from '../lib/types';

interface Props {
  onComplete: (gender: AIGender, name: string) => void;
}

export default function Onboarding({ onComplete }: Props) {
  const [gender, setGender] = useState<AIGender | null>(null);
  const [name, setName] = useState('');
  const [step, setStep] = useState<'gender' | 'name'>(gender ? 'name' : 'gender');

  const handleGenderSelect = (g: AIGender) => {
    setGender(g);
    setStep('name');
  };

  const handleComplete = () => {
    if (!gender) return;
    onComplete(gender, name.trim() || (gender === 'female' ? 'あかり' : '蓮'));
  };

  const defaultName = gender === 'female' ? 'あかり' : '蓮';

  return (
    <div className="h-full flex flex-col items-center justify-center bg-gradient-to-b from-white via-sakura/5 to-washi px-6">
      {step === 'gender' ? (
        <div className="text-center animate-[fadeSlideUp_0.5s_ease-out]">
          <div className="mb-8">
            <h1 className="text-2xl font-medium text-text-primary mb-2 tracking-wide">withme</h1>
            <p className="text-sm text-text-muted">はじめに、あなたのコンパニオンを選んでください</p>
          </div>

          <div className="flex gap-6 justify-center mb-8">
            <button
              onClick={() => handleGenderSelect('female')}
              className="group relative w-40 h-52 rounded-2xl overflow-hidden border-2 border-transparent hover:border-accent transition-all duration-300 shadow-md hover:shadow-xl"
            >
              <img src="/avatar-female.jpg" alt="女性" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="absolute bottom-3 left-0 right-0 text-center text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                女性
              </span>
            </button>

            <button
              onClick={() => handleGenderSelect('male')}
              className="group relative w-40 h-52 rounded-2xl overflow-hidden border-2 border-transparent hover:border-accent transition-all duration-300 shadow-md hover:shadow-xl"
            >
              <img src="/avatar-male.jpg" alt="男性" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="absolute bottom-3 left-0 right-0 text-center text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                男性
              </span>
            </button>
          </div>

          <p className="text-xs text-text-muted">クリックして選択</p>
        </div>
      ) : (
        <div className="text-center animate-[fadeSlideUp_0.5s_ease-out]">
          <div className="mb-6">
            <img
              src={gender === 'female' ? '/avatar-female.jpg' : '/avatar-male.jpg'}
              alt="selected"
              className="w-20 h-20 rounded-full mx-auto mb-4 border-2 border-sakura shadow-md object-cover"
            />
            <h2 className="text-lg font-medium text-text-primary mb-1">名前を教えてください</h2>
            <p className="text-sm text-text-muted">何と呼ばれたいですか？</p>
          </div>

          <div className="mb-6">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={defaultName}
              maxLength={20}
              className="w-64 text-center text-lg py-3 px-4 border-b-2 border-sakura/30 focus:border-accent bg-transparent outline-none text-text-primary placeholder-text-muted/50 transition-colors"
              onKeyDown={(e) => e.key === 'Enter' && handleComplete()}
              autoFocus
            />
            <p className="text-xs text-text-muted mt-2">
              空欄なら「<span className="text-accent">{defaultName}</span>」で始める
            </p>
          </div>

          <button
            onClick={handleComplete}
            className="px-8 py-3 bg-accent text-white rounded-full text-sm font-medium hover:bg-accent/90 transition-colors shadow-md hover:shadow-lg"
          >
            よろしく
          </button>
        </div>
      )}
    </div>
  );
}
