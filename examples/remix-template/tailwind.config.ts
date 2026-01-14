import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      animation: {
        'gradient-x': 'gradient-x 15s ease infinite',
        'gradient-y': 'gradient-y 15s ease infinite',
        'gradient-xy': 'gradient-xy 15s ease infinite',
      },
      keyframes: {
        'gradient-y': {
          '0%, 50%, 100%': {
            'background-size': '400% 400%',
            'background-position': 'center top'
          },
          '25%': {
            'background-size': '200% 200%',
            'background-position': 'center center'
          },
          '75%': {
            'background-size': '300% 300%',
            'background-position': 'center bottom'
          }
        },
        'gradient-x': {
          '0%, 50%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center'
          },
          '25%': {
            'background-size': '300% 300%',
            'background-position': 'right center'
          },
          '75%': {
            'background-size': '250% 250%',
            'background-position': 'center center'
          }
        },
        'gradient-xy': {
          '0%, 50%, 100%': {
            'background-size': '400% 400%',
            'background-position': 'left center'
          },
          '25%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          },
          '75%': {
            'background-size': '300% 300%',
            'background-position': 'center top'
          }
        }
      }
    },
  },
  plugins: [],
} satisfies Config;
