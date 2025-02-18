<template>
	<view class="d-flex js-b-c" style="padding-top: 16rpx;">
		<template v-for="(item, index) in options">
			<view @click="change(item.value)" class="item" :class="{ 'checked': item.value === value, 'item3': options.length === 3 }" :key="index">{{ item.label }}</view>
		</template>
	</view>
</template>

<script>
	export default {
		name: 'ridio-db',
		props: {
			value: {
				type: String,
				default: ''
			},
			options: {
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
			}
		},
		data() {
			return {

			};
		},
		methods: {
			change(event) {
				this.$emit('update:value', event)
				this.$emit('change', event)
			}
		}
	}
</script>

<style scoped lang="scss">
	.item {
		width: 46%;
		padding: 12rpx 20rpx;
		font-size: 26rpx;
		color: #666;
		text-align: center;
		border-width: 1rpx;
		border-style: solid;
		border-color: rgba(0, 0, 0, .1);
		border-radius: 12rpx;
		box-sizing: border-box;
		
		&.checked {
			color: #fff;
			border-color: #3B7EFF;
			background-color: #3B7EFF;
		}
		
		&.item3 {
			width: 26%;
		}
	}

</style>