<template>
	<z-paging
		ref="paging" class="reserve" :paging-style="{ backgroundColor: 'white' }" v-model="dataList" @query="queryList"
		:fixed="true" :auto="false" :refresher-enabled="false" :auto-show-back-to-top="true" :auto-scroll-to-top-when-reload="false"
		:loading-more-enabled="false" :show-refresher-when-reload="false" hide-empty-view
	>
        <view slot="top"><u-navbar title="预约详情" :fixed="false" background="transparent" color="#000" left-icon-color="#000" @leftClick="onBack" /></view>
        <view class="reserve-detail">
            <ut-components ref="utComponents" />
            <view class="reserve-detail-status">
                <view class="reserve-detail-status-blue" v-if="[1,2].includes(info.deviceReserveStatus)">{{ info.deviceReserveStatus_dictText }}</view>
                <view class="reserve-detail-status-green" v-if="[4,5,6].includes(info.deviceReserveStatus)">{{ info.deviceReserveStatus_dictText }}</view>
                <view class="reserve-detail-status-red" v-if="[3,7].includes(info.deviceReserveStatus)">
                    <view class="reserve-detail-status-red-title">{{ info.deviceReserveStatus_dictText }}</view>
                    <view class="reserve-detail-status-red-text" v-if="[7].includes(info.deviceReserveStatus)">{{ rejectDes }}</view>
                </view>
            </view>
            <view class="reserve-detail-info">
                <view class="reserve-detail-info-pic"><image class="reserve-detail-info-img" :src="info.deviceImg ? info.deviceImg : $staticPath+'device-appointment/image.png'" /></view>
                <view class="reserve-detail-info-message"><view class="reserve-detail-info-message-title">{{ info.deviceName }}</view><view class="reserve-detail-info-message-date">{{ info.reserveTime }}</view><view class="reserve-detail-info-message-use">用途：{{ info.reservePurpose || "暂无" }}</view></view>
            </view>
            <view class="reserve-detail-user"><view class="reserve-detail-user-item">用户名：{{ info.reserveName }}</view><view class="reserve-detail-user-item">电话：{{ info.reservePhone }}</view><view class="reserve-detail-user-item">提交时间：{{ info.updateTime }}</view></view>
            <u-modal :show="cancelReserve.visible" title="取消预约" showCancelButton @confirm="handleSubmitModal" @cancel="handleCancelModal"><u--textarea v-model="cancelReserve.description" placeholder="请输入取消原因" :autoHeight="false" /></u-modal>
        </view>
        <view slot="bottom" class="pubBotBtn pubTopLine">
            <view class="wrap">
                <view class="btn" v-if="(info.deviceReserveStatus == 4 && info.deviceStatus == 0) || (info.deviceReserveStatus == 5 && info.deviceStatus == 0)" @click="handleStart"><u-button type="primary" text="开机" /></view>
                <view class="btn" v-if="info.deviceReserveStatus == 5 && info.deviceStatus == 1" @click="handleClose"><u-button type="primary" text="关机" /></view>
                <view class="btn" v-if="cancelReserve.button" @click="handleCancelModalClick"><u-button type="primary" text="取消预约" /></view>
            </view>
        </view>
    </z-paging>
</template>

<script>
import { reserveDetail, getRejectDes, openDevice, closeDevice, setCancelReserve } from '@/app/api/index'
export default {
    data() { return { reserveId: null, info: null, rejectDes: null, ancelReserve: { visible: false, description: '', button: false } } },
    onLoad(options) { this.reserveId = options.id; this.getDetail() },
    methods: {
        handleGoBack() { this.$eUni.navBack() }, queryList(pageNo, pageSize) { this.$refs.paging.endRefresh(); this.getDetail(); uni.hideLoading(); },
        checkTime() {
            const startTimeStr = this.info.reserveTime.split(' - ')[0];
            const startTime = new Date(startTimeStr.replace(' ', 'T') + ':00');
            const currentTime = new Date(); const timeDifference = startTime - currentTime;
            if (timeDifference > 2 * 60 * 60 * 1000) { return true; }
            return false;
        },
        onCheckStatus() { const status = this.info.deviceReserveStatus; if (![3,5,6,7].includes(status)) { return true } else { return false } },
        getDetail() {
            reserveDetail(this.reserveId).then((resp) => {
                if (resp.code == 200) { this.info = resp.result;
                    if (resp.result.deviceReserveStatus == 7) { this.getReject() }
                    if (this.onCheckStatus() && this.checkTime()) { this.cancelReserve.button = true }
                }
            });
        },
        getReject() { getRejectDes(this.reserveId).then((res) => { if (res.code == 200) { this.rejectDes = res.result.comment } }) },
        handleStart() { openDevice(this.reserveId).then((res) => { if (res.code == 200) { this.showTips('开机成功', 'success'); this.getDetail() } }); },
        handleClose() { closeDevice(this.reserveId).then((res) => { if (res.code == 200) { this.showTips('关机成功', 'success'); this.getDetail() } }) },
        handleCancelModalClick() { this.cancelReserve.visible = true; this.cancelReserve.description = '' },
        handleCancelModal() { this.cancelReserve.visible = false },
        handleSubmitModal() {
            if (!this.cancelReserve.description) { this.showTips('请填写取消原因', 'error'); return }
            const pushData = { cancelReason: this.cancelReserve.description, instrmentReserveId: this.reserveId }
            setCancelReserve(pushData).then((resp) => { 
                if (resp.code == 200) { this.showTips('取消预约成功', 'success'); this.getDetail();
                    this.cancelReserve.button = false; this.cancelReserve.visible = false 
                } 
            }) 
        }
    }
}
</script>
<style lang="scss" scoped>
.reserve-detail {
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