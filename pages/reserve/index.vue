<style lang="less" scoped>
@import './asserts/index.less';
</style>

<template>
    <view class="reserve">
        <ut-nav title="我的预约" @onBack="handleGoUser" border></ut-nav>

        <scroll-view class="reserve-list" @scrolltolower="lowerBottom" :scroll-y="true">
            <view class="reserve-item" @click="handleGoDetail(item.id)" v-for="(item, index) in listData.list"
                :key="index">
                <div class="reserve-item-content">
                    <view class="reserve-pic">
                        <img class="reserve-img" src="https://genepiapi.ypzlfx.com/file/device-appointment/image.png" />
                    </view>
                    <view class="reserve-info">
                        <view class="reserve-info-head">
                            <view class="reserve-info-head-title">{{ item.deviceName }}</view>
                            <view class="reserve-info-head-status blue"
                                v-if="item.deviceReserveStatus == 1 || item.deviceReserveStatus == 2">
                                {{ item.deviceReserveStatus_dictText }}
                            </view>
                            <view class="reserve-info-head-status green"
                                v-if="item.deviceReserveStatus == 4 || item.deviceReserveStatus == 5 || item.deviceReserveStatus == 6">
                                {{ item.deviceReserveStatus_dictText }}
                            </view>
                            <view class="reserve-info-head-status red"
                                v-if="item.deviceReserveStatus == 3 || item.deviceReserveStatus == 7">
                                {{ item.deviceReserveStatus_dictText }}
                            </view>
                        </view>
                        <view class="reserve-info-message">
                            <view class="reserve-info-message-top">{{ item.reserveTime }}</view>
                            <view class="reserve-info-message-bottom">用途：{{ item.reservePurpose || "暂无" }}</view>
                        </view>
                    </view>
                </div>

                <!-- <view class="reserve-reject" v-if="item.deviceReserveStatus == 7">
                    <span class="reserve-reject-title">拒绝原因：</span>
                    <span class="reserve-reject-text">这个时间段有其他的用途，请换个时间</span>
                </view> -->
            </view>
        </scroll-view>
    </view>
</template>

<script>
import { getReserveList } from '@/api/device/index.js'

export default {
    data() {
        return {
            queryParameter: { pageNo: 1, pageSize: 10 },
            listData: { list: [], total: 0 }
        };
    },
    onLoad() {
        this.getReserveList()
    },
    methods: {
        getReserveList() {
            getReserveList(this.queryParameter).then((resp) => {
                this.listData.list.push(...resp.result.records);
                this.listData.total = resp.result.total
            });
        },
        handleGoUser() {
            this.$ut.jump(`/pages/user/user`);
        },
        handleGoDetail(id) {
            this.$ut.jump(`/pages/reserve/detail?id=${id}`);
        },
        lowerBottom() {
            if (this.queryParameter.pageNo * this.queryParameter.pageSize < this.listData.total) {
                this.queryParameter.pageNo += 1;
                this.getReserveList()
            } else {
                uni.showToast({ title: "已经到底啦！！！", icon: "none", });
            }
        },
    },
};
</script>
