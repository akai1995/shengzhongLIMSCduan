<template>
	<view>
		<ut-nav title="检测详情" border></ut-nav>
		<view class="content">
			<view class="ut-view">
				<view class="info">
					<view style="width: 40%;">患者姓名：xx</view>
					<view style="width: 30%;">性别：男</view>
					<view style="width: 30%;">年龄：39</view>
				</view>
				<view class="info">
					<view>检测项目：XXXXXXX</view>
				</view>
				<view class="info">
					<view>检测时间：2023-07-16 11:12:30</view>
				</view>
			</view>

			<view class="ut-view m-t3">
				<u-steps current="6" direction="column">
					<u-steps-item title="样本采集 07-16  08:08">
						<view class="box" slot="desc">
							<view class="width">样本类型：xxxxxx </view>
							<view class="width">采集时间:2023-07-16 06:17 </view>
							<view class="width">采集人：xx</view>
						</view>
					</u-steps-item>
					<u-steps-item title="样本送检 07-16  08:08">
						<view class="box" slot="desc">
							<view class="width">送检机构：xxxxxx </view>
							<view class="width">采集时间:2023-07-16 06:17 </view>
						</view>
					</u-steps-item>
					<u-steps-item title="样本物流 07-16  08:08">
						<view class="box" slot="desc">
							<view class="flex">
								<view class="m-r2">物流信息</view>
								<view class="flex" @click="show = !show">
									<text style="color: #2979ff;">{{show?'收起':'展开'}}</text>
									<u-icon :name="show?'arrow-down':'arrow-up'" color="#2979ff" size="24rpx"></u-icon></view>
							</view>
							<view class="box-item m-t2" v-if="show">
								<u-steps current="1" direction="column" dot>
									<u-steps-item title="已下单" desc="样本已送达，收货人已签收，签收人张医生"></u-steps-item>
									<u-steps-item title="已揽件" desc="派件员:张三"></u-steps-item>
									<u-steps-item title="运输中" desc="样本已到达云南省西山区"></u-steps-item>
									<u-steps-item title="派送中" desc="云南省红河州  已揽收 ,李四"></u-steps-item>
									<u-steps-item title="已签收" desc="样本等待揽收"></u-steps-item>
								</u-steps>
							</view>
						</view>
					</u-steps-item>
					<u-steps-item title="样本接收 07-16  08:08">
						<view class="box" slot="desc">
							<view class="width">接收机构：xxxxxx </view>
							<view class="width">接收时间:2023-07-16 06:17 </view>
						</view>
					</u-steps-item>
					<u-steps-item title="样本质控 07-16  08:08">
						<view class="box" slot="desc">
							<view>样本质控信息样本质控信息样本质控信息</view>
						</view>
					</u-steps-item>
					<u-steps-item title="流程质控 07-16  08:08">
						<view class="box" slot="desc">
							<view>流程质控信息（根据检测类型不同，流程质控节点信息不同，节点信息同质控平台）</view>
						</view>
					</u-steps-item>
					<u-steps-item title="结果质控 07-16  08:08">
						<view class="box" slot="desc">
							<view>结果质控信息</view>
						</view>
					</u-steps-item>
					<u-steps-item title="结果质控 07-16  08:08">
						<view class="box" slot="desc">
							<view>报告质控信息报告质控信息报告质控信息报告质控信息</view>
						</view>
					</u-steps-item>
					<u-steps-item title="报告生成/检测完成 07-16  08:08">
						<view class="box" slot="desc">
							<view class="width">完成时间:2023-07-16 06:17 </view>
							<view class="width">检测机构：xxxxxx </view>
						</view>
					</u-steps-item>
				</u-steps>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				show:true
			};
		}
	}
</script>

<style lang="less">
	.info {
		display: flex;
		align-items: center;
		color: #333;
		font-size: 24rpx;
		line-height: 2;
		font-weight: 600;
	}

	.box {
		display: flex;
		flex-wrap: wrap;
		font-size: 22rpx;
		color: #666;
		line-height: 1.5;
	}

	.width {
		width: 50%;
	}

	.box-item {
		width: 100%;
		min-height: 100rpx;
		background: #F8F8F8FF;
		border-radius: 20rpx;
		padding: 30rpx;
		box-sizing: border-box;
	}
	.box-item /deep/ .u-steps-item__wrapper{
		background-color: #F8F8F8FF !important;
	}

	/deep/.u-text__value--main {
		color: #3B7EFFFF !important;
	}
</style>