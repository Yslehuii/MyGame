import type { UserConfigExport } from '@tarojs/cli';
export default {
  mini: {
    terser: {
      enable: true,
      config: {
        compress: true,
        output: {
          comments: false,
        },
      },
    },
  },
  h5: {},
} satisfies UserConfigExport<'webpack5'>;
