<template>
	<view>
		<ut-nav title="知情同意书" border></ut-nav>
		<view class="content">
			<view class="title">知情同意书</view>
			<view class="text m-t2">
				1.SDC2
				编码跨膜蛋白多糖分子，是硫酸乙酷肝素聚家族中的成员;参与调节细胞黏附、组织分化血管形成等诸多生理病过程，影响人结肠癌细胞株增殖、迁移和侵袭;SDC2甲基化是促进结直肠肿瘤发生展过程中的早期分子事件。该项目进入美国多项指南推荐，并进入中国2019最新版肠癌筛查指南，相较于使用血液样本检测有更高的灵敏度以及特异性
				(特别是早期肠癌)
			</view>
			<view class="text m-t4">
				2.大多数的早期结直肠癌和癌前病变并无任何症状，欲检出这部分肿瘤患者，必须开展无症状人群筛查，筛查必须以无痛、简便、准确的方法检出肿瘤高危对象，再以结肠镜进行确诊。通过对正常人群及高危人群的筛查可提高早期癌检出率，减少患者治疗的经济负担，提高患者生命质量，降低死亡率。体外检测人粪便中SDC2等基因的甲基化，适用于临床医师建议做肠镜检测，但因病人依从性差或其他医学原因无法做肠镜检测患者的辅助诊断，该项目的临床意义在于使病人多一种无创性大肠癌辅助诊断和肿瘤筛查方法的选择，
			</view>
			
			<view class="qm flex j-c m-t6">
				<view class="label flex">姓名：	<signInput ref="sign" @signToUrl="signToUrl"></signInput> </view>
				<view class="time">时间: {{time}}</view>
			</view>
			<!-- <view class="btn m-t6" @click="submit" v-if="params.port">查询</view> -->
			<view class="btn m-t6" @click="submitScan">查询</view>
		</view>
	</view>
</template>

<script>
	import {getReportInfo,authReportInfo} from '@/api/report.js'
	import signInput from "@/pagesB/components/am-sign-input/am-sign-input.vue"
	export default {
		components:{
			signInput
		},
		data() {
			return {
				params:{},
				authFile:'',
				reportId:'',
				time:''
			}
		},
		onLoad(options) {
			// console.log('options',options)
			// if('params' in options){
			// 	this.params =JSON.parse(decodeURIComponent(options.params))
			// }
			if(options.id){
				this.reportId = options.id
			}
			console.log('a',this.reportId)
			var today = new Date();
			var year = today.getFullYear();
			var month = today.getMonth() + 1;
			var day = today.getDate();
			this.time = year + "年" + month + "月" + day + '日';
		},
		methods: {
			signToUrl(e) {
				console.log('e',e)
				this.authFile = e
				if (e.error_code && e.error_code === '201') {
					uni.showToast({
						title: e.msg,
						icon: 'none'
					})
					return
				}
			},
			submit(){
				var params = {
					applyCode:this.params.fdApplyCode,
					authFile:this.authFile,
					idCard:this.params.fdIdcard,
					name:this.params.fdName,
					tel:this.params.tel
				}
				// this.params.authFile = this.authFile
				// console.log('params+++',params)
				uni.showLoading()
				getReportInfo(params).then(res=>{
					uni.hideLoading()
					if(res.code == 200){
						// uni.navigateTo({
						// 	url:'/pagesB/report/details-pdf?url='+res.data.reportUrl
						// })
						uni.downloadFile({
							url:res.data.reportUrl,
							success:function(res_){
								var filePath = res_.tempFilePath;
								uni.openDocument({
									filePath:filePath,
									showMenu:true,
									success:function(){
										console.log('成功')
									}
								})
							}
						})
					}
					
				})
			},
			//扫码查询
			submitScan(){
				let params = {
					authFile:this.authFile,
					id:this.reportId
				}
				authReportInfo(params).then(res=>{
					console.log('res',res)
					if(res.code == 200){
						uni.redirectTo({
							url:'/pages/report/report'
						})
					}else{
						this.$ut.showToast(res.msg)
					}
				})
			}
		}
	}
</script>

<style lang="less">
	page {
		background: #fff !important;
	}

	.content {
		.title {
			color: #222;
			font-weight: 600;
			font-size: 32rpx;
			letter-spacing: 2rpx;
		}
		.text{
			color: #222;
			font-size: 24rpx;
			line-height: 1.8;
			font-weight: 400;
		}
		.qm{
			color: #999;
			font-size: 28rpx;
			font-weight: 400;
		}
	}
	.flex{
		display: flex;
		align-items: flex-start;
	}
	.btn {
		width: 100%;
		height: 80rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 80rpx;
		background: linear-gradient(135deg, #00DEFF 0%, #0C5FFF 100%);
		color: #fff;
		font-size: 36rpx;
		font-weight: 600;
		letter-spacing: 5rpx;
	}
</style>
