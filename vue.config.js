module.exports = {
  chainWebpack: (config) => {
    config.module
      .rule('raw')
      .test(/\.(md|txt)$/i)
      .use('raw-loader')
      .loader('raw-loader')
      .end();
  },
  pluginOptions: {
    electronBuilder: {
      builderOptions: {
        appId: 'com.sedlatschek.werkbank',
        productName: 'Werkbank',
        win: {
          icon: 'public/win.ico',
        },
        mac: {
          icon: 'public/icon-1536x1536.png',
        },
        linux: {
          icon: 'src/assets/icon',
        },
      },
      nodeIntegration: true,
      publish: ['github'],
    },
  },
  transpileDependencies: [
    'vuetify',
  ],
};
