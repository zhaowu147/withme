import { useState, useRef, useEffect } from 'react';

interface Props {
  onSend: (text: string, image?: string) => void;
  disabled: boolean;
}

export default function ChatInput({ onSend, disabled }: Props) {
  const [text, setText] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px';
    }
  }, [text]);

  const handleSend = () => {
    const trimmed = text.trim();
    if ((!trimmed && !image) || disabled) return;
    onSend(trimmed || '（画像を共有）', image || undefined);
    setText('');
    setImage(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert('画像は5MB以下にしてください。');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setImage(reader.result as string);
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;
    for (const item of items) {
      if (item.type.startsWith('image/')) {
        e.preventDefault();
        const file = item.getAsFile();
        if (file && file.size <= 5 * 1024 * 1024) {
          const reader = new FileReader();
          reader.onload = () => setImage(reader.result as string);
          reader.readAsDataURL(file);
        }
        break;
      }
    }
  };

  return (
    <div className="border-t border-sakura/10 bg-white/80 backdrop-blur-sm p-4">
      <div className="max-w-3xl mx-auto">
        {/* image preview */}
        {image && (
          <div className="img-preview">
            <img src={image} alt="添付画像" />
            <button onClick={() => setImage(null)}>✕</button>
          </div>
        )}

        <div className="flex items-end gap-2">
          {/* image upload button */}
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled}
            className="w-10 h-10 rounded-xl border border-washi-dark bg-white flex items-center justify-center text-text-muted hover:text-accent hover:border-sakura transition-colors flex-shrink-0 disabled:opacity-40"
            title="画像を添付"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="3" y="3" width="18" height="18" rx="3" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <path d="M21 15l-5-5L5 21" />
            </svg>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />

          {/* text input */}
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
            placeholder="メッセージを入力..."
            disabled={disabled}
            rows={1}
            className="flex-1 resize-none rounded-xl border border-washi-dark bg-washi/50 px-4 py-3 text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-sakura transition-colors"
          />

          {/* send button */}
          <button
            onClick={handleSend}
            disabled={disabled || (!text.trim() && !image)}
            className="w-10 h-10 rounded-xl bg-accent text-white flex items-center justify-center hover:bg-accent/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex-shrink-0"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
