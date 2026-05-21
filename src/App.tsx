import { useState, useEffect, useRef } from 'react';
import ChatMessage from './components/ChatMessage';
import ChatInput from './components/ChatInput';
import AffinityBar from './components/AffinityBar';
import { buildSystemPrompt } from './lib/personality';
import { sendMessage } from './lib/chat';
import { loadChatState, saveChatState, addMessage, updateAffinity, clearChatState } from './lib/storage';
import type { ChatState, Message } from './lib/types';

function genId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

export default function App() {
  const [state, setState] = useState<ChatState>(() => loadChatState());
  const [loading, setLoading] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [state.messages]);

  useEffect(() => {
    saveChatState(state);
  }, [state]);

  const handleSend = async (text: string) => {
    const userMsg: Message = { id: genId(), role: 'user', content: text, timestamp: Date.now() };

    let newState = addMessage(state, userMsg);
    newState = updateAffinity(newState, 1);
    setState(newState);
    setLoading(true);

    try {
      const systemPrompt = buildSystemPrompt(newState.affinity);
      const reply = await sendMessage(newState.messages, systemPrompt);
      const aiMsg: Message = { id: genId(), role: 'assistant', content: reply, timestamp: Date.now() };

      let finalState = addMessage(newState, aiMsg);
      finalState = updateAffinity(finalState, 2);
      setState(finalState);
    } catch {
      const errMsg: Message = {
        id: genId(),
        role: 'assistant',
        content: '……接続が不安定みたい。もう一度試してみて。',
        timestamp: Date.now(),
      };
      setState(addMessage(newState, errMsg));
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    if (window.confirm('会話履歴を削除しますか？この操作は取り消せません。')) {
      clearChatState();
      setState({ messages: [], affinity: 0, affinityLevel: 1 });
      setShowMenu(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-washi">
      {/* Header */}
      <header className="relative flex items-center justify-between px-4 py-3 border-b border-washi-dark bg-washi/80 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-accent/10 flex items-center justify-center">
            <span className="text-accent font-serif text-lg font-medium">w</span>
          </div>
          <div>
            <h1 className="text-sm font-medium text-text-primary tracking-wide">withme</h1>
            <p className="text-xs text-text-muted">関係性は、言葉の隙間に生まれる</p>
          </div>
        </div>
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-washi-dark transition-colors text-text-muted"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="1.5" />
            <circle cx="12" cy="5" r="1.5" />
            <circle cx="12" cy="19" r="1.5" />
          </svg>
        </button>

        {showMenu && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
            <div className="absolute right-4 top-14 bg-white rounded-xl shadow-lg border border-washi-dark py-2 z-50 min-w-[160px]">
              <button
                onClick={handleReset}
                className="w-full text-left px-4 py-2 text-sm text-accent hover:bg-washi-dark transition-colors"
              >
                会話をリセット
              </button>
            </div>
          </>
        )}
      </header>

      {/* Affinity */}
      <AffinityBar affinity={state.affinity} />

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-3xl mx-auto">
          {state.messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center py-20">
              <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mb-6">
                <span className="text-accent font-serif text-3xl font-medium">w</span>
              </div>
              <h2 className="text-lg font-medium text-text-primary mb-2">withme</h2>
              <p className="text-sm text-text-muted max-w-xs leading-relaxed">
                関係はゆっくり育てるもの。<br />
                今日はどんな話をしたい？
              </p>
            </div>
          )}

          {state.messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} />
          ))}

          {loading && (
            <div className="flex justify-start mb-4 message-enter">
              <div className="flex gap-3 max-w-[80%]">
                <div className="w-8 h-8 rounded-full bg-ai-bubble text-accent flex items-center justify-center text-xs flex-shrink-0">
                  w
                </div>
                <div className="rounded-2xl rounded-tl-sm px-4 py-3 bg-ai-bubble text-text-muted text-sm">
                  <span className="typing-cursor">●</span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <ChatInput onSend={handleSend} disabled={loading} />
    </div>
  );
}
