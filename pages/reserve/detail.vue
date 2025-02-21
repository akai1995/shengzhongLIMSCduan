<style lang="less" scoped>
@import './asserts/detail.less';
</style>

<template>
    <view class="reserve-detail">
        <ut-nav title="预约详情" @onBack="handleGoBack" border></ut-nav>

        <view class="reserve-detail-status">
            <view class="reserve-detail-status-blue" v-if="true">审核中</view>
            <view class="reserve-detail-status-green" v-if="false">已通过</view>
            <view class="reserve-detail-status-red" v-if="false">
                <view class="reserve-detail-status-red-title">已拒绝</view>
                <view class="reserve-detail-status-red-text">这个时间段有其他的用途，请换个时间</view>
            </view>
        </view>

        <view class="reserve-detail-info">
            <view class="reserve-detail-info-pic">
                <img class="reserve-detail-info-img"
                    src="https://genepiapi.ypzlfx.com/file/device-appointment/image.png" />
            </view>
            <view class="reserve-detail-info-message">
                <view class="reserve-detail-info-message-title">设备名称设备名称设备名称</view>
                <view class="reserve-detail-info-message-date">
                    1小时 02-13 15:32-16:32
                </view>
                <view class="reserve-detail-info-message-use">
                    用途：用于XXX实验用于XXX实验用于XX实验用于XXX实验用于XXX实验用于
                </view>
            </view>
        </view>

        <view class="reserve-detail-user">
            <view class="reserve-detail-user-item">预约人：张三</view>
            <view class="reserve-detail-user-item">电话：{{ hidePhoneNumber('13111111111') }}</view>
            <view class="reserve-detail-user-item">提交时间：2025/02/12 11:20:30</view>
        </view>

        <view class="submit-button">
            <u-button @click="handleStart" type="primary" text="开机"></u-button>
        </view>
    </view>
</template>

<script>

export default {
    data() {
        return {
        };
    },
    onLoad() {

    },
    methods: {
        hidePhoneNumber(phoneNumber) {
            return phoneNumber.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
        },
        handleGoBack() {
            uni.navigateBack()
        },
        handleStart() {
            uni.showToast({ title: "开机啦！！！", icon: "none", });
        }
    },
};
</script>
