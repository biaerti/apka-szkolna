import { defineConfig, loadEnv, Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { askPodstawaChat, parseChatMessages } from './src/lib/podstawaChat';

// Dev-owy odpowiednik funkcji serverless api/podstawa-chat.ts - dzieki temu
// czat z podstawa programowa dziala tez na npm run dev. Klucz z .env.local
// (OPENROUTER_API_KEY, bez prefiksu VITE_ - nie trafia do bundla klienta).
function podstawaChatDevPlugin(apiKey: string | undefined): Plugin {
  return {
    name: 'podstawa-chat-dev',
    configureServer(server) {
      server.middlewares.use('/api/podstawa-chat', (req, res) => {
        void (async () => {
          res.setHeader('Content-Type', 'application/json');
          if (req.method !== 'POST') {
            res.statusCode = 405;
            res.end(JSON.stringify({ error: 'Tylko POST' }));
            return;
          }
          if (!apiKey) {
            res.statusCode = 500;
            res.end(JSON.stringify({ error: 'Brak OPENROUTER_API_KEY w .env.local' }));
            return;
          }
          const chunks: Buffer[] = [];
          for await (const chunk of req) chunks.push(chunk as Buffer);
          let body: unknown;
          try {
            body = JSON.parse(Buffer.concat(chunks).toString('utf-8'));
          } catch {
            body = null;
          }
          const messages = parseChatMessages(body);
          if (!messages) {
            res.statusCode = 400;
            res.end(JSON.stringify({ error: 'Nieprawidłowe wiadomości' }));
            return;
          }
          try {
            const reply = await askPodstawaChat(apiKey, messages);
            res.statusCode = 200;
            res.end(JSON.stringify({ reply }));
          } catch (err) {
            res.statusCode = 502;
            res.end(JSON.stringify({ error: err instanceof Error ? err.message : 'Nieznany błąd' }));
          }
        })();
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react(), podstawaChatDevPlugin(env.OPENROUTER_API_KEY)],
    build: {
      target: 'es2020',
    },
  };
});
