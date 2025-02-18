<template>
	<view>
		<ut-nav title="打印机设备"></ut-nav>

		<view class="content">
			<u-button type="primary" shape='circle' @click="startSearch()" text="搜索打印机设备"></u-button>

			<view class="m-t3">
				<u-cell-group>
					<block v-for="(item,index) in list" :key="index">
						<!-- <u-cell size="large" @click="bindViewTap(item)" :title="item.name" :value="item.deviceId" isLink></u-cell> -->
						<u-cell size="large" :title="item.name" :value="item.deviceId" isLink></u-cell>
					</block>

				</u-cell-group>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list: [],
				services: [],
				serviceId: 0,
				writeCharacter: false,
				readCharacter: false,
				notifyCharacter: false,
				isScanning: false
			}
		},
		onLoad() {
			this.startSearch()
		},
		methods: {
			startSearch() {
				var that = this
				wx.openBluetoothAdapter({
					success: function(res) {
						wx.getBluetoothAdapterState({
							success: function(res) {
								console.log('openBluetoothAdapter success', res)
								if (res.available) {
									if (res.discovering) {
										wx.stopBluetoothDevicesDiscovery({
											success: function(res) {
												console.log(res)
											}
										})
									} else {
										// that.startBluetoothDevicesDiscovery()
										that.getBluetoothDevices()
									}
									// that.checkPemission()
								} else {
									wx.showModal({
										title: '提示',
										content: '本机蓝牙不可用',
										showCancel: false
									})
								}
							},
						})
					},
					fail: function() {
						// if (res.errCode === 10001) {
						//   wx.onBluetoothAdapterStateChange(function (res) {
						//     console.log('onBluetoothAdapterStateChange', res)
						//     if (res.available) {
						//       this.startBluetoothDevicesDiscovery()
						//     }
						//   })
						// }

						wx.showModal({
							title: '提示',
							content: '蓝牙初始化失败，请到设置打开蓝牙',
							showCancel: false
						})
					}
				})
			},
			getBluetoothDevices() {
				var that = this
				console.log("start search")
				wx.showLoading({
					title: '正在搜索设备',
					icon: 'loading',
				})
				that.isScanning = true
				wx.startBluetoothDevicesDiscovery({
					success: function(res_) {
						setTimeout(function() {
							wx.getBluetoothDevices({
								success: function(res) {
									var devices = []
									var num = 0
									res.devices.forEach((item,index)=>{
										if(item.name == 'GP-M322-6578_BLE'){
											devices[num] = res.devices[index]
											num++
										}
									})
									console.log('devices:',devices)
									// for (var i = 0; i < res.devices.length; ++i) {
									// 	if (res.devices[i].name == "GP-M322-6578_BLE") {
									// 		devices[num] = res.devices[i]
									// 		num++
									// 	}
									// }
									that.list = devices
									that.isScanning = false

									wx.hideLoading()
									wx.stopPullDownRefresh()
									wx.stopBluetoothDevicesDiscovery({
										success: function(res) {
											console.log("停止搜索蓝牙")
										}
									})
									
									if(that.list.length>0){
										that.bindViewTap()
									}
								},
							})
						}, 5000)
					},
				})
			},
			//连接设备
			bindViewTap() {
				var e = this.list[0]
				// console.log('e',e)
				
				var that = this
				wx.stopBluetoothDevicesDiscovery({
					success: function(res) {
						console.log(res)
					},
				})
				this.serviceId = 0
				this.writeCharacter = false
				this.readCharacter = false
				this.notifyCharacter = false
				// console.log(e.deviceId)
				wx.showLoading({
					title: '正在连接',
				})
				wx.createBLEConnection({
					deviceId: e.deviceId,
					success: function(res) {
						// console.log('res1',res)
						that.$store.commit('SET_DEVICEID', e.deviceId)
						// console.log('--deviceId:',that.$store.getters.getDeviceId)
						// app.BLEInformation.deviceId = e.deviceId
						that.getSeviceId()
						return
					},
					
					fail: function(e) {
						wx.showModal({
							title: '提示',
							content: '连接失败',
							showCancel: false
						})
						// console.log(e)
						wx.hideLoading()
					},
					complete: function(e) {
						console.log(e)
					}
				})
			},
			getSeviceId() {
				var that = this
				var platform = that.$store.getters.getPlatform
				wx.getBLEDeviceServices({
					deviceId: that.$store.getters.getDeviceId,
					success: function(res) {
						// console.log('--res:',res.services)
						
						that.services = res.services
						that.getCharacteristics()
					},
					fail: function(e) {
						console.log(e)
					},
					complete: function(e) {
						console.log(e)
					}
				})
			},
			getCharacteristics() {
				var that = this
				var list = that.services
				var num = that.serviceId
				var write = that.writeCharacter
				var read = that.readCharacter
				var notify = that.notifyCharacter
				
				// console.log('--list--',list)
				// return
				wx.getBLEDeviceCharacteristics({
					deviceId: that.$store.getters.getDeviceId,
					serviceId: list[num].uuid,
					success: function(res) {
						console.log(res)
						for (var i = 0; i < res.characteristics.length; ++i) {
							var properties = res.characteristics[i].properties
							var item = res.characteristics[i].uuid
							if (!notify) {
								if (properties.notify) { 
									that.$store.commit('SET_NOTIFYCHARATERID', item)
									that.$store.commit('SET_NOTIFYSERVICEID', list[num].uuid)
									notify = true
								}
							}
							if (!write) {
								if (properties.write) {
									that.$store.commit('SET_WRITECHARATERID', item)
									that.$store.commit('SET_WRITESERVICEID', list[num].uuid)
									write = true
								}
							}
							if (!read) {
								if (properties.read) {
									that.$store.commit('SET_READCHARATERID', item)
									that.$store.commit('SET_READSERVICEID', list[num].uuid)
									read = true
								}
							}
						}
						if (!write || !notify || !read) {
							num++
							that.writeCharacter = write
							that.readCharacter = read
							that.notifyCharacter = notify
							that.serviceId = num
							if (num == list.length) {
								wx.showModal({
									title: '提示',
									content: '找不到该读写的特征值',
									showCancel: false
								})
							} else {
								that.getCharacteristics()
							}
						} else {
							wx.showToast({
								title: '连接成功',
							})
							setTimeout(()=>{
								that.openControl()
							},1000)
						}
					},
					fail: function(e) {
						console.log(e)
					},
					complete: function(e) {
						console.log("write:" +  that.$store.getters.getWriteCharaterId)
						console.log("read:" +  that.$store.getters.getReadCharaterId)
						console.log("notify:" + that.$store.getters.getNotifyCharaterId)
					}
				})
			},
			openControl(){
				uni.navigateBack()
			}
		}
	}
</script>

<style lang="scss">

</style>