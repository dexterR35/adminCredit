/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    
      extend: {
        gridTemplateColumns: {
          'custom': 'minmax(100px, 220px) 3fr 1fr',
        }
      }
    
  },
  plugins: [],
};
