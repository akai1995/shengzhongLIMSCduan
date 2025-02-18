<template>
	<view>
		<ut-nav title="送检预约" border></ut-nav>
		<ut-tabs :tabList="tabList" :current="current" @onItem="onItem"></ut-tabs>

		<view class="content" v-if="current == 1">
			<view class="ut-view">

				<view class="title flex">
					<u-icon name="pushpin" color="#333" size="28rpx"></u-icon>
					<text>检测样本</text>
				</view>
				<u-line></u-line>
				<view class="item m-t2" v-for="(list,index_) in subForm.testSample" :key="index_">
					<image class="img" :src="list.sampleImage[0]" mode=""></image>
					<view class="text">
						<view class="h1 ellipsis">{{list.sampleType}}</view>
						<view class="vice flex j-c">
							<view>样本数量：{{list.sampleCount}}</view>
							<view>采集时时间：{{list.collectionTime}}</view>
						</view>
						<view class="vice">样本编码：{{list.sampleCode}}</view>
					</view>
				</view>
				<view class="bottom m-t2" @click="active">
					<u-icon name="plus" color="#3B7EFFFF" size="28rpx"></u-icon>
					<text>添加更多检测样本</text>
				</view>
				<view class="rules m-t3">*最多可添加10个样本</view>

			</view>

			<view class="ut-view m-t2">
				<view class="title flex">
					<u-icon name="edit-pen" color="#333" size="28rpx"></u-icon>
					<text>备注</text>
				</view>
				<u-line></u-line>
				<view class="m-t2">
					<u--textarea v-model="subForm.remark" border="none" placeholder="请输入"></u--textarea>
				</view>
			</view>

			<view class="ut-view m-t2" style="min-height: 60rpx;">
					<view style="display: flex;">
						<view class="title flex">
							<u-icon name="hourglass" color="#333" size="28rpx"></u-icon>
							<text>预约送检时间</text>
						</view>
							<view class="input-box" @click="showDateTime = true">
								<u--input readonly border="none" v-model="subForm.submissionTime"
									placeholder="请选择预约送检时间" readonly></u--input>
								<u-datetime-picker @cancel="showDateTime = false" @close="showDateTime = false"
									:show="showDateTime" @confirm='confirmSendTime' :min-date="minDate"
									:closeOnClickOverlay='true' mode="datetime"></u-datetime-picker>
							</view>
					</view>
			</view>

			<view class="ut-view m-t2">
				<view class="title" style="display: flex;">
					<u-icon name="map" color="#333" size="28rpx"></u-icon>
					<text>地址</text>
				</view>
				<u-line></u-line>

				<view class="cell-box" @click="$ut.jump('/pagesA/inspect/address?type=0')">
					<view class="icon back1">寄</view>
					<view class="text">{{subForm.mailAddress}}</view>
					<view class="right">
						<u-icon name="arrow-right" color="#999" size="28rpx"></u-icon>
					</view>
				</view>
				<view class="cell-box" style="background: #00C77714;"
					@click="$ut.jump('/pagesA/inspect/address?type=1')">
					<view class="icon back2">收</view>
					<view class="text">{{subForm.reachAddress}}</view>
					<view class="right">
						<u-icon name="arrow-right" color="#999" size="28rpx"></u-icon>
					</view>
				</view>
			</view>

			<view class="btn m-t4" @click="$ut.showText('请填写信息')" v-if="!showBtn">确认提交</view>
			<view class="btn back-btn m-t4" @click="submiit" v-if="showBtn">确认提交</view>

			<u-popup :show="isShow" @close="close" closeable>
				<view class="popup">
					<view class="title">添加样本</view>
					<view class="content">
						<u--form :model="form" labelWidth="150rpx" ref='form' :rules="rules">
							<u-form-item label="样本类型" prop="sampleType" @click="showType = true">
								<u--input v-model="form.sampleType" border="none" readonly placeholder="请选择"></u--input>
								<u-icon slot="right" name="arrow-right"></u-icon>
								<u-picker :show="showType" :columns="typeList" @close="closeType" @cancel="closeType"
									@confirm="setType"></u-picker>
							</u-form-item>
							<u-form-item label="样本数量" prop="sampleCount">
								<u--input v-model="form.sampleCount" border="none" type="number"
									placeholder="请输入"></u--input>
							</u-form-item>
							<u-form-item label="采集时间" prop="collectionTime" @click="showDate = true">
								<u--input v-model="form.collectionTime" border="none" readonly
									placeholder="请输入"></u--input>
								<u-icon slot="right" name="arrow-right"></u-icon>
								<u-datetime-picker :show="showDate" @cancel="cancelTime" :closeOnClickOverlay='true'
									@close="cancelTime" @confirm="setDate" mode="date"
									:min-date="minDate"></u-datetime-picker>
							</u-form-item>
							<u-form-item label="样本编码" prop="sampleCode" borderBottom>
								<u--input v-model="form.sampleCode" border="none" placeholder="请输入"></u--input>
							</u-form-item>
							<u-form-item label="样本图片" prop="sampleImage" labelPosition="top">
								<view class="m-t2">
									<u-upload :fileList="fileList" @afterRead="afterRead" @delete="deletePic" multiple
										:maxCount="3">

									</u-upload>
								</view>

							</u-form-item>
						</u--form>
					</view>


					<view class="submit">
						<view class="btn" @click="save">保存</view>
					</view>
				</view>
			</u-popup>
		</view>

		<view class="content" v-if="current == 2" style="padding-top: 0;">
			<block v-for="(item,inex) in queryList" :key="index">
				<view class="ut-view m-t3" @click="$ut.jump('/pagesA/inspect/details?id='+item.id)">
					<view class="up">预约送检时间：{{item.submissionTime | formatDate}}</view>
					<view class="item m-t2" v-for="(list,index_) in item.testSample" :key="index_">
						<image class="img" :src="list.sampleImage" mode=""></image>
						<view class="text">
							<view class="h1 ellipsis">{{list.sampleType}}</view>
							<view class="vice flex j-c">
								<view>样本数量：{{list.sampleCount}}</view>
								<view>采集时间：{{list.collectionTime | formatDate}}</view>
							</view>
							<view class="vice">样本编码：{{list.sampleCode}}</view>
						</view>
					</view>
				</view>
			</block>
			<ut-nodata v-if="queryList.length == 0"></ut-nodata>
		</view>
	</view>
</template>

<script>
	import {
		baseUrl
	} from "@/config";
	import {
		addInspectionAppointment,
		getByIdInspectionAppointment,
		getAddres,
		getDefaultAddressList
	} from "@/api/hospitalrelated/hospitalrelated"
	import {
		getDicts,
	} from "@/api/expert/data"
	export default {
		filters: {
			formatDate: function(item) {
				const date = new Date(item);
				const year = date.getFullYear();
				const month = date.getMonth() + 1; // 月份从0开始，所以需要加1
				const day = date.getDate();
				return year + "/" + month.toString().padStart(2, '0') + '/' + day.toString().padStart(2, '0');
			}
		},
		data() {
			return {
				tabList: [{
					name: '新建送检预约',
					id: 1
				}, {
					name: '历史记录',
					id: 2
				}],
				current: 1,
				value: '',
				isShow: false,
				showDateTime: false,
				queryList: [], //历史查询列表
				historyQueryList: [], //历史查询样本列表
				subForm: {
					userId: this.$store.getters.userId,
					testSample: [], //样本列表
					remark: '', //备注
					mailAddress: '请寄出选择地址', //寄出地址
					reachAddress: '请选择收货地址', //收件地址
					submissionTime: '', //预约送检时间

				},
				form: {
					sampleType: '',
					sampleCount: '',
					collectionTime: '',
					sampleCode: '',
					sampleImage: [],
				},
				showType: false,
				typeList: [
					[]
				],
				dictType:'sample_type',
				showDate: false,
				fileList: [],
				rules: {
					'sampleType': {
						type: 'string',
						required: true,
						message: '请选择样本类型',
						trigger: ['blur', 'change']
					},
					"sampleCount": {
						type: 'string',
						required: true,
						message: '请填写样本数量',
						trigger: ['blur', 'change']
					},
					"collectionTime": {
						type: 'string',
						required: true,
						message: '请选择样本时间',
						trigger: ['blur', 'change']
					},
					"sampleCode": {
						type: 'string',
						required: true,
						message: '请填写样本编码',
						trigger: ['blur', 'change']
					},
					
				},
				minDate: new Date().getTime(),
			}
		},
		onLoad() {
			// console.log(new Date)
			this.getDefaultAddressList();
			this.sampleType()
		},
		computed: {
			showBtn: function() {
				if (this.subForm.testSample.length > 0 && this.subForm.mailAddress != '请寄出选择地址' && this.subForm.reachAddress != '请选择收货地址' && this.subForm.submissionTime != '' ) {
					return true
				}else{
					return false
				}
			}
		},
		methods: {
			onItem(e, index) {
				this.current = e.id
				if (this.current == 2) {
					getByIdInspectionAppointment(this.subForm.userId).then(res => {
						this.queryList = res.data;
					})
				}
			},
			close() {
				this.isShow = false
			},
			closeType() {
				this.showType = false
			},
			setType(e) {
				this.form.sampleType = e.value[0]
				this.showType = false
			},
			cancelTime() {
				this.showDate = false
			},
			setDate(e) {
				this.form.collectionTime = uni.$u.timeFormat(e.value, 'yyyy-mm-dd')
				this.showDate = false
			},
			confirmSendTime(e) {
				const timeFormat = uni.$u.timeFormat;
				this.subForm.submissionTime = timeFormat(e.value, 'yyyy-mm-dd hh:MM:ss')
				this.showDateTime = false
			},
			deletePic(event) {
				this.fileList.splice(event.index, 1)
			},
			async afterRead(event) {
				let lists = [].concat(event.file)
				let fileListLen = this.fileList.length
				lists.map((item) => {
					this.fileList.push({
						...item,
						// status: 'uploading',
						// message: '上传中'
					})
				})
				for (let i = 0; i < lists.length; i++) {
					const result = await this.uploadFilePromise(lists[i].url)
					let item = this.fileList[fileListLen]
					this.fileList.splice(fileListLen, 1, Object.assign(item, {
						status: 'success',
						message: '',
						url: result
					}))
					fileListLen++
				}
			},
			uploadFilePromise(url) {
				return new Promise((resolve, reject) => {
					let a = uni.uploadFile({
						url: baseUrl + '/file/upload', // 仅为示例，非真实的接口地址
						filePath: url,
						name: 'file',
						formData: {
							user: 'test'
						},
						success: (res) => {
							let result = JSON.parse(res.data)
							if (result.code == 200) {
								this.form.sampleImage.push(result.data.url);
							} else {
								uni.$u.toast('图片上传失败');
							}

						}
					});
				})

			},
			//重置样本
			reset() {
				this.form = {
					sampleType: '',
					sampleCount: '',
					collectionTime: '',
					sampleCode: '',
					sampleImage: [],
					fileList: [],
				}
				this.fileList=[];

			},
			reset1() {
				this.subForm = {
					userId: this.$store.getters.userId,
					testSample: [], //样本列表
					remark: '', //备注
					mailAddress: '请寄出选择地址', //寄出地址
					reachAddress: '请选择收货地址', //收件地址
					submissionTime: '', //预约送检时间

				}

			},

			//保存样本列表
			save() {
				this.$refs.form.validate().then(res => {
					this.subForm.testSample.push(this.form);
					this.isShow = false;
					this.reset();
				})

			},
			//提交预约
			submiit() {
				console.log('-',this.subForm.mailAddress)
				console.log('-',this.subForm.reachAddress)
				uni.showLoading()
				console.log(this.subForm)
				if(this.subForm.submissionTime!=''){
					addInspectionAppointment(this.subForm).then(res => {
						if (res.code == 200) {
							uni.$u.toast('预约成功');
							this.current = 2;
							this.getData();
							this.reset1();
						} else {
							uni.$u.toast('预约失败，请重新预约');
						}
						uni.hideLoading()
					})
				}else{
					uni.$u.toast('请填写预约时间');
				}
				
			},
			getData() {
				getAddres(this.subForm.userId).then(res => {
					for (var i = 0; i < res.data.length; i++) {
						if (res.data[i].defaultAddress == 0) {
							this.subForm.mailAddress = res.data[i].mailAddress;
						}
					}
				});
				if (this.current == 2) {
					getByIdInspectionAppointment(this.subForm.userId).then(res => {
						this.queryList = res.data;
					})
				}
			},
			active() {

				if (this.subForm.testSample.length == 10) {
					this.$ut.showText("最多只能添加10个样本")
				} else if (this.subForm.testSample.length < 10) {
					this.isShow = !this.isShow;
				}
			},
			getDefaultAddressList(){
				getDefaultAddressList(this.subForm.userId).then(res => {
					for (var i = 0; i < res.data.length; i++) {
						if(res.data[i].defaultAddress==0){
							
							this.subForm.reachAddress= res.data[i].name+' '+res.data[i].phoneNumber+'\n'+res.data[i].address;
						}else{
							this.subForm.mailAddress=res.data[i].name+' '+res.data[i].phoneNumber+'\n'+res.data[i].address;
							
						}
					}
				})
			},
			sampleType(){
				getDicts(this.dictType).then(res=>{
					for (var i = 0; i < res.data.length; i++) {
						this.typeList[0].push(res.data[i].dictValue)
					}
					
				})
			}
		}
	}
</script>

<style lang="less" scoped>
	.popup {
		width: 100%;
		min-height: 500rpx;
		background: #fff;
		border-radius: 24rpx 24rpx 0 0;


		.title {
			width: 100%;
			text-align: center;
			font-size: 36rpx;
			color: #000;
			margin-top: 30rpx;
		}

		.submit {
			width: 100%;
			height: 120rpx;
			background: #FFFFFF;
			box-shadow: 0rpx -8rpx 20rpx 0rpx rgba(6, 63, 150, 0.1);
			display: flex;
			align-items: center;
			justify-content: center;
			padding: 20rpx 30rpx;
			box-sizing: border-box;

			.btn {
				width: 100%;
				height: 80rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				background: linear-gradient(135deg, #00DEFF 0%, #0C5FFF 100%);
				border-radius: 80rpx;
				color: #fff;
				font-size: 36rpx;
				font-weight: 600;
				letter-spacing: 5rpx;
			}
		}
	}

	.title {
		font-size: 28rpx;
		font-weight: 500;
		color: #333;
		line-height: 1.8;
		padding-bottom: 10rpx;

		text {
			margin-left: 15rpx;
		}
	}

	.bottom {
		background: #E8F1F8FF;
		width: 100%;
		height: 80rpx;
		border-radius: 10rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 28rpx;
		color: #3B7EFFFF;

		text {
			margin-left: 15rpx;
		}
	}

	.rules {
		font-size: 22rpx;
		color: #FD5454FF;
	}

	/deep/.u-textarea {
		background-color: #F8F8F8FF !important;
	}

	.cell-box {
		width: 100%;
		height: 110rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 20rpx;
		box-sizing: border-box;

		.icon {
			width: 40rpx;
			height: 40rpx;
			border-radius: 50%;
			display: flex;
			align-items: center;
			justify-content: center;
			color: #fff;
			font-size: 24rpx;
		}

		.right {
			width: 40rpx;
		}

		.text {
			width: calc(100% - 100rpx);
			font-size: 28rpx;
			color: #333;
		}
	}

	.btn {
		width: 100%;
		height: 80rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 80rpx;
		background: linear-gradient(135deg, #D9D9D9 0%, #979797 100%);
		color: #fff;
		font-size: 36rpx;
		font-weight: 500;
		letter-spacing: 2rpx;
	}

	.back1 {
		background: #3B7EFFFF;
	}

	.back2 {
		background: #00C777FF;
	}

	.ut-view {
		.up {
			font-size: 24rpx;
			color: #666;
		}

		.item {
			display: flex;
			width: 100%;

			.img {
				width: 140rpx;
				height: 140rpx;
				border-radius: 6rpx;
				flex-shrink: 0;
			}

			.text {
				margin-left: 20rpx;
				width: calc(100% - 160rpx);

				.vice {
					margin-top: 10rpx;
					font-size: 24rpx;
					color: #666;
				}
			}
		}
	}

	.back-btn {
		background: linear-gradient(135deg, #3B7EFF 0%, #0C5FFF 100%);
	}

	.input-box {
		margin-left: 10rpx;
	}
</style>