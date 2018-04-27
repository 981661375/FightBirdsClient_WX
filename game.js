require('libs/weapp-adapter-min');
var Parser = require('libs/xmldom/dom-parser');
window.DOMParser = Parser.DOMParser;
require('libs/wx-downloader.js');
wxDownloader.REMOTE_SERVER_ROOT = "";
require('src/settings.8fb97');
var g = require('src/globalData.js');

var getuserinfomation = function () {
  wx.getUserInfo({
    success: function (res) {
      g.globalda.userinfo = res.userInfo;
      require('main.7f559');
      wx.showShareMenu({
        success: function (res) {
          wx.onShareAppMessage(function () {
            // 用户点击了“转发”按钮
            return {
              title: '先用这个名',
              imageUrl: g.globalda.userinfo.avatarUrl
            }
          })
        }
      });

    }
  })
}

wx.getSetting({
  success: function (res) {
    var authSetting = res.authSetting
    if (authSetting['scope.userInfo'] === true) {
      // 用户已授权，可以直接调用相关 API
      wx.showModal({
        title: '获取头像信息',
        content: '已授权获取用户信息',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          }
        }
      })
      getuserinfomation();
    } else if (authSetting['scope.userInfo'] === false) {
      // 用户已拒绝授权，再调用相关 API 或者 wx.authorize 会失败，需要引导用户到设置页面打开授权开关
      //下面的一串解决用户再次授权问题
      wx.openSetting({
        success: (res) => {

          console.log(res.authSetting);
          //require('main.e2ad8');
          wx.getSetting({
            success: function (res) {
              var authSetting = res.authSetting
              if (authSetting['scope.userInfo'] === true) {
                // 用户已授权，可以直接调用相关 API
                getuserinfomation();
              } else if (authSetting['scope.userInfo'] === false) {
                // 用户已拒绝授权，再调用相关 API 或者 wx.authorize 会失败，需要引导用户到设置页面打开授权开关
                wx.showModal({
                  title: '警告',
                  content: '您点击了拒绝授权，请再次点击授权',
                  success: function (res) {
                    if (res.confirm) {
                      console.log('用户点击确定')
                    }
                  }
                })
              } else {
                // 未询问过用户授权，调用相关 API 或者 wx.authorize 会弹窗询问用户
              }
            }
          })
        }
      })
    } else {
      // 未询问过用户授权，调用相关 API 或者 wx.authorize 会弹窗询问用户
      wx.login({
        success: function () {
          wx.getUserInfo({
            success: function (res) {
              // console.log(g);
              //global.userinfo = res.userInfo;//全局变量global在真机上不能用，报错
              //console.log(global.userinfo )
              g.globalda.userinfo = res.userInfo;//一定要先获取信息在执行main函数！！不然会因为栈的问题无法正确获取数据
              //console.log(g.globalda.userinfo);

              require('main.7f559');
            },
            fail: function (res) {
              //下面的一串解决用户再次授权问题
              wx.openSetting({
                success: (res) => {
                  console.log(res.authSetting);
                  wx.getSetting({
                    success: function (res) {
                      var authSetting = res.authSetting
                      if (authSetting['scope.userInfo'] === true) {
                        // 用户已授权，可以直接调用相关 API
                        getuserinfomation();
                      } else if (authSetting['scope.userInfo'] === false) {
                        // 用户已拒绝授权，再调用相关 API 或者 wx.authorize 会失败，需要引导用户到设置页面打开授权开关
                        wx.showModal({
                          title: '警告',
                          content: '您点击了拒绝授权，请10分钟后再次点击授权，或者删除小程序重新进入。',
                          success: function (res) {
                            if (res.confirm) {
                              console.log('用户点击确定')
                            }
                          }
                        })
                      }
                    }
                  })
                }
              })

            },
          })
        }
      });
    }
  }
})

wx.showShareMenu({

})

wx.onShareAppMessage(function () {
  // 用户点击了“转发”按钮
  return {
    title: '先用这个名',
    imageUrl: g.globalda.userinfo.avatarUrl

  }
})
// wx.chooseImage({
//   count: 1,
//   sizeType: 'original',
//   sourceType: 'camera',

// });

// var video = wx.createVideo({
//   src: "http://1.dayong.applinzi.com/AR%E5%8C%BB%E7%96%97%E5%9F%B9%E8%AE%AD_%E6%A0%87%E6%B8%85.mp4",
//   autoplay: true,