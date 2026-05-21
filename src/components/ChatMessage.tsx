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
        <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs ${
          isUser
            ? 'bg-user-bubble text-text-secondary'
            : 'bg-ai-bubble text-accent'
        }`}>
          {isUser ? '你' : 'w'}
        </div>

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
