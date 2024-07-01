import type { Config } from 'tailwindcss'

export const tailwindTheme = {
  colors: {
    main: '#201D63',
    secondary: '#00A4C7',
    error: '#DC2626',
    disabledText: '#ADADAD',
  },
}

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: tailwindTheme,
  },
  plugins: [],
}

export default config
