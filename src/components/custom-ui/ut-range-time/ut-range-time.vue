<template>
	<view>
		<u-popup :show="show" @close="close" @open="open" closeable round="24rpx">
			<view class="h1 pop-title">时间筛选</view>
			<view style="padding: 0 20rpx;">
				<view class="item d-flex js-b-c">
					<template>
						<view 
							v-for="(item, index) in ksList" :key="item.type"
							class="btn-pop" :class="{ 'active': item.type == curType }"
							@click="changeKs(item.type)"
						>
							{{ item.name }}
						</view>
					</template>

				</view>
				<view class="item d-flex js-b-c">
					<picker mode="date" @change="changeTime($event, 'start')" :end="end">
						<input class="uni-input" disabled v-model="start" placeholder="开始时间" />
					</picker>
					<view class="">-</view>
					<picker mode="date" @change="changeTime($event, 'end')" :start="start" :end="curDate">
						<input class="uni-input" disabled v-model="end" placeholder="结束时间" />
					</picker>
				</view>
				<view class="d-flex js-b-c" style="padding: 60rpx 20rpx 20rpx;">
					<view @click="restDate" class="btn-btm btn-qs">重置</view>
					<view @click="change" class="btn-btm btn-ss">确定</view>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import { dateFormat } from '@/providers/index';
	export default {
		name: "ut-range-time",
		props: {
			show: {
				type: Boolean,
				default: false
			},
			startDate: {
				type: String,
				default: ''
			},
			endDate: {
				type: String,
				default: ''
			},
		},
		watch: {
			'startDate': function(ov) {
				if (ov) {
					this.start = ov
				}
			},
			'endDate': function(ov) {
				if (ov) {
					this.end = ov
				}
			},
		},
		data() {
			return {
				start: '',
				end: '',
				ksList: [{
						name: '本日',
						type: '0'
					},
					{
						name: '本周',
						type: '1'
					},
					{
						name: '本月',
						type: '2'
					},
					{
						name: '本年',
						type: '3'
					}
				],
				curType: '',
				curDate: '',
				mapRange: [
					{
						start: '',
						end: '',
					},
					{
						start: '',
						end: '',
					},
					{
						start: '',
						end: '',
					},
					{
						start: '',
						end: '',
					}
				]
			};
		},
		methods: {
			close() {
				this.$emit('update:show', false)
			},
			open() {
				const now = new Date()
				const nowTime = now.getTime() ; 
				const curDate = dateFormat(now)
				let day = now.getDay();
				if (day === 0) {
					day = 7
				}
				const oneDayTime = 24*60*60*1000 
				const MondayTime = nowTime - (day-1)*oneDayTime ; 
				this.curDate = curDate
				this.mapRange[0].start = curDate
				this.mapRange[0].end = curDate
				this.mapRange[1].start = dateFormat(new Date(MondayTime))
				this.mapRange[1].end = curDate
				this.mapRange[2].start = dateFormat(new Date(now.getFullYear(), now.getMonth(), 1))
				this.mapRange[2].end = curDate
				this.mapRange[3].start = dateFormat(new Date(now.getFullYear(), 0, 1))
				this.mapRange[3].end = curDate
			},
			restDate() {
				this.curType = ''
				this.start = ''
				this.end = ''
			},
			change() {
				this.close()
				this.$emit('change', {
					startDate: this.start,
					endDate: this.end,
					status: true
				})
			},
			changeKs(type) {
				if (this.curType !== type) {
					this.curType = type
					this.start = this.mapRange[type].start
					this.end = this.mapRange[type].end
				} else {
					this.curType = ''
					this.start = ''
					this.end = ''
				}
			},
			changeTime(event, field) {
				console.log(event, field);
				this[field] = event.detail.value
				this.curType = ''
			}
		}
	}
</script>

<style lang="scss" scoped>
	.pop-title {
		padding: 42rpx;
		text-align: center;
	}

	.btn-pop {
		width: 148rpx;
		height: 64rpx;
		font-size: 28rpx;
		color: #333;
		line-height: 64rpx;
		text-align: center;
		background: #EFEFEF;
		border-radius: 8rpx;

		&.active {
			color: #fff;
			background-color: #5178FF;
		}
	}

	.item {
		padding: 10rpx;
	}

	.uni-input {
		flex: 1;
		height: 64rpx;
		font-size: 28rpx;
		color: #333;
		text-align: center;
		background-color: #EFEFEF;
		border-radius: 8rpx;
	}

	.btn-btm {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 45%;
		height: 80rpx;
		font-size: 36rpx;
		font-weight: 500;
		border-radius: 80rpx;
	}

	.btn-qs {
		color: #5178FF;
		background: rgba(81, 120, 255, 0.1);
	}

	.btn-ss {
		color: #fff;
		background-color: #5178FF;
	}
</style>