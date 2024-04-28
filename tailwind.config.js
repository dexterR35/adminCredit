/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    
      extend: {
        gridTemplateColumns: {
          'custom': '200px repeat(10, minmax(0, 1fr)) 300px',
        }
      }
    
  },
  plugins: [],
};
