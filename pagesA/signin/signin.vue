<template>
  <view>
    <u-navbar
      title="肿瘤分子检测登记"
      :leftIconColor="leftIconColor"
      :placeholder="true"
      :border="border"
    >
      <view class="u-nav-slot" slot="left">
        <u-icon name="arrow-left" size="19" @click="onBack"></u-icon>
        <u-line direction="column" :hairline="false" length="16" margin="0 8px"></u-line>
        <u-icon name="home" size="20" @click="leftClick"></u-icon>
      </view>
    </u-navbar>
    <!-- <ut-nav title="肿瘤分子检测登记" border back @onBack="onBack">
      

    </ut-nav> -->
    <view class="ut-padding">
      <u-steps :current="current" dot activeIcon="checkmark" inactiveColor="#E7E7E7">
        <u-steps-item title="基本信息"></u-steps-item>
        <u-steps-item title="院内信息"></u-steps-item>
        <u-steps-item title="过往史"></u-steps-item>
      </u-steps>

      <view class="m-t3">
        <formInfo v-show="current == 0" ref="formInfo" @next="next"></formInfo>
        <formInner v-show="current == 1" ref="formInner" @next="next"></formInner>
        <formHistory
          v-show="current == 2"
          ref="formHistory"
          @next="next"
          @submit="submit"
        ></formHistory>
      </view>
    </view>
    <u-loading-page
      loadingText="提交中..."
      :loading="commitLoading"
      fontSize="32rpx"
    ></u-loading-page>
  </view>
</template>

<script>
import formInfo from "../component/formInfo.vue";
import formInner from "../component/formInner.vue";
import formHistory from "../component/formHistory.vue";
import {
  getUserRelationship,
  getRelation,
  pcrInformationAdd,
} from "@/api/personalCenter/personalCenter.js";
export default {
  components: {
    formInfo,
    formInner,
    formHistory,
  },
  data() {
    return {
      signin: "",
      commitLoading: false,
      current: "0",
      id: "",
      type: "",
      userId: "",
      pcrInformation: {},
      orgId: "",
    };
  },
  onLoad(options) {
    console.log(options, 999);
    const signin = options.signin;
    this.signin = options.signin;
    console.log(signin, 777);
    uni.setStorageSync("signin", signin);
    const userId = uni.getStorageSync("storage_data").vuex_userid;
    if (!userId) {
      uni.showModal({
        title: "提示",
        content: "请登录查看",
        cancelText: "取消", // 取消按钮的文字
        confirmText: "确认", // 确认按钮的文字
        success: (res) => {
          if (res.confirm) {
            uni.navigateTo({
              url: "/pages/login/login",
            }); //点击确定之后执行的代码
          } else {
            uni.navigateBack; //点击取消之后执行的代码
          }
        },
      });
    }
  },
  onShow(options) {
    console.log(options);
    console.log("options", uni.getStorageSync("itemId"));
    if (uni.getStorageSync("itemId")) {
      this.type = uni.getStorageSync("type");
      this.id = uni.getStorageSync("itemId");
      // this.type = options.type;
      // this.id = options.id;
      this.getInfo();
    }
    if (uni.getStorageSync("orgId")) {
      this.orgId = uni.getStorageSync("orgId");
      this.$refs.formInner.form.orgId = uni.getStorageSync("orgId");
      this.$refs.formInner.orgShow = true;
      // this.orgId = options.orgId;
      // this.$refs.formInner.form.orgId = options.orgId;
      // this.$refs.formInner.orgShow = true;
    }
    // console.log('orgid',this.orgId )
    this.$refs.formInfo.initDicts();
  },

  methods: {
    next(num, obj) {
      this.current = num;

      // this.pcrInformation = obj
      // console.log('obj',this.pcrInformation)
    },
    leftClick() {
      uni.reLaunch({
        url: "/pages/index/index",
      });
    },
    getInfo() {
      if (this.type != 1) {
        getUserRelationship(this.id)
          .then((res) => {
            let data = res.data;
            console.log(data, 111);
            if (res.code == 200) {
              this.userId = data.id;
              this.$refs.formInfo.form.fdName = data.name;
              this.$refs.formInfo.form.fdSex = data.sex;
              this.$refs.formInfo.form.fdIdcard = data.idcard;
              this.$refs.formInfo.form.fdTel = data.telephone;
              this.$refs.formInfo.form.fdNation = data.nation;
              this.$refs.formInfo.form.fdVocation = data.career;
              if (data.relationship == "本人") {
                this.$refs.formInfo.form.fdRelationship = "本人";
              }
            }
            uni.removeStorageSync("itemId");
            uni.removeStorageSync("type");
            uni.removeStorageSync("orgId");
          })
          .catch((err) => {
            uni.removeStorageSync("itemId");
            uni.removeStorageSync("type");
            uni.removeStorageSync("orgId");
          });
      } else {
        getRelation(this.id)
          .then((res) => {
            let data = res.data;
            if (res.code == 200) {
              console.log(data, 222);
              this.userId = data.id;
              this.$refs.formInfo.form.fdName = data.name;
              this.$refs.formInfo.form.fdSex = data.sex;
              this.$refs.formInfo.form.fdIdcard = data.idcard;
              this.$refs.formInfo.form.fdTel = data.telephone;
              this.$refs.formInfo.form.fdNation = data.nation;
              this.$refs.formInfo.form.fdVocation = data.career;
              this.$refs.formInfo.form.fdRelationship = data.relationship;
            }
            uni.removeStorageSync("itemId");
            uni.removeStorageSync("type");
            uni.removeStorageSync("orgId");
          })
          .catch((err) => {
            uni.removeStorageSync("itemId");
            uni.removeStorageSync("type");
            uni.removeStorageSync("orgId");
          });
      }
    },
    submit() {
      this.commitLoading = true;
      console.log("1", this.$refs.formInfo.form);
      // console.log('2',this.$refs.formInner.form)
      // console.log('3',this.$refs.formHistory.form)
      //注意：后面属性会把前面的属性覆盖的问题，已经修改
      let mergedObj = Object.assign(
        {},
        this.$refs.formInner.form,
        this.$refs.formHistory.form,
        this.$refs.formInfo.form
      );
      mergedObj.userId = this.userId;
      console.log("++", mergedObj);
      pcrInformationAdd(mergedObj)
        .then((res) => {
          if (res.code == 200) {
            this.commitLoading = false;
            // setTimeout(()=>{
            // 	// uni.reLaunch({
            // 	// 	url:'/pages/index/index'
            // 	// })
            uni.redirectTo({
              url: "/pagesA/signin/success",
            });
            // },1500)
            this.commitLoading = false;
          }
        })
        .catch((err) => {
          this.commitLoading = false;
        });
    },
    onBack() {
      uni.navigateBack()
    },
  },
  onUnload(e) {
    return true;
  },
};
</script>

<style lang="scss">
/deep/.u-steps-item__wrapper {
  background: transparent !important;
}
/deep/.u-steps-item__wrapper__dot {
  width: 32rpx !important;
  height: 32rpx !important;

}
/deep/.u-steps-item__line--row {
  top: 14rpx !important;
  height: 8rpx !important;

}
/deep/.u-text__value--main{
  // color: rgba(59, 126, 255, 1) !important;
}

.u-nav-slot {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  border-width: 1rpx;
  border-radius: 200rpx;
  border-color: #dadbde;
  padding: 6rpx 14rpx;
  opacity: 0.8;
}
.nav {
  height: 88rpx;
}
</style>
