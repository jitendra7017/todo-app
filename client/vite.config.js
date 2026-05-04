import { defineConfig, loadEnv } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const rawPort = env.CLIENT_PORT
  const parsedPort = Number.parseInt(String(rawPort ?? ''), 10)
  const port = Number.isFinite(parsedPort) && parsedPort > 0 ? parsedPort : 5173

  const apiOrigin = (env.VITE_API_URL || '').replace(/\/$/, '') || 'http://localhost:3001'

  return {
    plugins: [react(), babel({ presets: [reactCompilerPreset()] })],
    server: {
      port,
      proxy: {
        '/api': {
          target: apiOrigin,
          changeOrigin: true,
        },
      },
    },
  }
})
