<style lang="less" scoped>
@import './asserts/index.less';
</style>

<template>
    <view class="reserve">
        <ut-nav title="我的预约" @onBack="handleGoUser" border></ut-nav>

        <scroll-view class="reserve-list" @scrolltolower="lowerBottom" :scroll-y="true">
            <view class="reserve-item" @click="handleGoDetail(item)" v-for="(item, index) in 10" :key="index">
                <div class="reserve-item-content">
                    <view class="reserve-pic">
                        <img class="reserve-img" src="https://genepiapi.ypzlfx.com/file/device-appointment/image.png" />
                    </view>
                    <view class="reserve-info">
                        <view class="reserve-info-head">
                            <view class="reserve-info-head-title">设备名称设备名称设备名称</view>
                            <view class="reserve-info-head-status blue" v-if="index % 3 == 2">审核中</view>
                            <view class="reserve-info-head-status green" v-if="index % 3 == 1">已通过</view>
                            <view class="reserve-info-head-status red" v-if="index % 3 == 0">已拒绝</view>
                        </view>
                        <view class="reserve-info-message">
                            <view class="reserve-info-message-top">
                                1小时 02-13 15:00-16:00
                            </view>
                            <view class="reserve-info-message-bottom">
                                用途：用于XXX实验用于XXX实验用于XXX实验用于XXX实验用于XXX实验用于XXX实验用于XXX实验用于XXX实验用于XXX实验
                            </view>
                        </view>
                    </view>
                </div>

                <view class="reserve-reject" v-if="index % 3 == 0">
                    <span class="reserve-reject-title">拒绝原因：</span>
                    <span class="reserve-reject-text">这个时间段有其他的用途，请换个时间</span>
                </view>
            </view>
        </scroll-view>
    </view>
</template>

<script>

export default {
    data() {
        return {};
    },
    onLoad() {

    },
    methods: {
        handleGoUser() {
            this.$ut.jump(`/pages/user/user`);
        },
        handleGoDetail(id) {
            this.$ut.jump(`/pages/reserve/detail?id=${id}`);
        },
        lowerBottom() {
            uni.showToast({ title: "到底啦！！！", icon: "none", });
        },
    },
};
</script>
