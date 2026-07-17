/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        actor: '#0EA5E9',
        boundary: '#8B5CF6',
        entity: '#10B981',
        control: '#F59E0B',
        service: '#6366F1',
        error: '#EF4444',
        success: '#16A34A',
      },
      fontFamily: {
        display: ['"Be Vietnam Pro"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
