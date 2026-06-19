/**
 * Shared Tailwind (Play CDN) theme configuration.
 * Single source of truth for the brand color tokens used across every page.
 * Must be loaded AFTER the Tailwind CDN script and BEFORE the page renders.
 */
tailwind.config = {
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                "primary": "#ff6b6b",
                "accent": "#4ecdc4",
                "navy": "#2c3e50",
                "cream": "#fffaf0",
                "lavender": "#e0d7ff",
                "mint": "#d7fff1",
            },
        },
    },
};
