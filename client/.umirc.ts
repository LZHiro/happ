import { defineConfig } from 'umi';
import pxToVwPlugin from 'postcss-px-to-viewport';
import routes from './config/router.config';

export default defineConfig({
  history: {
    type: 'hash',
  },
  nodeModulesTransform: {
    type: 'none',
  },
  routes: routes,
  autoprefixer:{
    flexbox:'no-2009'
  },
  dynamicImport: {
    loading: '@/component/loading/index'
  },
  extraPostCSSPlugins: [
    pxToVwPlugin({
      viewportWidth: 375,
      viewportHeight: 667,
      unitPrecision: 5,
      viewportUnit: 'vw',
      selectorBlackList: [],
      minPixelValue: 1,
      mediaQuery: false,
    }),
  ],
  devServer: {
    https: {
      key:'/var/project/happ/server/cert/server.key',
      cert:'/var/project/happ/server/cert/server.crt',
    }
  },
});
