import type { Config } from 'tailwindcss'

export const tailwindTheme = {
  colors: {
    main: '#212121',
    secondary: '#8B6CEF',
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
