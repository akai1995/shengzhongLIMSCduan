<template>
	<view>
		<ut-nav title="试剂盒使用说明"></ut-nav>
		<view class="">
			<video style="width: 100%;" autoplay src="https://genepiapi.ypzlfx.com/file/genepi/2024/01/08/09a5f33918d8be5036930b4787555416.mp4" poster="https://genepiapi.ypzlfx.com/file/genepi/2024/01/08/ssOkr8vT75AO9ea6ca199cc829691e5591bc6d42b65d_20240108153408A724.jpg"></video>
			<image src="https://genepiapi.ypzlfx.com/file/genepi/2023/12/11/vLnME1Xpe38Scc8e429b45f2571516c4fb1f2c033b6e_20231211154754A155.jpg" style="width: 100%;" mode="widthFix"></image>
		</view>
	</view>
</template>

<script>
	let eventChannel  = null
	export default {
		data() {
			return {
				title: '',
				src: ''
			};
		},
		onLoad(options) {
			// eventChannel = this.getOpenerEventChannel();
			// eventChannel.on('info', (info) => {
			// 	const { title, src } = info
			// 	this.title = title
			// 	this.src = src
			// })
		}
	}
</script>

<style lang="scss">

</style>
