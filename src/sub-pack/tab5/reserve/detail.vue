<template>
    <view class="reserve-detail">
        <ut-nav title="预约详情" @onBack="handleGoBack" border></ut-nav>
		<ut-components ref="utComponents" />
        <view class="reserve-detail-status">
            <view class="reserve-detail-status-blue"
                v-if="detailData.deviceReserveStatus == 1 || detailData.deviceReserveStatus == 2">
                {{ detailData.deviceReserveStatus_dictText }}
            </view>
            <view class="reserve-detail-status-green"
                v-if="detailData.deviceReserveStatus == 4 || detailData.deviceReserveStatus == 5 || detailData.deviceReserveStatus == 6">
                {{ detailData.deviceReserveStatus_dictText }}
            </view>
            <view class="reserve-detail-status-red"
                v-if="detailData.deviceReserveStatus == 3 || detailData.deviceReserveStatus == 7">
                <view class="reserve-detail-status-red-title">{{ detailData.deviceReserveStatus_dictText }}</view>
                <view class="reserve-detail-status-red-text" v-if="detailData.deviceReserveStatus == 7">{{ rejectDes }}
                </view>
            </view>
        </view>

        <view class="reserve-detail-info">
            <view class="reserve-detail-info-pic">
                <image class="reserve-detail-info-img"
                    :src="detailData.deviceImg ? detailData.deviceImg : $staticPath+'device-appointment/image.png'" />
            </view>
            <view class="reserve-detail-info-message">
                <view class="reserve-detail-info-message-title">{{ detailData.deviceName }}</view>
                <view class="reserve-detail-info-message-date">{{ detailData.reserveTime }}</view>
                <view class="reserve-detail-info-message-use">用途：{{ detailData.reservePurpose || "暂无" }}</view>
            </view>
        </view>

        <view class="reserve-detail-user">
            <view class="reserve-detail-user-item">用户名：{{ detailData.reserveName }}</view>
            <view class="reserve-detail-user-item">电话：{{ detailData.reservePhone }}</view>
            <view class="reserve-detail-user-item">提交时间：{{ detailData.updateTime }}</view>
        </view>

        <view class="submit-button"
            v-if="(detailData.deviceReserveStatus == 4 && detailData.deviceStatus == 0) || (detailData.deviceReserveStatus == 5 && detailData.deviceStatus == 0)">
            <u-button @click="handleStart" type="primary" text="开机" />
        </view>
        <view class="submit-button" v-if="detailData.deviceReserveStatus == 5 && detailData.deviceStatus == 1">
            <u-button @click="handleClose" type="primary" text="关机" />
        </view>
        <view class="submit-button" v-if="cancelReserve.button">
            <u-button @click="handleCancelReserveClick" type="primary" text="取消预约" />
        </view>

        <u-modal :show="cancelReserve.visible" title="取消预约" showCancelButton @confirm="handleSubmitReserve"
            @cancel="handleCancelReserve">
            <u--textarea v-model="cancelReserve.description" placeholder="请输入取消原因" :autoHeight="false" />
        </u-modal>
    </view>
</template>

<script>
import { reserveDetail, getRejectDes, openDevice, closeDevice, cancelReserve } from '@/app/api/device/index.js'

export default {
    data() {
        return {
            reserveId: null,
            detailData: null,
            rejectDes: null,
            cancelReserve: { visible: false, description: '', button: false }
        };
    },
    onLoad(options) {
        this.reserveId = options.id;
        this.getReserveDetail()
    },
    methods: {
        hidePhoneNumber(phoneNumber) {
            return phoneNumber.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
        },
        checkTime() {
            const startTimeStr = this.detailData.reserveTime.split(' - ')[0];
            const startTime = new Date(startTimeStr.replace(' ', 'T') + ':00');
            const currentTime = new Date();
            const timeDifference = startTime - currentTime;
            if (timeDifference > 2 * 60 * 60 * 1000) {
                return true;
            }
            return false;
        },
        checkCancelReserveStatus() {
            if (this.detailData.deviceReserveStatus != 3 && this.detailData.deviceReserveStatus != 5 && this.detailData.deviceReserveStatus != 6 && this.detailData.deviceReserveStatus != 7) {
                return true
            } else {
                return false
            }
        },
        getReserveDetail() {
            reserveDetail(this.reserveId).then((resp) => {
                if (resp.code == 200) {
                    this.detailData = resp.result
                    if (resp.result.deviceReserveStatus == 7) {
                        this.getRejectDes()
                    }
                    if (this.checkCancelReserveStatus() && this.checkTime()) {
                        this.cancelReserve.button = true
                    }
                }
            });

        },
        getRejectDes() {
            getRejectDes(this.reserveId).then((resp) => {
                if (resp.code == 200) {
                    this.rejectDes = resp.result.comment
                }
            });
        },
        handleGoBack() {
            this.$eUni.navBack()
        },
        handleStart() {
            openDevice(this.reserveId).then((resp) => {
                if (resp.code == 200) {
                    this.showTips('开机成功', 'success');
                    this.getReserveDetail()
                }
            });
        },
        handleClose() {
            closeDevice(this.reserveId).then((resp) => {
                if (resp.code == 200) {
                    this.showTips('关机成功', 'success');
                    this.getReserveDetail()
                }
            });
        },
        handleCancelReserveClick() {
            this.cancelReserve.visible = true
            this.cancelReserve.description = ''
        },
        handleSubmitReserve() {
            if (!this.cancelReserve.description) {
                this.showTips('请填写取消原因', 'error');
                return
            }
            const pushData = {
                cancelReason: this.cancelReserve.description,
                instrmentReserveId: this.reserveId
            }
            cancelReserve(pushData).then((resp) => {
                if (resp.code == 200) {
                    this.showTips('取消预约成功', 'success');
                    this.getReserveDetail()
                    this.cancelReserve.button = false
                    this.cancelReserve.visible = false
                }
            });
        },
        handleCancelReserve() {
            this.cancelReserve.visible = false
        }
    },
};
</script>
<style lang="scss" scoped>.reserve-detail {
	width: 100%;
	height: 100vh;
	box-sizing: border-box;
	background-color: #fff;
	padding-bottom: 200rpx;
	.reserve-detail-status {
		width: 100%;
		box-sizing: border-box;
		padding: 20rpx;
		.reserve-detail-status-blue {
			width: 100%;
			background: rgba(13, 112, 243, 0.1);
			border-radius: 8rpx;
			font-weight: 500;
			font-size: 32rpx;
			color: #0d70f3;
			line-height: 40rpx;
			text-align: center;
			padding: 20rpx 0;
		}
		.reserve-detail-status-green {
			width: 100%;
			background: rgba(3, 171, 110, 0.1);
			border-radius: 8rpx;
			font-weight: 500;
			font-size: 32rpx;
			color: #03ab6e;
			line-height: 40rpx;
			text-align: center;
			padding: 20rpx 0;
		}
		.reserve-detail-status-red {
			width: 100%;
			padding: 20rpx;
			background: rgba(231, 41, 41, 0.1);
			border-radius: 8rpx;
			box-sizing: border-box;
			.reserve-detail-status-red-title {
				width: 100%;
				font-weight: 500;
				font-size: 32rpx;
				color: #e72929;
				line-height: 40rpx;
				text-align: center;
				margin-bottom: 20rpx;
			}
			.reserve-detail-status-red-text {
				width: 100%;
				font-weight: 400;
				font-size: 28rpx;
				color: #4b4b4e;
				line-height: 32rpx;
				text-align: center;
			}
		}
	}
	.reserve-detail-info {
		width: 100%;
		padding: 20rpx;
		box-sizing: border-box;
		margin-top: 40rpx;
		display: flex;
		.reserve-detail-info-pic {
			width: 152rpx;
			height: 152rpx;
			.reserve-detail-info-img {
				width: 100%;
				height: 100%;
				display: block;
			}
		}
		.reserve-detail-info-message {
			width: calc(100% - 152rpx);
			box-sizing: border-box;
			padding-left: 20rpx;
			.reserve-detail-info-message-title {
				width: 100%;
				font-weight: 500;
				font-size: 32rpx;
				color: #000000;
				line-height: 40rpx;
			}
			.reserve-detail-info-message-date {
				width: 100%;
				font-weight: 400;
				font-size: 28rpx;
				color: #4b4b4e;
				line-height: 32rpx;
				margin: 20rpx 0;
			}
			.reserve-detail-info-message-use {
				width: 100%;
				font-weight: 400;
				font-size: 28rpx;
				color: #9699a1;
				line-height: 32rpx;
			}
		}
	}
	.reserve-detail-user {
		width: 100%;
		box-sizing: border-box;
		padding: 20rpx;
		.reserve-detail-user-item {
			width: 100%;
			font-weight: 400;
			font-size: 28rpx;
			color: #9699a1;
			text-align: left;
			margin-bottom: 10rpx;
		}
	}
	.submit-button {
		position: fixed;
		width: 100%;
		box-sizing: border-box;
		bottom: constant(safe-area-inset-bottom);
		bottom: env(safe-area-inset-bottom);
		left: 0;
		padding: 20rpx;
	}
}
</style>