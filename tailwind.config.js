/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: {
            color: '#333',
            a: {
              color: '#3182ce',
              '&:hover': {
                color: '#2c5282',
              },
            },
            blockquote: {
              color: '#fff',
              borderLeftWidth: '10px',
              borderLeftColor: '#CC8899',
              backgroundColor: '#4B0082',
            },
            pre: {
              backgroundColor: '#282C34',
              padding: '6px 1px 6px 12px', //top, right, bottom, left
              borderRadius: '10px',
            },
            code: {
              color: '#EB5757',
              backgroundColor: '#e0e0e0',
              padding: '2px 4px',
              borderRadius: '3px',
            },
          },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
