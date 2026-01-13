<template>
	<view>
		<map id="mapView" :style="{width: width, height: height}" show-scale  :latitude="latitude" :longitude="longitude" :markers="markers"
			:polyline="polyline" :scale="scale">
		</map>
	</view>
</template>

<script>
	import Config from '../../lib/config.js';
	const amapFile = require('../../lib/amap-uni.js');
	export default {
		data() {
			return {
				markers: [],
				polyline: [],
				defaultConfig: {
					showMarks: true,
					lineColor: "#0606ff", //路径颜色
					lineWidth: 4, //路径宽度
					startImage: "",
					wayImage: this.$staticPath+"genepi/2023/10/23/l5V4Utu4XHAX8499a2fe9358b54b245701e198411d6d_20231023200037A490.png",
					endImage: ""
				}
			}
		},
		props: {
			scale: {
				type: Number,
				default: 16
			},
			width: {
				type: String,
				default: "100vw"
			},
			height: {
				type: String,
				default: "100vh"
			},
			longitude: {
				type: Number
			},
			latitude: {
				type: Number
			},
			startPoi: {
				type: String
			},
			wayPoi: {
				type: String
			},
			endPoi: {
				type: String
			},
			Config: {
				type: Object,
				default: function() {
					return {}
				}
			},
			includePoints: {
				type: Array,
				default: []
			}
		},
		onLoad() {
			this.init()
		},
		watch: {
			positionChanged: {
				handler(nv) {
					this.init()
				}
			},
			includePoints: {
				handler(nv) {
					console.log(nv);
					let MapContext = uni.createMapContext('mapView', this);
					MapContext.includePoints({
						padding: [30,30,30,30],
						points: nv
					})
				}
			}
		},
		computed: {
			positionChanged() {
				const { startPoi, endPoi, latitude, longitude } = this;
				return { startPoi, endPoi, latitude, longitude };
			}
		},
		methods: {

			init() {
				if (this.startPoi == null) {
					return
				}

				let that = this;

				// this.Config
				Object.assign(this.defaultConfig, this.Config)

				// fix longitude and latitude
				if (this.latitude == 0 || this.longitude == 0) {
					let startPoints = this.startPoi.split(",")
					this.longitude = parseFloat(startPoints[0])
					this.latitude = parseFloat(startPoints[1])
				}


				this.getDrivingRoute(this.startPoi, this.endPoi, this.wayPoi, (res) => {
					that.polyline.push(res)
				});

				if (this.Config.showMarks) {
					this.setMarkers(this.startPoi, this.endPoi, this.wayPoi, (res) => {
						this.markers.push.apply(that.markers, res)
						// this.$forceUpdate()
					})
				}
			},

			getDrivingRoute(start, end, _waypoints, result, fail) {
				console.log(Config.GAODE_KEY)
				let that = this;
				var myAmapFun = new amapFile.AMapWX({
					key: Config.GAODE_KEY
				});

				myAmapFun.getDrivingRoute({
					origin: start,
					destination: end,
					waypoints: _waypoints,
					success: function(data) {
						// console.log(data)
						var points = [];
						if (data.paths && data.paths[0] && data.paths[0].steps) {
							var steps = data.paths[0].steps;
							for (var i = 0; i < steps.length; i++) {
								var poLen = steps[i].polyline.split(';');
								for (var j = 0; j < poLen.length; j++) {
									points.push({
										longitude: parseFloat(poLen[j].split(',')[0]),
										latitude: parseFloat(poLen[j].split(',')[1])
									})
								}
							}
						}
						//这个返回结果就是对应的路线坐标,其他属性页面自己配置,请参照uniapp地图组件一章节
						//https://uniapp.dcloud.io/component/map
						result({
							points: points,
							color: that.Config.lineColor,
							width: that.Config.lineWidth
						})
					},
					fail: function(info) {
						console.log(info)
						fail(info)
					}
				})
			},
			setMarkers(startpoi, endpoi, waypoints, success) {
				let markers = [];

				//起点
				let start = {
					iconPath: this.Config.startImage,
					id: 0,
					longitude: parseFloat(startpoi.split(",")[0]),
					latitude: parseFloat(startpoi.split(",")[1]),
					width: 25,
					height: 25
				}
				markers.push(start)
				//终点
				let end = {
					iconPath: this.Config.endImage,
					id: 1,
					longitude: parseFloat(endpoi.split(",")[0]),
					latitude: parseFloat(endpoi.split(",")[1]),
					width: 25,
					height: 25
				}
				markers.push(end)
				//途经点,先将其分隔成为数组
				let _waypoints = waypoints.split(';')
				for (let i = 0, _len = _waypoints.length; i < _len; i++) {
					let point = {
						iconPath: this.Config.wayImage,
						id: i + 2,
						longitude: parseFloat(_waypoints[i].split(",")[0]),
						latitude: parseFloat(_waypoints[i].split(",")[1]),
						width: 25,
						height: 100
					}
					markers.push(point)
				}


				let _nowpoint = {

					iconPath: this.Config.wayImage,
					id: 2,
					longitude: this.longitude,
					latitude: this.latitude,
					width: 25,
					height: 25
				}
				// if (this.longitude != null && this.longitude != 0) {
				// 	markers.push(_nowpoint)
				// }



				//统一风格为回调方式,也可以直接返回这个markers
				success(markers);

			}
		}
	}
</script>

<style>

</style>