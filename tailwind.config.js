/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    
      extend: {
        gridTemplateColumns: {
          'custom-12':'180px repeat(10, minmax(50px, 1fr)) 180px',
          'custom-4':'repeat(4,200px)'
        },
        colors: {
          'primary':'#77AD78',
          'secondary':'#F96666',
          'low-color':'#D8E2DC',
          'medium-color':'#E3F4F4',
          'dark-color':"#F0544F",
          'error':'#E63946',
          'info':'#246EB9',
          'edit':'#F18F01',
          'success':'#256D1B',
          'green':{
            100: '#E1F0DA', 
            200: '#DEF5E5', 
            300: '#BFD8AF', 
            400: '#99BC85', 
            500: '#88AB8E'  
          },
          'gray':{
            50:'#E2DCDE',
            100:'#F6F5F2',
            200:'#EEEEEE',
            700:'#676361'
          }
        },
     
      }
    
  },
  plugins: [
    require('@tailwindcss/forms'), 
  ],
};
