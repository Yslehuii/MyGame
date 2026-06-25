export default defineAppConfig({
  pages: [
    'pages/index/index',
    'pages/create/index',
    'pages/notification/index',
    'pages/mine/index',
    'pages/detail/index',
    'pages/result/index',
    'pages/profile/index',
    'pages/login/index',
    'pages/user/index',
    'pages/admin/index',
    'pages/agreement/index',
    'pages/privacy/index'
  ],
  tabBar: {
    color: '#9CA3AF',
    selectedColor: '#7C5CFC',
    backgroundColor: '#ffffff',
    borderStyle: 'white',
    list: [
      {
        pagePath: 'pages/index/index',
        text: '社区'
      },
      {
        pagePath: 'pages/create/index',
        text: '记录'
      },
      {
        pagePath: 'pages/notification/index',
        text: '消息'
      },
      {
        pagePath: 'pages/mine/index',
        text: '我的'
      }
    ]
  },
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#F0ECF9',
    navigationBarTitleText: 'AI梦境社区',
    navigationBarTextStyle: 'black'
  },
})
