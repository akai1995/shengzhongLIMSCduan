<template>
	<view>
		<ut-nav title="发布" border></ut-nav>
		<view class="content">
			<view class="img-box">
				<u-upload :fileList="fileList" @afterRead="afterRead" @delete="deletePic" multiple
					:maxCount="3"></u-upload>
			</view>

			<view>
				<u--input placeholder="输入标题会更受欢迎～" border="none" v-model="title"></u--input>
			</view>

			<view class="m-t2">
				<u--textarea v-model="content" placeholder="请输入内容" maxlength="4000"  height="300rpx"></u--textarea>
			</view>
			<view class="m-t3">
				<u-cell-group>
					<u-cell :title="address" icon="map" isLink @click="chooseAddress()"></u-cell>
					<u-cell :title="type" icon="photo" isLink @click="show = true"></u-cell>

				</u-cell-group>
			</view>
			<u-picker :show="show" :columns="columns" @confirm="confirm" @cancel="show = false" @close="show=false"
				:closeOnClickOverlay='true' :immediateChange='true'></u-picker>
			<view class="button" @click="submit">发布贴子</view>
		</view>
	</view>
</template>

<script>
	import {
		publish,
		checkImg,
		searchLink
	}
	from "@/api/community.js";
	import baseUrl from '@/config.js'
	import { forEach } from "../../uni_modules/uview-ui/libs/luch-request/utils";
	export default {
		data() {
			return {
				tempList: [],
				fileList: [],
				title: '',
				content: '',
				address: '添加地点',
				uploadResult: {},
				type: '栏目',
				show: false,
				columns: [],
				linkList: []
			};
		},
		watch: {
			// 监听文件列表的变化，重新整理内部数据
			uploadResult: {
				immediate: true,
				handler(nv, ov) {
					if (!nv || !nv.url) {
						return
					}
					// 调用检测图片是否涉敏感的接口，如果涉敏就不显示在前端
					checkImg(this.uploadResult.url).then(res => {
						let fileListLen = this.fileList.length
						if (res.data == false) {
							this.tempList.map((item) => {
								this.fileList.push({
									...item,
									// status: 'uploading',
									// message: '上传中'
								})
							})
							this.fileList.splice(fileListLen, 1, {
								status: 'success',
								message: '',
								url: this.uploadResult.url
							})
							fileListLen++
						}
						else {
							this.$ut.showText("图片涉及敏感信息  审核不通过!")
						}
						uni.hideLoading()
					})

				}
			},
		},
		onLoad() {
			// 获取栏目信息列表
			this.getLinkLists()
		},
		methods: {
			chooseAddress() {
				var this_ = this
				wx.choosePoi({
					success(res) {
						this_.address = res.name
						console.log(res, '成功回调')
					},
					fail(res) {
						console.log(res, '失败回调')
					},
					complete(res) {
						console.log(res, '结束回调')
					}
				})
			},
			deletePic(event) {
				this.fileList.splice(event.index, 1)
			},
			async afterRead(event) {
				this.tempList = [].concat(event.file)
				for (let i = 0; i < this.tempList.length; i++) {
					this.uploadFilePromise(this.tempList[i].url)
				}
			},
			uploadFilePromise(url) {
				uni.showLoading()
				let a = uni.uploadFile({
					//url: baseUrl + '/file/upload', // 仅为示例，非真实的接口地址
					url: 'https://genepiapi.ypzlfx.com/prod-api/file/upload',
					filePath: url,
					name: 'file',
					formData: {
						user: 'test'
					},
					success: (res) => {
						let data = JSON.parse(res.data);
						this.uploadResult = data.data
					}
				});
			},
			submit() {
				if (!this.title) {
					this.$ut.showText('标题不能为空！')
					return
				}
				if (!this.content) {
					this.$ut.showText('内容不能为空！')
					return;
				}
				debugger
				if (!this.type) {
					this.$ut.showText('栏目不能为空！')
					return;
				}
				let link = this.linkList.find(u => u.name == this.type)
				let files = []
				this.fileList.forEach(item => {
					files.push(item.url)
				});
				var data = {
					newsTitle: this.title,
					newsContent: this.content,
					newsLocation: this.address,
					newsImage: JSON.stringify(files),
					linkId: link.id
				}
				publish(data).then(res => {
					this.$ut.showText(res.msg)
					if (res.code == 200) {
							uni.$emit('refreshCommunityNews')
							uni.navigateBack()

					}
				})
			},
			getLinkLists() {
				searchLink().then(res => {
					let arr = []
					this.linkList = res.data
					if (res.code == 200) {
						res.data.forEach(item => {
							arr.push(item.name)
						})
					}
					this.columns.push(arr)
				})
			},
			confirm(e) {
				this.type = e.value[0]
				this.show = false
			}
		}

	}
</script>

<style lang="less">
	page {
		background: #fff;
	}

	.img-box {
		width: 100%;
		height: 230rpx;
	}

	.button {
		position: fixed;
		left: 70rpx;
		right: 70rpx;
		bottom: 65rpx;
		height: 80rpx;
		border-radius: 80rpx;
		background: linear-gradient(135deg, #00DEFF 0%, #0C5FFF 100%);
		;
		display: flex;
		align-items: center;
		justify-content: center;
		color: #fff;
		font-size: 36rpx;
		font-weight: 500;
		letter-spacing: 2rpx;
	}
</style>