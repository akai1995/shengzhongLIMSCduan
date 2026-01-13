export default{
    data(){
        return {
            shareParams: {
                title: 'e-AI',
                path: '/pages/launch/launch',
                imageUrl: this.$staticPath+'genepi/2023/11/13/AKtZ1IVhxRiWc97110247ad6760c4f750448fbc3371b_20231113171945A939.png',
                desc: '',
                content: '',
                success: (res) => {
                    console.log(res, '发生过是');
                    if (res.errMsg == 'shareAppMessage:ok') {
                        console.log("成功", res)
                        uni.showToast({
                            title: '分享成功',
                            icon: 'success'
                        });
                    }
                },
                fail: (err) => {
                console.error("失败", res)
                    uni.showToast({
                        title: '分享失败',
                        icon: 'error'
                    });
                }
            }
        }
    },
    // 监听用户点击右上角菜单的「转发」按钮时触发的事件
    onShareAppMessage() {
        // 设置转发的参数
        return this.shareParams
    },
    // 分享到朋友圈
    onShareTimeline:function(res){
        return this.shareParams
    },
    // 收藏
    onAddToFavorites:function(res) {
        return this.shareParams
    }
}