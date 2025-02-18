<template>
  <view class="application_container">
    <ut-nav title="获取纸质报告" border url="/pages/report/report"></ut-nav>
    <view class="address">
      <view class="addIcon">
        <u-icon name="map" size="16"></u-icon>
        <text class="person_address">收件人地址</text>
      </view>
      <view class="addressInfo" @click="addAdress" v-if="!id && !defaultShow">
        <view class="leftBox">
          <view class="radousBtn">收</view>
          <view class="person_text">填写收件人地址</view>
        </view>
        <view class="rightBox">
          <u-icon name="arrow-right" color="#999999" size="16"></u-icon>
        </view>
      </view>
      <view class="addressInfo" @click="addAdress" style="background-color: #fff" v-else>
        <view class="leftBox">
          <view class="radousBtn" style="background-color: #00c777">寄</view>
          <view class="person_text">
            <view
              >{{ form.name
              }}<text style="margin-left: 6rpx">{{ form.phoneNumber }}</text></view
            >
            <view class="address_small">{{ form.address }}</view>
          </view>
        </view>
        <view class="rightBox">
          <u-icon name="arrow-right" color="#999999" size="16"></u-icon>
        </view>
      </view>
    </view>

    <view class="reportList">
      <view class="electronicReport">
        <image
          src="../../static/images/baogao.png"
          style="width: 32rpx; height: 32rpx"
        ></image>
        <view class="elecText">电子报告</view>
      </view>

      <view style="overflow-y: scroll; max-height: 488rpx">
        <u-checkbox-group v-model="checkboxValue1" placement="column">
          <view
            v-for="(item, index) in checkboxList1"
            :key="index"
            class="viewContent"
            style="display: flex; align-items: center; border-bottom: 1rpx solid #f2f2f2"
          >
            <u-checkbox
              :name="item.id"
              :checked="item.checked"
              @change="choose(item)"
              shape="circle"
            />
            
            <view class="reportDetil">
              <view class="reportTitle">{{ item.projectName }}</view>
              <view class="reportContent">
              
                <view class="personInfo">
                  <view style="width: 230rpx">姓名：{{ item.fdName }}</view>
                  <text>性别：{{ item.sex }}</text>
                </view>
                <view class="see">
                  <view class="seeBtn" @click.stop="toShowPort(item)">查看</view>
                </view>
              </view>
            </view>
          </view>
        </u-checkbox-group>
      </view>
      <view class="footer">
        <u-checkbox-group>
          <u-checkbox
            :value="value"
            shape="circle"
            :checked="isAllChecked"
            @change="allChoose"
            class="allCheck"
          /><text>全选</text>
        </u-checkbox-group>
        <view class="selectNum"
          >已选<text style="color: #3b7eff; margin: 3rpx">{{ selectList.length }}</text
          >份
        </view>
      </view>
    </view>

    <view class="attention">注：运费为医院承担，用户无需付费 一份电子报告仅寄送一次</view>
    <view class="btn" @click="submit">确认申请</view>
  </view>
</template>

<script>
import { selectPersonalList, selectApplyCode } from "@/api/report.js";
import {
  addAddress,
  getAddres,
  updateInspectionAddress,
  deleteInspectionAddress,
  selectOne,
  selectDefaultAddress,
  sendReport,
  getDefaultAddressList,
  getNoPost
} from "@/api/hospitalrelated/hospitalrelated";
export default {
  data() {
    return {
      portId:'',
      id: "",
      defaultShow: false,
      checkboxValue1: [],
      isAllChecked: false,
      selectList: [],
      checkboxList1: [],
      form: {
        name: "",
        phoneNumber: "",
        city: "",
        address: "",
        defaultAddress: "",
        defaultSendAddress: "",
        userId: this.$store.getters.userId,
      },
    };
  },
  onLoad (optins) {
    console.log(optins.portId, 7777)
    this.portId = optins.portId;
    this.queryList(1, 100);
    this.id = optins.id;
    if (this.id) {
      this.getData();
    } else {
      this.getDefaultAddress();
    }
  },
  methods: {
    //获取选择的地址
    getData() {
      if (this.id != "") {
        selectOne(this.id).then((res) => {
          this.form.name = res.data.name;
          this.form.phoneNumber = res.data.phoneNumber;
          let index = res.data.address.lastIndexOf("-");
          this.form.address = res.data.address;
          this.form.city = res.data.address.slice(0, index);
          if (res.data.defaultAddress == 0) {
            this.checkbox = "收件地址";
          } else if (res.data.defaultSendAddress == 0) {
            this.checkbox = "寄件地址";
          }
        });
      }
    },
    //获取默认地址
    getDefaultAddress() {
      let userId = this.$store.getters.userId;
      getDefaultAddressList(userId).then((res) => {
        if (res.code == 200) {
          if (res.data.length > 0) {
            this.defaultShow = true;
            this.form.name = res.data[0].name;
            this.form.phoneNumber = res.data[0].phoneNumber;
            let index = res.data[0].address.lastIndexOf("-");
            this.form.address = res.data[0].address;
            this.form.city = res.data[0].address.slice(0, index);
            this.id = res.data[0].id
          }
        }
      });
    },
    addAdress() {
      // uni.navigateTo({
      // 	url: '/pagesA/inspect/address'
      // })
      this.$ut.jump("/pagesA/inspect/address");
    },
    // 反选
    choose(item) {
      //先进行取反,改变当前数据的checked状态
      item.checked = !item.checked;
      this.selectList = this.checkboxList1.filter((item) => {
        return item.checked == true;
      });
      console.log(this.selectList);
      // 是否全部选中
      let allSelected = this.checkboxList1.every((item) => item.checked === true);
      if (allSelected) {
        this.isAllChecked = true;
      } else {
        this.isAllChecked = false;
      }
    },
    //  全选
    allChoose() {
      console.log(this.checkboxValue1);
      this.isAllChecked = !this.isAllChecked;
      this.checkboxList1.map((item) => (item.checked = this.isAllChecked));
      this.selectList = this.checkboxList1.filter((item) => {
        return item.checked == true;
      });
    },
    queryList(pageNo, pageSize) {
      uni.showLoading();
      let params = {
        isAsc: "desc",
        orderByColumn: "create_time",
        pageNum: pageNo,
        pageSize: pageSize,
        reasonable: true,
        reportType: 0,
        // userId: this.$store.getters.userId
      };
      getNoPost()
        .then((res) => {
          uni.hideLoading();
          if (res.code == 200) {
            if (res.data.length > 0) {
              console.log(res.data, "res.data");

              const realDate = res.data.filter((item) => {
                return item.reportStatus > 3 && item.ext1 != 1;
              });
              const newItem = realDate.find(item=>item.id==this.portId)
              realDate.forEach((e) => {
                console.log(e.id,4454)
                console.log(this.id,5666)
                // if (e.id == this.portId) {
                //   e.checked = true;
                //   // this.choose(newItem)
                // } else {
                  e.checked = false;
                // }
              });
              this.checkboxList1 = realDate;
              this.choose(newItem)
            }
          }
        })
        .catch((err) => {
          uni.hideLoading();
        });
    },
    toShowPort (item) {
      console.log(item, 1111);
      let jsonStr = JSON.stringify(item)
      if (!item.reportUrl) {
        uni.showToast({
          title: "检测未完成，无法查看",
          icon: "none",
        });
      } else {
        uni.navigateTo({
          url: "/pages/report/showPortAgain?data=" +  encodeURIComponent(jsonStr),
        });
      }
    },
    submit() {
      if (!this.id && !this.defaultShow) {
        uni.showToast({
          icon: "none",
          title: "请选择寄件地址",
        });
        return;
      }
      if (this.selectList.length === 0) {
        uni.showToast({
          icon: "none",
          title: "请至少选择一份报告",
        });
        return;
      }
      const reportIds = [];
      this.selectList.forEach((item) => {
        reportIds.push(item.id.toString());
      });
      console.log(this.id, reportIds);
      uni.showLoading();
      sendReport({ addressId: this.id, reportIds })
        .then((res) => {
          if (res.code == 200) {
            uni.hideLoading();
            uni.showToast({
              icon: "none",
              title: "申请成功",
            });
            
            this.$ut.jump("/pagesA/inspect/success");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>

<style scoped lang="scss">
.viewContent:nth-child(1) {
  border-top: 1px solid #f2f2f2;
}

.footer {
  display: flex;
  align-items: center;

  .selectNum {
    margin-left: 70rpx;
    color: #999999;
    font-size: 24rpx;
  }
}

.allCheck {
  height: 36rpx;
  height: 36rpx;
  border-radius: 36rpx;
}

page {
  background-color: #f8f8f8;
}

.application_container {
  padding: 32rpx;

  .address {
    box-sizing: border-box;
    min-height: 246rpx;
    background: #ffffff;
    padding: 0 30rpx 30rpx 30rpx;
    border-radius: 20rpx;

    .addIcon {
      height: 100rpx;
      border-bottom: 2rpx solid #f2f2f2;
      margin-bottom: 30rpx;
      display: flex;
      align-items: center;

      .person_address {
        margin-left: 6rpx;
        font-weight: 600;
        color: #333333;
        // line-height: 32rpx;
        font-size: 28rpx;
      }
    }
  }

  .addressInfo {
    min-height: 80rpx;
    background: rgba(0, 199, 119, 0.08);
    border-radius: 10rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .leftBox {
      display: flex;
      align-items: center;
    }

    .radousBtn {
      min-width: 40rpx;
      height: 40rpx;
      background: #00c777;
      border-radius: 20rpx;
      font-weight: 550;
      color: #ffffff;

      line-height: 40rpx;
      text-align: center;
      margin: 0 20rpx;
      font-size: 24rpx;
      // text-align: center;
    }

    .person_text {
      font-weight: 600;
      color: #333333;
      // line-height: 32rpx;
      font-size: 28rpx;

      .address_small {
        font-size: 24rpx;
        color: #999;
        margin-top: 4rpx;
      }
    }

    .rightBox {
      display: flex;
      margin-right: 32rpx;
    }
  }

  //list
  .reportList {
    max-height: 920rpx;
    // overflow-y: scroll;
    background: #ffffff;
    border-radius: 20rpx;
    margin-top: 20rpx;
    padding: 0 30rpx 30rpx 30rpx;
    box-sizing: border-box;
    margin-bottom: 0 !important;

    //电子
    .electronicReport {
      height: 100rpx;
      display: flex;
      align-items: center;

      .elecText {
        margin-left: 4rpx;
        font-weight: 600;
        color: #333333;
        // line-height: 32rpx;
        font-size: 28rpx;
      }
    }

    /deep/.u-radio {
      margin-bottom: 0 !important;
    }

    //列表
    .reportDetil {
      display: flex;
      flex-direction: column;
      justify-content: center;
      height: 160rpx;
      width: 100%;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;

      .reportTitle {
        width: 80%;
        overflow: hidden;
        text-overflow: ellipsis;
        font-size: 32rpx;
        font-weight: 550;
        color: #000000;
        line-height: 38rpx;
      }

      .reportContent {
        display: flex;
        justify-content: space-between;

        .personInfo {
          font-size: 24rpx;
          color: #999;
          line-height: 40rpx;
          margin-top: 10rpx;
          display: flex;
          align-items: center;
        }
      }

      .see {
        display: flex;
        justify-content: center;
        align-items: center;
        .seeBtn {
          width: 75rpx;
          height: 40rpx;
          background: rgba(59, 126, 255, 0.1);
          border-radius: 10rpx;
          font-size: 24rpx;
          color: #3b7eff;
          text-align: center;
          line-height: 40rpx;
        }
      }
    }
  }
}

.footer {
  height: 104rpx;
}

.attention {
  width: 384rpx;
  color: #ff5252;
  margin-top: 30rpx;
  font-size: 24rpx;
}

.btn {
  height: 80rpx;
  background: linear-gradient(135deg, #00deff 0%, #0c5fff 100%);
  border-radius: 80rpx;
  align-items: center;
  line-height: 80rpx;
  font-size: 36rpx;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 80rpx;
  //   position: fixed;
  //   bottom: 0;
}
</style>
