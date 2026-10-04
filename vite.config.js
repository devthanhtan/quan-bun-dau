import { defineConfig } from 'vite';

export default defineConfig({
  base: './', // Đảm bảo đường dẫn asset tương đối, không bị lỗi 404 trên GitHub Pages
});
