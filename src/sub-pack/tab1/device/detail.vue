<template>
	<z-paging
		ref="paging" class="detailPage" :paging-style="{ backgroundColor: 'white' }" v-model="dataList" @query="queryList"
		:fixed="true" :auto="false" :refresher-enabled="false" :auto-show-back-to-top="true" :auto-scroll-to-top-when-reload="false"
		:loading-more-enabled="false" :show-refresher-when-reload="false" hide-empty-view
	>
        <view slot="top"><u-navbar title="详情" :fixed="false" background="transparent" color="#000" left-icon-color="#000" @leftClick="handleGoHome" /></view>
        <!-- <ut-nav title="详情" @onBack="handleGoHome" border></ut-nav> -->
		<ut-components ref="utComponents" />
        <view class="detail">
            <view class="detail-pic">
                <image class="detail-img" :src="deviceInfo.deviceImg ? deviceInfo.deviceImg : $staticPath+'temp/imgs/devcieCover.png'" />
            </view>
            <view class="detail-content">
                <view class="detail-info">
                    <view class="detail-info-title">{{ deviceInfo.name }}</view>
                    <view class="detail-info-text" style="margin-bottom: 10rpx;">设备编号{{ deviceInfo.code }}</view>
                    <view class="detail-info-text">{{ deviceInfo.address }}</view>
                </view>
                <view class="detail-date">
                    <view class="detail-date-title">收费标准</view>
                    <view class="detail-info"><view class="detail-info-text middle" v-html="deviceInfo.price"></view></view>
                </view>

                <view class="detail-date">
                    <view class="detail-date-title">
                        <view>选择日期</view>
                        <view v-if="choose.isMore">{{ choose.moreDate }}</view>
                    </view>
                    <view class="detail-date-day">
                        <view
                            :class="index == choose.currIndex && !choose.isMore ? 'detail-date-day-item-curr' : 'detail-date-day-item'"
                            v-for="(item, index) in choose.list" :key="index" @click="handleDateClick(index, item.date)" >
                            <view class="detail-date-day-item-num">{{ item.date }}</view>
                            <view class="detail-date-day-item-text">{{ item.day }}</view>
                        </view>
                        <view :class="choose.isMore ? 'detail-date-day-item-more' : 'detail-date-day-item-more-curr'" @click="choose.moreVisible = true">
                            <view class="detail-date-day-item-more-text">更多</view>
                        </view>
                    </view>

                    <bolck v-if="deviceInfo && deviceInfo.reserveTime">
                        <view class="detail-date-title">已预约时间</view>
                        <view class="detail-date-has-list" v-if="deviceInfo.reserveTime.length > 0">
                            <view class="detail-date-has-item" v-for="item,idx in deviceInfo.reserveTime" :key="idx">{{ `${item.reserveStartTime} - ${item.reserveEndTime}` }}</view>
                        </view>
                        <view v-if="choose.moreText" class="detail-date-more-list" @click="handleClickMoreText()">查看更多</view>
                        <view class="detail-date-has-box" v-if="deviceInfo.reserveTime.length == 0">
                            <u-empty mode="data" text="当日暂无预约" />
                        </view>
                    </bolck>

                    <view class="detail-date-choose">
                        <view class="detail-date-choose-item">
                            <view class="detail-date-choose-item-title">开始时间</view>
                            <u-button type="success" plain :text="time.start ? time.start : '请选择'" shape="circle" @click="handleTimeClick('start')" />
                        </view>
                        <view class="detail-date-choose-item">
                            <view class="detail-date-choose-item-title">结束时间</view>
                            <u-button type="success" plain :text="time.end ? time.end : '请选择'" shape="circle" @click="handleTimeClick('end')" />
                        </view>
                    </view>
                </view>

                <view class="detail-form">
                    <view class="detail-form-item">
                        <view class="detail-form-item-title">预约人姓名</view>
                        <view class="detail-form-item-input">
                            <u--input placeholder="预约人姓名" border="surround" v-model="form.name" />
                        </view>
                    </view>

                    <view class="detail-form-item">
                        <view class="detail-form-item-title">预约人电话</view>
                        <view class="detail-form-item-input">
                            <u--input placeholder="请输入预约人电话" border="surround" v-model="form.phone" />
                        </view>
                    </view>

                    <view class="detail-form-item">
                        <view class="detail-form-item-title">团队选择</view>
                        <view class="detail-form-item-input" @click="group.visible = true">
                            <u--input v-model="group.currName" disabled disabledColor="#ffffff" placeholder="请选择团队" border="surround" />
                            <view class="detail-form-item-arr"><u-icon name="arrow-right" /></view>
                        </view>
                    </view>

                    <view class="detail-form-item" v-if="teacher.inputVisible">
                        <view class="detail-form-item-title">导师选择</view>
                        <view class="detail-form-item-input" @click="teacher.visible = true">
                            <u--input v-model="teacher.currName" disabled disabledColor="#ffffff" placeholder="请选择团队" border="surround" />
                            <view class="detail-form-item-arr"><u-icon name="arrow-right" /></view>
                        </view>
                    </view>

                    <view class="detail-form-item" v-if="schoolInput.visible">
                        <view class="detail-form-item-title">所在学院</view>
                        <view class="detail-form-item-input">
                            <u--input placeholder="请输入所在学院" border="surround" v-model="form.school" />
                        </view>
                    </view>

                    <view class="detail-form-item" v-if="schoolInput.visible">
                        <view class="detail-form-item-title">备注信息</view>
                        <view class="detail-form-item-input">
                            <u--textarea v-model="form.info" placeholder="请输入备注信息" :autoHeight="false" />
                        </view>
                    </view>

                    <view class="detail-form-item">
                        <view class="detail-form-item-title">用途说明</view>
                        <view class="detail-form-item-input">
                            <u--textarea v-model="form.description" placeholder="请输入用途说明" :autoHeight="false" />
                        </view>
                    </view>
                </view>
            </view>
        </view>

        <u-picker :show="time.selectVisible" ref="uPicker" :columns="time.select" @confirm="currTimeSubmit" @cancel="currTimeCancel" />
        <u-picker :show="group.visible" :columns="group.list" keyName="label" @confirm="handleCurrGroup" @cancel="group.visible = false" />
        <u-picker :show="teacher.visible" :columns="teacher.list" keyName="label" @confirm="handleCurrTeacher" @cancel="teacher.visible = false" />
        <u-calendar :show="choose.moreVisible" :defaultDate="choose.minDate" :minDate="choose.minDate" :maxDate="choose.maxDate" @confirm="handleConfirmDate" @close="choose.moreVisible = false"></u-calendar>

        <view slot="bottom" class="pubBotBtn pubTopLine">
            <view class="wrap">
                <view class="btn" @click="handleSubmit"><u-button type="primary" text="提交预约" /></view>
            </view>
        </view>
    </z-paging>
</template>
<script>
import { deviceSubmit, deviceDetail, getAllDayReserve, getGroup, getTeacher } from '@/app/api/device/index.js'
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
        };
    },
    onLoad(options) {
        this.instrumentId = options.instrumentId;
        this.deviceId = options.deviceId;
        // this.getDeviceDetail(); this.getGroup()
    },
    methods: {
		queryList(pageNo, pageSize) {
			this.$refs.paging.endRefresh()
            uni.hideLoading();
		},
        generateDateArray() {
            const result = [];
            const today = new Date();

            const year = today.getFullYear();
            const dayNames = ['日', '一', '二', '三', '四', '五', '六'];

            for (let i = 0; i < 4; i++) {
                const currentDate = new Date(today);
                currentDate.setDate(today.getDate() + i);

                const monthStr = this.formatDate(currentDate.getMonth() + 1);
                const dayStr = this.formatDate(currentDate.getDate());
                const dateStr = `${monthStr}-${dayStr}`;
                const dayOfWeekStr = `周${dayNames[currentDate.getDay()]}`;

                result.push({
                    year: year.toString(),
                    date: dateStr,
                    day: i === 0 ? '今天' : dayOfWeekStr,
                });
            }

            this.choose.minDate = this.getAnyDate(4);
            this.choose.maxDate = this.getAnyDate(30);
            this.choose.list = result
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
        getSelectPicker() {
            const timeArray = [];
            const range = this.deviceInfo.canReserveTime;
            const [startTime, endTime] = range.split(" - ");

            const startHour = parseInt(startTime.split(":")[0], 10);
            const endHour = parseInt(endTime.split(":")[0], 10);

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

            if (lastTime === "23:50") {
                timeArray.push('23:59');
            }



            this.time.select[0] = timeArray;
        },
        getWeekNumber(date) {
            const currDate = new Date(date);
            const dayOfWeek = currDate.getDay();
            const daysOfWeek = ["7", "1", "2", "3", "4", "5", "6"];
            return daysOfWeek[dayOfWeek];
        },
        timeIsNotGreaterThan(a, b) {
            const timeToMinutes = (time) => {
                const [hours, minutes] = time.split(':').map(Number);
                return hours * 60 + minutes;
            };

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
            deviceDetail(this.instrumentId).then((resp) => {
                if (resp.code == 200) {
                    this.deviceInfo.name = resp.result.deviceName
                    this.deviceInfo.code = resp.result.deviceCode
                    this.deviceInfo.price = this.addLineBreakBeforeText(resp.result.priceDesc, ["校内","校外", "不足"]) || "暂无价格"
                    this.deviceInfo.address = resp.result.deviceAddress || "暂无设备地址"
                    this.deviceInfo.reserveTime = resp.result.reserveTimeList
                    this.deviceInfo.canReserveWeek = resp.result.openList
                    this.deviceInfo.canReserveTime = resp.result.openTime
                    this.deviceInfo.deviceImg = resp.result.deviceImg || null

                    this.generateDateArray(); this.getSelectPicker(); this.getAllDayReserve()
                }
            }).finally(()=>{
                setTimeout(() => {
                    this.firstLoaded = true
                }, 1000)
            })
        },
        getGroup() {
            getGroup().then((resp) => {
                if (resp.code == 200) {
                    let arr = []
                    for (let item of resp.result) {
                        arr.push({ label: item.name, id: item.id, code: item.code })
                    }
                    this.group.list[0] = arr;
                }
            });
        },
        getTeacher(id) {
            getTeacher(id).then((resp) => {
                if (resp.code == 200) {
                    let arr = []
                    for (let item of resp.result) {
                        arr.push({ label: item.name, id: item.id })
                    }
                    this.teacher.list[0] = arr;
                }
            });

        },
        handleCurrGroup(e) {
            this.group.currName = e.value[0].label
            this.group.currCode = e.value[0].code
            this.form.group = e.value[0].id
            this.getTeacher(e.value[0].id)
            this.group.visible = false
            this.teacher.currName = ''
            this.form.teacher = ''
            this.form.school = ''
            this.form.info = ''
            if (e.value[0].code != 'xn' && e.value[0].code != 'xw') {
                this.teacher.inputVisible = true
                this.schoolInput.visible = false
            } else {
                this.teacher.inputVisible = false
                this.schoolInput.visible = true
            }
        },
        handleCurrTeacher(e) {
            this.teacher.currName = e.value[0].label
            this.form.teacher = e.value[0].id
            this.teacher.visible = false
        },
        getAllDayReserve() {
            const currentDate = this.choose.isMore ? this.choose.moreDate : `${this.choose.list[this.choose.currIndex].year}-${this.choose.list[this.choose.currIndex].date}`
            const pushData = {
                currentDate,
                deviceId: this.deviceId
            }

            getAllDayReserve(pushData).then((resp) => {
                if (resp.code == 200) {
                    if (resp.result.length <= 4) {
                        this.deviceInfo.reserveTime = resp.result
                        this.choose.moreText = false
                    } else {
                        if (this.choose.moreText == false) {
                            this.deviceInfo.reserveTime = resp.result
                            this.choose.moreText = false
                        } else {
                            const arr = []
                            for (let i = 0; i < 4; i += 1) {
                                arr.push(resp.result[i])
                            }
                            this.choose.moreText = true
                            this.deviceInfo.reserveTime = arr
                        }

                    }

                }
            });
        },
        handleClickMoreText() {
            this.choose.moreText = false
            this.getAllDayReserve()
        },
        handleDateClick(index, currDate) {
            const currentYear = new Date().getFullYear();
            const currenWeek = this.getWeekNumber(`${currentYear}-${currDate}`)
            const openDate = this.deviceInfo.canReserveWeek
            if (openDate.includes(currenWeek)) {
                this.choose.currIndex = index;
                this.choose.moreDate = ""
                this.choose.isMore = false
                this.getAllDayReserve()
            } else {
                this.showTips('该日设备不开放预约', 'error');
            }
        },
        handleConfirmDate(e) {
            this.choose.moreDate = e[0]
            this.choose.isMore = true
            this.choose.moreVisible = false
            this.getAllDayReserve()
        },
        handleTimeClick(type) {
            this.time.type = type
            this.time.selectVisible = true
        },
        currTimeSubmit(e) {
            this.time[this.time.type] = e.value[0]
            this.time.selectVisible = false
        },
        currTimeCancel() {
            this.time.selectVisible = false
        },
        handleSubmit() {
            if (!this.time.start) {
                this.showTips('请选择预约开始时间', 'error');
                return
            }
            if (!this.time.end) {
                this.showTips('请选择预约结束时间', 'error');
                return
            }

            if (!this.timeIsNotGreaterThan(this.time.start, this.time.end)) {
                this.showTips('预约开始时间不能大于等于预约结束时间', 'error');
                return
            }

            if (!this.isTimeDifferenceValid(this.time.start, this.time.end)) {
                this.showTips('使用设备至少三十分钟且不超过十二小时', 'error');
                return
            }

            if (!this.form.name) {
                this.showTips('请输入预约人姓名', 'error');
                return
            }
            if (!this.form.phone) {
                this.showTips('请输入预约人电话', 'error');
                return
            }
            if (!/^1[3-9]\d{9}$/.test(this.form.phone)) {
                this.showTips('请输入正确的电话号码', 'error');
                return
            }
            if (!this.form.description) {
                this.showTips('请输入用途说明', 'error');
                return
            }
            if (this.form.group == '') {
                this.showTips('请选择团队', 'error');
                return
            }
            if (this.group.currCode != 'xn' && this.group.currCode != 'xw' && this.form.teacher == '') {
                this.showTips('请选择导师', 'error');
                return
            }
            if ((this.group.currCode == 'xn' || this.group.currCode == 'xw') && this.form.school == '') {
                this.showTips('请填写所在学院', 'error');
                return
            }

            const currDate = this.choose.list[this.choose.currIndex]

            const pushData = {
                deviceId: this.instrumentId,
                projectMentorDictDetId: this.form.teacher,
                projectMentorDictDetName: this.teacher.currName || this.form.school,
                projectMentorDictId: this.form.group,
                projectMentorDictName: this.group.currName,
                projectMentorRemark: this.form.info,
                reserveDate: this.choose.isMore ? this.choose.moreDate : `${currDate.year}-${currDate.date}`,
                reserveEndTime: `${this.time.end}:00`,
                reservePurpose: this.form.description,
                reserveStartTime: `${this.time.start}:00`,
                reserveName: this.form.name,
                reservePhone: this.form.phone,
            }
            deviceSubmit(pushData).then((resp) => {
                if (resp.code == 200) {
                    this.showTips('预约成功，正在跳转', 'success');
                    setTimeout(() => {
                        this.$ut.jump(`/sub-pack/tab5/reserve/detail?id=${resp.result.instrumentId}`);
                    }, 2000);
                }
            });
        },
        handleGoHome() {
            this.$ut.jump(`/pages/launch/launch`);
        },
    },
};
</script>
<style lang="scss" scoped>
.detailPage{
    
}

.detail {
	width: 100%;
	box-sizing: border-box;
	background-color: #fff;
	.detail-pic {
		width: 100%;
		height: auto;
		aspect-ratio: 1.25/1;
		.detail-img {
			width: 100%;
			height: 100%;
		}
	}
	.detail-content {
		width: 100%;
		padding: 20rpx;
		box-sizing: border-box;
		background-color: #fff;
		.detail-info {
			width: 100%;
			.detail-info-title {
				width: 100%;
				font-weight: bold;
				font-size: 16px;
				color: #000000;
				line-height: 40rpx;
				margin: 22rpx 0;
			}
			.detail-info-text {
				width: 100%;
				font-weight: 400;
				font-size: 26rpx;
				color: #9699a1;
				line-height: 30rpx;
			}
			.middle {
				margin: 30rpx 0;
				margin-top: 0;
				line-height: 26px;
			}
		}
		.detail-date {
			width: 100%;
			box-sizing: border-box;
			.detail-date-title {
				width: 100%;
				display: flex;
				align-items: center;
				justify-content: space-between;
				font-weight: bold;
				font-size: 16px;
				color: #000000;
				line-height: 40rpx;
				margin: 22rpx 0;
				margin-top: 40rpx;
			}
			.detail-date-day {
				width: 100%;
				display: flex;
				align-items: stretch;
				justify-content: space-between;
				.detail-date-day-item {
					width: 19%;
					padding: 28rpx 16rpx;
					box-sizing: border-box;
					background: #f0f2f7;
					border-radius: 8rpx;
					.detail-date-day-item-num {
						width: 100%;
						font-weight: 500;
						font-size: 30rpx;
						color: #4b4b4e;
						line-height: 36rpx;
						text-align: center;
					}
					.detail-date-day-item-text {
						width: 100%;
						font-weight: 400;
						font-size: 26rpx;
						color: #4b4b4e;
						line-height: 30rpx;
						text-align: center;
						margin-top: 20rpx;
					}
				}
				.detail-date-day-item-curr {
					width: 19%;
					padding: 28rpx 16rpx;
					box-sizing: border-box;
					background: #0d70f3;
					border-radius: 4px 4px 4px 4px;
					.detail-date-day-item-num {
						width: 100%;
						font-weight: 500;
						font-size: 30rpx;
						color: #ffffff;
						line-height: 36rpx;
						text-align: center;
					}
					.detail-date-day-item-text {
						width: 100%;
						font-weight: 400;
						font-size: 26rpx;
						color: #ffffff;
						line-height: 30rpx;
						text-align: center;
						margin-top: 20rpx;
					}
				}
				.detail-date-day-item-more {
					width: 19%;
					padding: 28rpx 16rpx;
					box-sizing: border-box;
					background: #0d70f3;
					border-radius: 8rpx;
					display: flex;
					align-items: center;
					justify-content: center;
					.detail-date-day-item-more-text {
						font-weight: 500;
						font-size: 30rpx;
						color: #ffffff;
						line-height: 36rpx;
						text-align: center;
					}
				}
				.detail-date-day-item-more-curr {
					width: 19%;
					padding: 28rpx 16rpx;
					box-sizing: border-box;
					background: #f0f2f7;
					border-radius: 8rpx;
					display: flex;
					align-items: center;
					justify-content: center;
					.detail-date-day-item-more-text {
						font-weight: 500;
						font-size: 30rpx;
						color: #4b4b4e;
						line-height: 36rpx;
						text-align: center;
					}
				}
			}
			.detail-date-has-list {
				width: 100%;
				display: flex;
				align-items: center;
				justify-content: space-between;
				flex-wrap: wrap;
				box-sizing: border-box;
				.detail-date-has-item {
					box-sizing: border-box;
					width: calc(50% - 10rpx);
					margin-bottom: 20rpx;
					background: #f0f2f7;
					border-radius: 8rpx;
					font-weight: 400;
					font-size: 30rpx;
					color: #4b4b4e;
					line-height: 36rpx;
					text-align: center;
					padding: 20rpx;
				}
			}
			.detail-date-more-list {
				width: 100%;
				font-weight: 400;
				font-size: 26rpx;
				color: #9699a1;
				line-height: 30rpx;
				text-align: center;
				margin-bottom: 40rpx;
			}
			.detail-date-has-box {
				width: 100%;
				padding: 40rpx;
				border: 1px solid #cecece;
				border-radius: 4px;
				margin-bottom: 40rpx;
				box-sizing: border-box;
			}
			.detail-date-choose {
				width: 100%;
				display: flex;
				align-items: center;
				justify-content: space-between;
				.detail-date-choose-item {
					width: 48%;
					.detail-date-choose-item-title {
						width: 100%;
						text-align: center;
						font-weight: 400;
						font-size: 28rpx;
						color: #000000;
						line-height: 32rpx;
						text-align: center;
						margin: 22rpx auto;
					}
					.detail-date-choose-item-button {
						width: 100%;
						border-radius: 60rpx 60rpx 60rpx 60rpx;
						border: 1px solid rgba(3, 171, 110, 0.5);
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
		.detail-form {
			width: 100%;
			margin-top: 50rpx;
			.detail-form-item {
				position: relative;
				width: 100%;
				margin-top: 30rpx;
				.detail-form-item-title {
					width: 100%;
					margin-bottom: 10rpx;
					font-weight: 400;
					font-size: 28rpx;
					color: #4b4b4e;
					line-height: 16px;
					padding-left: 10rpx;
				}
				.detail-form-item-input {
					position: relative;
					width: 100%;
					.detail-form-item-arr {
						position: absolute;
						margin: auto;
						top: 11px;
						right: 20rpx;
					}
				}
			}
			.submit-button {
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