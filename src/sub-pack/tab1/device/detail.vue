<template>
	<z-paging
		ref="paging" class="detailPage" :paging-style="{ backgroundColor: 'white' }" v-model="dataList" @query="queryList"
		:fixed="true" :auto="false" :refresher-enabled="true" :auto-show-back-to-top="true" :auto-scroll-to-top-when-reload="true"
		:loading-more-enabled="false" :show-refresher-when-reload="true" hide-empty-view
	>
        <view slot="top"><u-navbar title="详情" :fixed="false" background="transparent" color="#000" left-icon-color="#000" @leftClick="onBack" /></view>
		<ut-components ref="utComponents" />
        <view class="detail">
            <view class="detailPic">
				<image class="detailImg" :src="deviceInfo.deviceImg ? deviceInfo.deviceImg : `${$staticPath}imgs/devcieCover.png`" />
			</view>
            <view class="detailContent">
                <view class="detailInfo">
					<view class="detailInfoTitle">{{ deviceInfo.name }}</view>
					<view class="detailInfoText" style="margin-bottom: 10rpx;">
						设备编号{{ deviceInfo.code }}
					</view>
					<view class="detailInfoText">{{ deviceInfo.address }}</view>
				</view>
                <view class="detailDate">
					<view class="detailDateTitle"><view>收费标准</view></view>
					<view class="detailInfo">
						<view class="detailInfoText middle" v-html="deviceInfo.price"></view>
					</view>
				</view>
                <view class="detailDate">
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
                    <view class="detailDateTitle">已预约时间</view>
                    <view class="detailDateHasList" v-if="deviceInfo.reserveTime && deviceInfo.reserveTime.length > 0">
						<view class="detailDateHasItem" v-for="item,idx in deviceInfo.reserveTime" :key="idx">
							{{ `${item.reserveStartTime} - ${item.reserveEndTime}` }}
						</view>
					</view>
                    <view class="detailDateMoreList" @click="onClickMoreText" v-if="choose.moreText">查看更多</view>
                    <view class="detailDatHasBox" v-if="deviceInfo.reserveTime && deviceInfo.reserveTime.length == 0"><u-empty mode="data" text="当日暂无预约" /></view>
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
                </view>
                <view class="detailForm">
                    <view class="detailFormItem"><view class="detailFormItemTitle">预约人姓名</view><view class="detailFormItemInput"><u--input placeholder="预约人姓名" border="surround" v-model="form.name" /></view></view>
                    <view class="detailFormItem"><view class="detailFormItemTitle">预约人电话</view><view class="detailFormItemInput"><u--input placeholder="请输入预约人电话" border="surround" v-model="form.phone" /></view></view>
                    <view class="detailFormItem">
						<view class="detailFormItemTitle">团队选择</view>
						<view class="detailFormItemInput" @click="group.visible = true">
							<u--input v-model="group.currName" disabled disabledColor="#ffffff" placeholder="请选择团队" border="surround" />
							<view class="detailFormItem-arr"><u-icon name="arrow-right" /></view>
						</view>
					</view>
                    <view class="detailFormItem" v-if="teacher.inputVisible">
						<view class="detailFormItemTitle">导师选择</view>
						<view class="detailFormItemInput" @click="teacher.visible = true">
							<u--input v-model="teacher.currName" disabled disabledColor="#ffffff" placeholder="请选择团队" border="surround" />
							<view class="detailFormItem-arr"><u-icon name="arrow-right" /></view>
						</view>
					</view>
                    <view class="detailFormItem" v-if="schoolInput.visible">
						<view class="detailFormItemTitle">所在学院</view>
						<view class="detailFormItemInput">
							<u--input placeholder="请输入所在学院" border="surround" v-model="form.school" />
						</view>
					</view>
                    <view class="detailFormItem" v-if="schoolInput.visible">
						<view class="detailFormItemTitle">备注信息</view>
						<view class="detailFormItemInput">
							<u--textarea v-model="form.info" placeholder="请输入备注信息" :autoHeight="false" />
						</view>
					</view>
                    <view class="detailFormItem">
						<view class="detailFormItemTitle">用途说明</view>
						<view class="detailFormItemInput">
							<u--textarea v-model="form.description" placeholder="请输入用途说明" :autoHeight="false" />
						</view>
					</view>
                    <!-- <view class="submit-button"><u-button @click="onSubmit" type="primary" text="提交预约" /></view> -->
                </view>
            </view>
        </view>        
        <!-- <u-datetime-picker :show="time.selectVisible" mode="datetime" @close="onTimeClose" @confirm="onTimeSubmit" /> -->        
        <u-picker :show="time.selectVisible" ref="uPicker" :columns="time.select" @confirm="onTimeSubmit" @cancel="onTimeClose" />
        <u-picker :show="group.visible" :columns="group.list" keyName="label" @confirm="onCurrGroup" @cancel="group.visible = false" />
        <u-picker :show="teacher.visible" :columns="teacher.list" keyName="label" @confirm="onCurrTeacher" @cancel="teacher.visible = false" />
        <u-calendar :show="choose.moreVisible" :defaultDate="choose.minDate" :minDate="choose.minDate" :maxDate="choose.maxDate" @confirm="onConfirmDate" @close="choose.moreVisible = false" />
        <view slot="bottom" class="pubBotBtn pubTopLine"><view class="wrap"><view class="btn" @click="onSubmit"><u-button type="primary" text="提交预约" /></view></view></view>
    </z-paging>
</template>
<script>
import {
	deviceSubmit, deviceDetail, getAllDayReserve as getAllDayReserveApi,
	getGroup as _getGroup, getTeacher as _getTeacher
} from '@/app/api/index'
export default {
    data() {
        return {
			dataList: [], firstLoaded: false, instrumentId: null, deviceId: null,
            choose: { currIndex: 0, list: [], isMore: false, moreDate: '', moreVisible: false, minDate: '', maxDate: '', moreText: true },
			time: { start: null, end: null, select: [[]], selectVisible: false, type: '' },
            form: { name: '', phone: '', description: '', group: '', teacher: '', school: '', info: '' },
			deviceInfo: { name: "", code: "", address: "", price: "", reserveTime: [], canReserveWeek: [], canReserveTime: '' },
            group: { visible: false, list: [[]], currName: '', currCode: '' },
			teacher: { visible: false, list: [[]], currName: '', inputVisible: false },
			schoolInput: { visible: false }
        }
    },
    onLoad(options) {
        this.instrumentId = options.instrumentId; this.deviceId = options.deviceId;
        this.eventHanlder = () => { this.getDeviceDetail(); this.getGroup() }
        this.getDeviceDetail(); this.getGroup()
    },
    methods: {
		queryList(pageNo, pageSize) {
			this.$refs.paging.endRefresh();
            this.getDeviceDetail(); this.getGroup()
            uni.hideLoading();
		},
        formatDate(num) { return num < 10 ? '0' + num : num; },
        getAnyDate(num) {
            const today = new Date();
            const year = today.getFullYear();
            const currentDate = new Date(today);
            currentDate.setDate(today.getDate() + num);
            const monthStr = this.formatDate(currentDate.getMonth() + 1);
            const dayStr = this.formatDate(currentDate.getDate());
            const dateStr = `${monthStr}-${dayStr}`;
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
            const timeArray = [];
            const range = this.deviceInfo.canReserveTime;
            const [startTime, endTime] = range.split(' - ');
            const startHour = parseInt(startTime.split(':')[0], 10);
            const endHour = parseInt(endTime.split(':')[0], 10);
            for (let i = startHour; i <= endHour; i++) {
                for (let j = 0; j < 60; j += 10) {
                    const hour = i < 10 ? `0${i}` : i;
                    const minute = j < 10 ? `0${j}` : j;
                    const time = `${hour}:${minute}`;

                    if (i > startHour || (i === startHour && j >= parseInt(startTime.split(":")[1], 10)) &&
                        (i < endHour || (i === endHour && j <= parseInt(endTime.split(":")[1], 10)))) {
                        timeArray.push(time);
                    }
                }
            }
            const lastTime = timeArray[timeArray.length - 1];
            if (lastTime === "23:50") { timeArray.push('23:59') }
            this.time.select[0] = timeArray;
        },
        getWeekNumber(date) {
            const currDate = new Date(date);
            const dayOfWeek = currDate.getDay();
            const daysOfWeek = ['7', '1', '2', '3', '4', '5', '6'];
            return daysOfWeek[dayOfWeek];
        },
        timeIsNotGreaterThan(a, b) {
            const timeToMinutes = (time) => {
                const [hours, minutes] = time.split(':').map(Number);
                return hours * 60 + minutes;
            }
            const timeA = timeToMinutes(a);
            const timeB = timeToMinutes(b);
            return timeA < timeB;
        },
        isTimeDifferenceValid(startTime, endTime) {
            function timeToMinutes(time) {
                const [hours, minutes] = time.split(":").map(num => parseInt(num, 10));
                return hours * 60 + minutes;
            }
            const startMinutes = timeToMinutes(startTime);
            const endMinutes = timeToMinutes(endTime);
            const timeDiff = Math.abs(endMinutes - startMinutes);
            return timeDiff >= 30 && timeDiff <= 720;
        },
        addLineBreakBeforeText(text, targets) {
            targets.forEach(target => {
                const regex = new RegExp(target, 'g');
                text = text.replace(regex, '<br />' + target);
            });
            return text;
        },
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
        onTimeClose() { this.time.selectVisible = false },
        onTimeSubmit(event) {
            console.log('onTimeSubmit',this.time.type, event.value[0])
            this.time[this.time.type] = event.value.length>0?event.value[0]:''; this.time.selectVisible = false
        },
        getDeviceDetail() {
            const _self = this
            deviceDetail(_self.instrumentId).then((resp) => {
                if (resp.code == 200) {
                    const result = resp.data
                    _self.deviceInfo.name = result.deviceName; _self.deviceInfo.code = result.deviceCode
                    _self.deviceInfo.price = _self.addLineBreakBeforeText(result.priceDesc, ["校内","校外", "不足"]) || "暂无价格"
                    _self.deviceInfo.address = result.deviceAddress || "暂无设备地址"
                    _self.deviceInfo.reserveTime = result.reserveTimeList
                    _self.deviceInfo.canReserveWeek = result.openList
                    _self.deviceInfo.canReserveTime = result.openTime
                    _self.deviceInfo.deviceImg = result.deviceImg || null

                    _self.genDateArray(); _self.getSelPicker(); _self.getAllDayReserve()
                }
            }).finally(()=>{
                setTimeout(() => {
                    _self.firstLoaded = true
                }, 1000)
            })
        },
        getGroup() {
            _getGroup().then((resp) => {
                if (resp.code == 200) {
                    let arr = []; for (let item of resp.data) {
                        arr.push({ label: item.name, id: item.id, code: item.code })
                    }
                    this.group.list[0] = arr;
                }
            });
        },
        getTeacher(id) {
            _getTeacher(id).then((resp) => {
                if (resp.code == 200) {
                    let arr = []; for (let item of resp.data) { arr.push({ label: item.realname, id: item.id }) }
                    this.teacher.list[0] = arr;
                }
            })
        },
        onCurrGroup(e) {
            const _self = this
            _self.group.currName = e.value[0].label
            _self.group.currCode = e.value[0].code
            _self.form.group = e.value[0].id
            _self.getTeacher(e.value[0].id); _self.group.visible = false
            _self.teacher.currName = ''; _self.form.teacher = ''
            _self.form.school = ''; _self.form.info = ''
            if (e.value[0].code != 'xn' && e.value[0].code != 'xw') {
                _self.teacher.inputVisible = true
                _self.schoolInput.visible = false
            } else {
                _self.teacher.inputVisible = false
                _self.schoolInput.visible = true
            }
        },
        onCurrTeacher(e) {
            this.teacher.currName = e.value[0].label
            this.form.teacher = e.value[0].id
            this.teacher.visible = false
        },
        onVisibleFalse(type) { if (type==1) { this.group.visible = false } if (type==2) { this.teacher.visible = false } if (type==3) { this.choose.moreVisible = false } },
        onSubmit() {
            const _self = this; if (!_self.checkUserInfo()) { return; }
            if (!_self.time.start) { _self.showTips('请选择预约开始时间', 'error'); return } if (!_self.time.end) { _self.showTips('请选择预约结束时间', 'error'); return }
            if (!_self.timeIsNotGreaterThan(_self.time.start, _self.time.end)) { _self.showTips('预约开始时间不能大于等于预约结束时间', 'error'); return }
            if (!_self.isTimeDifferenceValid(_self.time.start, _self.time.end)) { _self.showTips('使用设备至少三十分钟且不超过十二小时', 'error'); return }
            if (!_self.form.name) { _self.showTips('请输入预约人姓名', 'error'); return } if (!_self.form.phone) { _self.showTips('请输入预约人电话', 'error'); return }
            if (!/^1[3-9]\d{9}$/.test(_self.form.phone)) { _self.showTips('请输入正确的电话号码', 'error'); return }
            if (!_self.form.description) { _self.showTips('请输入用途说明', 'error'); return } if (_self.form.group == '') { _self.showTips('请选择团队', 'error'); return }
            if (_self.group.currCode != 'xn' && _self.group.currCode != 'xw' && _self.form.teacher == '') { _self.showTips('请选择导师', 'error'); return }
            if ((_self.group.currCode == 'xn' || _self.group.currCode == 'xw') && _self.form.school == '') { _self.showTips('请填写所在学院', 'error'); return }
            const currDate = _self.choose.list[_self.choose.currIndex]
            const pushData = {
                deviceId: _self.instrumentId, projectMentorDictId: _self.form.group,
                projectMentorDictName: _self.group.currName, projectMentorDictDetId: _self.form.teacher,
                projectMentorDictDetName: _self.teacher.currName || _self.form.school,

                reserveDate: _self.choose.isMore ? _self.choose.moreDate : `${currDate.year}-${currDate.date}`,
                reserveStartTime: `${_self.time.start}:00`, reserveEndTime: `${_self.time.end}:00`,

				reserveName: _self.form.name, reservePhone: _self.form.phone,
				projectMentorRemark: _self.form.info, reservePurpose: _self.form.description,
            }
            console.log('deviceSubmit::',pushData)
            deviceSubmit(pushData).then((resp) => {
                if (resp.code == 200) {
                    _self.showTips('预约成功，正在跳转', 'success');
                    setTimeout(() => {
                        _self.$eUni.redirectTo({ url:`/sub-pack/tab5/reserve/detail?id=${resp.data.instrumentId}` });
                    }, 2000);
                }
            })
        }
    }
}
</script>
<style lang="scss" scoped>
.detail {
	position: relative;
	width: 100%;
	box-sizing: border-box;
	background-color: #fff;
	.detailPic {
		position: relative;
		width: 100%;
		height: auto;
		aspect-ratio: 1.25/1;
		.detailImg {
			position: relative;
			width: 100%;
			height: 100%;
		}
	}
	.detailContent {
		position: relative;
		width: 100%;
		background-color: #fff;
		padding: 20rpx;
		box-sizing: border-box;
		.detailInfo {
			position: relative;
			width: 100%;
			.detailInfoTitle {
				position: relative;
				width: 100%;
				font-family: PingFang SC, PingFang SC;
				font-weight: bold;
				font-size: 32rpx;
				color: #000000;
				line-height: 38rpx;
				text-align: left;
				margin: 22rpx 0;
			}
			.detailInfoText {
				position: relative;
				width: 100%;
				font-family: PingFang SC, PingFang SC;
				font-weight: 400;
				font-size: 26rpx;
				color: #9699a1;
				line-height: 32rpx;
				text-align: left;
			}
			.middle {
				margin: 30rpx 0;
				margin-top: 0;
				line-height: 26px;
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
				position: relative;
				width: 100%;
				display: flex;
				align-items: stretch;
				justify-content: space-between;
				.detailDateDayItem {
					position: relative;
					width: 19%;
					padding: 28rpx 16rpx;
					box-sizing: border-box;
					background: #f0f2f7;
					border-radius: 8rpx 8rpx 8rpx 8rpx;
					.detailDateDayItem-num {
						position: relative;
						width: 100%;
						font-family: PingFang SC, PingFang SC;
						font-weight: 500;
						font-size: 30rpx;
						color: #4b4b4e;
						line-height: 36rpx;
						text-align: center;
						font-style: normal;
						text-transform: none;
					}
					.detailDateDayItem-text {
						position: relative;
						width: 100%;
						font-family: PingFang SC, PingFang SC;
						font-weight: 400;
						font-size: 26rpx;
						color: #4b4b4e;
						line-height: 32rpx;
						text-align: center;
						font-style: normal;
						text-transform: none;
						margin-top: 20rpx;
					}
				}
				.detailDateDayItemCurr {
					position: relative;
					width: 19%;
					padding: 28rpx 16rpx;
					box-sizing: border-box;
					background: #0d70f3;
					border-radius: 8rpx 8rpx 8rpx 8rpx;
					.detailDateDayItem-num {
						position: relative;
						width: 100%;
						font-family: PingFang SC, PingFang SC;
						font-weight: 500;
						font-size: 30rpx;
						color: white;
						line-height: 36rpx;
						text-align: center;
						font-style: normal;
						text-transform: none;
					}
					.detailDateDayItem-text {
						position: relative;
						width: 100%;
						font-family: PingFang SC, PingFang SC;
						font-weight: 400;
						font-size: 26rpx;
						color: white;
						line-height: 32rpx;
						text-align: center;
						font-style: normal;
						text-transform: none;
						margin-top: 20rpx;
					}
				}
				.detailDateDayItemMore {
					position: relative;
					width: 19%;
					padding: 28rpx 16rpx;
					box-sizing: border-box;
					background: #0d70f3;
					border-radius: 8rpx 8rpx 8rpx 8rpx;
					display: flex;
					align-items: center;
					justify-content: center;
					.detailDateDayItemMoreText {
						position: relative;
						font-family: PingFang SC, PingFang SC;
						font-weight: 500;
						font-size: 30rpx;
						color: white;
						line-height: 36rpx;
						text-align: center;
						font-style: normal;
						text-transform: none;
					}
				}
				.detailDateDayItemMore-curr {
					position: relative;
					width: 19%;
					padding: 28rpx 16rpx;
					box-sizing: border-box;
					background: #f0f2f7;
					border-radius: 8rpx 8rpx 8rpx 8rpx;
					display: flex;
					align-items: center;
					justify-content: center;
					.detailDateDayItemMoreText {
						position: relative;
						font-family: PingFang SC, PingFang SC;
						font-weight: 500;
						font-size: 30rpx;
						color: #4b4b4e;
						line-height: 36rpx;
						text-align: center;
						font-style: normal;
						text-transform: none;
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
				position: relative;
				width: 100%;
				padding: 40rpx;
				border: 2rpx solid #cecece;
				border-radius: 8px;
				margin-bottom: 40rpx;
				box-sizing: border-box;
			}
			.detailDateChoose {
				position: relative;
				width: 100%;
				display: flex;
				align-items: center;
				justify-content: space-between;
				.detailDateChooseItem {
					position: relative;
					width: 48%;
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
						font-style: normal;
						text-transform: none;
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
						font-style: normal;
						text-transform: none;
						padding: 20rpx 0;
					}
				}
			}
		}
		.detailForm {
			position: relative;
			width: 100%;
			margin-top: 50rpx;
			.detailFormItem {
				position: relative;
				width: 100%;
				margin-top: 30rpx;
				.detailFormItemTitle {
					position: relative;
					width: 100%;
					margin-bottom: 10rpx;
					font-family: PingFang SC, PingFang SC;
					font-weight: 400;
					font-size: 28rpx;
					color: #4b4b4e;
					line-height: 32rpx;
					text-align: left;
					font-style: normal;
					text-transform: none;
					padding-left: 10rpx;
				}
				.detailFormItemInput {
					position: relative;
					width: 100%;
					.detailFormItem-arr {
						position: absolute;
						margin: auto;
						top: 11px;
						right: 10px;
					}
				}
			}
			.submit-button {
				position: relative;
				width: 100%;
				margin-top: 30rpx;
				margin-bottom: constant(safe-area-inset-bottom);
				margin-bottom: env(safe-area-inset-bottom);
			}
		}
	}
}
    
/*共用底部按钮*/
.pubBotBtn {
	background: #fff;
    padding: 16rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
	.wrap {
        padding: 0;
        width: 100%;
	}
}
</style>