// file:    vite.config.ts


import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default ({ mode }: { mode: string }) => {

  const env = loadEnv(mode, process.cwd(), '')

  return defineConfig({
    plugins: [
      react({
        babel: {
          plugins: [['babel-plugin-react-compiler']],
        },
      }),
    ],
    // base: env.VITE_BASE || "/portfolioreact/",   // ProdGithub  
    base: env.VITE_BASE || "/portfolioreactstaging/",   // StagingGithub, Devt, IIS Dist, IIS Prod 
  })
}


