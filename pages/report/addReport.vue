<template>
  <view class="form_container">
    <ut-nav title="添加报告" border></ut-nav>
    <view class="u-form">
      <u--form
        labelPosition="left"
        :model="form"
        labelWidth="180rpx"
        ref="form"
        :rules="rules"
      >
        <u-form-item
          label="姓名"
          prop="fdName"
          borderBottom
          :label-style="{ fontSize: '28rpx' }"
          required
        >
          <u-input v-model="form.fdName" border="none" placeholder="请输入"> </u-input>
        </u-form-item>
        <u-form-item label="性别" prop="fdSex" borderBottom required>
          <u-radio-group v-model="form.fdSex">
            <view class="width flex j-end">
              <u-radio
                :customStyle="{ marginRight: '30rpx' }"
                label="男"
                name="男"
              ></u-radio>
              <u-radio
                :customStyle="{ marginRight: '30rpx' }"
                label="女"
                name="女"
              ></u-radio>
            </view>
          </u-radio-group>
        </u-form-item>
        <u-form-item label="身份证号" prop="fdIdcard" borderBottom required>
          <u--input
            v-model="form.fdIdcard"
            border="none"
            placeholder="请输入"
            maxlength="18"
          ></u--input>
        </u-form-item>
        <u-form-item label="联系电话" prop="fdTel" borderBottom required>
          <u--input
            v-model="form.fdTel"
            border="none"
            placeholder="请输入"
            maxlength="18"
          ></u--input>
        </u-form-item>
        <u-form-item
          label="与我的关系"
          labelWidth="180rpx"
          prop="fdRelationship"
          borderBottom
          @click="showRelation = true"
          required
        >
          <u--input
            v-model="form.fdRelationship"
            readonly
            border="none"
            placeholder="请选择"
          ></u--input>
          <u-icon slot="right" name="arrow-right"></u-icon>
          <block v-if="form.fdRelationship != '本人'">
            <u-picker
              :show="showRelation"
              :columns="relation"
              closeOnClickOverlay
              @confirm="confirm2"
              @cancel="showRelation = false"
              @close="showRelation = false"
            ></u-picker>
          </block>
        </u-form-item>
        <u-form-item label="民族" prop="fdNation" borderBottom @click="show = true">
          <u--input
            v-model="form.fdNation"
            required
            readonly
            border="none"
            placeholder="请选择"
          ></u--input>
          <u-icon slot="right" name="arrow-right"></u-icon>
          <u-picker
            :show="show"
            :columns="nationList"
            closeOnClickOverlay
            @confirm="confirm"
            @cancel="show = false"
            @close="show = false"
          ></u-picker>
        </u-form-item>
        <u-form-item label="职业" prop="fdVocation" @click="showType = true">
          <u--input
            v-model="form.fdVocation"
            readonly
            border="none"
            placeholder="请选择"
          ></u--input>
          <u-icon slot="right" name="arrow-right"></u-icon>
          <u-picker
            :show="showType"
            :columns="occupation"
            closeOnClickOverlay
            @confirm="confirm1"
            @cancel="showType = false"
            @close="showType = false"
          ></u-picker>
        </u-form-item>
      </u--form>
    </view>

    <view class="out m-t3" style="margin-left: 24rpx">注：平台严格保密您的个人信息</view>

    <view class="btn m-t3" @click="save">确认</view>
  </view>
</template>

<script>
import nation from "./nation.json";
import { getDicts } from "@/api/hospitalrelated/hospitalrelated.js";
import { addFamilyMember } from "@/api/personalCenter/personalCenter.js";
export default {
  data() {
    return {
      show: false,
      showType: false,
      showRelation: false,
      form: {
        fdName: "",
        fdSex: "",
        fdAge: "30",
        fdIdcard: "",
        fdTel: "",
        fdNation: "",
        fdVocation: "",
        fdRelationship: "",
      },
      rules: {
        fdName: {
          type: "string",
          required: true,
          message: "请填写姓名",
          trigger: ["blur", "change"],
        },
        fdRelationship: {
          type: "string",
          required: true,
          message: "请选择与我的关系",
          trigger: ["blur", "change"],
        },
        fdIdcard: [
          {
            required: true,
            message: "请输入身份证号",
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
        fdTel: [
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
      nationList: [[]],
      occupation: [[]],
      relation: [["子女", "父母", "配偶", "其他"]],
      dicts: ["ethnic_dictionary", "career_dictionary"],
    };
  },
  onLoad() {
    this.initDicts();
  },
  onReady() {
    //onReady 为uni-app支持的生命周期之一
    this.$refs.form.setRules(this.rules);
  },

  methods: {
    save() {
      this.$refs.form.validate().then((res) => {
        uni.showLoading();
        let userId = this.$store.getters.userId;
        addFamilyMember(
          {
            relationship: this.form.fdRelationship,
            name: this.form.fdName,
            idcard: this.form.fdIdcard,
            telephone: this.form.fdTel,
            nation: this.form.fdNation,
            career: this.form.fdVocation,
            sex: this.form.fdSex,
          },
          userId
        ).then((res) => {
          if (res.code == 200) {
            uni.hideLoading();
            // this.$ut.jump("/pagesA/user/family")
			const eventChannel = this.getOpenerEventChannel();
			eventChannel.emit('change');
            uni.navigateBack({
				delta: 1
			})
            uni
              .showToast({
                title: "添加成功",
                icon: "none",
              })
              .catch((err) => {
                uni.hideLoading();
              });
          } else {
            uni.hideLoading();
            uni.showToast({
              title: "添加失败，请核对信息",
              icon: "none",
            });
          }
        });
        // if (this.checked.length == 0) {
        // 	this.$ut.showText("请先阅读并勾选协议")
        // } else {
        // 	let userId = this.$store.getters.userId
        // 	addFamilyMember(this.formData, userId).then(res => {
        // 		if (res.code == 200) {
        // 			// this.$ut.jump("/pagesA/user/family")
        // 			uni.navigateBack()
        // 		}
        // 	})
        // }
      });
    },
    next() {
      this.getAge(this.form.fdIdcard);
      this.$emit("next", 1);
    },

    initDicts() {
      getDicts(this.dicts[0]).then((res) => {
        for (var i = 0; i < res.data.length; i++) {
          this.nationList[0].push(res.data[i].dictValue);
        }
      });
      getDicts(this.dicts[1]).then((res) => {
        for (var i = 0; i < res.data.length; i++) {
          this.occupation[0].push(res.data[i].dictLabel);
        }
      });
    },
    getAge(iden) {
      let val = iden.length;
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
      this.form.fdAge = age;
    },
    confirm(e) {
      this.form.fdNation = e.value[0];
      this.show = false;
    },
    confirm1(e) {
      this.form.fdVocation = e.value[0];
      this.showType = false;
    },
    confirm2(e) {
      this.form.fdRelationship = e.value[0];
      console.log("22222", this.form.fdRelationship);
      this.$refs.form.validateField("fdRelationship");
      this.showRelation = false;
    },
  },
};
</script>

<style scoped lang="scss">
page {
  background-color: #f8f8f8;
}

.form_container {
  padding: 30rpx;
}

.u-form {
  padding: 10rpx 30rpx;
  box-sizing: border-box;
  background: #fff;
  border-radius: 20rpx;
}

.out {
  color: #ff5252ff;
  font-size: 28rpx;
}

.btn {
  width: 100%;
  height: 80rpx;
  border-radius: 100rpx;
  font-size: 36rpx;
  font-weight: 500;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #00deff 0%, #0c5fff 100%);
}
</style>
