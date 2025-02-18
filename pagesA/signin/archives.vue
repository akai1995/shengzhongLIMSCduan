<template>
  <view>
    <view class="user_container">
      <ut-nav title="肿瘤分子检测登记" border></ut-nav>
      <view class="ut-padding" style="padding-bottom: 110rpx" v-if="list.length != 0">
        <view class="out"></view>
        <view>
          <u-radio-group
            v-model="radioValue"
            placement="column"
            class="radio_group"
            iconPlacement="right"
            @change="radioChange"
          >
            <u-radio
              activeColor="#3B7EFF"
              class="listBox"
              v-for="(item, index) in list"
              :key="index"
              :name="item.id"
            >
              <view class="list">
                <image
                  class="headImg"
                  v-if="item.sex == null"
                  :src="headImg"
                  mode=""
                ></image>
                <image
                  class="headImg"
                  v-if="item.sex == '男'"
                  src="../../static/images/a-8nanxuesheng.png"
                  mode=""
                ></image>
                <image
                  class="headImg"
                  v-if="item.sex == '女'"
                  src="../../static/images/a-6nvhai.png"
                  mode=""
                ></image>
                <view class="text">
                  <view class="width flex">
                    <text class="name">{{ item.name }}</text>
                    <text
                      class="tag"
                      :class="item.sex != '男' ? 'bg' : ''"
                      v-if="item.relationship"
                      >{{ item.relationship }}</text
                    >
                  </view>
                  <view class="flex">
                    <view class="age m-r2">{{ item.sex ? item.sex : "未知" }}</view>
                    <view class="age">{{ getAge(item.idcard) }}</view>
                  </view>
                </view>
              </view>
            </u-radio>
          </u-radio-group>
        </view>
      </view>

      <view class="noData" @click="redirectJump" v-else>
        <image class="headImg" src="https://genepiapi.ypzlfx.com/file/genepi/2023/12/07/wtglvvsQWlCFf604d3e0d861bd31c526eb2689257d69_20231207154216A946.png" mode=""></image>
        <view>暂无用户档案信息</view>
        <view class="btnUser">点击添加用户档案</view>
      </view>
    </view>
    <view class="btnContent">
      <view class="subBtn" @click="realJump" v-if="list.length != 0"> 确定 </view>
    </view>
  </view>
</template>

<script>
import { getUserHealthList } from "@/api/personalCenter/personalCenter.js";
export default {
  data() {
    return {
      headImg:
        "https://genepiapi.ypzlfx.com/file/genepi/2023/07/20/OxbWNs6SoNLF1129151bdb41b25719e93409dc3a1f5b_20230720170831A016.jpg",
      headImg1:
        "https://genepiapi.ypzlfx.com/file/genepi/2023/10/10/Q0H7kANHdLrT52a4e41d3ad33f54cc502abe62ea1911_20231010170129A049.png",
      headImg2:
        "https://genepiapi.ypzlfx.com/file/genepi/2023/10/10/CLuoMHARubJH7bcac0584bad5fc8dfd70faf3c286f1b_20231010170148A050.png",
      list: [],
      radioValue: "",
    };
  },
  onLoad() {
    this.init();
  },
  methods: {
    radioChange(e) {
      // console.log('选中的值：', e);
    },
    init() {
      getUserHealthList(this.$store.getters.userId).then((res) => {
        console.log("res", res);
        if (res.code == 200) {
          this.list = res.data;
        }
      });
    },
    jump(item) {
      if (item.relationship == "本人") {
        this.$ut.jump("/pagesA/signin/signin?id=" + item.id + "&type=0");
      } else {
        this.$ut.jump("/pagesA/signin/signin?id=" + item.id + "&type=1");
      }
    },
    redirectJump () {
      uni.navigateBack()
    },
    realJump() {
      let item = this.list.find((item) => item.id === this.radioValue);
      // console.log('item',item)
      if (!item) {
        return;
      }
      // 获取所有页面栈实例列表
      let pages = getCurrentPages();
      console.log(pages,44444)
      // 上一页页面实例
      let prevPage = pages[pages.length - 1];
      console.log(prevPage.$vm,33)
      let orgId = prevPage.$vm.orgId;
      console.log("parms", prevPage.$vm.orgId);
      // return
      uni.setStorageSync('itemId', item.id);
      uni.setStorageSync('orgId', orgId);
 
      if (item.relationship == "本人") {
        uni.setStorageSync('type', 0);
        uni.navigateBack()
  //       uni.redirectTo({
  // url: '/pagesA/signin/signin?id='+ item.id + "&type=0" + "&orgId=" + orgId
  //       })

        // this.$ut.jump(
        //   "/pagesA/signin/signin?id=" + item.id + "&type=0" + "&orgId=" + orgId
        // );
      } else {
        uni.setStorageSync('type', 1);
        uni.navigateBack()
//         uni.redirectTo({
//   url: '/pagesA/signin/signin?id='+ item.id + "&type=1" + "&orgId=" + orgId
// })
        // this.$ut.jump(
        //   "/pagesA/signin/signin?id=" + item.id + "&type=1" + "&orgId=" + orgId
        // );
      }
    },
    getAge(iden) {
      let val = iden?.length;
      let myDate = new Date();
      let month = myDate.getMonth() + 1;
      let day = myDate.getDate();
      let age = 0;

      if (val === 18) {
        age = myDate.getFullYear() - iden.substring(6, 10) - 1;

        if (
          iden.substring(10, 12) < month ||
          (iden.substring(10, 12) == month && iden.substring(12, 14) <= day)
        )
          age++;
      }
      if (val === 15) {
        age = myDate.getFullYear() - iden.substring(6, 8) - 1901;

        if (
          iden.substring(8, 10) < month ||
          (iden.substring(8, 10) == month && iden.substring(10, 12) <= day)
        )
          age++;
      }
      return age + "岁";
    },
  },

};
</script>

<style lang="scss">
page {
  background: #f8f8f8 !important;
}

.user_container {
  height: 100%;
}

.noData {
  box-sizing: border-box;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 120rpx 174rpx 0 174rpx;
  color: #333333;
  font-size: 28rpx;
}

.btnUser {
  box-sizing: border-box;
  width: 414rpx;
  height: 80rpx;
  border-radius: 80rpx;
  background-color: rgba(59, 126, 255, 0.1);
  padding: 14rpx 52rpx;
  color: #3b7eff;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 36rpx;
  margin-top: 48rpx;
  font-weight: 500;
}

.out {
  color: #ff5252ff;
  font-size: 28rpx;
}

.u-radio {
  box-sizing: border-box;
  width: 100%;
  height: 150rpx;
  border-radius: 20rpx;
  background-color: #fff;
  padding-right: 32rpx;
  margin-bottom: 32rpx;
}

.list {
  width: 100%;
  height: 150rpx;
  border-radius: 20rpx;
  background-color: #fff;
  display: flex;
  align-items: center;
  padding: 10rpx 30rpx;
  box-sizing: border-box;

  .headImg {
    width: 120rpx;
    height: 120rpx;
    border-radius: 50%;
    flex-shrink: 0;
  }

  .text {
    width: calc(100% - 140rpx);
    height: 100%;
    display: flex;
    flex-wrap: wrap;

    align-content: space-around;
    margin-left: 20rpx;

    .name {
      font-size: 32rpx;
      color: #000;
      font-weight: 500;
    }

    .tag {
      background: #3b7eff33;
      border-radius: 10rpx;
      padding: 5rpx 10rpx;
      font-size: 24rpx;
      margin-left: 20rpx;
      color: #3b7effff;
    }

    .age {
      color: #666;
      font-size: 28rpx;
    }
  }
}

.bg {
  background: #ff525233 !important;
  color: #ff5252ff !important;
}

.bottom {
  position: fixed;
  left: 0;
  bottom: 0;
  right: 0;
  height: 100rpx;
  background: #fff;
  padding: 15rpx 30rpx;
  box-sizing: border-box;
  box-shadow: 0rpx -8rpx 20rpx 0rpx rgba(6, 63, 150, 0.1);

  .btn {
    width: 100%;
    height: 100%;
    border-radius: 80rpx;
    font-size: 36rpx;
    font-weight: 500;
    color: #3b7effff;
    background: #3b7eff33;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
.btnContent {
  width: 100%;
  position: fixed;
  bottom: 0;
  height: 120rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #fff;
}
.subBtn {
  box-sizing: border-box;
  width: 686rpx;
  height: 80rpx;
  background: linear-gradient(135deg, #00deff 0%, #0c5fff 100%);
  border-radius: 80rpx;
  opacity: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #ffffff;
  font-size: 36rpx;
  font-weight: 500;
  line-height: 42rpx;
}
</style>
