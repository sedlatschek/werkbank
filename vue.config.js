module.exports = {
  pluginOptions: {
    electronBuilder: {
      builderOptions: {
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
