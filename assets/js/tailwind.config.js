/* Tailwind Play CDN config — must load BEFORE the Play CDN <script>. */
window.tailwind = window.tailwind || {};
window.tailwind.config = {
  theme: {
    extend: {
      colors: {
        bg:      '#f7f3ec',
        surface: '#fdfaf4',
        card:    '#ffffff',
        ink:     '#2b2a27',
        muted:   '#6e665a',
        caramel: '#b8865b',
        sage:    '#7c8c6c',
        blush:   '#e8cfbf',
        rule:    '#ece4d3',
      },
      fontFamily: {
        display: ['Fraunces', 'serif'],
        body:    ['Inter', 'system-ui', 'sans-serif'],
        mono:    ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        soft: '0 1px 2px rgba(43,42,39,.04), 0 8px 24px -12px rgba(43,42,39,.08)',
        lift: '0 2px 4px rgba(43,42,39,.05), 0 18px 40px -18px rgba(43,42,39,.18)',
      },
      borderRadius: {
        '2xl': '18px',
        '3xl': '28px',
      },
    },
  },
};
