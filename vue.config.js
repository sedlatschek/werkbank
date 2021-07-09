module.exports = {
  chainWebpack: (config) => {
    config.module
      .rule('raw')
      .test(/\.txt$/i)
      .use('raw-loader')
      .loader('raw-loader')
      .end();
  },
  pluginOptions: {
    electronBuilder: {
      builderOptions: {
        appId: 'de.simonsedlatschek.werkbank',
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
    },
  },
  transpileDependencies: [
    'vuetify',
  ],
};
