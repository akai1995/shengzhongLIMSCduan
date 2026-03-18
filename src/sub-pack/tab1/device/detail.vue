<template>
	<z-paging
		ref="paging" class="detailPage" :paging-style="{ backgroundColor: 'white' }" v-model="dataList" @query="queryList"
		:fixed="true" :auto="false" :refresher-enabled="true" :auto-show-back-to-top="true" :auto-scroll-to-top-when-reload="true"
		:loading-more-enabled="false" :show-refresher-when-reload="true" hide-empty-view
	>
        <view slot="top"><u-navbar title="详情" :fixed="false" background="transparent" color="#000" left-icon-color="#000" @leftClick="onBack" /></view>
		<ut-components ref="utComponents" />
        <view class="detail">
            <view class="detail-pic"><image class="detail-img" :src="deviceInfo.deviceImg ? deviceInfo.deviceImg : `${$staticPath}imgs/devcieCover.png`" /></view>
            <view class="detail-content">
                <view class="detail-info"><view class="detail-info-title">{{ deviceInfo.name }}</view><view class="detail-info-text" style="margin-bottom: 10rpx;">设备编号{{ deviceInfo.code }}</view><view class="detail-info-text">{{ deviceInfo.address }}</view></view>
                <view class="detail-date"><view class="detail-date-title"><view>收费标准</view></view><view class="detail-info"><view class="detail-info-text middle" v-html="deviceInfo.price"></view></view></view>
                <view class="detail-date">
                    <view class="detail-date-title"><view>选择日期</view><view v-if="choose.isMore">{{ choose.moreDate }}</view></view>
                    <view class="detail-date-day">
                        <view :class="index == choose.currIndex && !choose.isMore ? 'detail-date-day-item-curr' : 'detail-date-day-item'" @click="onDateClick(index, item.date)" v-for="(item, index) in choose.list" :key="index"><view class="detail-date-day-item-num">{{ item.date }}</view><view class="detail-date-day-item-text">{{ item.day }}</view></view>
                        <view :class="choose.isMore ? 'detail-date-day-item-more' : 'detail-date-day-item-more-curr'" @click="choose.moreVisible = true"><view class="detail-date-day-item-more-text">更多</view></view>
                    </view>
                    <view class="detail-date-title">已预约时间</view>
                    <view class="detail-date-has-list" v-if="deviceInfo.reserveTime && deviceInfo.reserveTime.length > 0"><view class="detail-date-has-item" v-for="item,idx in deviceInfo.reserveTime" :key="idx">{{ `${item.reserveStartTime} - ${item.reserveEndTime}` }}</view></view>
                    <view class="detail-date-more-list" @click="onClickMoreText" v-if="choose.moreText">查看更多</view>
                    <view class="detail-date-has-box" v-if="deviceInfo.reserveTime && deviceInfo.reserveTime.length == 0"><u-empty mode="data" text="当日暂无预约" /></view>
                    <view class="detail-date-choose">
                        <view class="detail-date-choose-item"><view class="detail-date-choose-item-title">开始时间</view><view class="detail-date-choose-item-button" @click="onTimeClick('start')">{{ time.start ? time.start : '请选择' }}</view></view>
                        <view class="detail-date-choose-item"><view class="detail-date-choose-item-title">结束时间</view><view class="detail-date-choose-item-button" @click="onTimeClick('end')">{{ time.end ? time.end : '请选择' }}</view></view>
                    </view>
                </view>
                <view class="detail-form">
                    <view class="detail-form-item"><view class="detail-form-item-title">预约人姓名</view><view class="detail-form-item-input"><u--input placeholder="预约人姓名" border="surround" v-model="form.name"></u--input></view></view>
                    <view class="detail-form-item"><view class="detail-form-item-title">预约人电话</view><view class="detail-form-item-input"><u--input placeholder="请输入预约人电话" border="surround" v-model="form.phone"></u--input></view></view>
                    <view class="detail-form-item"><view class="detail-form-item-title">团队选择</view><view class="detail-form-item-input" @click="group.visible = true"><u--input v-model="group.currName" disabled disabledColor="#ffffff" placeholder="请选择团队" border="surround"></u--input><view class="detail-form-item-arr"><u-icon name="arrow-right"></u-icon></view></view></view>
                    <view class="detail-form-item" v-if="teacher.inputVisible"><view class="detail-form-item-title">导师选择</view><view class="detail-form-item-input" @click="teacher.visible = true"><u--input v-model="teacher.currName" disabled disabledColor="#ffffff" placeholder="请选择团队" border="surround"></u--input><view class="detail-form-item-arr"><u-icon name="arrow-right"></u-icon></view></view></view>
                    <view class="detail-form-item" v-if="schoolInput.visible"><view class="detail-form-item-title">所在学院</view><view class="detail-form-item-input"><u--input placeholder="请输入所在学院" border="surround" v-model="form.school"></u--input></view></view>
                    <view class="detail-form-item" v-if="schoolInput.visible"><view class="detail-form-item-title">备注信息</view><view class="detail-form-item-input"><u--textarea v-model="form.info" placeholder="请输入备注信息" :autoHeight="false"></u--textarea></view></view>
                    <view class="detail-form-item"><view class="detail-form-item-title">用途说明</view><view class="detail-form-item-input"><u--textarea v-model="form.description" placeholder="请输入用途说明" :autoHeight="false"></u--textarea></view></view>
                    <!-- <view class="submit-button"><u-button @click="onSubmit" type="primary" text="提交预约"></u-button></view> -->
                </view>
            </view>
        </view>        
        <!-- <u-datetime-picker :show="time.selectVisible" mode="datetime" @close="onTimeClose" @confirm="onTimeSubmit" /> -->        
        <u-picker :show="time.selectVisible" ref="uPicker" :columns="time.select" @confirm="currTimeSubmit" @cancel="currTimeCancel" />
        <u-picker :show="group.visible" :columns="group.list" keyName="label" @confirm="onCurrGroup" @cancel="group.visible = false" />
        <u-picker :show="teacher.visible" :columns="teacher.list" keyName="label" @confirm="onCurrTeacher" @cancel="teacher.visible = false" />
        <u-calendar :show="choose.moreVisible" :defaultDate="choose.minDate" :minDate="choose.minDate" :maxDate="choose.maxDate" @confirm="onConfirmDate" @close="choose.moreVisible = false" />
        <view slot="bottom" class="pubBotBtn pubTopLine"><view class="wrap"><view class="btn" @click="onSubmit"><u-button type="primary" text="提交预约" /></view></view></view>
    </z-paging>
</template>
<script>
import {  deviceSubmit, deviceDetail, getAllDayReserve, getGroup as _getGroup, getTeacher as _getTeacher } from '@/app/api/index'
export default {
    data() {
        return {
			dataList: [], firstLoaded: false, instrumentId: null, deviceId: null,
            choose: { currIndex: 0, list: [], isMore: false, moreDate: '', moreVisible: false, minDate: '', maxDate: '', moreText: true }, time: { start: null, end: null, select: [[]], selectVisible: false, type: '' },
            form: { name: '', phone: '', description: '', group: '', teacher: '', school: '', info: '' }, deviceInfo: { name: "", code: "", address: "", price: "", reserveTime: [], canReserveWeek: [], canReserveTime: '' },
            group: { visible: false, list: [[]], currName: '', currCode: '' }, teacher: { visible: false, list: [[]], currName: '', inputVisible: false }, schoolInput: { visible: false }
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
        formatDate(num) {
            return num < 10 ? '0' + num : num;
        },
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
                    let arr = []; for (let item of resp.data) { arr.push({ label: item.name, id: item.id }) }
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
        getAllDayReserve() {
            const _self = this
            const currentDate = _self.choose.isMore ? _self.choose.moreDate : `${_self.choose.list[_self.choose.currIndex].year}-${_self.choose.list[_self.choose.currIndex].date}`
            getAllDayReserve({ currentDate, deviceId: _self.deviceId }).then((resp) => {
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
        onConfirmDate(event) {
            this.choose.moreDate = event[0]
            this.choose.isMore = true
            this.choose.moreVisible = false
            this.getAllDayReserve()
        },
        onTimeClick(type) {
            this.time.type = type
            this.time.selectVisible = true
        },
        currTimeSubmit(event) {
            console.log('onTimeSubmit',this.time.type, event.value[0])
            // const date = new Date(event.value); // 毫秒级时间戳
            // // 格式化为 YYYY-MM-DD HH:mm:ss
            // const dateTimeVal = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ` +
            // `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
            // console.log(dateTimeVal); // 输出：2025-03-11 00:00:00
            this.time[this.time.type] = event.value.length>0?event.value[0]:''
            this.time.selectVisible = false
        },
        onTimeClose() {
            this.time.selectVisible = false
        },
        onVisibleFalse(type) {
            if (type==1) this.group.visible = false
            if (type==2) this.teacher.visible = false
            if (type==3) this.choose.moreVisible = false
        },
        onSubmit() {
            const _self = this; if (!_self.checkUserInfo()) { return; }
            if (!_self.time.start) { _self.showTips('请选择预约开始时间', 'error'); return }
            if (!_self.time.end) { _self.showTips('请选择预约结束时间', 'error'); return }
            if (!_self.timeIsNotGreaterThan(_self.time.start, _self.time.end)) { _self.showTips('预约开始时间不能大于等于预约结束时间', 'error'); return }
            if (!_self.isTimeDifferenceValid(_self.time.start, _self.time.end)) { _self.showTips('使用设备至少三十分钟且不超过十二小时', 'error'); return }
            if (!_self.form.name) { _self.showTips('请输入预约人姓名', 'error'); return }
            if (!_self.form.phone) { _self.showTips('请输入预约人电话', 'error'); return }
            if (!/^1[3-9]\d{9}$/.test(_self.form.phone)) { _self.showTips('请输入正确的电话号码', 'error'); return }
            if (!_self.form.description) { _self.showTips('请输入用途说明', 'error'); return }
            if (_self.form.group == '') { _self.showTips('请选择团队', 'error'); return }
            if (_self.group.currCode != 'xn' && _self.group.currCode != 'xw' && _self.form.teacher == '') { _self.showTips('请选择导师', 'error'); return }
            if ((_self.group.currCode == 'xn' || _self.group.currCode == 'xw') && _self.form.school == '') { _self.showTips('请填写所在学院', 'error'); return }
            const currDate = _self.choose.list[_self.choose.currIndex]
            const pushData = {
                deviceId: _self.instrumentId, projectMentorDictDetId: _self.form.teacher,
                projectMentorDictDetName: _self.teacher.currName || _self.form.school,
                projectMentorDictId: _self.form.group,
                projectMentorDictName: _self.group.currName, projectMentorRemark: _self.form.info,
                reserveDate: _self.choose.isMore ? _self.choose.moreDate : `${currDate.year}-${currDate.date}`,
                reserveEndTime: `${_self.time.end}:00`, reservePurpose: _self.form.description,
                reserveStartTime: `${_self.time.start}:00`, reserveName: _self.form.name, reservePhone: _self.form.phone,
            }
            console.log('deviceSubmit::',pushData)
            deviceSubmit(pushData).then((resp) => {
                if (resp.code == 200) {
                    _self.showTips('预约成功，正在跳转', 'success');
                    setTimeout(() => {
                        _self.$ut.jump(`/sub-pack/tab5/reserve/detail?id=${resp.data.instrumentId}`);
                    }, 2000);
                }
            });
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
	.detail-pic {
		position: relative;
		width: 100%;
		height: auto;
		aspect-ratio: 1.25/1;
		.detail-img {
			position: relative;
			width: 100%;
			height: 100%;
		}
	}
	.detail-content {
		position: relative;
		width: 100%;
		background-color: #fff;
		padding: 20rpx;
		box-sizing: border-box;
		.detail-info {
			position: relative;
			width: 100%;
			.detail-info-title {
				position: relative;
				width: 100%;
				font-family: PingFang SC, PingFang SC;
				font-weight: bold;
				font-size: 16px;
				color: #000000;
				line-height: 19px;
				text-align: left;
				font-style: normal;
				text-transform: none;
				margin: 22rpx 0;
			}
			.detail-info-text {
				position: relative;
				width: 100%;
				font-family: PingFang SC, PingFang SC;
				font-weight: 400;
				font-size: 13px;
				color: #9699a1;
				line-height: 15px;
				text-align: left;
				font-style: normal;
				text-transform: none;
			}
			.middle {
				margin: 30rpx 0;
				margin-top: 0;
				line-height: 26px;
			}
		}
		.detail-date {
			position: relative;
			width: 100%;
			box-sizing: border-box;
			.detail-date-title {
				position: relative;
				width: 100%;
				display: flex;
				align-items: center;
				justify-content: space-between;
				font-family: PingFang SC, PingFang SC;
				font-weight: bold;
				font-size: 16px;
				color: #000000;
				line-height: 19px;
				text-align: left;
				font-style: normal;
				text-transform: none;
				margin: 22rpx 0;
				margin-top: 40rpx;
			}
			.detail-date-day {
				position: relative;
				width: 100%;
				display: flex;
				align-items: stretch;
				justify-content: space-between;
				.detail-date-day-item {
					position: relative;
					width: 19%;
					padding: 14px 8px;
					box-sizing: border-box;
					background: #f0f2f7;
					border-radius: 4px 4px 4px 4px;
					.detail-date-day-item-num {
						position: relative;
						width: 100%;
						font-family: PingFang SC, PingFang SC;
						font-weight: 500;
						font-size: 15px;
						color: #4b4b4e;
						line-height: 18px;
						text-align: center;
						font-style: normal;
						text-transform: none;
					}
					.detail-date-day-item-text {
						position: relative;
						width: 100%;
						font-family: PingFang SC, PingFang SC;
						font-weight: 400;
						font-size: 13px;
						color: #4b4b4e;
						line-height: 15px;
						text-align: center;
						font-style: normal;
						text-transform: none;
						margin-top: 20rpx;
					}
				}
				.detail-date-day-item-curr {
					position: relative;
					width: 19%;
					padding: 14px 8px;
					box-sizing: border-box;
					background: #0d70f3;
					border-radius: 4px 4px 4px 4px;
					.detail-date-day-item-num {
						position: relative;
						width: 100%;
						font-family: PingFang SC, PingFang SC;
						font-weight: 500;
						font-size: 15px;
						color: #ffffff;
						line-height: 18px;
						text-align: center;
						font-style: normal;
						text-transform: none;
					}
					.detail-date-day-item-text {
						position: relative;
						width: 100%;
						font-family: PingFang SC, PingFang SC;
						font-weight: 400;
						font-size: 13px;
						color: #ffffff;
						line-height: 15px;
						text-align: center;
						font-style: normal;
						text-transform: none;
						margin-top: 20rpx;
					}
				}
				.detail-date-day-item-more {
					position: relative;
					width: 19%;
					padding: 14px 8px;
					box-sizing: border-box;
					background: #0d70f3;
					border-radius: 4px 4px 4px 4px;
					display: flex;
					align-items: center;
					justify-content: center;
					.detail-date-day-item-more-text {
						position: relative;
						font-family: PingFang SC, PingFang SC;
						font-weight: 500;
						font-size: 15px;
						color: #ffffff;
						line-height: 18px;
						text-align: center;
						font-style: normal;
						text-transform: none;
					}
				}
				.detail-date-day-item-more-curr {
					position: relative;
					width: 19%;
					padding: 14px 8px;
					box-sizing: border-box;
					background: #f0f2f7;
					border-radius: 4px 4px 4px 4px;
					display: flex;
					align-items: center;
					justify-content: center;
					.detail-date-day-item-more-text {
						position: relative;
						font-family: PingFang SC, PingFang SC;
						font-weight: 500;
						font-size: 15px;
						color: #4b4b4e;
						line-height: 18px;
						text-align: center;
						font-style: normal;
						text-transform: none;
					}
				}
			}
			.detail-date-has-list {
				position: relative;
				width: 100%;
				display: flex;
				align-items: center;
				justify-content: space-between;
				flex-wrap: wrap;
				box-sizing: border-box;
				.detail-date-has-item {
					position: relative;
					box-sizing: border-box;
					width: calc(50% - 10rpx);
					margin-bottom: 20rpx;
					background: #f0f2f7;
					border-radius: 4px 4px 4px 4px;
					font-family: PingFang SC, PingFang SC;
					font-weight: 400;
					font-size: 15px;
					color: #4b4b4e;
					line-height: 18px;
					text-align: center;
					font-style: normal;
					text-transform: none;
					padding: 20rpx;
				}
			}
			.detail-date-more-list {
				position: relative;
				width: 100%;
				font-family: PingFang SC, PingFang SC;
				font-weight: 400;
				font-size: 13px;
				color: #9699a1;
				line-height: 15px;
				text-align: center;
				font-style: normal;
				text-transform: none;
				margin-bottom: 40rpx;
			}
			.detail-date-has-box {
				position: relative;
				width: 100%;
				padding: 40rpx;
				border: 1px solid #cecece;
				border-radius: 4px;
				margin-bottom: 40rpx;
				box-sizing: border-box;
			}
			.detail-date-choose {
				position: relative;
				width: 100%;
				display: flex;
				align-items: center;
				justify-content: space-between;
				.detail-date-choose-item {
					position: relative;
					width: 48%;
					.detail-date-choose-item-title {
						position: relative;
						width: 100%;
						text-align: center;
						font-family: PingFang SC, PingFang SC;
						font-weight: 400;
						font-size: 14px;
						color: #000000;
						line-height: 16px;
						text-align: center;
						font-style: normal;
						text-transform: none;
						margin: 22rpx auto;
					}
					.detail-date-choose-item-button {
						position: relative;
						width: 100%;
						border-radius: 30px 30px 30px 30px;
						border: 1px solid rgba(3, 171, 110, 0.5);
						font-family: PingFang SC, PingFang SC;
						font-weight: 400;
						font-size: 14px;
						color: #03ab6e;
						line-height: 16px;
						text-align: center;
						font-style: normal;
						text-transform: none;
						padding: 10px 0;
					}
				}
			}
		}
		.detail-form {
			position: relative;
			width: 100%;
			margin-top: 50rpx;
			.detail-form-item {
				position: relative;
				width: 100%;
				margin-top: 30rpx;
				.detail-form-item-title {
					position: relative;
					width: 100%;
					margin-bottom: 10rpx;
					font-family: PingFang SC, PingFang SC;
					font-weight: 400;
					font-size: 14px;
					color: #4b4b4e;
					line-height: 16px;
					text-align: left;
					font-style: normal;
					text-transform: none;
					padding-left: 10rpx;
				}
				.detail-form-item-input {
					position: relative;
					width: 100%;
					.detail-form-item-arr {
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