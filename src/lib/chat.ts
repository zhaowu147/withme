import type { Message } from './types';

export async function sendMessage(
  messages: Message[],
  systemPrompt: string
): Promise<string> {
  // DeepSeek is text-only, so we convert image messages to text descriptions
  const apiMessages = messages.map((m) => {
    let content = m.content;
    if (m.image && m.role === 'user') {
      content = `[ユーザーが画像を添付して送信しました] ${content}`;
    }
    return { role: m.role, content };
  });

  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messages: [
        { role: 'system', content: systemPrompt },
        ...apiMessages,
      ],
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `API error: ${res.status}`);
  }

  const data = await res.json();
  return data.content;
}
