<template>
	<view class="chat-item">
		<template v-if="type === 'card'">
			<view class="card-block mg-32">
				<view class="card-up d-flex border-bottom">
					<view class="head-box">
						<u-avatar :src="info.headImg || img" size="100rpx"></u-avatar>
						<view class="tag-img d-flex jc-c-c">
							<u--image src="https://genepiapi.ypzlfx.com/file/genepi/2023/11/22/iShC4iMXB95hc93de8908a8287855c3695050fa0845a_20231122103950A175.png" height="23rpx" width="17rpx"
								shape="circle" mode="aspectFill"></u--image>
							<view style="padding-left: 6rpx;">已认证</view>
						</view>
					</view>
					<view class="card-info">
						<view class="text-pd">
							<text class="name">{{ info.name }}</text>
							<text class="tag-txt">{{ info.level }}</text>
							<text class="tag-txt">{{ info.lable }}</text>
						</view>
						<view class="tag-text d-flex text-pd">
							<u-tag text="三甲" size="mini" :icon="icon" plain></u-tag>
							<view class="bg-text">{{ info.fdMeadicalName }}</view>
						</view>
						<view class="font-gray text-pd">擅长：{{ info.classification }}</view>
						<view class="bg-text d-flex">
							<view class="desc-item">月咨询 <text class="cl-zt">{{ info.chatCount || 0 }}</text> </view>
							<view class="line-su">|</view>
							<view class="desc-item">平均响应 <text class="cl-zt">{{ info.answerHour || 0 }}小时</text> </view>
						</view>
					</view>
				</view>
				<view @click="$ut.jump('/pagesC/expert/expertDetails?id=' + info.id + '&type=1')" class="chard-btm-click d-flex js-b-c" hover-class="active-hover">
					<text>查看详情</text>
					<u-icon name="arrow-right" color="#999" size="24rpx"></u-icon>
				</view>
			</view>
		</template>
		<template v-if="type === 'leftContentXb'">
			<view class="left-content mg-32">
				<view class="d-flex">
					<view>
						<u--image :src="headImg || img" mode="aspectFill" width="80rpx"
							height="80rpx" radius="8rpx"></u--image>
					</view>
					<view class="content-box">
						<text class="ctt-text">请问您的性别是？</text>
					</view>
				</view>
				<view v-if="!form.gender" class="d-flex" style="padding-left: 100rpx;">
					<view @click="changeXb('1')" class="radio-item-lt d-flex jc-c-c">男</view>
					<view @click="changeXb('0')" class="radio-item-lt d-flex jc-c-c">女</view>
				</view>
			</view>
		</template>
		<template v-if="type === 'leftContentZP'">
			<view class="left-content mg-32">
				<view class="d-flex">
					<view>
						<u--image :src="headImg || img" mode="aspectFill" width="80rpx"
							height="80rpx" radius="8rpx"></u--image>
					</view>
					<view class="content-box">
						<text class="ctt-text">请问是否上传图片？</text>
					</view>
				</view>
				<view v-if="!form.isImg" class="d-flex" style="padding-left: 100rpx;">
					<view @click="changeXb('1')" class="radio-item-lt d-flex jc-c-c">是</view>
					<view @click="changeXb('0')" class="radio-item-lt d-flex jc-c-c">否</view>
				</view>
			</view>
		</template>
		<template v-if="type === 'leftContentXG'">
			<view class="left-content mg-32 d-flex">
				<view>
					<u--image :src="headImg || img" mode="aspectFill" width="80rpx"
						height="80rpx" radius="8rpx"></u--image>
				</view>
				<view class="content-box" style="min-width: 450rpx;">
					<view class="d-flex js-b-c hd-row border-bottom">
						<view>咨询信息</view>
						<view @click="route" class="click-color">修改</view>
					</view>
					<text class="ctt-text word-wrap">{{ form.description }}({{ form.name }} {{ form.gender * 1 ? '男' : '女' }} {{ form.age }}岁)</text>
					<ut-imgs :imgs="form.imgs"></ut-imgs>
				</view>
			</view>
		</template>
		<template v-if="type === 'centerContent'">
			<view class="ctr-ctt mg-32 d-flex" :style="{ color: info.color }">
				{{ info.content }}
			</view>
		</template>
		<template v-if="type === 'timeDate'">
			<view class="ctr-ctt mg-32 d-flex jc-c-c" style="background: none; ">
				{{ info.content }}
			</view>
		</template>
		
		<template v-if="type === 'content'">
			<view v-if="direction === 'left'" class="left-content mg-32 d-flex">
				<view>
					<u--image :src="headImg || img" mode="aspectFill" width="80rpx"
						height="80rpx" radius="8rpx"></u--image>
				</view>
				<view class="content-box">
					<text class="ctt-text word-wrap">{{ info.content }}</text>
				</view>
			</view>
			<view v-if="direction === 'right'" class="mg-32 right-content d-flex">
				<view class="content-box">
					<text class="ctt-text word-wrap">{{ info.content }}</text>
				</view>
				<view>
					<u--image :src="headImg || img" mode="aspectFill" width="80rpx"
						height="80rpx" radius="8rpx"></u--image>
				</view>
			</view>
		</template>
		<template v-if="type === 'img'">
			<view v-if="direction === 'left'" class="mg-32 d-flex">
				<view>
					<u--image lazyLoad :src="headImg || img" mode="aspectFill" width="80rpx"
						height="80rpx" radius="8rpx"></u--image>
				</view>
				<view class="ml-32">
					<u--image lazyLoad bgColor="#999" @click="lookImg(info.content)" radius="8rpx" :src="info.content"
						width="270rpx" height="294rpx" mode="aspectFit"></u--image>
				</view>
				
			</view>	
			<view v-if="direction === 'right'" class="mg-32 img-send d-flex">
				<view class="mr-32">
					<u--image lazyLoad bgColor="#999" @click="lookImg(info.content)" radius="8rpx" :src="info.content"
						width="270rpx" height="294rpx" mode="aspectFit"></u--image>
				</view>
				<view>
					<u--image lazyLoad :src="headImg" mode="aspectFill" width="80rpx"
						height="80rpx" radius="8rpx"></u--image>
				</view>
			</view>
		</template>
	</view>
</template>

<script>
	import {
		mapGetters
	} from 'vuex'
	export default {
		props: {
			type: {
				type: String,
				default: 'content' // 展示列表的类型  card 医生名片
			},
			info: {
				type: Object
			},
			color: {
				type: String,
				default: '#999'
			},
			form: {
				type: Object
			},
			headImg: {
				type: String,
				default: 'https://genepiapi.ypzlfx.com/file/genepi/2023/11/24/Mask group@2x_20231124181155A412.png'
			},
			direction: {
				type: String,
				default: 'left'
			}
		},
		computed: {
			...mapGetters(['avatar'])
		},
		data() {
			return {
				img:'https://genepiapi.ypzlfx.com/file/genepi/2023/11/24/Mask group@2x_20231124181155A412.png',
				icon: 'https://genepiapi.ypzlfx.com/file/genepi/2023/11/20/viJafsIMIXkA73c2a80b68df31d0d0530e72926de14a_20231120111723A422.png',
			}
		},
		methods: {
			changeXb(value) {
				this.$emit('change', {
					'field': this.info.field,
					value: value
				})
			},
			route () {
				this.$emit('route', 'edit')
			},
			lookImg (url) {
				uni.previewImage({
					urls: [url],
					current: 0
				})
			}
		}
	}
</script>

<style lang="scss">
	.card-block {
		padding: 32rpx 32rpx 0;
		background-color: #fff;
		border-radius: 20rpx;
	}

	.head-box {
		position: relative;
	}

	.tag-img {
		position: relative;
		margin-top: -10rpx;
		width: 100rpx;
		height: 36rpx;
		font-size: 20rpx;
		color: #fff;
		background: linear-gradient(135deg, #00DEFF 0%, #0C5FFF 100%);
		border-radius: 68rpx;
		z-index: 2;
	}

	.border-bottom {
		border-bottom: 1rpx solid rgba(0, 0, 0, 0.1);
	}

	.card-info {
		padding: 0 24rpx 34rpx;

		.name {
			padding-right: 10rpx;
			font-size: 28rpx;
			font-weight: 500;
			color: #000;
		}

		.tag-txt {
			padding: 0 8rpx;
			font-size: 24rpx;
			color: #222;
		}

		.bg-text {
			padding: 0 16rpx;
			font-size: 28rpx;
			color: #666;
		}

		.text-pd {
			padding-bottom: 14rpx;
		}

		.tag-yy {
			width: 82rpx;
			height: 32rpx;
			border-radius: 6rpx;
			font-size: 22rpx;
			border: 1rpx solid #3B7EFF;
			color: #3B7EFF;
		}

		.font-gray {
			font-size: 24rpx;
			color: #999;
		}

		.desc-item {
			font-size: 22rpx;
			color: #999;
		}

		.cl-zt {
			padding-left: 10rpx;
			color: #3B7EFF;
		}

		.line-su {
			padding: 0 24rpx;
			font-size: 24rpx;
			color: rgba(0, 0, 0, 0.1);
		}
	}

	.chard-btm-click {
		padding: 18rpx;
		font-size: 24rpx;
		color: #999;
	}

	.active-hover {
		background-color: #f4f4f4;
	}

	.mg-32 {
		margin: 32rpx;
	}

	.left-content {
		.content-box {
			position: relative;
			max-width: 450rpx;
			margin-left: 20rpx;
			padding: 16rpx 20rpx;
			border-radius: 8rpx;
			background-color: #fff;

			&::before {
				position: absolute;
				top: 20rpx;
				left: -6rpx;
				content: '';
				width: 44rpx;
				height: 44rpx;
				border-radius: 6rpx;
				background-color: #fff;
				transform: rotate(-45deg);
				z-index: 1;
			}
		}

		.ctt-text {
			position: relative;
			font-size: 34rpx;
			color: #222;
			z-index: 3;
		}

		.hd-row {
			position: relative;
			padding: 6rpx 20rpx 20rpx;
			margin-left: -20rpx;
			margin-right: -20rpx;
			margin-bottom: 20rpx;
			font-size: 28rpx;
			color: #666;
			z-index: 5;
		}
	}

	.ctr-ctt {
		padding: 8rpx 20rpx;
		margin-left: 120rpx;
		margin-right: 120rpx;
		font-size: 22rpx;
		color: #999;
		background: rgba(153, 153, 153, 0.1);
		border-radius: 12rpx;
	}

	.right-content {
		justify-content: flex-end;

		.content-box {
			position: relative;
			max-width: 450rpx;
			margin-right: 20rpx;
			padding: 16rpx 20rpx;
			border-radius: 8rpx;
			background-color: #3B7EFF;

			&::before {
				position: absolute;
				top: 20rpx;
				right: -6rpx;
				content: '';
				width: 44rpx;
				height: 44rpx;
				border-radius: 6rpx;
				background-color: #3B7EFF;
				transform: rotate(-45deg);
				z-index: 1;
			}
		}

		.ctt-text {
			position: relative;
			font-size: 34rpx;
			color: #fff;
			z-index: 3;
		}
	}
    .ml-32 {
		margin-left: 32rpx;
	}
	.img-send {
		justify-content: flex-end;
	}
	.img-send-left {
		justify-content: flex-start;
	}

	.mr-32 {
		margin-right: 32rpx;
	}

	.radio-item-lt {
		margin-top: 30rpx;
		margin-right: 32rpx;
		width: 160rpx;
		height: 80rpx;
		font-size: 32rpx;
		color: #3B7EFF;
		background: #fff;
		border-radius: 60rpx;
	}
	.word-wrap {
		word-wrap:break-word; 
		word-break:break-all;
	}
	.imgs-block {
		padding: 10rpx 0;
		width: 100%;
		
		.img-item {
			padding: 0 10rpx;
		}
	}
</style>