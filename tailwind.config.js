import { createPreset } from "fumadocs-ui/tailwind-plugin"

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./content/**/*.{md,mdx}",
    "./mdx-components.{ts,tsx}",
    "./node_modules/fumadocs-ui/dist/**/*.js",
    "./node_modules/fumadocs-openapi/dist/**/*.js"
  ],
  theme: {
    extend: {
      fontFamily: {
        mono: [
          'JetBrainsMono Nerd Font',
          'JetBrains Mono',
          'SF Mono',
          'Monaco',
          'Inconsolata',
          'Fira Code',
          'Fira Mono',
          'Roboto Mono',
          'monospace'
        ]
      }
    }
  },
  presets: [createPreset()]
}
