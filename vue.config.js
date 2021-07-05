module.exports = {
  pluginOptions: {
    electronBuilder: {
      builderOptions: {
        win: {
          icon: 'public/win.ico',
        },
      },
      nodeIntegration: true,
    },
  },
  transpileDependencies: [
    'vuetify',
  ],
};
