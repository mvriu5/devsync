import type { Config } from "tailwindcss";

import tailwindcss_animate from "tailwindcss-animate"

function withOpacity(variableName: string) {
    return `hsl(var(${variableName}) / <alpha-value>)`;
}

export default {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/stories/*.{js,ts,jsx,tsx,mdx}",
    ],
    darkMode: "class",
    theme: {
        variants: {
            fill: ['hover', 'focus'],
        },
        extend: {
            colors: {
                background: withOpacity('--bg-background'),
                primary: withOpacity('--bg-primary'),
                secondary: withOpacity('--bg-secondary'),
                brand: withOpacity('--brand'),
            },
            fill: {
                error: withOpacity('--error'),
                warning: withOpacity('--warning'),
                success: withOpacity('--success'),
                brand: withOpacity('--brand'),
            },
            backgroundColor: {
                background: withOpacity('--bg-background'),
                primary: withOpacity('--bg-primary'),
                secondary: withOpacity('--bg-secondary'),
                error: withOpacity('--error'),
                warning: withOpacity('--warning'),
                success: withOpacity('--success'),
                brand: withOpacity('--brand'),
            },
            textColor: {
                primary: withOpacity('--text-primary'),
                secondary: withOpacity('--text-secondary'),
                tertiary: withOpacity('--text-tertiary'),
                error: withOpacity('--error'),
                warning: withOpacity('--warning'),
                success: withOpacity('--success'),
                brand: withOpacity('--brand'),
            },
            borderColor: {
                main: withOpacity('--border'),
                success: withOpacity('--success'),
                warning: withOpacity('--warning'),
                error: withOpacity('--error'),
                brand: withOpacity('--brand'),
            },
            ringColor: {
                success: withOpacity('--success'),
                warning: withOpacity('--warning'),
                error: withOpacity('--error'),
                brand: withOpacity('--brand'),
            },
            outlineColor: {
                success: withOpacity('--success'),
                warning: withOpacity('--warning'),
                error: withOpacity('--error'),
                brand: withOpacity('--brand'),
            },
            placeholderColor: {
                main: withOpacity('--placeholder'),
            },
            keyframes: {
                "accordion-down": {
                    from: { height: "0" },
                    to: { height: "var(--radix-accordion-content-height)" },
                },
                "accordion-up": {
                    from: { height: "var(--radix-accordion-content-height)" },
                    to: { height: "0" },
                },
            },
            animation: {
                "accordion-down": "accordion-down 0.2s ease-out",
                "accordion-up": "accordion-up 0.2s ease-out",
            }
        },
    },
    plugins: [
        tailwindcss_animate
    ],
} satisfies Config;