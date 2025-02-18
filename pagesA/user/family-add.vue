<template>
  <view>
    <ut-nav title="添加就诊人" border></ut-nav>

    <view class="content">
      <view class="title">添加就诊人 <text>保存后信息不可更改</text></view>

      <view class="m-t4">
        <u--form labelPosition="left" :model="formData" ref="uForm" labelWidth="150rpx">
          <u-form-item label="姓名" prop="name" borderBottom>
            <u--input
              v-model="formData.name"
              border="none"
              placeholder="请真实姓名"
            ></u--input>
          </u-form-item>
          <u-form-item label="证件类型" borderBottom>
            <view class="width">
              <u-cell
                title="身份证"
                :border="false"
                :isLink="true"
                arrow-direction="down"
              ></u-cell>
            </view>
          </u-form-item>
          <u-form-item label="证件号码" prop="idcard" borderBottom>
            <u--input
              v-model="formData.idcard"
              border="none"
              placeholder="请输入"
            ></u--input>
          </u-form-item>
          <u-form-item label="手机号码" prop="telephone" borderBottom>
            <u--input
              v-model="formData.telephone"
              border="none"
              placeholder="请输入"
            ></u--input>
          </u-form-item>
          <u-form-item label="关系" prop="relationship" borderBottom>
            <view class="width" @click="isShow = true">
              <u-cell
                :title="formData.relationship"
                :border="false"
                :isLink="true"
                arrow-direction="down"
              ></u-cell>
            </view>
          </u-form-item>
        </u--form>
        <!-- <view class="clause m-t4">
					<u-checkbox-group class="check" v-model="checked">
						<u-checkbox name="ok" shape="circle" activeColor="#3B7EFFFF"></u-checkbox>
					</u-checkbox-group>
					<view class="text">
						<text class="grey">已仔细阅读并同意</text>
						<text class="blue">《基因派用户协议》</text>
					</view>
				</view> -->

        <view class="btn m-t4" @click="save">添加</view>

        <u-picker
          :show="isShow"
          :columns="columns"
          :closeOnClickOverlay="true"
          @confirm="confirm"
          @cancel="isShow = false"
        ></u-picker>
      </view>
    </view>
  </view>
</template>

<script>
import { addFamilyMember } from "@/api/personalCenter/personalCenter.js";
export default {
  data() {
    return {
      formData: {
        relationship: "子女",
        name: "",
        idcard: "",
        telephone: "",
      },
      isShow: false,
      columns: [["子女", "父母", "配偶", "其他"]],
      checked: [],
      rules: {
        name: [
          {
            required: true,
            message: "请输入姓名",
            trigger: ["change", "blur"],
          },
        ],
        idcard: [
          {
            required: true,
            message: "请输入身份证号码",
            trigger: ["change", "blur"],
          },
          {
            // 自定义验证函数，见上说明
            validator: (rule, value, callback) => {
              // 上面有说，返回true表示校验通过，返回false表示不通过
              // uni.$u.test.mobile()就是返回true或者false的
              return uni.$u.test.idCard(value);
            },
            message: "身份证号码不正确",
            // 触发器可以同时用blur和change
            trigger: ["change", "blur"],
          },
        ],
        telephone: [
          {
            required: true,
            message: "请输入手机号码",
            trigger: ["change", "blur"],
          },
          {
            // 自定义验证函数，见上说明
            validator: (rule, value, callback) => {
              // 上面有说，返回true表示校验通过，返回false表示不通过
              // uni.$u.test.mobile()就是返回true或者false的
              return uni.$u.test.mobile(value);
            },
            message: "手机号码不正确",
            // 触发器可以同时用blur和change
            trigger: ["change", "blur"],
          },
        ],
      },
    };
  },
  onReady() {
    //onReady 为uni-app支持的生命周期之一
    this.$refs.uForm.setRules(this.rules);
  },
  methods: {
    confirm(e) {
      this.formData.relationship = e.value[0];
      this.isShow = false;
    },
    save() {
      this.$refs.uForm.validate().then((res) => {
          let userId = this.$store.getters.userId;
          addFamilyMember(this.formData, userId).then((res) => {
            if (res.code == 200) {
				 const eventChannel = this.getOpenerEventChannel();
				  eventChannel.emit('someEvent');
				  uni.navigateBack()
            }
          });
      });
    },
  },
};
</script>

<style lang="scss">
page {
  background: #fff;
}

.title {
  font-size: 34rpx;
  color: #000;
  font-weight: 600;
  display: flex;
  align-items: flex-end;

  text {
    color: #fd5454ff;
    font-size: 24rpx;
    margin-left: 20rpx;
  }
}

.clause {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  font-size: 24rpx;

  .check {
    width: 8%;
  }

  .text {
    width: 92%;
  }
}

.btn {
  width: 100%;
  height: 80rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 80rpx;
  background: linear-gradient(135deg, #00deff 0%, #0c5fff 100%);
  color: #fff;
  font-size: 36rpx;
  font-weight: 600;
  letter-spacing: 5rpx;
}

/deep/ .u-cell__body{
	padding: 0 !important;
}
</style>
