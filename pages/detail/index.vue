<style lang="less" scoped>
@import './asserts/index.less';
</style>

<template>
    <view>
        <ut-nav title="详情" @onBack="handleGoHome" border></ut-nav>

        <view class="detail">
            <view class="detail-pic">
                <img class="detail-img"
                    :src="deviceInfo.deviceImg ? deviceInfo.deviceImg : 'https://genepiapi.ypzlfx.com/file/device-appointment/image.png'" />
            </view>

            <view class="detail-content">
                <view class="detail-info">
                    <view class="detail-info-title">{{ deviceInfo.name }}</view>
                    <view class="detail-info-text">设备编号{{ deviceInfo.code }}</view>
                    <view class="detail-info-text">设备价格{{ deviceInfo.price }}</view>
                    <view class="detail-info-text">{{ deviceInfo.address }}</view>
                </view>

                <view class="detail-date">
                    <view class="detail-date-title">
                        <view>选择日期</view>
                        <view v-if="choose.isMore">{{ choose.moreDate }}</view>
                    </view>
                    <view class="detail-date-day">
                        <view
                            :class="index == choose.currIndex && !choose.isMore ? 'detail-date-day-item-curr' : 'detail-date-day-item'"
                            @click="handleDateClick(index, item.date)" v-for="(item, index) in choose.list"
                            :key="index">
                            <view class="detail-date-day-item-num">{{ item.date }}</view>
                            <view class="detail-date-day-item-text">{{ item.day }}</view>
                        </view>
                        <view :class="choose.isMore ? 'detail-date-day-item-more' : 'detail-date-day-item-more-curr'"
                            @click="choose.moreVisible = true">
                            <view class="detail-date-day-item-more-text">更多</view>
                        </view>
                    </view>

                    <view class="detail-date-title">已预约时间</view>
                    <view class="detail-date-has-list"
                        v-if="deviceInfo.reserveTime && deviceInfo.reserveTime.length > 0">
                        <view class="detail-date-has-item" v-for="item in deviceInfo.reserveTime">
                            {{ `${item.reserveStartTime} - ${item.reserveEndTime}` }}
                        </view>
                    </view>
                    <view class="detail-date-more-list" @click="handleClickMoreText" v-if="choose.moreText">
                        查看更多
                    </view>
                    <view class="detail-date-has-box"
                        v-if="deviceInfo.reserveTime && deviceInfo.reserveTime.length == 0">
                        <u-empty mode="data" text="当日暂无预约"></u-empty>
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
                </view>

                <view class="detail-form">
                    <view class="detail-form-item">
                        <view class="detail-form-item-title">预约人姓名</view>
                        <view class="detail-form-item-input">
                            <u--input placeholder="预约人姓名" border="surround" v-model="form.name"></u--input>
                        </view>
                    </view>

                    <view class="detail-form-item">
                        <view class="detail-form-item-title">预约人电话</view>
                        <view class="detail-form-item-input">
                            <u--input placeholder="请输入预约人电话" border="surround" v-model="form.phone"></u--input>
                        </view>
                    </view>

                    <view class="detail-form-item">
                        <view class="detail-form-item-title">团队选择</view>
                        <view class="detail-form-item-input" @click="group.visible = true">
                            <u--input v-model="group.currName" disabled disabledColor="#ffffff" placeholder="请选择团队"
                                border="surround"></u--input>
                            <view class="detail-form-item-arr">
                                <u-icon name="arrow-right"></u-icon>
                            </view>
                        </view>
                    </view>

                    <view class="detail-form-item" v-if="teacher.inputVisible">
                        <view class="detail-form-item-title">导师选择</view>
                        <view class="detail-form-item-input" @click="teacher.visible = true">
                            <u--input v-model="teacher.currName" disabled disabledColor="#ffffff" placeholder="请选择团队"
                                border="surround"></u--input>
                            <view class="detail-form-item-arr">
                                <u-icon name="arrow-right"></u-icon>
                            </view>
                        </view>
                    </view>

                    <view class="detail-form-item" v-if="schoolInput.visible">
                        <view class="detail-form-item-title">所在学院</view>
                        <view class="detail-form-item-input">
                            <u--input placeholder="请输入所在学院" border="surround" v-model="form.school"></u--input>
                        </view>
                    </view>

                    <view class="detail-form-item" v-if="schoolInput.visible">
                        <view class="detail-form-item-title">备注信息</view>
                        <view class="detail-form-item-input">
                            <u--textarea v-model="form.info" placeholder="请输入备注信息" :autoHeight="false"></u--textarea>
                        </view>
                    </view>

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

        <u-picker :show="group.visible" :columns="group.list" keyName="label" @confirm="handleCurrGroup"
            @cancel="group.visible = false"></u-picker>

        <u-picker :show="teacher.visible" :columns="teacher.list" keyName="label" @confirm="handleCurrTeacher"
            @cancel="teacher.visible = false"></u-picker>

        <u-calendar :show="choose.moreVisible" :defaultDate="choose.minDate" :minDate="choose.minDate"
            :maxDate="choose.maxDate" @confirm="handleConfirmDate" @close="choose.moreVisible = false"></u-calendar>
    </view>
</template>

<script>
import { deviceSubmit, deviceDetail, getAllDayReserve, getGroup, getTeacher } from '@/api/device/index.js'

export default {
    data() {
        return {
            instrumentId: null,
            deviceId: null,
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
        this.getDeviceDetail()
        this.getGroup()
    },
    methods: {
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
        getDeviceDetail() {
            deviceDetail(this.instrumentId).then((resp) => {
                if (resp.code == 200) {
                    this.deviceInfo.name = resp.result.deviceName
                    this.deviceInfo.code = resp.result.deviceCode
                    this.deviceInfo.price = resp.result.priceDesc || "暂无价格"
                    this.deviceInfo.address = resp.result.deviceAddress || "暂无设备地址"
                    this.deviceInfo.reserveTime = resp.result.reserveTimeList
                    this.deviceInfo.canReserveWeek = resp.result.openList
                    this.deviceInfo.canReserveTime = resp.result.openTime
                    this.deviceInfo.deviceImg = resp.result.deviceImg || null


                    this.generateDateArray()
                    this.getSelectPicker()
                    this.getAllDayReserve()
                }
            });

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
                uni.showToast({ title: "该日设备不开放预约", icon: "none", });
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

            if (!this.isTimeDifferenceValid(this.time.start, this.time.end)) {
                uni.showToast({ title: "使用设备至少三十分钟且不超过十二小时", icon: "none", });
                return
            }

            if (!this.form.name) {
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
            }
            if (!this.form.description) {
                uni.showToast({ title: "请输入用途说明", icon: "none", });
                return
            }
            if (this.form.group == '') {
                uni.showToast({ title: "请选择团队", icon: "none", });
                return
            }
            if (this.group.currCode != 'xn' && this.group.currCode != 'xw' && this.form.teacher == '') {
                uni.showToast({ title: "请选择导师", icon: "none", });
                return
            }
            if ((this.group.currCode == 'xn' || this.group.currCode == 'xw') && this.form.school == '') {
                uni.showToast({ title: "请填写所在学院", icon: "none", });
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
