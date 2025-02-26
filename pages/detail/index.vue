<style lang="less" scoped>
@import './asserts/index.less';
</style>

<template>
    <view>
        <ut-nav title="详情" @onBack="handleGoHome" border></ut-nav>

        <view class="detail">
            <view class="detail-pic">
                <img class="detail-img" src="https://genepiapi.ypzlfx.com/file/device-appointment/image.png" />
            </view>

            <view class="detail-content">
                <view class="detail-info">
                    <view class="detail-info-title">{{ deviceInfo.name }}</view>
                    <view class="detail-info-text">设备编号{{ deviceInfo.code }}</view>
                    <view class="detail-info-text">{{ deviceInfo.address }}</view>
                </view>

                <view class="detail-date">
                    <view class="detail-date-title">选择日期</view>
                    <view class="detail-date-day">
                        <view :class="index == choose.currIndex ? 'detail-date-day-item-curr' : 'detail-date-day-item'"
                            @click="handleDateClick(index, item.date)" v-for="(item, index) in choose.list"
                            :key="index">
                            <view class="detail-date-day-item-num">{{ item.date }}</view>
                            <view class="detail-date-day-item-text">{{ item.day }}</view>
                        </view>
                    </view>
                    <view class="detail-date-choose">
                        <view class="detail-date-choose-item">
                            <view class="detail-date-choose-item-title">开始时间</view>
                            <view class="detail-date-choose-item-button" @click="handleTimeClick('start')">
                                {{ time.start ? time.start : '请选择' }}
                            </view>
                        </view>
                        <view class="detail-date-choose-item">
                            <view class="detail-date-choose-item-title">结束时间</view>
                            <view class="detail-date-choose-item-button" @click="handleTimeClick('end')">
                                {{ time.end ? time.end : '请选择' }}
                            </view>
                        </view>
                    </view>

                    <view class="detail-date-condition">
                        <view class="detail-date-condition-head">
                            <view class="detail-date-condition-head-state">
                                <view class="detail-date-condition-head-state-item">
                                    <view class="no-reserve-icon"></view>
                                    <view class="no-reserve-text">不可约</view>
                                </view>
                                <view class="detail-date-condition-head-state-item">
                                    <view class="reserve-icon"></view>
                                    <view class="reserve-text">可约</view>
                                </view>
                            </view>
                        </view>

                        <view class="detail-date-condition-time">
                            <view class="detail-date-condition-time-item"
                                v-for="(items, indexs) in deviceInfo.reserveTime" :key="indexs">
                                <view
                                    :class="items.status ? 'detail-date-condition-time-item-block-curr' : 'detail-date-condition-time-item-block'">
                                </view>
                                <view class="detail-date-condition-time-item-num">{{ indexs }}</view>
                            </view>
                        </view>
                    </view>
                </view>

                <view class="detail-form">
                    <!-- <view class="detail-form-item">
                        <view class="detail-form-item-title">预约人姓名</view>
                        <view class="detail-form-item-input">
                            <u--input placeholder="预约人姓名" border="surround" v-model="form.name"></u--input>
                        </view>
                    </view>
                    <view class="detail-form-item">
                        <view class="detail-form-item-title">预约人电话</view>
                        <view class="detail-form-item-input">
                            <u--input placeholder="预约人电话" border="surround" v-model="form.phone"></u--input>
                        </view>
                    </view> -->
                    <view class="detail-form-item">
                        <view class="detail-form-item-title">用途说明</view>
                        <view class="detail-form-item-input">
                            <u--textarea v-model="form.description" placeholder="请输入用途说明"
                                :autoHeight="false"></u--textarea>
                        </view>
                    </view>

                    <view class="submit-button">
                        <u-button @click="handleSubmit" type="primary" text="提交预约"></u-button>
                    </view>
                </view>
            </view>


        </view>

        <u-picker :show="time.selectVisible" ref="uPicker" :columns="time.select" @confirm="currTimeSubmit"
            @cancel="currTimeCancel"></u-picker>
    </view>
</template>

<script>
import { deviceSubmit, deviceDetail, getAllDayReserve } from '@/api/device/index.js'

export default {
    data() {
        return {
            instrumentId: null,
            deviceId: null,
            choose: { currIndex: 0, list: [] },
            time: { start: null, end: null, select: [[]], selectVisible: false, type: '' },
            form: { name: ''/* , phone: '', description: '' */ },
            deviceInfo: { name: "", code: "", address: "", reserveTime: [], canReserveWeek: [], canReserveTime: '' }
        };
    },
    onLoad(options) {
        this.instrumentId = options.instrumentId;
        this.deviceId = options.deviceId;
        this.getDeviceDetail()
    },
    methods: {
        generateDateArray() {
            const result = [];
            const today = new Date();

            const tomorrow = new Date(today);
            tomorrow.setDate(today.getDate() + 1);

            const year = tomorrow.getFullYear();
            const month = tomorrow.getMonth() + 1;
            const dayNames = ['日', '一', '二', '三', '四', '五', '六'];

            function formatDate(num) {
                return num < 10 ? '0' + num : num;
            }

            for (let i = 0; i < 5; i++) {
                const currentDate = new Date(tomorrow);
                currentDate.setDate(tomorrow.getDate() + i);

                const monthStr = formatDate(currentDate.getMonth() + 1);
                const dayStr = formatDate(currentDate.getDate());
                const dateStr = `${monthStr}-${dayStr}`;
                const dayOfWeekStr = `周${dayNames[currentDate.getDay()]}`;

                result.push({
                    year: year.toString(),
                    date: dateStr,
                    day: i === 0 ? '明天' : dayOfWeekStr,
                });
            }

            this.choose.list = result
        },
        getSelectPicker() {
            const timeArray = [];
            const range = this.deviceInfo.canReserveTime; // 假设这个是输入的范围
            const [startTime, endTime] = range.split(" - "); // 拆分字符串为开始时间和结束时间

            // 将时间范围的小时部分转为数字，方便比较
            const startHour = parseInt(startTime.split(":")[0], 10);
            const endHour = parseInt(endTime.split(":")[0], 10);

            for (let i = 0; i < 24; i++) {
                const hour = i < 10 ? `0${i}` : i;
                const time = `${hour}:00`;

                // 判断当前时间是否在范围内
                if (i >= startHour && i <= endHour) {
                    timeArray.push(time);
                }
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
        getDeviceDetail() {
            deviceDetail(this.instrumentId).then((resp) => {
                if (resp.code == 200) {
                    this.deviceInfo.name = resp.result.deviceName
                    this.deviceInfo.code = resp.result.deviceCode
                    this.deviceInfo.address = resp.result.deviceAddress || "暂无设备地址"
                    this.deviceInfo.reserveTime = resp.result.reserveTimeList
                    this.deviceInfo.canReserveWeek = resp.result.openList
                    this.deviceInfo.canReserveTime = resp.result.openTime


                    this.generateDateArray()
                    this.getSelectPicker()
                    this.getAllDayReserve()
                }
            });

        },
        getAllDayReserve() {
            const currentDate = `${this.choose.list[this.choose.currIndex].year}-${this.choose.list[this.choose.currIndex].date}`
            const pushData = {
                currentDate,
                deviceId: this.deviceId
            }

            getAllDayReserve(pushData).then((resp) => {
                if (resp.code == 200) {
                    this.deviceInfo.reserveTime = resp.result
                }
            });
        },
        handleDateClick(index, currDate) {
            console.log(this.deviceInfo.canReserveWeek);
            const currentYear = new Date().getFullYear();
            const currenWeek = this.getWeekNumber(`${currentYear}-${currDate}`)
            const openDate = this.deviceInfo.canReserveWeek
            if (openDate.includes(currenWeek)) {
                this.choose.currIndex = index;
                this.getAllDayReserve()
            } else {
                uni.showToast({ title: "该日设备不开放预约", icon: "none", });
            }
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
                uni.showToast({ title: "请选择预约开始时间", icon: "none", });
                return
            }
            if (!this.time.end) {
                uni.showToast({ title: "请选择预约结束时间", icon: "none", });
                return
            }
            if (!this.timeIsNotGreaterThan(this.time.start, this.time.end)) {
                uni.showToast({ title: "预约开始时间不能大于等于预约结束时间", icon: "none", });
                return
            }
            /* if (!this.form.name) {
                uni.showToast({ title: "请输入预约人姓名", icon: "none", });
                return
            }
            if (!this.form.phone) {
                uni.showToast({ title: "请输入预约人电话", icon: "none", });
                return
            }
            if (!/^1[3-9]\d{9}$/.test(this.form.phone)) {
                uni.showToast({ title: "请输入正确的电话号码", icon: "none", });
                return
            } */
            if (!this.form.description) {
                uni.showToast({ title: "请输入用途说明", icon: "none", });
                return
            }

            const currDate = this.choose.list[this.choose.currIndex]

            const pushData = {
                deviceId: this.instrumentId,
                reserveDate: `${currDate.year}-${currDate.date}`,
                reserveEndTime: `${this.time.end}:00`,
                reservePurpose: this.form.description,
                reserveStartTime: `${this.time.start}:00`
            }
            deviceSubmit(pushData).then((resp) => {
                if (resp.code == 200) {
                    uni.showToast({ title: "预约成功，正在跳转", icon: "none", });
                    setTimeout(() => {
                        this.$ut.jump(`/pages/reserve/detail?id=${resp.result.instrumentId}`);
                    }, 2000);
                }
            });
        },
        handleGoHome() {
            this.$ut.jump(`/pages/index/index`);
        },
    },
};
</script>
