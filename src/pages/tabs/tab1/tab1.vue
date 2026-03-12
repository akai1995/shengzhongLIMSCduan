<template>
	<z-paging 
		ref="paging" class="page" :paging-style="{ backgroundColor: 'white' }" 
		v-model="dataList" @query="queryList" :fixed="true" :auto="false" :auto-show-back-to-top="true"
		:enable-back-to-top="true" :auto-scroll-to-top-when-reload="false"
		:auto-clean-list-when-reload="true" :safe-area-inset-bottom="true"
		empty-view-text="暂无数据" :loading-more-no-more-text="`已加载完，共${totalCount}条记录`"
		:loading-more-enabled="false" :show-refresher-when-reload="false" hide-empty-view
	>
	 	<!-- slot="top" -->
		<u-navbar slot="top" title="E-AI" :fixed="true" bgColor="transparent"><view class="u-nav-slot" slot="left"></view></u-navbar>
		<view style="height: 308rpx; position: relative; box-sizing: border-box;">
			<image class="home-bg" :src="`${$staticPath}imgs/top_bg.png`" />
			<!-- <view class="home-head" :style="{ height: headInfo.headHeight }"><view class="home-title" :style="{ marginTop: headInfo.titleTop }">设备预约</view></view> -->
			<view class="home-search">
				<!-- <u--input border="surround" placeholder="请输入设备名称" suffixIcon="search" suffixIconStyle="color: #909399" customStyle="background-color: white;" @change="onSearch" /> -->
			</view>
		</view>
		<view class="home-content">
            <view class="cardBox">
                <!-- 原有模板内容不变 -->
                <view v-if="hasAction('tab1:ocr-recog')" class="cardWarp f1" @click="onJump('/sub-pack/tab1/ocr-recog/ocr-recog')">
                    <view class="cardInfo">
                        <view class="cardTitle">
                            图文识别
                            <u-icon class="iconR" :name="`${$staticPath}imgs/home_card_r_1.png`" size="32rpx" />
                        </view>
                        <view class="cardSubTitle">扫图识字，一扫既得</view>
                    </view>
                    <view class="cardIcon">
                        <u-icon :name="`${$staticPath}imgs/home_card_1.png`" size="140rpx" />
                    </view>
                </view>
                <view v-if="hasAction('tab1:chat-stream')" class="cardWarp f2" @click="onJump('/sub-pack/chat/chat-stream/chat-stream')">
                    <view class="cardInfo">
                        <view class="cardTitle">
                            报告分析
                            <u-icon class="iconR" :name="`${$staticPath}imgs/home_card_r_2.png`" size="32rpx" />
                        </view>
                        <view class="cardSubTitle">医疗报告智能分析助手</view>
                    </view>
                    <view class="cardIcon">
                        <u-icon :name="`${$staticPath}imgs/home_card_2.png`" size="140rpx" />
                    </view>
                </view>
                <view v-if="hasAction('tab1:reserve')" class="cardWarp f3" @click="onJump('/sub-pack/tab5/reserve/reserve')">
                    <view class="cardInfo">
                        <view class="cardTitle">
                            设备预约
                            <u-icon class="iconR" :name="`${$staticPath}imgs/home_card_r_3.png`" size="32rpx" />
                        </view>
                        <view class="cardSubTitle">实验室设备预约</view>
                    </view>
                    <view class="cardIcon">
                        <u-icon :name="`${$staticPath}imgs/home_card_3.png`" size="140rpx" />
                    </view>
                </view>
                <view v-if="hasAction('tab1:sign-doc')" class="cardWarp f4" @click="onJump('/sub-pack/tab5/sign-doc/sign-doc')">
                    <view class="cardInfo">
                        <view class="cardTitle">
                            待签署文件
                            <u-icon class="iconR" :name="`${$staticPath}imgs/home_card_r_4.png`" size="32rpx" />
                        </view>
                        <view class="cardSubTitle">一键签署，高效便捷</view>
                    </view>
                    <view class="cardIcon">
                        <u-icon :name="`${$staticPath}imgs/home_card_4.png`" size="140rpx" />
                    </view>
                </view>
                <view class="cardWarp f5" @click="onJump('/sub-pack/tab5/temperature-monitoring/temperature-monitoring')">
                    <view class="cardInfo">
                        <view class="cardTitle">
                            温度监控
                            <u-icon class="iconR" :name="`${$staticPath}imgs/home_card_r_5.png`" size="32rpx" />
                        </view>
                        <view class="cardSubTitle data">
                            <view class="">
                                预警低温：
                                <text>{{temperatureCount.temperatureLowCount||'0'}}</text>
                            </view>
                                
                            <view class="">
                                预警高温：
                                <text>{{temperatureCount.temperatureHighCount||'0'}}</text>
                            </view>
                        </view>
                    </view>
                    <view class="cardIcon">
                        <u-icon :name="`${$staticPath}imgs/home_card_5.png`" size="140rpx" />
                    </view>
                </view>
            </view>
			<!-- <view class="luBox">
				<view class="luTitle">设备列表</view><u-skeleton v-if="!firstLoaded&&dataList.length==0" rows="8" title loading />
      			<project-device-apply-item v-for="item,idx in dataList" :key="item.id" :item="item" :hideLine="dataList.length-1==idx" />
			</view> -->
		</view>
		<ut-bottomNav slot="bottom" :value="0" />
	</z-paging>
</template>
<script>
import { getDeviceList } from '@/app/api/index'
import { getDeviceTemperatureCount } from '@/app/api/index'
import EventsConfigs from '@/app/app.event.config'
export default {
	data() {
		return {
			headInfo: { headHeight: '0px', titleTop: '0px', listHeight: '0px' },
			queryParams: { pageNo: 1, pageSize: 10, deviceName: "" },
			dataList: [], totalCount: 0, firstLoaded: false,
            temperatureCount: {
                temperatureHighCount: 0,
                temperatureLowCount: 0,
            },
            timer: null, // 定时器引用
		};
	},
	onShow() {
        // 关键修复1：创建新定时器前先清除旧的，避免叠加
        this.clearTimer()
        // 立即执行一次获取数据
        this.getTemperatureCount()
        // 关键修复2：确保定时器正确创建并赋值
        this.timer = setInterval(() => { 
            this.getTemperatureCount() 
        }, 60 * 1000); 
        console.log('定时器已启动，ID：', this.timer)
    },
	mounted() { 
		setTimeout(() => { this.$refs.paging && this.$refs.paging.refresh() }, 450); 
	},
	methods: {
		getHeadInfo() {
			// #ifdef MP-WEIXIN
			// const popInfo = uni.getMenuButtonBoundingClientRect()
			// this.headInfo.headHeight = `${popInfo.height}px`; this.headInfo.titleTop = `${popInfo.top}px`
			// this.headInfo.listHeight = `calc(100vh - ${popInfo.top + popInfo.height + 155}px)`
			// #endif
		},
        // 新增：封装定时器清理方法，统一管理
        clearTimer() {
            if (this.timer) {
                clearInterval(this.timer)
                console.log('定时器已清除，ID：', this.timer)
                this.timer = null // 清除后重置引用
            }
        },
        getTemperatureCount() {
            if (this.isLogin) {
                getDeviceTemperatureCount().then((res) => {
                    console.log('温度数据更新：', res.data)
                    this.temperatureCount = res.data
                }).catch((err) => { 
                    // 关键修复3：添加异常日志，便于排查
                    console.error('获取温度数据失败：', err)
                }).finally(() => { })
            }
        },
        onJump(path){
            if (!this.checkUserInfo()) { return; };
            console.log('path::', path)
            this.$eUni.navTo({ url: `${path}` })
        },
		queryList(pageNo, pageSize) {
			this.$refs.paging.endRefresh()
			this.queryParams.pageNo = pageNo; this.queryParams.pageSize = pageSize; const type = pageNo>1 ? 'search': ''
			// getDeviceList(this.queryParams).then((res) => {
			// 	this.totalCount = res&&res.data?res.data.total : 0 
			// 	this.$refs.paging.complete(res&&res.data?res.data.records:false)
			// }).catch(()=>{
			// 	this.$refs.paging.complete(false)
			// }).finally(()=>{ 
            setTimeout(()=>{ this.firstLoaded = true; }, 750); uni.hideLoading(); 
            // })
		},
		// onSearch(event) { this.queryParams.deviceName = event; this.$refs.paging && this.$refs.paging.refresh(); },
		// handleGoDetail(id, deviceId) { if (!this.checkUserInfo()){ return }; this.$ut.jump(`/sub-pack/tab1/device/detail?instrumentId=${id}&deviceId=${deviceId}`); }
	},
    onHide() {
        // 统一清理定时器
        this.clearTimer()
        uni.$off(EventsConfigs.eventNames.refreshLoginedPage, this.eventHanlder)
    },
    onUnload() {
        // 关键修复4：使用onUnload替代destroyed（uniapp中页面销毁用onUnload）
        this.clearTimer()
        uni.$off(EventsConfigs.eventNames.refreshLoginedPage, this.eventHanlder)
    }
}
</script>
<style lang="scss" scoped>
	.page {
		box-sizing: border-box;
	}

	.home-bg {
		position: absolute;
		width: 100%;
		height: auto;
		aspect-ratio: 2.435/1;
		top: 0; left: 0;right: 0;
	}

	.home-head {
		position: relative;
		width: 100%;

		.home-title {
			width: 100%;
			line-height: 32rpx;
			font-weight: 500;
			font-size: 32rpx;
			color: #000000;
			text-align: center;
		}
	}

// 原有样式不变
.cardBox {
    .f1 { @include background-image('imgs/home_card_bg_1.png'); }
    .f2 { @include background-image('imgs/home_card_bg_2.png'); }
    .f3 { @include background-image('imgs/home_card_bg_3.png'); }
    .f4 { @include background-image('imgs/home_card_bg_4.png'); }
    .f5 { @include background-image('imgs/home_card_bg_5.png'); }
    .cardWarp {
        width: auto; height: 180rpx; position: relative;
        padding: 20rpx 140rpx 20rpx 32rpx; border-radius: 24rpx;
        margin-bottom: 20rpx; &:last-child { margin-bottom: 0; }
        .cardInfo {
            .cardTitle {
                display: flex; align-items: center; justify-content: flex-start; font-weight: bold; color: #000; font-size: 32rpx; line-height: 50rpx; line-height: 64rpx; gap: 8rpx;
            }
            .cardSubTitle { 
                font-weight: 400; color: #4B4B4E ; font-size: 24rpx; line-height: 56rpx;
                &.data {
                    gap: 20rpx; display: flex; align-items: center; justify-content: flex-start;
                    text { color: #222; font-size: 24rpx; font-weight: bold; margin-left: 8rpx; }
                }
            } 
        }
        .cardIcon { 
            position: absolute; top: 16rpx; right: 24rpx; width: 140rpx; border-radius: 8rpx; overflow: hidden; height: 140rpx;
            image { width: 100% !important; height: 100% !important; }
        }
    }
}
	.home-content {
		background-color: #fff;
		padding: 12rpx 32rpx 0;
		// #ifdef H5
		margin-top: -210rpx;
		// #endif
		// #ifdef MP-WEIXIN
		margin-top: -130rpx;
		// #endif
		.luBox {
			width: 100%;
			margin-top: 20rpx;
			box-sizing: border-box;
			.luTitle{
				font-weight: bold;
				color: #222;
				font-size: 34rpx;
				line-height: 70rpx;
			}
		}
	}
</style>