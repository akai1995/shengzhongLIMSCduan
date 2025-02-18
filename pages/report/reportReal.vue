<template>
  <view>
    <view>
      <ut-nav title="报告列表" border url="/pages/index/index"></ut-nav>
      <view class="fixedTop">
        <view class="top_container">
          <view class="btn-box">
            <u-tabs :list="tabList" @click="tabsItem"></u-tabs>
          </view>
          <view class="add_report" @click="$ut.jump('/pages/report/addReport')"
            >添加报告</view
          >
        </view>
      </view>
    </view>
    <view class="content">
      <!-- <u-action-sheet :actions="tabList" @select="selectClick" :closeOnClickOverlay="true"
					:safeAreaInsetBottom="true" :closeOnClickAction="true" @close="isShow = false" cancelText="取消"
					:show="isShow"></u-action-sheet> -->
      <view>
        <view class="list" v-for="item in list" :key="item.id" @click="jumpPdf(item)">
          <view class="title">检测项目： {{ item.projectName || "" }}</view>
          <image
            class="ok"
            src="@/static/images/ok.png"
            mode=""
            v-if="item.reportStatus == '4' || item.reportStatus == '5'"
          ></image>
          <image
            class="ok"
            src="@/static/images/undo.png"
            mode=""
            v-else-if="item.reportStatus == '0'"
          >
          </image>
          <image class="ok" src="@/static/images/processing.png" mode="" v-else></image>
          <view class="info">
            <view class="t">姓名：{{ item.fdName }}</view>
            <view class="t">性别：{{ item.sex }}</view>
            <view class="t">年龄：{{ item.age }}岁</view>
          </view>

          <view class="text m-t2">
            <view class="label">检测时间：{{ $ut.strSlice(item.registerDate) }}</view>
            <view class="label">申请编码：{{ item.fdApplyCode }}</view>
          </view>
          <view class="text m-t2 j-c">
            <view class="label">检测医院：{{ item.hospital }}</view>
            <!-- <view class="get" v-if='item.reportStatus=="4"'>获取报告</view> -->
          </view>
          <!-- <view @click.stop="jumpDetails(item)">
							<view class="abc">
								<view class="tag" v-if="item.reportStatus>=4&&(item.analysisStatus == 0 || item.analysisStatus == null)">解读报告</view>
								<view class="tags" v-if="item.analysisStatus == 1">查看解读详情</view>
							</view>
						</view> -->
          <view class="m-t2 width">
            <scroll-view class="scroll" scroll-x>
              <u-steps
                :current="item.reportStatus == 4 ? 5 : item.reportStatus"
                activeIcon="checkmark-circle-fill"
                inactiveIcon="minus-circle"
              >
                <u-steps-item title="样本送检"></u-steps-item>
                <u-steps-item title="样本质控"></u-steps-item>
                <u-steps-item title="流程质控"></u-steps-item>
                <u-steps-item title="结果质控"></u-steps-item>
                <u-steps-item title="报告质控"></u-steps-item>
                <u-steps-item title="检测完成"></u-steps-item>
              </u-steps>
            </scroll-view>
          </view>
        </view>
      </view>
    </view>

    <!-- <template #bottom>
				<view class="box">
					<view class="button" @click="isShow = true">报告自助查询</view>
				</view>
			</template> -->
    <view v-if="no_more" class="no_more">没有更多了</view>
    <ut-nodata v-if="list.length==0"></ut-nodata>
  </view>
</template>

<script>
import { selectPersonalList, selectApplyCode } from "@/api/report.js";
import { showConfirm } from "@/utils/common";
export default {
  data() {
    return {
      status: 2,
      pageNo: 1,
      pageSize: 10,
      total: 0,
      no_more: false,
      list: [],
      isShow: false,
      tabList: [
        {
          name: "全部",
          type: 0,
        },
        {
          name: "本人",
          type: 1,
        },
        {
          name: "其他人",
          type: 2,
        },
      ],
      reportType: 0,
    };
  },
  // 下拉刷新
  // onPullDownRefresh() {
  //          this.queryList()
  //       },

  onShow () {
    this.list = [];
    uni.showLoading()
    this.pageNo = 1,
    this.pageNum =10
    console.log(555)
    let userId = this.$store.getters.userId;
    let idcard = this.$store.getters.idcard;
    let name = this.$store.getters.name;
    console.log("idcard", idcard);
    console.log("name", name);
		this.queryList();

    // if (userId.length == 0) {
    //   showConfirm("请登录").then((res) => {
    //     console.log(res, "-=");
    //     if (res.confirm) {
    //       uni.reLaunch({
    //         url: "/pages/login/login",
    //       });
    //     } else if (res.cancel) {
    //       uni.reLaunch({
    //         url: "/pages/index/index",
    //       });
    //     }
    //   });
    //   return;
    // }
    // this.queryList();
    // if (idcard.length > 0 && name.length > 0) {
    // 	this.list = []
    // } else {
    // 	let that = this
    // 	uni.showModal({
    // 		content: "尚未完善个人信息，请前往填写",
    // 		success(res) {
    // 			if (res.confirm) {
    // 				that.$ut.jump("/pagesA/user/editMyInformation")
    // 			} else if (res.cancel) {
    // 				uni.reLaunch({
    // 					url: '/pages/index/index'
    // 				})
    // 			}
    // 		}
    // 	})
    // }
    // if(idcard.length > 0 && name.length > 0 &&this.list.length===0){
    // 	let that = this
    // 	uni.showModal({
    // 		title:'添加报告',
    // 		content: "请添加检测人档案后查看报告",
    // 		success(res) {
    // 			if (res.confirm) {
    // 				that.$ut.jump("/pagesA/user/editMyInformation")
    // 			} else if (res.cancel) {
    // 				uni.reLaunch({
    // 					url: '/pages/index/index'
    // 				})
    // 			}
    // 		}
    // 	})
    // }
  },
  methods: {
    refreshData () {
      this.queryList()
    },
    queryList() {
      uni.showLoading();
      let params = {
        isAsc: "desc",
        orderByColumn: "create_time",
        pageNum: this.pageNo,
        pageSize: this.pageSize,
        reasonable: true,
        reportType: this.reportType,
        // userId: this.$store.getters.userId
      };
      let isLoading = false;
      selectPersonalList(params)
        .then((res) => {
          if (res.code == 200) {
            if (res.data.records.length > 0) {
              console.log(res.data, "res.data");
              this.list = [...this.list, ...res.data.records];
              this.pageNo = res.data.current;
              this.total = res.data.total;
            }
            if (this.reportType === 0 && this.list.length == 0) {
              uni.showModal({
                title: "添加报告",
                content: "请添加检测人档案后查看报告",
                success(res) {
                  if (res.confirm) {
                    that.$ut.jump("/pagesA/user/editMyInformation");
                  } else if (res.cancel) {
                    uni.reLaunch({
                      url: "/pages/index/index",
                    });
                  }
                },
              });
			  }
			  if (this.pageNo == 1) {
				setTimeout(() => {
					uni.hideLoading();
				}, 1000);
			  } else {
				uni.hideLoading();
			}
          }
        })
        .catch((err) => {
          uni.hideLoading();
        });
    },
    jump(item) {
      if (item.reportStatus == "4") {
        uni.navigateTo({
          url: "/pagesB/report/query?id=" + item.id,
        });
      }
      if (item.id == null) {
        uni.navigateTo({
          url: "/pagesB/report/query",
        });
      }
    },
    jumpPdf(item) {
      console.log(item, 1111);
      let jsonStr = JSON.stringify(item)
      if (!item.reportUrl) {
        uni.showToast({
          title: "检测未完成，无法查看",
          icon: "none",
        });
      } else {
        uni.navigateTo({
          url: "/pages/report/showPort?data=" +  encodeURIComponent(jsonStr),
        });
      }
      // let reportUrl = 'http://192.168.110.33:9300/statics/2023/07/04/file_1688435765151_20230704095605A002.pdf'
      // uni.navigateTo({
      // 	url: '/pagesB/report/details-pdf?url=' + item.reportUrl
      // })
      // uni.downloadFile({
      //   url: item.reportUrl,
      //   success: function (res_) {
      //     var filePath = res_.tempFilePath;
      //     uni.openDocument({
      //       filePath: filePath,
      //       showMenu: true,
      //       success: function () {
      //         // console.log('成功')
      //       },
      //     });
      //   },
      // });
    },
    jumpDetails(item) {
      if (item.analysisStatus == 0 || item.analysisStatus == null) {
        uni.navigateTo({
          url: "/pages/report/explain",
        });
      } else if (item.analysisStatus == 1) {
        uni.navigateTo({
          url: "/pages/report/details?id=" + item.analysisId,
        });
      }
    },
    scanCode() {
      uni.scanCode({
        success(res) {
          // console.log('res', res.result)
          let code = res.result;
          selectApplyCode(code).then((res) => {
            if (res.code == 200) {
              let id = res.data.id;

              uni.navigateTo({
                url: "/pagesB/report/agreeBook?id=" + id + "&type=1",
              });
            } else if (res.code == 500) {
              this.$ut.showText(res.msg);
            }
          });
        },
      });
    },
    tabsItem(item) {
      // console.log('item', item);
      this.reportType = item.type;
      this.list = [];
      this.pageNo = 1;
      this.queryList();
      //   this.$refs.paging.reload();
    },
    // 之前版本 点击弹窗
    // selectClick(e) {
    // 	// console.log('==', e)
    // 	if (e.name == '扫码查询') {
    // 		uni.scanCode({
    // 			success(res) {
    // 				// console.log('res', res.result)
    // 				let code = res.result
    // 				selectApplyCode(code).then(res => {
    // 					if (res.code == 200) {
    // 						let id = res.data.id

    // 						uni.navigateTo({
    // 							url: '/pagesB/report/agreeBook?id=' + id + '&type=1'
    // 						})
    // 					} else if (res.code == 500) {
    // 						this.$ut.showText(res.msg)
    // 					}

    // 				})
    // 			}
    // 		})
    // 	} else if (e.name == '自助查询') {
    // 		uni.navigateTo({
    // 			url: '/pagesB/report/query'
    // 		})
    // 	}
    // }
  },
  onReachBottom() {
    if (this.list.length < this.total) {
      this.pageNo++;
      this.queryList();
    } else {
      this.no_more = true;
    }
	},

//   onReady() {
//     // 模拟页面加载
//     setTimeout(() => {
//     }, 2000)
//   },
};
</script>

<style lang="less">
.no_more {
  font-size: 24rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #666;
  height: 50rpx;
}
.content {
  padding: 32rpx 32rpx 0 32rpx;
  box-sizing: border-box;
}
page {
  background-color: #fff;
}

.list {
  box-sizing: border-box;
  width: 100%;
  min-height: 268rpx;
  background: #fff;
  // border-radius: 20rpx;
  margin-bottom: 30rpx;
  border-bottom: 2rpx solid #e7e7e7;
  padding-bottom: 30rpx;
  box-sizing: border-box;
  position: relative;
  overflow: hidden;

  .title {
    width: 80%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 30rpx;
    line-height: 38rpx;
    font-weight: 600;
    color: #000;
    letter-spacing: 1rpx;
    margin-bottom: 10rpx;
  }

  .ok {
    width: 120rpx;
    height: 120rpx;
    position: absolute;
    top: 20rpx;
    right: 20rpx;
    z-index: 1;
  }

  .abc {
    position: absolute;
    right: 20rpx;
    bottom: 140rpx;
    z-index: 100;

    .tag {
      font-size: 24rpx;
      border: 1rpx solid #f90;
      color: #f90;
      padding: 5rpx 15rpx;
    }

    .tags {
      font-size: 24rpx;
      border: 1rpx solid #3b7eff;
      color: #3b7eff;
      padding: 5rpx 15rpx;
    }
  }

  .info {
    display: flex;
    align-items: center;
    color: #666;
    font-size: 24rpx;
    line-height: 1.5;
    font-weight: 400;
    color: #999999;

    .t {
      margin-right: 30rpx;
    }
  }

  .text {
    font-size: 24rpx;
    color: #c6c6c6;
    font-weight: 400;

    display: flex;
    align-items: center;

    .label {
      margin-right: 20rpx;
      line-height: 40rpx;
    }
  }

  .get {
    // position: absolute;
    // right: 20rpx;
    // bottom: 30rpx;
    padding: 5rpx 15rpx;
    color: #3b7effff;
    font-size: 24rpx;
    background: #3b7eff1a;
    border-radius: 10rpx;
    letter-spacing: 2rpx;
  }
  .reportDatil {
    box-sizing: border-box;
    width: 160rpx;
    height: 48rpx;
    background: linear-gradient(135deg, #00deff 0%, #0c5fff 100%);
    border-radius: 80rpx;
    font-size: 24rpx;
    line-height: 28rpx;
    color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    right: 4rpx;
    bottom: 30rpx;
  }
}
.list:last-child {
  margin-bottom: 0 !important;
}
.box {
  width: 100%;
  display: flex;
  justify-content: center;
  position: fixed;
  left: 0;
  bottom: 30rpx;
  z-index: 9;
}

.button {
  width: 80%;
  height: 80rpx;
  border-radius: 80rpx;
  background: #3b7eff1a;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #3b7effff;
  font-size: 36rpx;
  font-weight: 500;
  letter-spacing: 2rpx;
}

/deep/ .u-text__value {
  // font-size: 24rpx !important;
}

.scroll {
  display: inline-flex;
  white-space: nowrap;
}
.fixedTop {
  width: 100%;
  height: 88rpx;
}
.top_container {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #fff;
  position: fixed;

  z-index: 99999;
}

.btn-box {
  // width: 100%;
  background: #fff;
  color: #666666;
}

.add_report {
  margin-right: 32rpx;
  box-sizing: border-box;
  width: 116rpx;
  height: 44rpx;
  border-radius: 10rpx;
  border: 1px solid #3b7eff;
  font-weight: 400;
  color: #3b7eff;
  font-size: 22rpx;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
