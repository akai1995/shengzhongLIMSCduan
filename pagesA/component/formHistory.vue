<template>
  <view>
    <view class="u-form">
      <u--form
        labelPosition="left"
        :model="form"
        labelWidth="250rpx"
        ref="form"
        :rules="rules"
      >
        <u-form-item label="吸烟史" prop="fdSmoke" borderBottom required>
          <u-radio-group v-model="form.fdSmoke">
            <view class="width flex j-end">
              <u-radio
                :customStyle="{ marginRight: '30rpx' }"
                label="有"
                name="有"
              ></u-radio>
              <u-radio
                :customStyle="{ marginRight: '30rpx' }"
                label="无"
                name="无"
              ></u-radio>
            </view>
          </u-radio-group>
        </u-form-item>
        <view class="item-box" v-if="form.fdSmoke == '有'">
          <view class="width flex j-c">
            <view class="label">已吸烟</view>
            <view class="flex" style="width: 300rpx">
              <u-form :model="form" :rules="rules" ref="smokeRef">
                <u-form-item prop="fdYear">
                  <u-input border="none" type="number" v-model="form.fdYear"></u-input>
                </u-form-item>
              </u-form>
              <view style="width: 192rpx">年</view>
            </view>
          </view>

          <u-line color="#fff"></u-line>
        </view>
        <u-form-item
          label="有无饮酒史"
          prop="fdAlcohol"
          borderBottom
          labelWidth="250rpx"
          required
        >
          <u-radio-group v-model="form.fdAlcohol">
            <view class="width flex j-end">
              <u-radio
                :customStyle="{ marginRight: '30rpx' }"
                label="有"
                name="有"
              ></u-radio>
              <u-radio
                :customStyle="{ marginRight: '30rpx' }"
                label="无"
                name="无"
              ></u-radio>
            </view>
          </u-radio-group>
        </u-form-item>
        <u-form-item
          label="燃煤接触史"
          prop="fdCoal"
          borderBottom
          labelWidth="250rpx"
          required
        >
          <u-radio-group v-model="form.fdCoal">
            <view class="width flex j-end">
              <u-radio
                :customStyle="{ marginRight: '30rpx' }"
                label="有"
                name="有"
              ></u-radio>
              <u-radio
                :customStyle="{ marginRight: '30rpx' }"
                label="无"
                name="无"
              ></u-radio>
            </view>
          </u-radio-group>
        </u-form-item>
        <u-form-item
          label="是否初治"
          prop="fdTreatment"
          borderBottom
          labelWidth="250rpx"
          required
        >
          <u-radio-group v-model="form.fdTreatment">
            <view class="width flex j-end">
              <u-radio
                :customStyle="{ marginRight: '30rpx' }"
                label="是"
                name="是"
              ></u-radio>
              <u-radio
                :customStyle="{ marginRight: '30rpx' }"
                label="否"
                name="否"
              ></u-radio>
            </view>
          </u-radio-group>
        </u-form-item>
        <!-- <view class="item-box" v-if="form.fdTreatment=='否'">
					<view class="width flex j-c">
						<view class="label">手术日期</view>
						<view class="flex" style="width: 350rpx;">
							<u--input type="number" border="none" v-model="form.fdOperationDate" placeholder="请输入年月日"
								@focus.prevent="showPicker"></u--input>
							<u-datetime-picker :show="showDatePicker" v-model="confirmData" mode="date"
								:formatter="formatter" @cancel="showDatePicker=false"
								@confirm="confirmDate" ref="datetimePicker"></u-datetime-picker>
						</view>
					</view>
				</view> -->
        <u-form-item
          label="既往患癌史"
          prop="fdCancerHistory"
          borderBottom
          labelWidth="250rpx"
          required
        >
          <u-radio-group v-model="form.fdCancerHistory">
            <view class="width flex j-end">
              <u-radio
                :customStyle="{ marginRight: '30rpx' }"
                label="有"
                name="有"
              ></u-radio>
              <u-radio
                :customStyle="{ marginRight: '30rpx' }"
                label="无"
                name="无"
              ></u-radio>
            </view>
          </u-radio-group>
        </u-form-item>
        <view class="item-box" v-if="form.fdCancerHistory === '有'">
          <view class="width flex j-c">
            <view class="label">患癌史</view>
            <view class="flex" style="width: 300rpx">
              <u-form :model="form" :rules="rules" ref="smokeRef1">
                <u-form-item prop="fdIsCancer">
                  <u-input
                    border="none"
                    v-model="form.fdIsCancer"
                    placeholder="请输入内容"
                  ></u-input>
                </u-form-item>
              </u-form>
            </view>
          </view>

          <u-line color="#fff"></u-line>
        </view>
        <u-form-item
          label="近期化疗史"
          prop="fdChemotherapy"
          borderBottom
          labelWidth="250rpx"
          required
        >
          <u-radio-group v-model="form.fdChemotherapy">
            <view class="width flex j-end">
              <u-radio
                :customStyle="{ marginRight: '30rpx' }"
                label="有"
                name="有"
              ></u-radio>
              <u-radio
                :customStyle="{ marginRight: '30rpx' }"
                label="无"
                name="无"
              ></u-radio>
            </view>
          </u-radio-group>
        </u-form-item>
        <u-form-item
          label="是否接受过骨髓移植"
          prop="boneIs"
          borderBottom
          labelWidth="250rpx"
          required
        >
          <u-radio-group v-model="form.boneIs">
            <view class="width flex j-end">
              <u-radio
                :customStyle="{ marginRight: '30rpx' }"
                label="是"
                name="是"
              ></u-radio>
              <u-radio
                :customStyle="{ marginRight: '30rpx' }"
                label="否"
                name="否"
              ></u-radio>
            </view>
          </u-radio-group>
        </u-form-item>
        <u-form-item
          label="近期是否接受过输血"
          prop="isTransfusion"
          borderBottom
          labelWidth="250rpx"
          required
        >
          <u-radio-group v-model="form.isTransfusion">
            <view class="width flex j-end">
              <u-radio
                :customStyle="{ marginRight: '30rpx' }"
                label="是"
                name="是"
              ></u-radio>
              <u-radio
                :customStyle="{ marginRight: '30rpx' }"
                label="否"
                name="否"
              ></u-radio>
            </view>
          </u-radio-group>
        </u-form-item>
        <u-form-item
          label="靶向治疗史"
          prop="egfris"
          borderBottom
          labelWidth="250rpx"
          required
        >
          <u-radio-group v-model="form.egfris">
            <view class="width flex j-end">
              <u-radio
                :customStyle="{ marginRight: '30rpx' }"
                label="有"
                name="有"
              ></u-radio>
              <u-radio
                :customStyle="{ marginRight: '30rpx' }"
                label="无"
                name="无"
              ></u-radio>
            </view>
          </u-radio-group>
        </u-form-item>
        <view class="item-box" v-if="form.egfris == '有'">
          <view class="width flex j-c">
            <view class="label">用药中</view>
            <view class="flex" style="width: 300rpx">
              <u-form :model="form" :rules="rules" ref="smokeRef2">
                <u-form-item prop="monthgo">
                  <u-input border="none" type="number" v-model="form.monthgo"></u-input>
                </u-form-item>
              </u-form>
              <view style="width: 192rpx">月</view>
            </view>
          </view>
          <u-line color="#fff"></u-line>
          <view class="width flex j-c">
            <view class="label">停药后</view>
            <view class="flex" style="width: 300rpx">
              <u-form :model="form" :rules="rules" ref="smokeRef3">
                <u-form-item prop="monthendend">
                  <u-input border="none" type="number" v-model="form.monthendend"></u-input>
                </u-form-item>
              </u-form>
              <view style="width: 192rpx">月</view>
            </view>
          </view>
          <u-line color="#fff"></u-line>
          <view class="width flex j-c">
            <view class="label">药物名称</view>
            <view class="flex" style="width: 300rpx">
              <u-form :model="form" :rules="rules" ref="smokeRef4">
                <u-form-item prop="egfrName">
                  <u-input border="none" v-model="form.egfrName"></u-input>
                </u-form-item>
              </u-form>
            </view>
          </view>
        </view>
        <u-line color="#fff"></u-line>
        <!-- <u-form-item label="EGFR-TKI用药史" prop="egfris" borderBottom labelWidth="400rpx">
					<u-radio-group v-model="form.egfris">
						<view class="width flex j-end">
							<u-radio :customStyle="{marginRight: '30rpx'}" label="是" name='是'></u-radio>
							<u-radio :customStyle="{marginRight: '30rpx'}" label="否" name='否'></u-radio>
						</view>
					</u-radio-group>
				</u-form-item> -->
        <!-- <u-form-item label="当前是否进展(影像学或临床评估)" prop="fdCoal" borderBottom labelWidth="250rpx">
					<u-radio-group v-model="form.fdCoal">
						<view class="width flex j-end">
							<u-radio :customStyle="{marginRight: '30rpx'}" label="是" name='是'></u-radio>
							<u-radio :customStyle="{marginRight: '30rpx'}" label="否" name='否'></u-radio>
						</view>
					</u-radio-group>
				</u-form-item> -->
        <u-form-item
          label="是否转移"
          prop="fdTransfer"
          borderBottom
          labelWidth="250rpx"
          required
        >
          <u-radio-group v-model="form.fdTransfer">
            <view class="width flex j-end">
              <u-radio
                :customStyle="{ marginRight: '30rpx' }"
                label="是"
                name="是"
              ></u-radio>
              <u-radio
                :customStyle="{ marginRight: '30rpx' }"
                label="否"
                name="否"
              ></u-radio>
            </view>
          </u-radio-group>
        </u-form-item>
        <u-form-item
          label="慢性病史"
          prop="fdChronic"
          borderBottom
          labelWidth="250rpx"
          required
        >
          <u-radio-group v-model="form.fdChronic">
            <view class="width flex j-end">
              <u-radio
                :customStyle="{ marginRight: '30rpx' }"
                label="有"
                name="有"
              ></u-radio>
              <u-radio
                :customStyle="{ marginRight: '30rpx' }"
                label="无"
                name="无"
              ></u-radio>
            </view>
          </u-radio-group>
        </u-form-item>
        <view class="item-box" v-if="form.fdChronic == '有'">
          <view class="width flex j-c">
            <view class="label">何种疾病</view>
            <view class="flex" style="width: 300rpx">
              <u-form :model="form" :rules="rules" ref="smokeRef5">
                <u-form-item prop="fdChronicName">
                  <u-input
                    border="none"
                    v-model="form.fdChronicName"
                    placeholder="请输入内容"
                  ></u-input>
                </u-form-item>
              </u-form>
            </view>
          </view>
        </view>
        <!-- <view class="item-box" v-if="form.fdChronic == '无'">
          <view class="width flex j-c">
            <view class="label">其他疾病史</view>
            <view class="flex" style="width: 300rpx">
              <u-form :model="form" :rules="rules" ref="smokeRef6">
                <u-form-item prop="fdDiseases">
                  <u-input
                    border="none"
                    v-model="form.fdDiseases"
                    placeholder="请输入内容"
                  ></u-input>
                </u-form-item>
              </u-form>
            </view>
          </view>
        </view> -->
        <u-form-item label="肿瘤家族史" prop="fdFamily" labelWidth="250rpx" required>
          <u-radio-group v-model="form.fdFamily">
            <view class="width flex j-end">
              <u-radio
                :customStyle="{ marginRight: '30rpx' }"
                label="有"
                name="有"
              ></u-radio>
              <u-radio
                :customStyle="{ marginRight: '30rpx' }"
                label="无"
                name="无"
              ></u-radio>
            </view>
          </u-radio-group>
        </u-form-item>
        <view class="item-box" v-if="form.fdFamily == '有'">
          <view class="width flex j-c">
            <view class="label">申请者与该亲属的关系</view>
            <view class="flex" style="width: 300rpx">
              <u-form :model="form" :rules="rules" ref="smokeRef7">
                <u-form-item prop="fdRelationship">
                  <u-input
                    
                    border="none"
                    v-model="form.fdRelationship"
                    placeholder="请输入内容"
                  ></u-input>
                </u-form-item>
              </u-form>
            </view>
          </view>
          <u-line color="#fff"></u-line>
          <view class="width flex j-c">
            <view class="label">该亲属患何种癌</view>
            <view class="flex" style="width: 300rpx">
              <u-form :model="form" :rules="rules" ref="smokeRef8">
                <u-form-item prop="fdRelationCancer">
                  <u-input
                    border="none"
                    v-model="form.fdRelationCancer"
                    placeholder="请输入内容"
                  ></u-input>
                </u-form-item>
              </u-form>
            </view>
          </view>
          <u-line color="#fff"></u-line>
          <view class="width flex j-c">
            <view class="label">亲属姓名</view>
            <view class="flex" style="width: 300rpx">
              <u-form :model="form" :rules="rules" ref="smokeRef9">
                <u-form-item prop="fdRelationName">
                  <u-input
                    border="none"
                    v-model="form.fdRelationName"
                    placeholder="请输入内容"
                  ></u-input>
                </u-form-item>
              </u-form>
            </view>
          </view>
          <u-line color="#fff"></u-line>
          <view class="width flex j-c">
            <view class="label">亲属分子检测情况</view>
            <view class="flex" style="width: 300rpx">
              <u-form :model="form" :rules="rules" ref="smokeRef10">
                <u-form-item prop="fdRelationCondition">
                  <u-input
                    border="none"
                    v-model="form.fdRelationCondition"
                    placeholder="请输入内容"
                  ></u-input>
                </u-form-item>
              </u-form>
            </view>
          </view>
        </view>
      </u--form>
    </view>

    <view class="out m-t3">注：平台严格保密您的个人信息</view>

    <view class="btn-box m-t3">
      <view class="btn bg1" @click="next(1)">上一步</view>
      <view class="btn bg2" @click="submit">确认</view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      show: false,
      showDatePicker: false, //手术时间选择
      confirmData: Number(new Date()),

      form: {
        fdIsCancer: "",
        fdDiseases: "",
        fdChronicName: "",
        egfrName: "",
        monthgo: "",
        fdSmoke: "",
        fdYear: "",
        fdPer: "",
        fdOperationDate: "",
        fdAlcohol: "",
        // fdTreatment: '',
        fdChemotherapy: "",
        boneIs: "",
        egfris: "",
        fdCoal: "",
        fdTreatment: "",
        isTransfusion: "",
        fdFamily: "",
        fdRelationship: "",
        fdRelationCancer: "",
        fdRelationName: "",
        fdRelationCondition: "",
        fdTreatment1: "",
        fdCoal: "",
        fdCancerHistory: "",
        fdChronic: "",
        fdTransfer: "",
      },

      rules: {
        fdSmoke: {
          type: "string",
          required: true,
          message: "请选择吸烟史",
          trigger: ["blur", "change"],
        },
        fdYear: [
          {
            pattern: /^[0-9a-zA-Z]*$/g,
            // 正则检验前先将值转为字符串
            transform(value) {
              return String(value);
            },
            message: "只能包含字母或数字",
          },
          {
            required: true,
            message: "请输入",
            trigger: ["blur", "change"],
          },
        ],
        fdAlcohol: {
          type: "string",
          required: true,
          message: "请选择饮酒史",
          trigger: ["blur", "change"],
        },
        fdCoal: {
          type: "string",
          required: true,
          message: "请选择燃煤接触史",
          trigger: ["blur", "change"],
        },
        fdTreatment: {
          type: "string",
          required: true,
          message: "是否初治",
          trigger: ["blur", "change"],
        },
        fdCancerHistory: {
          type: "string",
          required: true,
          message: "请选择既往患癌史",
          trigger: ["blur", "change"],
        },
        fdChemotherapy: {
          type: "string",
          required: true,
          message: "请选择近期化疗史",
          trigger: ["blur", "change"],
        },
        boneIs: {
          type: "string",
          required: true,
          message: "是否接受过骨髓移植",
          trigger: ["blur", "change"],
        },
        isTransfusion: {
          type: "string",
          required: true,
          message: "近期是否接受过输血",
          trigger: ["blur", "change"],
        },
        egfris: {
          type: "string",
          required: true,
          message: "请选择靶向治疗史",
          trigger: ["blur", "change"],
        },
        fdTransfer: {
          type: "string",
          required: true,
          message: "是否转移",
          trigger: ["blur", "change"],
        },
        fdChronic: {
          type: "string",
          required: true,
          message: "请选择慢性病史",
          trigger: ["blur", "change"],
        },
        fdFamily: {
          type: "string",
          required: true,
          message: "请选择肿瘤家族史",
          trigger: ["blur", "change"],
        },
        fdIsCancer: {
          type: "string",
          required: true,
          message: "请输入",
          trigger: ["blur", "change"],
        },
        fdRelationship: {
          type: "string",
          required: true,
          message: "请输入",
          trigger: ["blur", "change"],
        },
        fdRelationCancer: {
          type: "string",
          required: true,
          message: "请输入",
          trigger: ["blur", "change"],
        },
        fdRelationName: {
          type: "string",
          required: true,
          message: "请输入",
          trigger: ["blur", "change"],
        },
        fdRelationCondition: {
          type: "string",
          required: true,
          message: "请输入",
          trigger: ["blur", "change"],
        },
        monthgo: {
          type: "string",
          required: true,
          message: "请输入",
          trigger: ["blur", "change"],
        },
        monthendend: {
          type: "string",
          required: true,
          message: "请输入",
          trigger: ["blur", "change"],
        },
        egfrName: {
          type: "string",
          required: true,
          message: "请输入",
          trigger: ["blur", "change"],
        },
        fdChronicName: {
          type: "string",
          required: true,
          message: "请输入",
          trigger: ["blur", "change"],
        },
        fdDiseases: {
          type: "string",
          required: true,
          message: "请输入",
          trigger: ["blur", "change"],
        },
      },

      relation: [["门诊病人", "住院病人"]],
    };
  },

  methods: {
    next(e) {
      this.$emit("next", e);
    },
    submit() {
      this.commitLoading = true;
      // if (this.form.fdSmoke === '有') {
      // 	this.$refs.smokeRef.validate()
      // }
      // if (this.form.fdCancerHistory === '有') {
      // 	this.$refs.smokeRef1.validate()
      // }

      console.log(this.$refs.smokeRef, 888);

       
		let validatePromises = [];
		
			validatePromises.push(this.$refs.form.validate())

            if (this.form.fdSmoke === "有") {
              validatePromises.push(this.$refs.smokeRef.validate());
            }
            if (this.form.fdCancerHistory === "有") {
              validatePromises.push(this.$refs.smokeRef1.validate());
            }
            if (this.form.egfris === "有") {
              validatePromises.push(this.$refs.smokeRef2.validate());
              validatePromises.push(this.$refs.smokeRef3.validate());
              validatePromises.push(this.$refs.smokeRef4.validate());
            }
            if (this.form.fdChronic === "有") {
              validatePromises.push(this.$refs.smokeRef5.validate());
            }
            // if (this.form.fdChronic === "无") {
            //   validatePromises.push(this.$refs.smokeRef6.validate());
            // }
            if (this.form.fdFamily === "有") {
              validatePromises.push(
                this.$refs.smokeRef7.validate(),
                this.$refs.smokeRef8.validate(),
                this.$refs.smokeRef9.validate(),
                this.$refs.smokeRef10.validate()
              );
            }

            Promise.all(validatePromises)
              .then(() => {
                this.$emit("submit");
              })
              .catch((error) => {
                console.log("表单验证出错");
                console.log(error);
              });

            // this.$refs.smokeRef.validate()
            // this.$refs.smokeRef1.validate()
            // this.$refs.smokeRef2.validate()
            // this.$refs.smokeRef3.validate()
            // this.$refs.smokeRef4.validate()
            // this.$refs.smokeRef5.validate()
            // this.$refs.smokeRef6.validate()
            // this.$refs.smokeRef7.validate()
            // this.$refs.smokeRef8.validate()
            // this.$refs.smokeRef9.validate()
            // this.$refs.smokeRef10.validate()
            // this.$emit("submit");
       
    },
    confirm(e) {
      this.form.fdNation = e.value[0];
      this.show = false;
    },
    formatter(type, value) {
      if (type === "year") {
        return `${value}年`;
      }
      if (type === "month") {
        return `${value}月`;
      }
      if (type === "day") {
        return `${value}日`;
      }
      return value;
    },

    confirmDate(e) {
      const timestamp = e.value;
      const date = new Date(timestamp); // 创建Date对象
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0"); // 使用padStart()补0
      const day = String(date.getDate()).padStart(2, "0"); // 使用padStart()补0

      const formattedDate = `${year}-${month}-${day}`; // 使用模板字面量语法拼接字符串

      console.log(formattedDate);
      this.form.fdOperationDate = formattedDate;
      this.showDatePicker = false;
    },
    showPicker(event) {
      this.showDatePicker = true;
    },
  },
  onReady() {
    //onReady 为uni-app支持的生命周期之一
    this.$refs.form.setRules(this.rules);
  },
};
</script>

<style scoped lang="scss">
.u-form {
  padding: 30rpx;
  box-sizing: border-box;
  background: #fff;
  border-radius: 20rpx;
}

.out {
  color: #ff5252ff;
  font-size: 28rpx;
}

.btn-box {
  width: 100%;
  height: 80rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .btn {
    width: 320rpx;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 80rpx;
    font-size: 36rpx;
  }
}

.bg1 {
  color: #3b7effff;
  background: rgba(40, 120, 255, 0.1);
}

.bg2 {
  color: #fff;
  background: linear-gradient(135deg, #00deff 0%, #0c5fff 100%);
}

.item-box {
  width: 100%;
  min-height: 80rpx;
  background: #f8f8f8ff;
  padding: 0 20rpx;
  box-sizing: border-box;
  margin-bottom: 20rpx;

  .label {
    font-size: 30rpx;
    color: #000;
    line-height: 80rpx;
    white-space: nowrap;
  }
}
</style>
