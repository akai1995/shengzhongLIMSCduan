<template>
	<z-paging
		ref="paging" class="reserve" :paging-style="{ backgroundColor: 'white' }" v-model="dataList" @query="queryList"
		:fixed="true" :auto="false" :refresher-enabled="false" :auto-show-back-to-top="true" :auto-scroll-to-top-when-reload="false"
		:loading-more-enabled="false" :show-refresher-when-reload="false" hide-empty-view
	>
        <view slot="top"><u-navbar title="预约详情" :fixed="false" background="transparent" :leftIcon="$leftIcon" @leftClick="onBack" /></view>
        <view class="detailPage">
            <ut-components ref="utComponents" />
            <view
				class="status"
				v-if="
					deviceInfo && deviceInfo.deviceReserveStatus &&
					[1,2,4,5,6,3,7,8,9].includes(deviceInfo.deviceReserveStatus) && 
					dictText
				"
				:class="{
					'blue':[1,2].includes(deviceInfo.deviceReserveStatus),
					'green':[4,5,6].includes(deviceInfo.deviceReserveStatus),
					'red':[3,7,8,9].includes(deviceInfo.deviceReserveStatus)
				}"
			>
                <view v-if="[1,2,4,5,6].includes(deviceInfo.deviceReserveStatus)">{{ dictText }}</view>
                <view v-if="[3,7,8,9].includes(deviceInfo.deviceReserveStatus)">
                    {{ dictText }}
                    <text class="text" v-if="[7].includes(deviceInfo.deviceReserveStatus)">{{ rejectDes }}</text>
                </view>
            </view>
            <project-reserve-item v-if="deviceInfo" :item="deviceInfo" :hideLine="false" :noStatus="true" />
			<view class="detailForm" v-if="deviceInfo">
				<view class="info"><text class="title">用 户 名：</text>{{deviceInfo.reserveName}}</view>
				<view class="info"><text class="title">电   话：</text>{{deviceInfo.reservePhone}}</view>
				<view class="info"><text class="title">提交时间：</text>{{deviceInfo.updateTime}}</view>
				<view class="info"><text class="title">团    队：</text>{{deviceInfo.projectMentorDictName}}</view>
				<view class="info" v-if="deviceInfo.projectMentorDictDetName"><text class="title">导师/学院：</text>{{deviceInfo.projectMentorDictDetName}}</view>
				<view class="info" v-if="deviceInfo.projectMentorRemark"><text class="title">备注信息：</text>{{deviceInfo.projectMentorRemark}}</view>
				<!-- <view class="submit-button"><u-button @click="onSubmit" type="primary" text="提交预约" /></view> -->
			</view>
            <u-modal
				:show="cancelReserve.visible" title="取消预约" showCancelButton
				@confirm="onSubmitModal" @cancel="onCancelModal"
			>
				<u--textarea v-model="cancelReserve.description" placeholder="请输入取消原因" :autoHeight="false" />
			</u-modal>
			
            <u-modal
				title="延长预约" showCancelButton
				:show="extendSppointment.visible"
				@confirm="onExtendAppointmentSubmit"
				@cancel="onExtendAppointmentCancel"
			>
				<view
					class="detailDate"
				>
					<template v-if="false">
						<view class="detailDateTitle"><view>选择日期</view><view v-if="choose.isMore">{{ choose.moreDate }}</view></view>
						<view class="detailDateDay">
							<view
								v-for="(item, index) in choose.list" :key="index"
								:class="index == choose.currIndex && !choose.isMore ? 'detailDateDayItemCurr' : 'detailDateDayItem'"
								@click="onDateClick(index, item.date)"
							>
								<view class="detailDateDayItem-num">{{ item.date }}</view>
								<view class="detailDateDayItem-text">{{ item.day }}</view>
							</view>
							<view :class="choose.isMore ? 'detailDateDayItemMore' : 'detailDateDayItemMore-curr'" @click="choose.moreVisible = true">
								<view class="detailDateDayItemMoreText">更多</view>
							</view>
						</view>
					</template>
					<template v-if="deviceInfo && deviceInfo.reserveTime && deviceInfo.reserveTime.length > 0">
                    <view class="detailDateTitle">已预约时间</view>
						<view class="detailDateHasList">
							<view class="detailDateHasItem" v-for="item,idx in deviceInfo.reserveTime" :key="idx">
								{{ `${item.reserveStartTime} - ${item.reserveEndTime}` }}
							</view>
						</view>
					</template>
					<view class="detailDateChoose">
						<view class="detailDateChooseItem">
							<view class="detailDateChooseItemTitle">开始时间</view>
							<view class="detailDateChooseItemButton" @click="onTimeClick('start')">{{ time.start ? time.start : '请选择' }}</view>
						</view>
						<view class="detailDateChooseItem">
							<view class="detailDateChooseItemTitle">结束时间</view>
							<view class="detailDateChooseItemButton" @click="onTimeClick('end')">{{ time.end ? time.end : '请选择' }}</view>
						</view>
					</view>
					<u--textarea
						v-model="extendSppointment.description"
						placeholder="请输入延长预约原因"
						:autoHeight="false"
					/>
				</view>
			</u-modal>
			<u-picker :show="time.selectVisible" ref="uPicker" :columns="time.select" @confirm="onTimeSubmit" @cancel="onTimeClose" />
        
        </view>
        <view slot="bottom" class="pubBotBtn pubTopLine">
            <view class="wrap">
                <view
					v-if="
						deviceInfo && [4,5].includes(deviceInfo.deviceReserveStatus)
						&& deviceInfo.deviceStatus == 0
					"
					class="btn" @click="onStart"
				>
					<u-button type="primary" text="开机" />
				</view>
                <view
					v-if="
						deviceInfo && [5].includes(deviceInfo.deviceReserveStatus)
						&& deviceInfo.deviceStatus == 1
					"
					class="btn" @click="onClose"
				>
					<u-button type="primary" text="关机" />
				</view>
                <view
					v-if="
						deviceInfo && deviceInfo.continueFlag
					"
					class="btn" @click="onExtendAppointment"
				>
					<u-button type="primary" text="延长预约" />
				</view>
                <view
					v-if="cancelReserve.button"
					class="btn" @click="onCancelModalClick"
				>
					<u-button type="primary" text="取消预约" />
				</view>
            </view>
        </view>
    </z-paging>
</template>

<script>
import {
	deviceDetail, reserveDetail, getRejectDes,
	openDevice, closeDevice, setCancelReserve,
	getAllDayReserve as getAllDayReserveApi,
	appDeviceReserveExtend
} from '@/app/api/index'
export default {
    data() {
		return {
			instrumentId: null, reserveId: null, deviceInfo: null, rejectDes: null,
			extendSppointment: { visible: false, description: '', button: false },
            choose: {
				currIndex: 0, list: [], isMore: false, moreDate: '',
				moreVisible: false, minDate: '', maxDate: '', moreText: true
			},
			time: { type: '', start: null, end: null, select: [[]], selectVisible: false },
			cancelReserve: { visible: false, description: '', button: false }
		}
	},
    onLoad(options) { this.reserveId = options.id; this.getDetail() },
    computed: {
        dictText() {
            if (!this.deviceInfo) return ''
            if (this.deviceInfo&&!this.deviceInfo.hasOwnProperty('deviceReserveStatus')) return ''
            const text = this.deviceInfo.deviceReserveStatusName || ''
            if (text) return text
            const status = this.deviceInfo.deviceReserveStatus
            const statusMap = {
                1: '待审批', 2: '审批中', 3: '已取消',
                4: '待上机', 5: '上机中', 6: '已上机',
                7: '驳回', 8: '爽约', 9: '解除爽约',
            }
            return statusMap[status] || ''
        }
    },
	mounted() { },
    methods: {
        onGoBack() { this.$eUni.navBack() },
        checkTime() {
            const startTimeStr = this.deviceInfo.reserveTime.split(' - ')[0];
            const startTime = new Date(startTimeStr.replace(' ', 'T') + ':00');
            const currentTime = new Date(); const timeDifference = startTime - currentTime;
            if (timeDifference > 2 * 60 * 60 * 1000) { return true; }
            return false;
        },
        onCheckStatus() { const status = this.deviceInfo.deviceReserveStatus; if (![3,5,6,7].includes(status)) { return true } else { return false } },
        getReject() { getRejectDes(this.reserveId).then((res) => { if (res.code == 200) { this.rejectDes = res.result.comment } }) },
        onStart() { openDevice(this.reserveId).then((res) => { if (res.code == 200) { this.showTips('开机成功', 'success'); this.getDetail() } }); },
        onClose() { closeDevice(this.reserveId).then((res) => { if (res.code == 200) { this.showTips('关机成功', 'success'); this.getDetail() } }) },
        formatDate(num) { return num < 10 ? '0' + num : num; },
        getAnyDate(num) {
            const today = new Date(); const year = today.getFullYear();
            const currentDate = new Date(today); currentDate.setDate(today.getDate() + num);
            const monthStr = this.formatDate(currentDate.getMonth() + 1);
            const dayStr = this.formatDate(currentDate.getDate()); const dateStr = `${monthStr}-${dayStr}`;
            return `${year}-${dateStr}`
        },
        genDateArray() {
            const result = []; const today = new Date(); const year = today.getFullYear();
            const dayNames = ['日', '一', '二', '三', '四', '五', '六'];

            for (let i = 0; i < 4; i++) {
                const currentDate = new Date(today); currentDate.setDate(today.getDate() + i);
                const monthStr = this.formatDate(currentDate.getMonth() + 1); const dayStr = this.formatDate(currentDate.getDate());
                const dateStr = `${monthStr}-${dayStr}`; const dayOfWeekStr = `周${dayNames[currentDate.getDay()]}`;
                result.push({ year: year.toString(), date: dateStr, day: i === 0 ? '今天' : dayOfWeekStr, });
            }

            this.choose.minDate = this.getAnyDate(4); this.choose.maxDate = this.getAnyDate(30); this.choose.list = result
        },
        getSelPicker() {
            const timeArray = []; const range = this.deviceInfo.canReserveTime; const [startTime, endTime] = range.split(' - ');
            const startHour = parseInt(startTime.split(':')[0], 10); const endHour = parseInt(endTime.split(':')[0], 10);
            for (let i = startHour; i <= endHour; i++) {
                for (let j = 0; j < 60; j += 10) {
                    const hour = i < 10 ? `0${i}` : i; const minute = j < 10 ? `0${j}` : j; const time = `${hour}:${minute}`;
                    if (
						i > startHour || (i === startHour && j >= parseInt(startTime.split(":")[1], 10)) &&
                        (i < endHour || (i === endHour && j <= parseInt(endTime.split(":")[1], 10)))
					) {
                        timeArray.push(time);
                    }
                }
            }
            const lastTime = timeArray[timeArray.length - 1];
            if (lastTime === "23:50") { timeArray.push('23:59') }
            this.time.select[0] = timeArray;
        },
        getWeekNumber(date) {
            const currDate = new Date(date); const dayOfWeek = currDate.getDay();
            const daysOfWeek = ['7', '1', '2', '3', '4', '5', '6']; return daysOfWeek[dayOfWeek];
        },
        timeIsNotGreaterThan(a, b) {
            const timeToMinutes = (time) => { const [hours, minutes] = time.split(':').map(Number); return hours * 60 + minutes; }
            const timeA = timeToMinutes(a); const timeB = timeToMinutes(b); return timeA < timeB;
        },
        isTimeDifferenceValid(startTime, endTime) {
            const timeToMinutes = (time) => { const [hours, minutes] = time.split(":").map(num => parseInt(num, 10)); return hours * 60 + minutes; }
            const startMinutes = timeToMinutes(startTime); const endMinutes = timeToMinutes(endTime); const timeDiff = Math.abs(endMinutes - startMinutes);
            return timeDiff >= 30 && timeDiff <= 720;
        },
        addLineBreakBeforeText(text, targets) { targets.forEach(target => { const regex = new RegExp(target, 'g'); text = text.replace(regex, '<br />' + target); }); return text; },
        onMoreTextClick() { this.choose.moreText = false; this.getAllDayReserve() },
        onDateClick(index, currDate) {
            const currentYear = new Date().getFullYear();
            const currenWeek = this.getWeekNumber(`${currentYear}-${currDate}`)
            const openDate = this.deviceInfo.canReserveWeek
            if (openDate.includes(currenWeek)) {
                this.choose.currIndex = index; this.choose.moreDate = ''
                this.choose.isMore = false; this.getAllDayReserve()
            } else {
                this.showTips('该日设备不开放预约', 'error');
            }
        },
		onConfirmDate(event) { this.choose.moreDate = event[0]; this.choose.isMore = true; this.choose.moreVisible = false; this.getAllDayReserve(); },
        onTimeClick(type) { this.time.type = type; this.time.selectVisible = true; },
        onTimeSubmit(event) { this.time[this.time.type] = event.value.length>0?event.value[0]:''; this.time.selectVisible = false; }, onTimeClose() { this.time.selectVisible = false },
        getAllDayReserve() {
            const _self = this
            const currentDate = _self.choose.isMore ? _self.choose.moreDate : `${_self.choose.list[_self.choose.currIndex].year}-${_self.choose.list[_self.choose.currIndex].date}`
            getAllDayReserveApi({ currentDate, deviceId: _self.deviceId }).then((resp) => {
                if (resp.code == 200) {
                    const result = resp.data
                    if (result.length <= 4) {
                        _self.deviceInfo.reserveTime = result
                        _self.choose.moreText = false
                    } else {
                        if (_self.choose.moreText == false) {
                            _self.deviceInfo.reserveTime = result
                            _self.choose.moreText = false
                        } else {
                            const arr = []; for (let i = 0; i < 4; i += 1) { arr.push(result[i]) }
                            _self.choose.moreText = true
                            _self.deviceInfo.reserveTime = arr
                        }
                    }
                }
            })
        },
        getDeviceDetail() {
            const _self = this
			if (!_self.instrumentId) return
            deviceDetail(_self.instrumentId).then((resp) => {
                if (resp.code == 200) {
                    const result = resp.data
					_self.$set(_self.deviceInfo, 'name', result.deviceName)
					_self.$set(_self.deviceInfo, 'code', result.deviceCode)
					_self.$set(_self.deviceInfo, 'price', _self.addLineBreakBeforeText(result.priceDesc, ["校内","校外", "不足"]) || "暂无价格")
					_self.$set(_self.deviceInfo, 'address', result.deviceAddress || "暂无设备地址")
					_self.$set(_self.deviceInfo, 'reserveTime', result.reserveTimeList)
					_self.$set(_self.deviceInfo, 'canReserveWeek', result.openList)
					_self.$set(_self.deviceInfo, 'canReserveTime', result.openTime)
					_self.$set(_self.deviceInfo, 'deviceImg', result.deviceImg || null)

                    _self.genDateArray(); _self.getSelPicker(); _self.getAllDayReserve()
                }
            }).finally(()=>{
                setTimeout(() => {
                    _self.firstLoaded = true
                }, 1000)
            })
        },
        getDetail() {
			const _self = this
			if (!_self.reserveId) return
            reserveDetail(_self.reserveId).then((resp) => {
                if (resp.code == 200) {
					_self.deviceInfo = resp.data;
					this.instrumentId = resp.data.instrumentId
                    if (resp.data.deviceReserveStatus == 7) { _self.getReject() }
                    if (_self.onCheckStatus() && _self.checkTime()) { _self.cancelReserve.button = true }					
                    _self.getDeviceDetail()
                }
            });
        },
		queryList(pageNo, pageSize) {
			uni.hideLoading();
			this.$refs.paging.endRefresh();
			this.getDetail();
		},
        onExtendAppointment() { this.extendSppointment.visible = true },
		onExtendAppointmentCancel() { this.extendSppointment.visible = false },
		onExtendAppointmentSubmit() { 
			const _self = this;
			if (!_self.time.start) { _self.showTips('请选择预约开始时间', 'error'); return }
			if (!_self.time.end) { _self.showTips('请选择预约结束时间', 'error'); return }
			if (!_self.extendSppointment.description) { _self.showTips('请填写延长预约原因', 'error'); return }
			const reserveDate = _self.choose.isMore ? _self.choose.moreDate : `${_self.choose.list[_self.choose.currIndex].year}-${_self.choose.list[_self.choose.currIndex].date}`
			const pushData = { 
				"id": this.reserveId,
				"extendReason": this.extendSppointment.description,
				"extendStartTime": `${reserveDate} ${_self.time.start}:00`,
				"extendEndTime": `${reserveDate} ${_self.time.end}:00`,	
			}
			appDeviceReserveExtend(pushData).then((resp) => { 
                if (resp.code == 200) {
					this.showTips('延长预约成功', 'success');
					this.getDetail();
                    this.extendSppointment.visible = false 
                } 
            }) 
        },
        onSubmitModal() {
            if (!this.cancelReserve.description) { this.showTips('请填写取消原因', 'error'); return }
            const pushData = {
				cancelReason: this.cancelReserve.description,
				instrmentReserveId: this.reserveId
			}
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
.detailPage {
	width: 100%; box-sizing: border-box;
	background-color: #fff; padding: 32rpx;
	.status {
		width: 100%; box-sizing: border-box;
		border-radius: 8rpx; font-weight: 500;
		font-size: 32rpx; line-height: 40rpx;
		text-align: center; padding: 20rpx;
		margin-bottom: 24rpx;
		&.blue {
			background: rgba(13, 112, 243, 0.1);
			color: #0d70f3;
		}
		&.green {
			background: rgba(3, 171, 110, 0.1);
			color: #03ab6e;
		}
		&.red {
			background: rgba(231, 41, 41, 0.1);
			color: #e72929;
			.text {
				margin-left: 12rpx;
				font-weight: 400;
				font-size: 28rpx;
				color: #4b4b4e;
			}
		}
	}
	
	.detailForm {
		width: 100%;
		margin-top: 12rpx;
		.info {
			position: relative;
			width: 100%;
			margin-top: 12rpx;
			padding: 0 8rpx 0 170rpx;
			font-size: 28rpx;
			line-height: 32rpx;
			position: relative;
			.title {
				position: absolute;
				top: 0; left: 0; width: 160rpx;
				font-family: PingFang SC, PingFang SC;
				font-weight: 400; color: #9699a1;
				text-align: right;
			}
		}
	}
}

.detailDate {
	position: relative;
	width: 100%;
	box-sizing: border-box;
	.detailDateTitle {
		position: relative;
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-family: PingFang SC, PingFang SC;
		font-weight: bold;
		font-size: 32rpx;
		color: #000000;
		line-height: 38rpx;
		text-align: left;
		margin: 22rpx 0;
		margin-top: 40rpx;
	}
	.detailDateDay {
		position: relative; width: 100%;
		display: flex; align-items: stretch;
		justify-content: space-between;
		.detailDateDayItem {
			position: relative; width: 19%;
			padding: 28rpx 16rpx; box-sizing: border-box;
			background: #f0f2f7; border-radius: 8rpx 8rpx 8rpx 8rpx;
			.detailDateDayItem-num {
				position: relative; width: 100%;
				font-family: PingFang SC, PingFang SC;
				font-weight: 500; font-size: 26rpx;
				color: #4b4b4e; line-height: 34rpx;
				text-align: center;
			}
			.detailDateDayItem-text {
				position: relative; width: 100%;
				font-family: PingFang SC, PingFang SC;
				font-weight: 400; font-size: 24rpx;
				color: #4b4b4e; line-height: 32rpx;
				text-align: center; margin-top: 16rpx;
			}
		}
		.detailDateDayItemCurr {
			position: relative;
			width: 19%; padding: 18rpx 8rpx;
			box-sizing: border-box; background: #0d70f3;
			font-size: 24rpx; border-radius: 8rpx 8rpx 8rpx 8rpx;
			.detailDateDayItem-num {
				position: relative; width: 100%;
				font-family: PingFang SC, PingFang SC;
				font-weight: 500; font-size: 26rpx;
				color: white; line-height: 36rpx;
				text-align: center;
			}
			.detailDateDayItem-text {
				position: relative; width: 100%;
				font-family: PingFang SC, PingFang SC;
				font-weight: 400; font-size: 24rpx;
				color: white; line-height: 32rpx;
				text-align: center; margin-top: 16rpx;
			}
		}
		.detailDateDayItemMore {
			position: relative; width: 19%;
			padding: 28rpx 16rpx; box-sizing: border-box;
			background: #0d70f3; border-radius: 8rpx 8rpx 8rpx 8rpx;
			display: flex; align-items: center; justify-content: center;
			.detailDateDayItemMoreText {
				position: relative; font-family: PingFang SC, PingFang SC;
				font-weight: 500; font-size: 30rpx;
				color: white; line-height: 36rpx;
				text-align: center;
			}
		}
		.detailDateDayItemMore-curr {
			position: relative; width: 19%;
			padding: 28rpx 16rpx; box-sizing: border-box;
			background: #f0f2f7; border-radius: 8rpx 8rpx 8rpx 8rpx;
			display: flex; align-items: center;
			justify-content: center;
			.detailDateDayItemMoreText {
				position: relative; font-family: PingFang SC, PingFang SC;
				font-weight: 500; font-size: 30rpx;
				color: #4b4b4e; line-height: 36rpx;
				text-align: center;
			}
		}
	}
	.detailDateHasList {
		position: relative;
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: space-between;
		flex-wrap: wrap;
		box-sizing: border-box;
		.detailDateHasItem {
			position: relative;
			box-sizing: border-box;
			width: calc(50% - 10rpx);
			margin-bottom: 20rpx;
			background: #f0f2f7;
			border-radius: 8rpx 8rpx 8rpx 8rpx;
			font-family: PingFang SC, PingFang SC;
			font-weight: 400;
			font-size: 30rpx;
			color: #4b4b4e;
			line-height: 36rpx;
			text-align: center;
			font-style: normal;
			text-transform: none;
			padding: 20rpx;
		}
	}
	.detailDateMoreList {
		position: relative;
		width: 100%;
		font-family: PingFang SC, PingFang SC;
		font-weight: 400;
		font-size: 26rpx;
		color: #9699a1;
		line-height: 32rpx;
		text-align: center;
		margin-bottom: 40rpx;
	}
	.detailDatHasBox {
		position: relative; width: 100%;
		padding: 40rpx; border: 2rpx solid #cecece;
		border-radius: 8px; margin-bottom: 30rpx;
		box-sizing: border-box;
	}
	.detailDateChoose {
		position: relative; width: 100%;
		display: flex; align-items: center;
		justify-content: space-between; margin-bottom: 30rpx;
		.detailDateChooseItem {
			position: relative; width: 48%;
			.detailDateChooseItemTitle {
				position: relative;
				width: 100%;
				text-align: center;
				font-family: PingFang SC, PingFang SC;
				font-weight: 400;
				font-size: 28rpx;
				color: #000000;
				line-height: 32rpx;
				text-align: center;
				margin: 22rpx auto;
			}
			.detailDateChooseItemButton {
				position: relative;
				width: 100%;
				border-radius: 60rpx;
				border: 2rpx solid rgba(3, 171, 110, 0.5);
				font-family: PingFang SC, PingFang SC;
				font-weight: 400;
				font-size: 28rpx;
				color: #03ab6e;
				line-height: 32rpx;
				text-align: center;
				padding: 20rpx 0;
			}
		}
	}
}
</style>