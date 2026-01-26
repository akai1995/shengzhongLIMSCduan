<template>
	<view class="tabs">
		<view
			v-for="(item,idx) in tabList" :key="idx"
			class="tabs-item" :class="current==item.id?'active':''"
			@click="onItem(item,idx)"
		>
			{{item.name}}
		</view>
	</view>
</template>

<script>
	export default {
		name:"ut-tabs",
		// props:['tabList','current'],
		props:{
			tabList:{
				type:Array,
				default:()=>[]
			},
			current:{
				type:Number,
				default:()=>0
			}
		},
		data() {
			return {
				// current:0
			};
		},
		methods:{
			onItem(item,index){
				// this.current = index
				this.$emit('onItem',item,index)
			}
		}
	}
</script>

<style lang="scss">
	page{
		background: #F8F8F8;
	}
	.tabs{
		width: 100%;
		height: 90rpx;
		display: flex;
		align-items: center;
		background: #fff;
		&-item{
			flex: 1;
			height: 100%;
			line-height: 90rpx;
			text-align: center;
			position: relative;
			
		}
	}
	.active{
		color: #3B7EFFFF;
		&::after{
			content: '';
			width: 160rpx;
			height: 6rpx;
			background: #3B7EFFFF;
			position: absolute;
			left: 50%;
			bottom: -3rpx;
			transform: translateX(-50%);
		}
		
	}
</style>