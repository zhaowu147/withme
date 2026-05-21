import { useState } from 'react';
import type { Message } from '../lib/types';

interface Props {
  message: Message;
}

export default function ChatMessage({ message }: Props) {
  const isUser = message.role === 'user';
  const [lightbox, setLightbox] = useState(false);

  return (
    <>
      <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4 message-enter`}>
        <div className={`flex gap-3 max-w-[80%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
          {/* avatar */}
          {isUser ? (
            <div className="w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center text-xs bg-user-bubble text-text-secondary border border-washi-dark">
              你
            </div>
          ) : (
            <img src="/avatar.svg" alt="withme" className="w-9 h-9 rounded-full flex-shrink-0" />
          )}

          {/* bubble */}
          <div className={`rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
            isUser
              ? 'bg-user-bubble text-text-primary rounded-tr-sm'
              : 'bg-ai-bubble text-text-primary rounded-tl-sm'
          }`}>
            {/* image */}
            {message.image && (
              <img
                src={message.image}
                alt="添付画像"
                className="msg-image mb-2"
                onClick={() => setLightbox(true)}
              />
            )}
            {message.content && <p>{message.content}</p>}
          </div>
        </div>
      </div>

      {/* lightbox */}
      {lightbox && message.image && (
        <div className="lightbox" onClick={() => setLightbox(false)}>
          <img src={message.image} alt="添付画像" />
        </div>
      )}
    </>
  );
}
