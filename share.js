export default{
    // 监听用户点击右上角菜单的「转发」按钮时触发的事件
    onShareAppMessage() {
        // 设置转发的参数
        return {
            title: "基因派",
            // path: '',
            imageUrl: "",
            success: function(res) {
                console.log(res, '发生过是');
                if (res.errMsg == 'shareAppMessage:ok') {
                    console.log("成功", res)
                }
            },
            fail: function(res) {
    
                console.log("失败", res)
    
            }
        }
    },
    // 分享到朋友圈
     onShareTimeline:function(res){
        return {
          title: '基因派',
          imageUrl:'https://genepiapi.ypzlfx.com/file/genepi/2023/11/13/AKtZ1IVhxRiWc97110247ad6760c4f750448fbc3371b_20231113171945A939.png',
          query:''      
        }
      },
      // 收藏
      onAddToFavorites:function(res) {
        return {
          title: '基因派',
          imageUrl:'https://genepiapi.ypzlfx.com/file/genepi/2023/11/13/AKtZ1IVhxRiWc97110247ad6760c4f750448fbc3371b_20231113171945A939.png',
          query: '',
        }
      }
}