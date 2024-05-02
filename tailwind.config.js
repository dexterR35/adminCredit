/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    
      extend: {
        gridTemplateColumns: {
          'custom-10': '200px repeat(10, minmax(50px, 1fr)) 200px',
          'custom-4':'repeat(4,200px)'
        },
        colors: {
          'primary':'#A1C398',
          'secondary':'#F96666',
          'low-color':'#E3F4F4',
          'medium-color':'#E3F4F4',
          'error-color':'#FA7070',
          'info-color':'#5BBCFF',
          'succes-color':'#8DECB4',

          'green':{
            100: '#E1F0DA', // Light soft green
            200: '#DEF5E5', // Soft green
            300: '#BFD8AF', // Medium green
            400: '#99BC85', // Vibrant green
            500: '#88AB8E'  // Strong green
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
    require('@tailwindcss/forms'), // This plugin provides a better base styling for form inputs
  ],
};
