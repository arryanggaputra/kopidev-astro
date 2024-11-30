const colors = require("tailwindcss/colors");

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      colors: {
        primary: `var(--frist-main-color)`,
        primaryTwo: `var(--second-main-color)`,
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: null,
            // color: 'var(--text-color)',
            // blockquote: {
            //   color: 'var(--text-color)',
            // },
            // h1: {
            //   color: 'var(--text-color)',
            // },
            // h2: {
            //   color: 'var(--text-color)',
            // },
            // h3: {
            //   color: 'var(--text-color)',
            // },
            // h4: {
            //   color: 'var(--text-color)',
            // },
            // h5: {
            //   color: 'var(--text-color)',
            // },
            a: {
              color: colors.yellow[400],
            },
            // code: {
            //   color: colors.black,
            //   background: theme.colors.yellow[400],
            //   borderRadius: theme.borderRadius.sm,
            // },
            // strong: {
            //   color: 'var(--text-color)',
            //   opacity: theme.opacity[70],
            // },

            color: colors.gray[300],
            '[class~="lead"]': {
              color: colors.gray[300],
            },
            // a: {
            //   color: 'var(--text-color)',
            // },
            strong: {
              color: "var(--text-color)",
            },
            "ol > li::before": {
              color: colors.gray[400],
            },
            "ul > li::before": {
              backgroundColor: colors.gray[600],
            },
            hr: {
              borderColor: colors.gray[200],
            },
            blockquote: {
              color: colors.gray[200],
              borderLeftColor: colors.gray[600],
            },
            h1: {
              color: "var(--text-color)",
            },
            h2: {
              color: "var(--text-color)",
            },
            h3: {
              color: "var(--text-color)",
            },
            h4: {
              color: "var(--text-color)",
            },
            "figure figcaption": {
              color: colors.gray[400],
            },
            code: {
              color: "var(--text-color)",
            },
            "a code": {
              color: "var(--text-color)",
            },
            pre: {
              color: colors.gray[200],
              backgroundColor: colors.gray[800],
            },
            thead: {
              color: "var(--text-color)",
              borderBottomColor: colors.gray[400],
            },
            "tbody tr": {
              borderBottomColor: colors.gray[600],
            },
          },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
