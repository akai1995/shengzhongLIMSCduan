<template>
	<view class="ask-box">
		<view class="h2">{{ title }}</view>
		<template v-for="(item, index) in askList">
			<view @click="change(item.value)" class="answer-item" :class="{ 'active': curValue.includes(item.value) }"
				:key="item.value">{{ item.label }}</view>
		</template>
	</view>
</template>

<script>
	import { debounce } from '@/utils/public'
	console.log(debounce);
	export default {
		props: {
			value: {
				type: String,
				value: ''
			},
			title: {
				type: String
			},
			askList: {
				type: Array,
				default: [{
						label: '是',
						value: '1'
					},
					{
						label: '否',
						value: '0'
					},
				]
			},
			cType: {
				type: String,
				default: '1' // 2 多选 判断 3 填空 4
			}
		},
		watch: {
			value(val) {
				this.curValue = val
			}
		},
		data() {
			return {
				curValue: ''
			}
		},
		methods: {
			change: debounce(function (val) {
				const {
					cType,
					curValue
				} = this
				let cValue = ''
				if (cType === '1') {
					cValue = val
				} else if (cType === '2') {
					if (!curValue) {
						cValue = val
					} else {
						const values = curValue.split('|')
						if (values.includes(val)) {
							const curIndex = values.findIndex(item => item === val)
							values.splice(curIndex, 1)
						} else {
							values.push(val)
						}
						cValue = values.join('|')
					}
				}
				this.curValue = cValue
				this.$emit('change', cValue)
			}, 100)
		}
	}
</script>

<style lang="scss">
	.h2{
		color: #000;
		font-weight: bold;
	}
	.ask-box {
		position: relative;
		height: 100%;
		overflow-y: auto;
		z-index: 4;
	}

	.answer-item {
		margin: 24rpx 0;
		padding: 22rpx 32rpx;
		border-radius: 20rpx;
		font-size: 28rpx;
		border: 1rpx solid rgba(0, 0, 0, .1);
		color: #666;

		&.active {
			color: #3B7EFF;
			border-color: #3B7EFF;
		}
	}
</style>