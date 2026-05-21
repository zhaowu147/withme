import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { readFileSync } from 'fs'
import { resolve } from 'path'

function deepseekProxy() {
  return {
    name: 'deepseek-proxy',
    configureServer(server: any) {
      server.middlewares.use('/api/chat', async (req: any, res: any) => {
        if (req.method !== 'POST') {
          res.statusCode = 405
          res.end(JSON.stringify({ error: 'Method not allowed' }))
          return
        }

        // load env
        let apiKey = process.env.DEEPSEEK_API_KEY
        if (!apiKey) {
          try {
            const envPath = resolve(__dirname, '.env')
            const envContent = readFileSync(envPath, 'utf-8')
            const match = envContent.match(/DEEPSEEK_API_KEY=(.+)/)
            if (match) apiKey = match[1].trim()
          } catch {}
        }

        if (!apiKey) {
          res.statusCode = 500
          res.end(JSON.stringify({ error: 'DEEPSEEK_API_KEY not set' }))
          return
        }

        let body = ''
        for await (const chunk of req) body += chunk
        const { messages } = JSON.parse(body)

        if (!messages || !Array.isArray(messages)) {
          res.statusCode = 400
          res.end(JSON.stringify({ error: 'messages array required' }))
          return
        }

        try {
          const response = await fetch('https://api.deepseek.com/chat/completions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
              model: 'deepseek-chat',
              messages,
              max_tokens: 1024,
              temperature: 0.85,
              top_p: 0.9,
            }),
          })

          if (!response.ok) {
            const err = await response.text()
            console.error('DeepSeek error:', err)
            res.statusCode = 502
            res.end(JSON.stringify({ error: 'AI service unavailable' }))
            return
          }

          const data = await response.json() as any
          const content = data.choices?.[0]?.message?.content || '……'
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ content }))
        } catch (err) {
          console.error('Proxy error:', err)
          res.statusCode = 500
          res.end(JSON.stringify({ error: 'Internal error' }))
        }
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), deepseekProxy()],
})
