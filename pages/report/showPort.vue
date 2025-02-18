<!--
 * @Description: 
 * @Version: 
 * @Author: 孙子呷约
 * @Date: 2023-10-30 16:39:56
-->
<template>
  <view class="reportDetail">
    <ut-nav title="报告" border></ut-nav>
    <view class="topContent">
      <view class="imgContent">
        <view
          v-for="(item, index) in imgList"
          style="margin-bottom: 20rpx; margin-top: 20rpx"
          @click="showImage(index)"
        >
          <image :src="item" mode="widthFix"></image>
        </view>
      </view>
    </view>
    <view class="btn">
      <!-- <web-view :src="allUrl"></web-view> -->
      <view class="backList" @click="back">返回报告列表</view>
      <view @click="toApplicationPort()" class="getPaper">邮寄纸质报告</view>
    </view>
    <u-modal
      :show="showModal1"
      title="您已申请过寄送此报告"
      class="modalStyle"
      @confirm="confirmModal1"
    >
      <template #default>
        <view class="fontContent">申请时间：{{ time }}</view>
        <view class="fontContent"
          >寄送地址：{{ currentReport.hosReportSendOrderVO.address }}</view
        >
      </template>
    </u-modal>
    <u-modal
      :show="showModal2"
      title="您已申请过寄送此报告"
      class="modalStyle"
      confirmText="复制单号"
      @confirm="confirmModal2"
    >
      <template #default>
        <view class="fontContent">申请时间：{{ time }}</view>
        <view class="fontContent"
          >{{ tempDict[currentReport.hosReportSendOrderVO.logistics] }}：{{
            currentReport.hosReportSendOrderVO.logisticsSn
          }}</view
        >
      </template>
    </u-modal>
  </view>
</template>

<script>
import { getDicts } from "@/api/hospitalrelated/hospitalrelated.js";
export default {
  data() {
    return {
      tempDict: {},
      currentReport: {},
      showModal1: false,
      showModal2: false,
      time: "",
      imgList: [],
    };
  },
  methods: {
    showImage(index) {
      uni.previewImage({
        urls: this.imgList, //需要预览的图片http链接列表，多张的时候，url直接写在后面就行了
        current: index, // 当前显示图片的http链接，默认是第一个
        success: function (res) {},
        fail: function (res) {},
        complete: function (res) {},
      });
    },
    toApplicationPort() {
      if (this.currentReport.ext1 == 1) {
        if (this.currentReport.hosReportSendOrderVO.logisticsSn) {
          this.showModal2 = true;
        } else {
          this.showModal1 = true;
        }
      } else {
        uni.navigateTo({
          url: "/pages/report/applicationReport?portId="+this.currentReport.id,
        });
      }
    },
    back() {
      uni.navigateBack();
    },
    confirmModal1() {
      this.showModal1 = false;
    },
    confirmModal2() {
      let textToCopy = this.currentReport.hosReportSendOrderVO.logisticsSn;
      uni.setClipboardData({
        data: textToCopy,
        success: function (res) {
          uni.showToast({
            title: "复制成功",
            icon: "success",
            duration: 2000,
          });
        },
        fail: function (res) {
          console.log(res);
          uni.showToast({
            title: "复制失败",
            icon: "none",
            duration: 2000,
          });
        },
      });
      this.showModal2 = false;
    },
  },
  onLoad(options) {
    getDicts("logistics").then((res) => {
      if (res.code == 200) {
        console.log(res, "disc");
        const tempObj = {};
        res.data.forEach((item) => {
          const key = item.dictValue;
          const value = item.dictLabel;
          tempObj[key] = value;
        });
        this.tempDict = tempObj;
      }
    });
    let fileUrl = encodeURIComponent(this.pdfUrl); // encodeURIComponent 函数可把字符串作为 URI 组件进行编码。
    this.allUrl = this.viewerUrl + "?file=" + fileUrl;
    console.log(options);
    let jsonStr = decodeURIComponent(options.data);
    let obj = JSON.parse(jsonStr);
    // console.log(jsonStr) // 输出：123
    console.log(obj, 111); // 输出：John
    this.currentReport = obj;
    this.time = obj.hosReportSendOrderVO?.createTime.substring(0, 10);
    const imgs = obj.ext2;
    if (imgs) {
      this.imgList = imgs.split(",");
    }
  },
};
</script>

<style scoped lang="scss">
.reportDetail {
  height: 100%;
  background-color: #fff;
}
/deep/.u-modal__content {
  display: flex;
  flex-direction: column !important;
  justify-content: center;
  align-items: center;
  padding: 36rpx 140rpx 50rpx 140rpx !important;
  .fontContent {
    color: #999;
    font-size: 24rpx;
  }
}
.btn {
  // padding: 0 30rpx;
  height: 120rpx;
  width: 100%;
  display: flex;
  align-items: center;
  position: fixed;
  justify-content: space-around;
  bottom: 0;
  background-color: #fff;
  .backList {
    width: 320rpx;
    height: 80rpx;
    background-color: rgba(40, 120, 255, 0.1);
    border-radius: 80rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: 500;
    color: #3b7eff;
    font-size: 36rpx;
  }
  .getPaper {
    width: 320rpx;
    height: 80rpx;
    background: linear-gradient(135deg, #00deff 0%, #0c5fff 100%);
    border-radius: 80rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: 550;
    color: #fff;
    font-size: 36rpx;
  }
}
.topContent {
  width: 100%;
  overflow: scroll;
  height: 100%;
  background-color: #fff;
  min-height: 996rpx;
}
.imgContent {
  width: 100%;
  // height: 100%;
  min-height: 1080rpx;;
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: center;

  image {
    // height: 760px;
    // width: 537px;
  }
}
</style>
