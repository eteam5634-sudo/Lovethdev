import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Support Vite and Next-style public env names for Supabase
  envPrefix: ['VITE_', 'NEXT_PUBLIC_'],
})
