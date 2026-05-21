import type { Message } from '../lib/types';

interface Props {
  message: Message;
}

export default function ChatMessage({ message }: Props) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4 message-enter`}>
      <div className={`flex gap-3 max-w-[80%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        {/* avatar */}
        {isUser ? (
          <div className="w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center text-xs bg-user-bubble text-text-secondary border border-washi-dark">
            你
          </div>
        ) : (
          <img src="/avatar.svg" alt="withme" className="w-9 h-9 rounded-full flex-shrink-0 border border-washi-dark" />
        )}

        {/* bubble */}
        <div className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
          isUser
            ? 'bg-user-bubble text-text-primary rounded-tr-sm'
            : 'bg-ai-bubble text-text-primary rounded-tl-sm'
        }`}>
          {message.content}
        </div>
      </div>
    </div>
  );
}
