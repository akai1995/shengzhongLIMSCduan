<template>
  <view>
    <ut-nav title="样本详情" border=""></ut-nav>
    <view class="orderSn">申请单号：{{ info.orderSn }}</view>
    <view style="padding-bottom: 130rpx">
      <view class="ul">
        <view class="li" v-for="(item, index) in list" :key="index">
          <view class="yb">样本 {{ index + 1 }}</view>
          <view class="title">{{ item.geneSample.fdSampleCode }}</view>
          <view class="item">
            <view class="x">姓名：{{ item.geneApply.fdName }}</view>
            <view class="d">申请时间：{{ item.geneSample.fdRegisterDate }}</view>
          </view>
          <view class="item">
            <view class="d">送检项目：{{ item.genePro.fdProjectName }}</view>
          </view>
        </view>
      </view>
      <view class="info">
        <view class="info-item">开始时间：{{ info.aptmtStart || "" }}</view>
        <view class="info-item">结束时间：{{ info.aptmtEnd || "" }}</view>
        <view class="info-item">送检医院：{{ info.sendOrg || "" }}</view>
        <view class="info-item">接收医院：{{ info.receiveOrg || "" }}</view>
      </view>
    </view>
    <view class="btn-box">
      <view
        class="btn1"
        @click="jump()"
        v-if="
          (info.status == 3 || info.status == 4) 
        "
        >查看物流</view
      >
      <!-- &&(userOrgId == info.receiveOrgid || userOrgId == info.sendOrgid) -->

      <view
        class="btn2"
        v-if="info.status == 3 && info.receiveOrgid == userOrgId"
        @click="isShow = true"
        >确认接收</view
      >
    </view>

    <u-modal
      :show="isShow"
      @confirm="confirm"
      title="提示"
      :content="content"
      @cancel="isShow = false"
      showCancelButton
    ></u-modal>
  </view>
</template>

<script>
import { sendOrderDetails, orderSn, receiveOrder } from "@/api/order.js";
export default {
  data() {
    return {
      userOrgId: "",
      show: 0,
      driver: false,
      doctor: false,
      id: "",
      type: null,
      info: {},
      list: [],
      isShow: false,
      content: "是否确定接收样本",
    };
  },
  onLoad(options) {
    this.show = options.show;
    const userType = uni.getStorageSync("storage_data").vuex_roles;
    this.userOrgId = uni.getStorageSync("orgId");
    console.log(userType, 999);
    if (userType.includes("driver")) {
      this.driver = true;
      console.log(this.driver, 876);
    }
    if (userType.includes("doctor")) {
      this.doctor = true;
    }
    console.log("id", options);
    this.type = options.type;
    if (options.id) {
      this.id = options.id;
    }
    if (options.type != "code") {
      this.getDetails();
    } else {
      this.getOrderSn();
    }
  },

  methods: {
    getDetails() {
      sendOrderDetails(this.id).then((res) => {
        if (res.code == 200) {
          this.info = res.data.order;
          // console.log(this.info,9999)
          this.list = res.data.messageList;
        }
      });
    },
    getOrderSn() {
      orderSn(this.id).then((res) => {
        if (res.code == 200) {
          this.info = res.data.order;
          this.list = res.data.messageList;
        }
      });
    },

    jump() {
      uni.navigateTo({
        url: "/pagesB/order/mapFlow?id=" + this.id,
      });
    },
    confirm() {
      receiveOrder(this.info.id).then((res) => {
        if (res.code == 200) {
          this.isShow = false;
          this.$ut.showText("接收成功");
          uni.redirectTo({
            url: "/pagesB/order/orderReceive",
          });
        }
      });
    },
  },
};
</script>

<style lang="scss">
page {
  background: #fff;
}

.orderSn {
  color: #000;
  font-size: 32rpx;
  font-weight: 600;
  padding: 30rpx;
  box-sizing: border-box;
}

.info {
  padding: 20rpx;
  box-sizing: border-box;

  &-item {
    font-size: 28rpx;
    line-height: 1.8;
    color: #333;
  }
}

.popup {
  min-height: 310rpx;
  padding: 10rpx 20rpx;
  box-sizing: border-box;

  .title {
    text-align: center;
    font-size: 36rpx;
    line-height: 2;
    font-weight: bold;
  }

  .footer {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 90rpx;
    display: flex;
    align-items: center;
    border-top: 2rpx solid #efefef;

    .btn {
      flex: 1;
      font-size: 26rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      border-right: 1rpx solid #efefef;
    }
  }
}

.btn-box {
  width: 100%;
  height: 120rpx;
  display: flex;
  align-items: center;
  justify-content: space-around;
  position: fixed;
  left: 0;
  bottom: 0;
  z-index: 10;
  box-shadow: 0rpx -8rpx 20rpx 0rpx rgba(6, 63, 150, 0.1);

  .btn1 {
    flex: 1;
    margin: 0 40rpx;
    height: 80rpx;
    border-radius: 80rpx;
    background: #3b7eff1a;
    font-size: 36rpx;
    color: #3b7eff;
    display: flex;
    align-items: center;
    justify-content: center;
    letter-spacing: 2rpx;
  }

  .btn2 {
    flex: 1;
    margin: 0 40rpx;
    height: 80rpx;
    border-radius: 80rpx;
    background: linear-gradient(135deg, #3b7eff 0%, #0c5fff 100%);
    font-size: 36rpx;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    letter-spacing: 2rpx;
  }
}

.ul {
  padding: 0 30rpx;
  box-sizing: border-box;

  .li {
    padding: 20rpx;
    box-sizing: border-box;
    margin-bottom: 20rpx;
    border-radius: 10rpx;
    background: #3b7eff1a;
    position: relative;

    .yb {
      position: absolute;
      right: 0;
      top: 32rpx;
      border-radius: 20rpx 0 0 20rpx;
      background: #3b7eff80;
      color: #fff;
      font-size: 24rpx;
      padding: 5rpx 20rpx;
    }

    .title {
      font-size: 32rpx;
      color: #000;
      font-weight: 600;
      line-height: 2;
    }

    .item {
      display: flex;
      align-items: center;
      font-size: 24rpx;
      line-height: 1.8;

      .d {
        flex: 3;
      }

      .x {
        flex: 2;
      }
    }
  }
}

.gray {
  color: gray;
}

.blue {
  color: #0c5fff;
}
</style>
