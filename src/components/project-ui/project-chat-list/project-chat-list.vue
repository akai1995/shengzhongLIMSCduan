<template>
	<view class="chatList">
		<scroll-view ref="scrollChatRef" scroll-y="true" style="height: 70vh; background-color: #f9fafb" @scroll="scrollChat" @scrolltolower="scrollToLower" :scroll-into-view="scrollToItemId" :scroll-with-animation="true">
			<template v-if="chatLogs.length > 0">
				<block v-for="(item, index) in chatLogs" :key="index">
					<view class="item topic animate__animated animate__fadeInRight" v-if="item.role == 'user'">
						<view class="conBox">
							<view class="txtCon" v-html="renderUserContent(item)" /> <!-- <view class="txtCon">{{ item.content }}</view> -->
							<view class="imgCon" v-if="item.sendAttachment != null && item.sendAttachment !== ''">
								<u--image :src="item.sendAttachment" width="60%" mode="widthFix" border-radius="20" @click="showPreviewImage(item.sendAttachment)" />
							</view>
						</view>
					</view>
					<view class="item answer" :style="cssVars" v-if="item.role == 'assistant'">
						<view class="aBox">
							<view class="renderBox">
								<template v-if="item.content == null || item.content === ''">
									<u--image width="50" :src="`${$staticPath}imgs/ai-chat-loading.apng`" mode="widthFix" />
									<text class="txt textBlink">正在思考中...</text>
								</template>
								<template v-else>
									<u--image width="50" :src="`${$staticPath}imgs/ai-chat-loaded.apng`" mode="widthFix" />
									<text class="txt">根据您的问题生成的内容总结如下</text>
								</template>
							</view>
							<view class="conBox">
								<!-- <u-parse class="txtCon" :html="item.content" v-if="item.isContentComplete" />
								<u-parse class="txtCon" :html="renderAssistantContent(item)" v-else /> -->
								<!-- <view class="txtCon" v-html="item.content" v-if="item.isContentComplete" />
								<u-parse class="txtCon" :html="renderAssistantContent(item)" v-else /> -->

								<view :ref="`assistantContentRef-${item.id}`" class="txtCon" v-html="renderAssistantContent(item)" v-if="!item.isContentComplete" />
								<view class="txtCon" v-html="item.content" v-else />
								<view class="imgCon" v-if="item.replyAttachment != null && item.replyAttachment !== ''">
									<u--image :src="item.replyAttachment" width="60%" mode="widthFix" border-radius="20" @click="showPreviewImage(item.replyAttachmen)" />
								</view>
							</view>
							<view class="botHandle pubTopLine">
								<view class="lBtn">
									<u-button class="btn" @click="$emit('again', item)"><u-icon name="reload" size="36" / />
									<u-button class="btn" @click="onCopy(item.content)"><u-icon name="file-text" size="36" / />
									<u-button class="btn" @click="$emit('del', item)"><u-icon name="trash" size="36" / />
								</view>
							</view>
						</view>
						<!-- 相关话题引导 -->
						<view class="list pubGuidList" v-if="false"><view class="item pubBoxAI" v-for="(item, index) in 1" :key="index" :id="`chat-${index}`">你能提供哪些资源？</view></view>
					</view>
				</block>
			</template>
			<view class="pubEmptyData" v-else><u-empty icon-size="300" text="暂无会话记录，在下方输入问题向我提问吧" /></view>
		</scroll-view>

		<!-- 聊天消息向上滚动时显示，此时点击回到最新信息处 -->
		<view class="newMsg" v-if="showBotNew"><u-button :throttle-time="0" @click="scrollBtn()"><u-icon name="arrow-down" size="28" / /></view>
	</view>
</template>

<script>
import { mdRenderHtml } from '@/providers/utilities/chat';
import '@/static/temp/styles/a11y-dark.css';
import '@/static/temp/styles/markdown.scss';
import 'github-markdown.css';
const rect = () => {
	let info = uni.getSystemInfoSync();
	return { width: info.screenWidth, height: info.screenHeight };
}
export default {
	props: {
		/**
		 * 当前选中的会话
		 */
		currentSelectedHis: {
			type: Object,
			default: () => {
				return { }
			}
		},
		/**
		 * 使用MarkDown的引用
		 */
		useMarkdown: {
			type: Object,
			default: () => {
				return {
				}
			}
		},
		/**
		 * 聊天列表
		 */
		chatLogs: {
			type: Array,
			default: () => {
				return {
				}
			}
		}
	},
	data() {
		return {
			/**
			 * 聊天信息滚动距离
			 */
			scrollTop: 0,

			/**
			 * 是否显示到底最新消息
			 */
			showBotNew: false,

			/**
			 * 底部到顶部的距离
			 */
			bottomToTop: 0,

			/**
			 * 滚动到的元素id
			 */
			scrollToItemId: '',

			/**
			 * 屏幕宽度
			 */
			scwidth: 0,
		}
	},
    computed: {
        cssVars() {
            return {
				'--scwidth': `${this.scwidth}px`
			}
        },
		assistantContent() {
			if (this.chatLogs.length === 0) return '';
			return mdRenderHtml(this.chatLogs[this.chatLogs.length - 1].content, this.useMarkdown);
		},
    },
	/**
	 * 页面挂载
	 */
	mounted() {
		console.log(uni.getSystemInfoSync(), '设备信息');
		this.scwidth = rect().width - 20;
	},
	methods: {
		/**
		 * 聊天信息滚动scroll-view
		 */
		scrollChat(e) {
			this.scrollTop = e.detail.scrollTop;
			if (this.scrollTop >= 0 && !this.showBotNew) this.showBotNew = true;
			if (this.scrollTop === this.bottomToTop) this.showBotNew = false;
			this.scrollToItemId = '';
			// console.log(this.scrollTop, '聊天信息滚动', e.detail);
		},

		/**
		 * 滚动到了底部
		 */
		scrollToLower(e) {
			console.log('滚动到了底部', e);
			setTimeout(() => {
				this.showBotNew = false;
			}, 200);
		},

		/**
		 * 滚动到最新消息处
		 */
		scrollBtn() {
			if (this.chatLogs.length > 0) this.scrollToItemId = `chat-${this.chatLogs[this.chatLogs.length - 1].id}`;
			// this.scrollTop = this.bottomToTop;
			setTimeout(() => {
				this.scrollToItemId = '';
				this.bottomToTop = this.scrollTop;
				this.showBotNew = false;
			}, 500);
		},

		/**
		 * 显示到底最新消息按钮
		 */
		hideShowBotNew() {
			this.showBotNew = false;
			this.scrollToItemId = '';
		},

		/**
		 * 渲染内容
		 */
		renderUserContent(item) {
			return item.content.replace(/\n/g, '<br>');
		},

		/**
		 * 渲染内容
		 */
		renderAssistantContent(item) {
			return mdRenderHtml(item.content, this.useMarkdown);
		},

		getContentRef(id) {
			const refs = this.$refs[`assistantContentRef-${id}`];
			if (refs != null && refs.length > 0) return refs[0];
			return null;
		},

		/**
		 * 复制
		 */
		onCopy(txt) {
			uni.setClipboardData({
				data: txt,
				success: () => {
					uni.showToast({
						title: '复制成功',
						icon: 'success',
						duration: 2000
					});
				}
			});
		}
	}
}
</script>

<style scoped lang="scss">
	.chatList {
		overflow: hidden;
		.item {
			margin-bottom: 30rpx;

			.conBox {
				.txtCon {
					color: #fffde6; // #13142a;
					font-size: 32rpx;
					line-height: 45rpx;
				}
				.imgCon {
					display: flex;
					align-items: center;
					justify-content: flex-start;
					width: 100%;
					margin-top: 15rpx;
				}
			}
			.botHandle {
				position: relative;
				padding-right: 35%;
				height: 96rpx;
				margin-top: 20rpx;
				.btn {
					background: transparent !important;
					&::after {
						border: 0 !important;
					}
					&:active {
						opacity: 0.8;
					}
				}
				.lBtn {
					display: flex;
					align-items: center;
					justify-content: flex-start;
					height: 96rpx;
					.btn {
						padding: 0 20rpx !important;
					}
				}
				.rBtn {
					position: absolute;
					right: -30rpx;
					top: 50%;
					transform: translateY(-50%);
				}
			}
			&.topic {
				float: right;
				padding: 25rpx 30rpx;
				background: #377ff7; // linear-gradient(to bottom, #ffe2e3, #e8e5ff);
				border-radius: 30rpx 30rpx 0 30rpx;
			}
			&.answer {
				float: left;
				padding: 0;
				.aBox {
					width: var(--scwidth);
					padding: 25rpx 30rpx;
					background: #f7f7f7; // #fff;
					border-radius: 30rpx 30rpx 30rpx 0;
					padding-bottom: 0;
					.renderBox {
						margin-bottom: 8px;
						align-items: center;
						border-radius: 8px;
						display: inline-flex;
						height: 36px;
						letter-spacing: 0;
						padding: 0 12px 0 6px;
						background: rgba(226, 226, 240, 0.3);
						width: 100%;
						line-height: 0;
						.txt {
							font-size: 28rpx;
							margin-left: 5px;
							color: #878aab;
						}
					}
					.conBox {
						.txtCon {
							color: #000000;
						}
					}
				}
				.list {
					margin-top: 30rpx;
					.item {
						margin-bottom: 15rpx;
						width: auto;
					}
				}
			}
		}
	}

	.newMsg {
		position: fixed;
		left: 50%;
		bottom: 380rpx;
		transform: translateX(-50%);
		z-index: 99;
		.u-btn {
			width: 80rpx !important;
			height: 80rpx !important;
			padding: 0 !important;
			border-radius: 40rpx !important;
			box-shadow: 0 5rpx 10rpx rgba($color: #000000, $alpha: 0.2);
			&::after {
				border: 0 !important;
			}
		}
	}
</style>
