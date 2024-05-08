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
          'primary':'#03C988',
          'secondary':'#F96666',
          'low-color':'#E3F4F4',
          'medium-color':'#E3F4F4',
          'dark-color':"#F0544F",
          'error-color':'#DB162F',
          'info-color':'#246EB9',
          'succes-color':'#52AA5E',

          'green':{
            100: '#E1F0DA', 
            200: '#DEF5E5', 
            300: '#BFD8AF', 
            400: '#99BC85', 
            500: '#88AB8E'  
          },
          'gray':{
            50:'#F9F5EB',
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
