<template>
	<view>
		<view class="back" @click="onBack()">
			<u-icon name="arrow-left" color="#fff" size="28rpx"></u-icon>
		</view>
		<view>
			<Lyn4ever-gaodeRoutePlanning ref="maps" :scale="scale" :longitude="longitude" :latitude="latitude"
				width="100vw" heith="100vh" :Config="Config" :startPoi="startPoi" :endPoi="endPoi" :wayPoi="wayPoi"
				:polyline="polylines" />

		</view>
		<view class="view">
			<view class="top">
				<view class="du">
					<view class="t">实时温度</view>
					<view class="font">{{ temperature || 0}} °C</view>
				</view>
				<view class="du">
					<view class="t">实时湿度</view>
					<view class="font">{{ humidness|| 0}} %rh</view>
				</view>
			</view>
			<scroll-view scroll-y class="steps">
				<u-steps :current="stepsList.length" direction="column">
					<u-steps-item v-for="(item,index) in stepsList" :key="index"
						:title="status(item.oderType,item.userName)" :desc="item.oderTime"></u-steps-item>
				</u-steps>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	import {
		sample
	}
	from '@/api/order.js'
	// import Lyn4evergaodeRoutePlanning from '../components/Lyn4ever-gaodeRoutePlanning'
	export default {
		components:{
			// Lyn4evergaodeRoutePlanning
		},
		data() {
			return {
				flag: true,
				id: '',
				markers: [],
				longitude: null,
				latitude: null,
				scale: 7.5,
				Config: {
					showMarks: false,
					lineColor: "#ff0000", //路径颜色
					lineWidth: 4, //路径宽度
					startImage: "https://genepiapi.ypzlfx.com/file/genepi/2023/10/24/0eIutzLIDPsg883a653fe9bbe70f98343aee48399c48_20231024162930A521.png",
					wayImage: "https://genepiapi.ypzlfx.com/file/genepi/2023/10/23/l5V4Utu4XHAX8499a2fe9358b54b245701e198411d6d_20231023200037A490.png",
					endImage: "https://genepiapi.ypzlfx.com/file/genepi/2023/10/24/uqJSY4tXLyHB65f95c30eca3742d21a5baa85eb491f3_20231024162959A522.png"
				},
				startPoi: "",
				endPoi: "",
				wayPoi: "",
				//路线信息
				polylines: [],
				nextPointIndex: 1,
				mapContext: null, //地图对象
				temperature: 0,
				humidness: 0,
				stepsList: [],
				trajectory: []
			}
		},
		onLoad(options) {
			if (options.id) {
				this.id = options.id
				this.getList()
			}
		},

		methods: {
			markertap(e) {
				let that = this
				var id = e.markerId;
				console.log(id)
			},
			async getList() {
				let that = this
				sample(this.id).then(res => {
					if (res.code == 200) {
						var list = res.data.sendSampleList[0]
						this.temperature = res.data.devDevice.tem.toFixed(2)
						this.humidness = res.data.devDevice.hum.toFixed(2)
						this.stepsList = res.data.orderLogList
						this.startPoi = res.data.startPosi
						this.endPoi = res.data.endPosi
						const startpoiArr = this.startPoi.split(',').map(o => Number(o))
						const endpoiArr = this.endPoi.split(',').map(o => Number(o))
						const distance = Math.sqrt(Math.pow(startpoiArr[0] - endpoiArr[0], 2) + Math.pow(
							startpoiArr[1] - endpoiArr[1], 2))
						this.scale = Number(distance / 2.16 * 7.5).toFixed(2)
						this.longitude = (startpoiArr[0] + endpoiArr[0]) / 2
						this.latitude = (startpoiArr[1] + endpoiArr[1]) / 2 - Number(distance / 2.16 * 0.6)
						.toFixed(2)
						const wagpoints = list.deviceLogList.filter(a => (a.lng > 0 && a.lat > 0))
						if (wagpoints.length > 0) {
							const last = wagpoints[wagpoints.length - 1]
							this.startPoi = `${last.lng},${last.lat}`
							this.$refs.maps.polyline.push({
								points: wagpoints.map(o => {
									return {
										longitude: o.lng,
										latitude: o.lat,
									}
								}),
								color: "#4aba44",
								width: 8,
								arrowLine: true,
							})
							this.$refs.maps.markers.push({
								height: 40,
								iconPath:this.Config.wayImage ,
								id: 999,
								latitude: last.lat,
								longitude: last.lng,
								width: 25,
							})
							this.$refs.maps.markers.push({
								height: 25,
								iconPath:this.Config.startImage,
								id: 998,
								latitude: startpoiArr[1],
								longitude: startpoiArr[0],
								width: 25,
							})
							this.$refs.maps.markers.push({
								height: 25,
								iconPath: this.Config.endImage,
								id: 997,
								latitude: endpoiArr[1],
								longitude: endpoiArr[0],
								width: 25,
							})
						}
						// this.markers = list.deviceLogList
						if (this.markers.length > 0) {
							// let listArr = []
							// //该方法会在每个有经纬度的地方出现标点
							// that.markers.map(item => {
							// 	const obj = {
							// 		id: parseInt(item.id) ,
							// 		width: 30,
							// 		height: 30,
							// 		//如果有数据就覆盖原有的经纬度
							// 		latitude: that.latitude = item.lat,
							// 		longitude: that.longitude = item.lng,
							// 		// iconPath: '/static/biaodian.png',
							// 		anchor: {
							// 			x: 0.5,
							// 			y: 1
							// 		}
							// 	}
							// 	listArr.push(obj)
							// })
							// that.markers = listArr
							// // 初始化地图不划线
							// that.polylines[0].points = that.markers
							// /**
							//  * 搜索完成设置路线后自动移动轨迹
							//  */
							// that.initMap();
							// that.handleIsstartMove();

							this.flag = true

						}

						// that.$refs.maps.startPoi = res.data.startPosi
						// that.$refs.maps.endPoi = res.data.endPosi
						// that.$refs.maps.init()
					}
				})




			}, //设置地图
			initMap() {
				this.initMarkers()
				//初始化地图
				this.mapContext = uni.createMapContext('Map', this)
			},
			//设置位置（从起点开始）
			initMarkers() {
				this.markers[0].latitude = this.polylines[0].points[0].latitude
				this.markers[0].longitude = this.polylines[0].points[0].longitude
			}, //开始移动
			handleIsstartMove() {
				this.IsstartMove = true
				this.moveMarkers()
			}, //移动坐标
			moveMarkers() {
				this.mapContext.translateMarker({
					markerId: this.markers[0].id,
					destination: {
						latitude: this.polylines[0].points[this.nextPointIndex].latitude,
						longitude: this.polylines[0].points[this.nextPointIndex].longitude
					},
					animationEnd: res => {
						//播放结束，继续移动到下一个点，最后一个点时结束移动
						if (this.nextPointIndex < this.polylines[0].points.length - 1) {
							this.nextPointIndex++
							if (this.IsstartMove) {
								console.log('index', this.nextPointIndex)

								this.moveMarkers()
							}
						}
						else {
							this.nextPointIndex = 1
							this.IsstartMove = false
						}
					}
				})
			},
			status(type, name) {
				if (type == 1) {
					return '待确认  ' + name
				}
				else if (type == 2) {
					return '已确认  ' + name
				}
				else if (type == 3) {
					return '寄送中  ' + name
				}
				else if (type == 4) {
					return '已接收  ' + name
				}
				else if (type == 5) {
					return '已取消  ' + name
				}
			},
			onBack() {
				uni.navigateBack()
			}
		}
	}
</script>

<style scoped lang="less">
	.back {
		position: fixed;
		z-index: 10;
		left: 60rpx;
		top: 60rpx;
		width: 50rpx;
		height: 50rpx;
		border-radius: 50%;
		background: #989796db;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.map {
		width: 100%;
		height: 100vh;
	}

	.view {
		position: fixed;
		left: 20rpx;
		right: 20rpx;
		bottom: 20rpx;
		height: 45vh;
		border-radius: 10rpx;
		background: #fff;
		padding: 20rpx;
		box-sizing: border-box;

		.top {
			width: 100%;
			height: 140rpx;
			background: #03a9f4;
			display: flex;

			.du {
				width: 50%;

				.t {
					font-size: 28rpx;
					color: #fff;
					font-weight: 500;
					line-height: 2;
					text-align: center;
					letter-spacing: 2rpx;
				}

				.font {
					font-size: 40rpx;
					font-weight: bold;
					color: #fff;
					text-align: center;
					line-height: 2;
				}
			}

		}

		.steps {
			width: 100%;
			height: calc(100% - 140rpx);
			padding: 20rpx;
			box-sizing: border-box;
		}

	}
</style>