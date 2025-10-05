// app/util/MangaList/imageOptimization.ts
export const getBlurDataURL = () => {
  return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAMCAYAAABfnvydAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAK0lEQVR4nGNgQAX/gdj/PwMDA8N/ZPhfIICBgYHhPzJ8gCwAVvAfXQEyDAB5PBQNqL7HWgAAAABJRU5ErkJggg==';
};

export const shimmer = (w, h) => `
<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#1a1a1a" offset="20%" />
      <stop stop-color="#2a2a2a" offset="50%" />
      <stop stop-color="#1a1a1a" offset="70%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#1a1a1a" />
  <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
  <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite" />
</svg>`;

export const toBase64 = (str)=>
  typeof window === 'undefined'
    ? Buffer.from(str).toString('base64')
    : window.btoa(str);