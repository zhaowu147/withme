import { useRef } from 'react';
import type { UserSettings } from '../lib/types';
import { getAvatarUrl } from '../lib/storage';

interface Props {
  settings: UserSettings;
  onUpdate: (updates: Partial<UserSettings>) => void;
  onClose: () => void;
}

export default function Settings({ settings, onUpdate, onClose }: Props) {
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const bgInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || file.size > 2 * 1024 * 1024) {
      alert('画像は2MB以下にしてください。');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => onUpdate({ userAvatar: reader.result as string });
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleBgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || file.size > 5 * 1024 * 1024) {
      alert('画像は5MB以下にしてください。');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => onUpdate({ chatBackground: reader.result as string });
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 overflow-hidden" onClick={(e) => e.stopPropagation()}>
        {/* header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-washi-dark">
          <h2 className="text-sm font-medium text-text-primary">設定</h2>
          <button onClick={onClose} className="text-text-muted hover:text-text-primary transition-colors text-lg">✕</button>
        </div>

        <div className="px-5 py-4 space-y-6">
          {/* AI info */}
          <div className="flex items-center gap-4">
            <img src={getAvatarUrl(settings.aiGender)} alt={settings.aiName} className="w-14 h-14 rounded-full object-cover border border-sakura/30" />
            <div>
              <p className="text-sm font-medium text-text-primary">{settings.aiName}</p>
              <p className="text-xs text-text-muted">{settings.aiGender === 'female' ? '女性' : '男性'}コンパニオン</p>
            </div>
          </div>

          {/* user avatar */}
          <div>
            <p className="text-xs text-text-muted mb-2">あなたのアイコン</p>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full overflow-hidden border border-washi-dark bg-washi flex items-center justify-center">
                {settings.userAvatar ? (
                  <img src={settings.userAvatar} alt="あなた" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-text-muted text-xs">未設定</span>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => avatarInputRef.current?.click()}
                  className="px-3 py-1.5 text-xs text-accent border border-sakura/30 rounded-lg hover:bg-sakura/10 transition-colors"
                >
                  画像を選びます
                </button>
                {settings.userAvatar && (
                  <button
                    onClick={() => onUpdate({ userAvatar: undefined })}
                    className="px-3 py-1.5 text-xs text-text-muted border border-washi-dark rounded-lg hover:bg-washi transition-colors"
                  >
                    削除
                  </button>
                )}
              </div>
              <input ref={avatarInputRef} type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
            </div>
          </div>

          {/* chat background */}
          <div>
            <p className="text-xs text-text-muted mb-2">チャットの背景</p>
            <div className="flex items-center gap-3">
              <div className="w-20 h-12 rounded-lg overflow-hidden border border-washi-dark bg-washi flex items-center justify-center">
                {settings.chatBackground ? (
                  <img src={settings.chatBackground} alt="背景" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-text-muted text-[10px]">デフォルト</span>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => bgInputRef.current?.click()}
                  className="px-3 py-1.5 text-xs text-accent border border-sakura/30 rounded-lg hover:bg-sakura/10 transition-colors"
                >
                  画像を選びます
                </button>
                {settings.chatBackground && (
                  <button
                    onClick={() => onUpdate({ chatBackground: undefined })}
                    className="px-3 py-1.5 text-xs text-text-muted border border-washi-dark rounded-lg hover:bg-washi transition-colors"
                  >
                    リセット
                  </button>
                )}
              </div>
              <input ref={bgInputRef} type="file" accept="image/*" onChange={handleBgUpload} className="hidden" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
