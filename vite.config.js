import { defineConfig } from "vite";
import path from 'path';
import uni from "@dcloudio/vite-plugin-uni";
import { UnifiedViteWeappTailwindcssPlugin as uvwt } from "weapp-tailwindcss/vite";
const { WeappTailwindcssDisabled } = require('./shared')
import { plugins as postcssPlugins } from './postcss.config.cjs'
// vite 插件配置
const vitePlugins = [uni(), uvwt({
  rem2rpx: true,
  disabled: WeappTailwindcssDisabled
})];
const UNI_PLATFORM = {
  "app": "uni",
  "web": "uni",
  "mp-weixin": "wx",
  "mp-baidu": "swan",
  "mp-alipay": "my",
  "mp-toutiao": "tt",
  "mp-lark": "tt",
  "mp-qq": "qq",
  "mp-kuaishou": "ks",
  "mp-jd": "jd",
  "mp-360": "qh",
  "quickapp-webview-union": "qa",
  "quickapp-webview-huawei": "qa",
  "quickapp-webview": "qa",
}
// https://vitejs.dev/config/
export default defineConfig({
  plugins: vitePlugins,
  optimizeDeps: {
    include: ['vue-hooks-plus']
  },
  // 假如 postcss.config.js 不起作用，请使用内联 postcss Latset
  css: {
    postcss: {
      plugins: postcssPlugins,
    },
  },
//   define: { 
//     global: UNI_PLATFORM[process.env.UNI_PLATFORM],
//     wx: UNI_PLATFORM[process.env.UNI_PLATFORM]
// },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
});



