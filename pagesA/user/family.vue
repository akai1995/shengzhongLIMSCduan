<template>
  <view>
    <ut-nav url="/pages/user/user" title="家庭成员" border></ut-nav>

    <view class="content">
      <view class="add" @click="jump()">
        <u-icon name="plus-people-fill" color="#3B7EFFFF" size="22"></u-icon>
        <text>添加家庭成员</text>
      </view>

      <u-swipe-action>
        <view>
          <u-swipe-action-item
            :ref="'swipeAction' + index"
            @click="onDelete(item)"
            :options="options"
            v-for="(item, index) in list"
            :key="item.id"
            @touchmove="move(index)"
			disabled
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
          </u-swipe-action-item>
        </view>
      </u-swipe-action>

      <ut-nodata v-if="list.length == 0"></ut-nodata>
    </view>
  </view>
</template>

<script>
import {
  getFamilyListByUserId,
  deleteFamily,
} from "@/api/personalCenter/personalCenter.js";
export default {
  data() {
    return {
      list: [],
      options: [
        {
          text: "删除",
        },
      ],
      moveIndex: -1,
      indextol: "",
    };
  },
  onLoad() {
    this.getFamilyList();
  },
  methods: {
    getFamilyList() {
      let userId = this.$store.getters.userId;
      getFamilyListByUserId(userId).then((res) => {
        res.data.forEach((item) => {
          if (item.idcard != null) {
            item.age = this.getAge(item.idcard);
          }
        });
        this.list = res.data;
      });
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
    onDelete(e) {
      console.log("e", e);
      let this_ = this;
      uni.showModal({
        title: "提示",
        content: "确定是否删除这条数据",
        cancelText: "取消",
        confirmText: "确定",
        confirmColor: "#fa3534",
        success: function (res) {
          if (res.confirm) {
            let index = this_.list.indexOf(e.id);
            console.log("index", e.id);
            deleteFamily(e.id).then((res) => {
              if (res.code == 200) {
                this_.list.splice(index, 1);
                this_.closeSwipeAction();
                this_.$ut.showText("删除成功");
              }
            });
          } else if (res.cancel) {
            console.log("用户点击取消");
            this_.closeSwipeAction();
          }
        },
      });
    },
    //检测滑动的是第几个
    move(index) {
      if (this.moveIndex == index) return;
      this.moveIndex = index;
      this.indextol = index;
    },
    //关闭事件
    closeSwipeAction() {
      let test = "swipeAction" + this.moveIndex;
      if (this.moveIndex != -1) {
        this.$refs[test][0].closeHandler();
        this.indextol = "";
      }
    },
	
	jump(){
		let this_ = this
		uni.navigateTo({
			url:"/pagesA/user/family-add",
			events:{
				someEvent(){
					this_.getFamilyList()
				}
			}
		})
	}
  },
};
</script>

<style lang="less">
page {
  background: #f8f8f8ff;
}
.u-swipe-action-item{
	border-radius: 20rpx;
}
.add {
  width: 100%;
  height: 120rpx;
  background: #e8f1f8ff;
  border-radius: 20rpx;
  color: #3b7effff;
  font-size: 28rpx;
  display: flex;
  align-items: center;
  justify-content: center;

  text {
    margin: 0 20rpx;
  }
}

.list {
  width: 100%;
  height: 150rpx;
  background: #fff;

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
      font-weight: 600;
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
      color: #000;
      font-size: 28rpx;
	  display: flex;
	  align-items: baseline;
    }
  }
}

/deep/.u-swipe-action-item {
  margin-top: 40rpx;
}

.bg {
  background: #ff525233 !important;
  color: #ff5252ff !important;
}
</style>
