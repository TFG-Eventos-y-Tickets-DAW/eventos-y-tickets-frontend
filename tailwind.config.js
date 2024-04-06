/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            colors: {
                "primary-white": "#FFFFFF",
                "secondary-black-lighter": "#0A0A0A",
                "accent-blue": "#CAF0F8",
                "blue-links": "#228DA5",
                "red-links": "#950000",
                "success-green": "#36B37E",
                "failure-red": "#FF5630",
            },
            fontFamily: {
                karla: ["Karla", "sans-serif"],
                spectral: ["Spectral", "serif"],
            },
            backgroundImage: {
                "hero-image": "url('src/assets/Hero.jpg')",
            },
        },
    },
    plugins: [],
};
