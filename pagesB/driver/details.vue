<template>
  <view>
    <ut-nav title="样本详情" border=""></ut-nav>
    <view class="orderSn">申请单号：{{ info.orderSn }}</view>
    <view style="padding-bottom: 130rpx">
      <view class="ul">
        <view class="li" v-for="(item, index) in dataList" :key="index">
          <view class="yb">样本 {{ index + 1 }}</view>
          <view class="title">{{ item.geneSample.fdSampleCode }}</view>
          <view class="item">
            <view class="x">姓名：{{ item.geneApply.fdName }}</view>
            <view class="d">申请时间：{{ item.geneSample.fdRegisterDate }}</view>
          </view>
          <view class="item" v-if="item.genePro.fdProjectName">
            <view class="d">送检项目：{{ item.genePro.fdProjectName || "" }}</view>
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
      <view class="btn1" @click="isShow = true" v-if="info.status == 1 && driver"
        >确认</view
      >
      <view class="btn1" @click="isModal = true" v-if="info.status == 2 && driver"
        >取件</view
      >
      <!-- <view class="btn1" @click="jump()" v-if="info.status == 3">查看物流</view> -->
      <view
        class="btn1"
        @click="jump()"
        v-if="(info.status == 3||info.status ==4) && (driver || doctor)"
        >查看物流</view
      >
      <!-- <view class="btn1" @click="print(info)" v-if="info.status >2">打印条码</view> -->
      <view class="btn1" @click="startSearch()" v-if="info.status == 3||info.status ==2 && driver"
        >打印条码</view
      >
    </view>
    <u-modal
      :show="isShow"
      :content="content"
      showCancelButton
      @cancel="isShow = false"
      @confirm="myConfirm"
    ></u-modal>

    <u-popup :show="isModal" mode="center" :round="10" @close="close">
      <view class="popup">
        <view class="title">确认取件</view>
        <view class="m-t2">
          <u-input v-model="bwxCode" placeholder="请输入保温箱编号">
            <template slot="suffix">
              <u-button
                type="success"
                size="mini"
                icon="scan"
                text="扫一扫"
                @click="scanCode"
              ></u-button>
            </template>
          </u-input>
        </view>
        <div class="footer">
          <view class="btn gray" @click="isModal = false">取消</view>
          <view class="btn blue" @click="onSend">确定</view>
        </div>
      </view>
    </u-popup>

    <u-popup
      :show="luetoothShow"
      @close="luetoothClose"
      closeable
      :closeOnClickOverlay="false"
      mode="bottom"
      :round="10"
    >
      <view class="ly-popup">
        <view class="h1">打印机设备</view>
        <view class="m-t2">
          <u-cell-group>
            <block v-for="(item, index) in list" :key="index">
              <u-cell
                size="large"
                @click="bindViewTap(item)"
                :title="item.name"
                isLink
              ></u-cell>
            </block>
          </u-cell-group>
        </view>
      </view>
    </u-popup>
  </view>
</template>

<script>
import { sendOrderDetails, confirmOrder, sendOrder } from "@/api/order.js";
import tsc from "./utils/tsc.js";
export default {
  data() {
    return {
      driver: false,
      doctor: false,
      id: "",
      isModal: false,
      isShow: false,
      bwxCode: "",
      info: {},
      dataList: [],
      content: "确认样本信息",
      oneTimeData: 0,
      looptime: 0,
      lastData: 0,
      currentTime: 1,
      currentPrint: 1,
      isLabelSend: false,
      printerNum: 1,
      buffSize: [],
      printNum: [],

      list: [],
      services: [],
      serviceId: 0,
      writeCharacter: false,
      readCharacter: false,
      notifyCharacter: false,
      isScanning: false,

      luetoothShow: false,
    };
  },
  onLoad(options) {
    const userType = uni.getStorageSync("storage_data").vuex_roles;
    console.log(userType, 999);
    if (userType.includes("driver")) {
      this.driver = true;
      console.log(this.driver, 876);
    }
    if (userType.includes("doctor")) {
      this.doctor = true;
    }
    console.log("id", options.id);
    if (options.id) {
      this.id = options.id;
      this.getDetails();
    }
  },
  onReady() {
    var list = [];
    var numList = [];
    var j = 0;
    for (var i = 20; i < 200; i += 10) {
      list[j] = i;
      j++;
    }
    for (var i = 1; i < 10; i++) {
      numList[i - 1] = i;
    }
    this.buffSize = list;
    this.oneTimeData = list[0];
    this.printNum = numList;
    this.printerNum = numList[0];
  },
  methods: {
    getDetails() {
      sendOrderDetails(this.id).then((res) => {
        if (res.code == 200) {
          this.info = res.data.order;
          console.log(this.info);
          this.dataList = res.data.messageList;
        }
      });
    },

    close() {
      this.isModal = false;
    },
    onSend() {
      if (!this.bwxCode) {
        this.$ut.showText("请输入保温箱编号");
        return;
      } else {
        sendOrder(this.id, this.bwxCode).then((res) => {
          if (res.code == 200) {
            this.$ut.showText("寄送成功");
            setTimeout(() => {
              uni.navigateBack();
            }, 1500);
          }
        });
      }
    },
    myConfirm() {
      confirmOrder(this.id).then((res) => {
        if (res.code == 200) {
          this.$ut.showText("确认成功");
          setTimeout(() => {
            uni.navigateBack();
          }, 1500);
        }
      });
    },
    scanCode() {
      var this_ = this;
      uni.scanCode({
        success(res) {
          // console.log('scanCode--', res.result)
          this_.bwxCode = res.result;
        },
      });
    },
    jump() {
      uni.navigateTo({
        url: "/pagesB/order/mapFlow?id=" + this.id,
      });
    },
    luetoothClose() {
      this.list.length = 0;
      this.luetoothShow = false;
    },

    print() {
      var that = this;
      var e = that.info;
      // var canvasWidth = that.canvasWidth
      // var canvasHeight = that.canvasHeight
      var dateTime = new Date();
      //获得系统年份;
      var year = dateTime.getFullYear();
      //获得系统月份;
      var month = dateTime.getMonth() + 1;
      //获得系统当月分天数;
      var day = dateTime.getDate();
      //获得系统小时;
      var hours = dateTime.getHours();
      //获得系统分钟;
      var minutes = dateTime.getMinutes();
      //获得系统秒数;
      var second = dateTime.getSeconds();

      minutes < 10 ? (minutes = "0" + minutes) : minutes;
      second < 10 ? (second = "0" + second) : second;
      var currentTime =
        year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + second;
      // console.log('++',currentTime)

      var command = tsc.jpPrinter.createNew();
      command.setCls(); //清除缓冲区，防止下一个没生效
      command.setSize(60, 40); //设置标签大小，单位mm.具体参数请用尺子量一下
      command.setGap(0); //设置两个标签之间的间隙，单位mm.具体参数请用尺子量一下
      command.setCls(); //清除缓冲区
      command.setBox(10, 10, 420, 300, 5); //绘制一个边框
      command.setText(20, 40, "TSS20.BF2", 0, 1, 1, "送检医院：" + e.sendOrg); //绘制文字
      command.setText(20, 80, "TSS20.BF2", 0, 1, 1, "检测医院：" + e.receiveOrg); //绘制文字
      command.setText(20, 120, "TSS20.BF2", 0, 1, 1, "送检日期：" + currentTime); //绘制文字
      command.setText(20, 160, "TSS20.BF2", 0, 1, 1, "物流编号：" + e.orderSn); //绘制文字
      command.setText(20, 200, "TSS20.BF2", 0, 1, 1, "物流负责人：朱坤凤"); //绘制文字
      command.setText(20, 240, "TSS20.BF2", 0, 1, 1, "电话：18087969463"); //绘制文字

      // command.setBar(300, 80, 5, 150); //绘制一条黑线
      command.setQrcode(300, 155, "L", 5, "A", e.orderSn); //绘制一个二维码
      command.setPagePrint(); //执行打印指令

      this.isLabelSend = true;
      // return
      that.prepareSend(command.getData());
    },
    //准备发送，根据每次发送字节数来处理分包数量
    prepareSend(buff) {
      // console.log('buff-1:', buff)
      var that = this;
      var time = that.oneTimeData;
      var looptime = parseInt(buff.length / time);
      var lastData = parseInt(buff.length % time);
      //console.log(looptime + "---" + lastData)
      that.looptime = looptime + 1;
      that.lastData = lastData;
      that.currentTime = 1;
      that.Send(buff);
    },
    Send(buff) {
      var that = this;
      var currentTime = that.currentTime;
      var loopTime = that.looptime;
      var lastData = that.lastData;
      var onTimeData = that.oneTimeData;
      var printNum = that.printerNum;
      var currentPrint = that.currentPrint;
      var buf;
      var dataView;
      if (currentTime < loopTime) {
        buf = new ArrayBuffer(onTimeData);
        dataView = new DataView(buf);
        for (var i = 0; i < onTimeData; ++i) {
          dataView.setUint8(i, buff[(currentTime - 1) * onTimeData + i]);
        }
      } else {
        buf = new ArrayBuffer(lastData);
        dataView = new DataView(buf);
        for (var i = 0; i < lastData; ++i) {
          dataView.setUint8(i, buff[(currentTime - 1) * onTimeData + i]);
        }
      }
      // console.log("第" + currentTime + "次发送数据大小为：" + buf.byteLength)

      wx.writeBLECharacteristicValue({
        deviceId: that.$store.getters.getDeviceId,
        serviceId: that.$store.getters.getWriteServiceId,
        characteristicId: that.$store.getters.getWriteCharaterId,
        value: buf,
        writeType: "writeNoResponse",
        success: function (res) {
          // console.log('deviceId++', that.$store.getters.getDeviceId)
          // console.log('serviceId++', that.$store.getters.getWriteServiceId)
          // console.log('characteristicId++', that.$store.getters.getWriteCharaterId)
          // console.log('value++', buf)
          // console.log('11', currentPrint, '22', printNum)
          if (currentPrint == printNum) {
            that.luetoothShow = false;
            that.list = [];
            wx.showToast({
              title: "打印成功",
            });
          }
        },
        fail: function (e) {
          console.log("err-", e);
          wx.showToast({
            title: "打印失败",
            icon: "none",
          });
        },
        complete: function () {
          currentTime++;
          // console.log('currentTime', currentTime)
          if (currentTime <= loopTime) {
            that.currentTime = currentTime;

            that.Send(buff);
          } else {
            // wx.showToast({
            //   title: '已打印第' + currentPrint + '张',
            // })`
            if (currentPrint == printNum) {
              that.looptime = 0;
              that.lastData = 0;
              that.currentTime = 1;
              that.isLabelSend = false;
              that.currentPrint = 1;
            } else {
              currentPrint++;
              that.currentPrint = currentPrint;
              that.currentTime = 1;
              that.Send(buff);
            }
          }
        },
      });
    },

    //自动连接打印机
    startSearch() {
      var that = this;
      wx.openBluetoothAdapter({
        success: function (res) {
          wx.getBluetoothAdapterState({
            success: function (res) {
              console.log("openBluetoothAdapter success", res);
              if (res.available) {
                if (res.discovering) {
                  wx.stopBluetoothDevicesDiscovery({
                    success: function (res) {
                      console.log(res);
                    },
                  });
                } else {
                  // that.startBluetoothDevicesDiscovery()
                  that.getBluetoothDevices();
                }
                // that.checkPemission()
              } else {
                wx.showModal({
                  title: "提示",
                  content: "本机蓝牙不可用",
                  showCancel: false,
                });
              }
            },
          });
        },
        fail: function () {
          // if (res.errCode === 10001) {
          //   wx.onBluetoothAdapterStateChange(function (res) {
          //     console.log('onBluetoothAdapterStateChange', res)
          //     if (res.available) {
          //       this.startBluetoothDevicesDiscovery()
          //     }
          //   })
          // }

          wx.showModal({
            title: "提示",
            content: "蓝牙初始化失败，请到设置打开蓝牙",
            showCancel: false,
          });
        },
      });
    },
    getBluetoothDevices() {
      var that = this;
      console.log("start search", that.$store.getters.getDeviceId);
      if (that.$store.getters.getDeviceId) {
        that.print();
      } else {
        wx.showLoading({
          title: "正在搜索设备",
          icon: "loading",
        });
        that.isScanning = true;
        wx.startBluetoothDevicesDiscovery({
          success: function (res_) {
            setTimeout(function () {
              wx.getBluetoothDevices({
                success: function (res) {
                  that.list.length = 0;
                  var devices = [];
                  var num = 0;
                  res.devices.forEach((item, index) => {
                    if (item.name.includes("GP-M322")) {
                      devices[num] = res.devices[index];
                      num++;
                      console.log("index:", index);
                    }
                  });
                  console.log("devices:", devices);
                  that.list = devices;
                  that.isScanning = false;

                  wx.hideLoading();
                  wx.stopPullDownRefresh();
                  wx.stopBluetoothDevicesDiscovery({
                    success: function (res) {
                      console.log("停止搜索蓝牙");
                    },
                  });
                  that.luetoothShow = true;
                  // if(that.list.length>0){
                  // 	that.bindViewTap()
                  // }
                },
              });
            }, 5000);
          },
        });
      }
    },
    //连接设备
    bindViewTap(e) {
      var that = this;
      wx.stopBluetoothDevicesDiscovery({
        success: function (res) {
          console.log(res);
        },
      });
      this.serviceId = 0;
      this.writeCharacter = false;
      this.readCharacter = false;
      this.notifyCharacter = false;
      // console.log(e.deviceId)
      wx.showLoading({
        title: "正在连接",
      });
      wx.createBLEConnection({
        deviceId: e.deviceId,
        success: function (res) {
          // console.log('res1',res)
          that.$store.commit("SET_DEVICEID", e.deviceId);
          // console.log('--deviceId:',that.$store.getters.getDeviceId)
          // app.BLEInformation.deviceId = e.deviceId
          that.getSeviceId();
          return;
        },

        fail: function (e) {
          // wx.showModal({
          // 	title: '提示',
          // 	content: '连接失败',
          // 	showCancel: false
          // })
          // console.log(e)
          wx.hideLoading();
        },
        complete: function (e) {
          console.log(e);
        },
      });
    },
    getSeviceId() {
      var that = this;
      var platform = that.$store.getters.getPlatform;
      wx.getBLEDeviceServices({
        deviceId: that.$store.getters.getDeviceId,
        success: function (res) {
          // console.log('--res:',res.services)

          that.services = res.services;
          that.getCharacteristics();
        },
        fail: function (e) {
          console.log(e);
        },
        complete: function (e) {
          console.log(e);
        },
      });
    },
    getCharacteristics() {
      var that = this;
      var list = that.services;
      var num = that.serviceId;
      var write = that.writeCharacter;
      var read = that.readCharacter;
      var notify = that.notifyCharacter;

      // console.log('--list--',list)
      // return
      wx.getBLEDeviceCharacteristics({
        deviceId: that.$store.getters.getDeviceId,
        serviceId: list[num].uuid,
        success: function (res) {
          console.log(res);
          for (var i = 0; i < res.characteristics.length; ++i) {
            var properties = res.characteristics[i].properties;
            var item = res.characteristics[i].uuid;
            if (!notify) {
              if (properties.notify) {
                that.$store.commit("SET_NOTIFYCHARATERID", item);
                that.$store.commit("SET_NOTIFYSERVICEID", list[num].uuid);
                notify = true;
              }
            }
            if (!write) {
              if (properties.write) {
                that.$store.commit("SET_WRITECHARATERID", item);
                that.$store.commit("SET_WRITESERVICEID", list[num].uuid);
                write = true;
              }
            }
            if (!read) {
              if (properties.read) {
                that.$store.commit("SET_READCHARATERID", item);
                that.$store.commit("SET_READSERVICEID", list[num].uuid);
                read = true;
              }
            }
          }
          if (!write || !notify || !read) {
            num++;
            that.writeCharacter = write;
            that.readCharacter = read;
            that.notifyCharacter = notify;
            that.serviceId = num;
            if (num == list.length) {
              wx.showModal({
                title: "提示",
                content: "找不到该读写的特征值",
                showCancel: false,
              });
            } else {
              that.getCharacteristics();
            }
          } else {
            wx.showToast({
              title: "连接成功",
            });
            setTimeout(() => {
              that.luetoothShow = false;
              that.print();
            }, 1000);
          }
        },
        fail: function (e) {
          console.log(e);
        },
        complete: function (e) {
          // console.log("write:" +  that.$store.getters.getWriteCharaterId)
          // console.log("read:" +  that.$store.getters.getReadCharaterId)
          // console.log("notify:" + that.$store.getters.getNotifyCharaterId)
        },
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
    padding-left: 15rpx;
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
    margin: 0 20rpx;
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
    margin: 0 20rpx;
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

.ly-popup {
  padding: 20rpx;
  box-sizing: border-box;
  min-height: 400rpx;
}

.h1 {
  text-align: center;
  line-height: 1.8;
}
</style>
