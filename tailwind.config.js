const { resolve } = require('./shared')
const cssMacro = require('weapp-tailwindcss/css-macro')
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./**/*.vue"].map(resolve),
  theme: {
    extend: {
      
    },
    colors: {
      text1:"var(--UI-BG-4)",
      text2:"#666666",
      text3:"#fa2c19",
      text4:"#fff",
      text5:"#20d400",
    },
    fontSize: {
      10: '10rpx',
      12: '24rpx',
      14: '28rpx',
      16: '32rpx',
      18: '36rpx',
      20: '40rpx',
    },
    backgroundColor: {
      bg1: 'var(--bg_1)',
      bg2: '#fa2c19',
      bg3: '#fff',
    }
  },
  plugins: [
    // https://weapp-tw.icebreaker.top/docs/quick-start/uni-app-css-macro
    cssMacro({
      variantsMap: {
        wx: 'MP-WEIXIN',
        '-wx': {
          value: 'MP-WEIXIN',
          negative: true
        }
      }
    })
  ],
  corePlugins: {
    preflight: false,
  },
};
