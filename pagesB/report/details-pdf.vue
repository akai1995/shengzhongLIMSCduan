<template>
	<view>
		<!-- <ut-nav title="获取报告" border></ut-nav> -->
		<view class="content">
			<web-view :src="url" @message="message" ></web-view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				url:''
			}
		},
		onLoad(options) {
			if(options.url){
				this.url = options.url
				console.log('url',this.url)
			}
		},
		methods: {
			message(e){
				console.log('e',e)
			}
		}
	}
</script>

<style>

</style>
