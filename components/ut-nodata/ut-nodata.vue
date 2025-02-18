<template>
	<view class="no-data">
		<u-empty mode="list" ></u-empty>
	</view>
</template>

<script>
	export default {
		name:"ut-nodata",
		data() {
			return {
				
			};
		}
	}
</script>

<style lang="less">
.no-data{
	position: absolute;
	left: 50%;
	top: 50%;
	transform: translate(-50%,-50%);
	z-index: 2;
}
</style>