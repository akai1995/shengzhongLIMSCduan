<!-- 聊天记录模式流式输出-类似chatGPT对话演示(vue)，加载更多聊天记录无闪动 -->
<!-- nvue的聊天记录模式中需要写@cellStyleChange="cellStyleChange"，如果需要兼容nvue和vue，请以nvue中写法为准，会自动兼容vue -->
<!-- 注意，此写法由于将列表倒置了，在iOS15以下和部分较低版本安卓中可能出现列表无法滚动的问题，此时建议使用z-paging 2.7.0以下的版本及写法 -->
<template>
	<view>		
        <chat-log v-if="showChatLog" @close="onChatLogClose" />
		<!-- use-chat-record-mode：开启聊天记录模式 -->
		<!-- safe-area-inset-bottom：开启底部安全区域适配 -->
		<!-- bottom-bg-color：设置slot="bottom"容器的背景色，这里设置为和chat-input-bar的背景色一致 -->
		<z-paging 
			ref="paging" v-show="!showChatLog" v-model="dataList" use-chat-record-mode safe-area-inset-bottom bottom-bg-color="#f8f8f8" 
			empty-view-text="有什么可以帮忙的？" @query="queryList" @keyboardHeightChange="keyboardHeightChange" @hidedKeyboard="hidedKeyboard"
		>
			<!-- 顶部提示文字 -->
			<!-- #ifdef H5 || MP-BAIDU || MP-TOUTIAO -->
			<!-- #endif -->
			<view slot="top" class="">
				<u-navbar
					title="报告分析" :fixed="false" background="transparent"
					color="#000" left-icon-color="#000"  @leftClick="onBack" 
				/>
				<view class="cardWarp container" v-if="!showChatList">
					<view class="cardInfo">
						<view class="cardTitle">Hi~我是您的报告分析助手</view>
						<view class="cardSubTitle">您身边的智能健康伙伴，帮您读懂报告，答疑解惑，快来体验吧~</view>
					</view>
					<view class="cardIcon"><image :src="`${$staticPath}temp/imgs/report-icon.png`" /></view>
				</view>
			</view>
			<ut-components ref="utComponents" />
			<view class="container" v-if="showChatList">
				<!-- for循环渲染聊天记录列表 -->
				<view v-for="(item,index) in dataList" :key="index" style="position: relative;">
					<!-- 如果要给聊天item添加长按的popup，请在popup标签上写style="transform: scaleY(-1);"，注意style="transform: scaleY(-1);"不要写在最外层，否则可能导致popup被其他聊天item盖住 -->
					<!-- <view class="popup" style="transform: scaleY(-1);">popUp</view>			 -->
					<!-- style="transform: scaleY(-1)"必须写，否则会导致列表倒置 -->
					<!-- 注意不要直接在chat-item组件标签上设置style，因为在微信小程序中是无效的，请包一层view -->
					<view style="transform: scaleY(-1);"><chat-item :item="item" /></view>
				</view>
			</view>
			<view class="inWrap" v-if="false">
				<!-- 未有聊天问题时显示 -->
				<!-- 聊天内容显示 -->
				<!-- <project-chat-list 
					ref="refChatList" :chatLogs="dataList"
					:currentSelectedHis="currentSelectedHis"
					:useMarkdown="useMarkdown"
					@again="againDialog($event)" @del="delDialog($event)"
				/> -->
			</view>

			<!-- 删除历史记录弹出层 -->
			<u-mask class="delPopupMark" :show="showLongDel" z-index="10100" :custom-style="{ background: 'rgba(0, 0, 0, 0)' }" @click="showLongDel = false">
				<view class="delPopup">
					<view class="inBtn" :style="{ top: delItemTop + 'px' }">
						<u-button class="delBtn" @click="delHis()">
							<u-icon name="delete" custom-prefix="custom-icon" color="#0F0F0F" size="48" />
							删除
						</u-button>
					</view>
				</view>
			</u-mask>

			<!-- 微信隐私保护指引 -->
			<u-modal :show="showPrivacy" width="90%" :show-cancel-button="true" :title="privacyTitle" :title-style="{ color: '#000', fontWeight: 'bold' }" cancel-text="拒绝" @cancel="denyPrivacy()">
				<view class="privacyContent">
					在您使用之前，请仔细阅读<u-button class="txtBtn" @click="handleOpenPrivacyContract()">{{ privacyTitle }}</u-button
					>。如您同意{{ privacyTitle }}，请点击“同意”开始使用。
				</view>
				<button id="agree-btn" open-type="agreePrivacyAuthorization" class="u-reset-button" slot="confirm-button" @agreeprivacyauthorization="handleAgreePrivacyAuthorization">同意</button>
			</u-modal>
			<!-- 底部聊天输入框 -->
			<view slot="bottom">
				<chat-input :disabled="isAnswering" ref="chatInputBar" @show-log="onChatLogShow" @send="doSend" />
			</view>
		</z-paging>
	</view>
</template>

<script>
import { md, initMd } from '@/providers/utilities/chat.js';
import chatInput from './components/chat-input.vue'
import chatItem from './components/chat-item.vue'
import chatLog from './chat-log.vue'
import store from '@/store/index'
export default {
	components: {
		'chat-input': chatInput,
		'chat-item': chatItem,
		'chat-log': chatLog,
	},
	data() {
		return {
			showChatLog: false,
			/**
			 * 控制器
			 */
			ctrl: null,
			/**
			 * 是否需要刷新历史聊天
			 */
			needRefreshHisChat: false,
			/**
			 * 是否长按删除显示mask
			 */
			showLongDel: false,

			/**
			 * 删除元素距离顶部的位置
			 */
			delItemTop: 0,
			// v-model绑定的这个变量不要在分页请求结束中自己赋值！！！
			dataList: [],
			/**
			 * 聊天内容
			 */
			chatContent: '',

			/**
			 * 是否在生成结果
			 */
			isGenChat: false,
			// 用户发送的提问信息
			askMsg: '',
			// 是否在回答中，回答中不允许用户发言，避免数据错乱
			isAnswering: false,
			/**
			 * 是否显示某个对话的聊天记录
			 */
			showChatList: false,
			/**
			 * 是否显示查询聊天记录的loading
			 */
			showQueryHisLoading: false,
			/**
			 * 触摸开始位置
			 */
			startY: 0,
			/**
			 * 滚动到聊天历史的Id
			 */
			scrollToChatHisId: '',
			/**
			 * 当前选中的聊天
			 */
			currentSelectedHis: { id: '', conversationId: '', lastMsg: '' },
			/**
			 * 使用markdown的引用
			 */
			useMarkdown: null,
			isDenyPrivacy: false,
			showPrivacy: false,
			privacyTitle: '',

			outputBuffer: '', // 用于临时存储接收到的字符串
			outputBufferAll: '', // 用于临时存储接收到的所有字符串
			isProcessingSSEData: false, // 标记是否正在处理缓冲区
			outputSpeed: 30, //逐字输出速度
			isClickSpeak: false,
			sendTextOrVoiceChatLogId: '',
			realTimeSendTryTime: 0,
			realTimeSendTryEncBusy: 0,
			realTimeSendTryNumber: 0,
			transferUploadNumberMax: 0,
			realTimeSendTryChunk: null,
			realTimeAudioRequiredId: '',			

			/**
			 * 长按聊天记录的项目
			 */
			longPressHisChatItem: null
		}
	},
	mounted() {
		setTimeout(() => {
			this.useMarkdown = initMd(md)
		}, 250);
	},
	methods: {
		onChatLogShow() {
			console.log('onChatLogShow')
			this.showChatLog = true
		},
		onChatLogClose() {
			this.showChatLog = false
		},
		queryList(pageNo, pageSize) {
			// 组件加载时会自动触发此方法，因此默认页面加载时会自动触发，无需手动调用
			// 这里的pageNo和pageSize会自动计算好，直接传给服务器即可
			// 模拟请求服务器获取分页数据，请替换成自己的网络请求
			const params = {
				pageNo: pageNo,
				pageSize: pageSize,
			}
			this.$refs.paging.complete([]);
			// this.$request.queryChatList(params).then(res => {
			// 	// 将请求的结果数组传递给z-paging
			// 	this.$refs.paging.complete([]);
			// }).catch(res => {
			// 	// 如果请求失败写this.$refs.paging.complete(false);
			// 	// 注意，每次都需要在catch中写这句话很麻烦，z-paging提供了方案可以全局统一处理
			// 	// 在底层的网络请求抛出异常时，写uni.$emit('z-paging-error-emit');即可
			// 	this.$refs.paging.complete(false);
			// })
		},
		// 监听键盘高度改变，请不要直接通过uni.onKeyboardHeightChange监听，否则可能导致z-paging内置的键盘高度改变监听失效（如果不需要切换表情面板则不用写）
		keyboardHeightChange(res) {
			this.$refs.chatInputBar.updateKeyboardHeightChange(res);
		}, 
		// 用户尝试隐藏键盘，此时如果表情面板在展示中，应当通知chatInputBar隐藏表情面板（如果不需要切换表情面板则不用写）
		hidedKeyboard() {
			this.$refs.chatInputBar.hidedKeyboard();
		},
		

		/**
		 * 查看微信隐私保护指引
		 */
		handleOpenPrivacyContract() {
			// 打开隐私协议页面
			wx.openPrivacyContract({
				success: () => {}, // 打开成功
				fail: () => {}, // 打开失败
				complete: () => {}
			});
		},

		/**
		 * 同意微信隐私保护指引
		 */
		handleAgreePrivacyAuthorization(e) {
			this.isDenyPrivacy = false;
		},

		/**
		 * 删除聊天记录
		 */
		delHis() {
			console.log(this.longPressHisChatItem, '删除聊天记录');
			this.showLongDel = false;
			if (this.longPressHisChatItem == null) return;
			if (this.isGenChat) {
				this.showTips('正在生成结果中，请稍后再进行操作!', 'info');
				return;
			}
			if (this.isProcessingSSEData) {
				this.showTips('正在输出结果中，请稍后再进行操作!', 'info');
				return;
			}
			this.showConfirm(
				`是否确定删除此条聊天记录？`,
				() => {
					this.showLoading('正在删除...', true);
					uni.hideLoading();
					let cleanCatIdx = -1;
					for (let i = 0; i < this.dataList.length; i++) {
						let bingo = false;
						const idx = this.dataList[i].datas.findIndex((x) => x.id === this.longPressHisChatItem.id);
						bingo = idx !== -1;
						if (bingo) {
							this.dataList[i].datas.splice(idx, 1);
							if (this.dataList[i].datas.length === 0) cleanCatIdx = i;
							break;
						}
					}
					if (cleanCatIdx !== -1) this.dataList.splice(cleanCatIdx, 1);
					this.newChat(false, false, this.currentSelectedHis != null && this.currentSelectedHis.id === this.longPressHisChatItem.id);
				},
				() => {
					this.longPressHisChatItem = null;
				}
			);
		},

		/**
		 * 删除所有会话
		 */
		delAllHis() {
			if (this.isDenyPrivacy) {
				this.showConfirm('您拒绝了微信隐私保护指引，是否重新同意隐私保护？', () => {
					this.showPrivacy = true;
				});
				return;
			}
			if (this.isGenChat) {
				this.showTips('正在生成结果中，请稍后再进行操作!', 'info');
				return;
			}
			if (this.isProcessingSSEData) {
				this.showTips('正在输出结果中，请稍后再进行操作!', 'info');
				return;
			}
			this.showConfirm(`是否确定删除所有会话记录？`, () => {
				this.showLoading('正在删除...', true);
				uni.hideLoading();
				this.dataList.splice(0);
				this.newChat();
			});
		},

		/**
		 * socket消息处理
		 */
		socketMessageHandle(data) {
			if (data == null) return;
			// console.log('🚀 ~ Page ~ socketMessageHandle ~ data:', data);

			const udc = this.dataList[this.dataList.length - 2];
			const mdc = this.dataList[this.dataList.length - 1];

			if (typeof data == 'object') {
				if (data.taskId !== this.currentConversationTaskId) {
					this.isRequestVoice = false;
					return;
				}
				switch (data.command) {
					case 1: //文字消息
						const dt = JSON.parse(data.data);
						console.log('收到文字消息', dt);
						if (dt.event === 'tts_message_end' || dt.event === 'message_end' || dt.event.indexOf('message_end') !== -1) {
							this.onSSEMessageClose(mdc);
							return;
						}
						this.onSSEMessage(dt, true);
						break;
				}
			}
		},
		/**
		 * 底部发送聊天
		 */
		async onAgentChat() {
			if (!this.checkAppHubAuth()) return;
			if (this.isDenyPrivacy) {
				this.showConfirm('您拒绝了微信隐私保护指引，是否重新同意隐私保护？', () => {
					this.showPrivacy = true;
				});
				return;
			}
			if (Ruler.empty(this.chatContent)) {
				this.showTips('请输入您的问题', 'error');
				return;
			}
			if (this.isGenChat) {
				this.showTips('正在生成结果中，请稍后再进行操作!', 'info');
				return;
			}
			if (this.isProcessingSSEData) {
				this.showTips('正在输出结果中，请稍后再进行操作!', 'info');
				return;
			}
			if (this.isUploading) {
				this.showTips('正在上传图片...,请稍后', 'info');
				return;
			}

			const customData = {
				chatImage: this.chatImageUrl,
				chatImageName: this.chatImageName,
				chatImageSize: this.chatImageSize,
				chatFileList: this.chatFileUrl,
				content: this.chatContent
			};

			if (!this.prepareSendMsg(customData)) return;
			this.outputSpeed = 30;
			this.outputBuffer = '';
			this.outputBufferAll = '';
			this.releaseVoice();

			this.currentConversationTaskId = MathUnitl.guid;
			const dt = {
				command: 1,
				taskId: this.currentConversationTaskId,
				data: {
					appId: this.hubApp().appId,
					appHubCode: this.hubApp().applicationCode,
					userTag: this.currentUser().id,
					userGroupTag: this.currentUser().enterpriseId,
					conversationId: this.currentConversationId,
					query: customData.content
				}
			};
			console.log('发送消息提问命令', dt);
			store.commit('app.sendSocketMessage', JSON.stringify(dt));
		},

		/**
		 * 收到消息
		 */
		onSSEMessage(dt, isWebSocket = false) {
			if (!this.isGenChat) return;
			if (this.hubApp().appPlatform === 2) {
				// coze
				if (dt.message && (dt.message.type === 'answer' || dt.message.type === 'follow_up' || dt.message.type === 'verbose')) {
					console.log(dt.message.content);
					if (dt.conversation_id) this.currentConversationId = dt.conversation_id;
					if (!isWebSocket && dt.task_id) this.currentConversationTaskId = dt.task_id;
					if (this.dataList[this.dataList.length - 1].messageId === '') this.dataList[this.dataList.length - 1].messageId = dt.message_id;
					if (dt.message.type == 'answer') {
						this.outputBuffer += dt.message.content;
						this.outputBufferAll += dt.message.content;
						if (!this.isProcessingSSEData) {
							this.processBuffer(true);
						}
					}
				}
			}
			if (this.hubApp().appPlatform === 1) {
				// Dify
				if (dt.answer) {
					if (dt.conversation_id) this.currentConversationId = dt.conversation_id;
					if (!isWebSocket && dt.task_id) this.currentConversationTaskId = dt.task_id;
					if (this.dataList[this.dataList.length - 1].messageId === '') this.dataList[this.dataList.length - 1].messageId = dt.message_id;

					this.outputBuffer += dt.answer;
					this.outputBufferAll += dt.answer;
					if (!this.isProcessingSSEData) {
						this.processBuffer(true);
					}
				}
			}
			setTimeout(() => {
				this.$refs.refChatList.scrollBtn();
			}, 300);
		},

		/**
		 * 消息完结
		 */
		onSSEMessageClose(mdc) {
			this.outputSpeed = 10;
			if (Ruler.empty(mdc.content)) {
				this.isGenChat = false;
				mdc.isGenChat = false;
				mdc.content = '<strong>抱歉，[AI] 异常 无法回答您的问题</strong>';
				mdc.isAbandon = true;
				mdc.isContentComplete = true;
			} else {
				this.releaseVoice();
				this.speakContent(mdc, false, this.outputBufferAll, false, true);
				this.renderChatLog();
			}
			UserUtility.refreshSelfInfo(this.usSvc).subscribe();
			this.chatType = 'text';
			this.clearChatAttachAttr();
			// this.currentConversationTaskId = '';
			setTimeout(() => {
				this.$refs.refChatList.scrollBtn();
			}, 500);
		},

		/**
		 * 处理SSE逐字输出
		 */
		processBuffer(needUpdateReplyMsg) {
			this.isProcessingSSEData = true;
			const processChunk = (words, needUpdateReplyMsg) => {
				if (this.outputBuffer.length > 0) {
					words++;
					this.dataList[this.dataList.length - 1].content += this.outputBuffer[0];
					this.dataList[this.dataList.length - 1].renderContent = mdRenderHtml(this.dataList[this.dataList.length - 1].content, this.useMarkdown);
					this.outputBuffer = this.outputBuffer.slice(1);
					if (words === 85) {
						words = 0;
						setTimeout(() => {
							this.$refs.refChatList.scrollBtn();
						}, 500);
					}
					// 使用 setTimeout 分批处理数据，防止页面卡死
					setTimeout(() => {
						processChunk(words, needUpdateReplyMsg);
					}, this.outputSpeed);
				} else {
					this.isProcessingSSEData = false;
					words = 0;
					this.phoneCallWaitingAnswerBack = false;
					setTimeout(() => {
						// 这里只有发送的是文字消息，回复渲染完成时才会执行
						if (needUpdateReplyMsg && this.$refs.refChatList) {
							this.updateFormatedChatLog('processBuffer');
						}
						this.$refs.refChatList.scrollBtn();
					}, 1000);
				}
			};

			processChunk(0, needUpdateReplyMsg);
		},

		/**
		 * 更新渲染了格式的聊天记录
		 */
		updateFormatedChatLog(tip) {
			console.log(`调用了${tip}中的updateFormatedChatLog方法`);
			const mdc = this.dataList[this.dataList.length - 1];
			if (mdc.content.indexOf('您终止了请求...') === -1) {
				if (mdc.id !== this.sendTextOrVoiceChatLogId) {
					
					console.log(`${tip}中成功更新了聊天记录内容,获取组件用的mdc.id=${mdc.id}`);
					// mdc.content = txtRef.$el.innerHTML;
					// mdc.isContentComplete = true;
					// this.sendTextOrVoiceChatLogId = '';
						
				} else console.log(`${tip}中更新聊天记录内容是发现id为前端构造id或内容已经更新过，忽略更新`);
			} else console.log(`${tip}中更新聊天记录内容是发现内容是终止了, mdc.id=${mdc.id}, this.sendTextOrVoiceChatLogId=${this.sendTextOrVoiceChatLogId}`);
		},

		/**
		 * 发送消息前准备工作
		 */
		prepareSendMsg(customData) {
			this.dataList.push({
				id: MathUnitl.guid,
				role: 'user',
				content: customData.content,
				sendAttachment: customData.chatImage,
				isPlayingVoice: false,
				isContentComplete: false,
				isGenChat: false
			});
			this.sendTextOrVoiceChatLogId = MathUnitl.guid;
			this.dataList.push({
				id: this.sendTextOrVoiceChatLogId,
				role: 'assistant', content: '',
				renderContent: '',
				isAbandon: false,
				messageId: '',
				replyAttachment: '',
				chat_type: this.chatType,
				isPlayingVoice: false,
				isContentComplete: false,
				isGenChat: false
			});
			if (this.chatType !== 'voice') {
				this.chatContent = '';
				this.clearChatAttachAttr();
			}
			this.showUpload = false;

			this.showChatList = true;
			this.isGenChat = true;
			setTimeout(() => {
				this.$refs.refChatList.scrollBtn();
			}, 300);

			return true;
		},

		/**
		 * 渲染聊天记录
		 */
		renderChatLog(needUpdateReplyMsg = false) {
			this.needRefreshHisChat = true;
			setTimeout(() => {
				const m = this.dataList[this.dataList.length - 1];
				this.bqsSvc.get(RouteConfigs.businessRoute.Chat.getByConversationId, { conversationId: this.currentConversationId }).subscribe((resp) => {
					this.isGenChat = false;
					if (m != null) m.isGenChat = false;
					if (resp.code === HttpStatusCode.成功) {
						this.currentSelectedHis = resp.data;
						if (this.dataList.length > 0) {
							const selHis = this.dataList.find((x) => x.id === this.currentSelectedHis.id);
							if (selHis !== undefined) {
								selHis.lastMsg = this.currentSelectedHis.lastMsg;
								this.needRefreshHisChat = false;
							}
						}
						if (this.showChatList) {
							const ctlog = resp.data.chatLogs.find((x) => x.messageId === m.messageId);
							if (ctlog !== undefined) {
								m.id = ctlog.id;
								console.log(`找到chatLog，进行渲染赋值,m.id=${m.id}`);
								setTimeout(() => {
									this.$refs.refChatList.scrollBtn();
								}, 300);
							} else {
								console.log('没有找到chatLog，进行renderChatList');
								// 从之前显示了聊天记录信息，这时候应该切换为显示语音聊天的记录
								if (!this.isPlayingAudioQueue) {
									this.dataList.splice(0);
									this.renderChatList(resp.data);
								}
							}
						} else {
							this.showChatList = true;
							// 从没有显示任何聊天记录的时候，直接加载聊天记录
							this.dataList.splice(0);
							this.renderChatList(resp.data);
						}
					}
				});
			}, 1000);
		},

		/**
		 * 结束聊天
		 */
		endChat() {
			if (!this.isGenChat) return;
			this.isGenChat = false;
			this.outputBuffer = '';
			this.outputBufferAll = '';
			this.outputSpeed = 30;
			if (this.chatType !== 'voice') {
				if (this.ctrl != null) this.ctrl.abort();
				this.chatType = 'text';
				this.clearChatAttachAttr();

				if (this.currentConversationTaskId !== '') {
					this.endWebsocket();
				}
			} else {
				// 语音消息
				this.endWebsocket();
			}

			if (this.dataList.length === 0) return;
			const mdc = this.dataList[this.dataList.length - 1];
			mdc.isGenChat = false;
			mdc.isAbandon = true;
			mdc.isContentComplete = false;
			if (Ruler.empty(mdc.content)) {
				mdc.content = '<strong>您终止了请求...</strong>';
			} else mdc.content += '<br><strong>您终止了请求...</strong>';
		},

		/**
		 * 终止websocket
		 */
		endWebsocket() {
			if (this.currentConversationTaskId !== '') {
				const dt = {
					command: -1,
					taskId: this.currentConversationTaskId
				};
				console.log('发送消息终止 命令', dt);
				this.currentConversationTaskId = '';
				store.commit(StoreConfigs.vuex.currentUserModule.mutations.sendSocketMessage, JSON.stringify(dt));
			}
		},

		/**
		 * 新建聊天
		 */
		newChat(showTip = true, hideMenu = true, clearSelect = true) {
			if (!this.checkAppHubAuth()) return;
			if (this.isDenyPrivacy) {
				this.showConfirm('您拒绝了微信隐私保护指引，是否重新同意隐私保护？', () => {
					this.showPrivacy = true;
				});
				return;
			}
			if (this.isGenChat) {
				this.showTips('正在生成结果中，请稍后再进行操作!', 'info');
				return;
			}
			if (this.isProcessingSSEData) {
				this.showTips('正在输出结果中，请稍后再进行操作!', 'info');
				return;
			}
			this.currentConversationId = '';
			this.currentConversationTaskId = '';
			if (clearSelect) this.dataList.splice(0);
			this.releaseVoice();
			this.clickHubAppName(hideMenu, clearSelect);
			if (showTip) this.showToast('已开启新的话题');
		},

		/**
		 * 发现
		 */
		discovery() {
			this.showMenu = false;
			if (!this.checkAppHubAuth()) return;
			if (this.isDenyPrivacy) {
				this.showConfirm('您拒绝了微信隐私保护指引，是否重新同意隐私保护？', () => {
					this.showPrivacy = true;
				});
				return;
			}
			if (this.isGenChat) {
				this.showTips('正在生成结果中，请稍后再进行操作!', 'info');
				return;
			}
			if (this.isProcessingSSEData) {
				this.showTips('正在输出结果中，请稍后再进行操作!', 'info');
				return;
			}
			this.releaseVoice();
			this.navToPage('discovery');
		},

		againDialog(item) {
			if (this.isGenChat) {
				this.showTips('正在生成结果中，请稍后再进行操作!', 'info');
				return;
			}
			if (this.isProcessingSSEData) {
				this.showTips('正在输出结果中，请稍后再进行操作!', 'info');
				return;
			}
			console.log(item, '重新生成对话');
			if (item.sendAttachment != null && item.sendAttachment !== '') {
				this.chatType = 'image';
				this.chatImageUrl = item.sendAttachment;
			}
			// 操作终止了请求的记录，这个时候messageId是空
			if (Ruler.empty(item.sendMsg)) {
				const md = this.dataList[this.dataList.length - 2];
				if (md == null) return;
				this.chatContent = md.content;
			} else this.chatContent = item.sendMsg;
			this.sendChat(this.chatContent);
		},

		againDialog(item) {
			if (this.isGenChat) {
				this.showTips('正在生成结果中，请稍后再进行操作!', 'info');
				return;
			}
			if (this.isProcessingSSEData) {
				this.showTips('正在输出结果中，请稍后再进行操作!', 'info');
				return;
			}
			console.log(item, '重新生成对话');
			if (item.sendAttachment != null && item.sendAttachment !== '') {
				this.chatType = 'image';
				this.chatImageUrl = item.sendAttachment;
			}
			// 操作终止了请求的记录，这个时候messageId是空
			if (Ruler.empty(item.sendMsg)) {
				const md = this.dataList[this.dataList.length - 2];
				if (md == null) return;
				this.chatContent = md.content;
			} else this.chatContent = item.sendMsg;
			this.doSend(this.chatContent);
		},

		/**
		 * 删除聊天记录
		 */
		delDialog(item) {
			if (this.currentUser() == null || !this.currentUser().isLogined) {
				this.onLogin();
				return;
			}
			if (this.isGenChat) {
				this.showTips('正在生成结果中，请稍后再进行操作!', 'info');
				return;
			}
			if (this.isProcessingSSEData) {
				this.showTips('正在输出结果中，请稍后再进行操作!', 'info');
				return;
			}
			// 删除终止了请求的记录，这个时候messageId是空
			if (Ruler.empty(item.messageId)) {
				let idx = this.dataList.findIndex((x) => x.content === item.content && x.role === 'assistant');
				this.dataList.splice(idx - 1, 1);
				idx = this.dataList.findIndex((x) => x.content === item.content && x.role === 'assistant');
				this.dataList.splice(idx, 1);
				return;
			}
			if (item.id == null || item.id === '') {
				this.showTips('记录id丢失，请联系管理员!', 'error');
				return;
			}
			console.log(item);
			this.showConfirm('是否确定删除此条记录', () => {
				this.showLoading('删除中...', true);
				this.bqsSvc.put(RouteConfigs.businessRoute.Chat.delChatLog.replace('{id}', item.id).replace('{type}', '3')).subscribe((res) => {
					uni.hideLoading();
					if (res.code === HttpStatusCode.服务器成功处理) {
						let idx = this.dataList.findIndex((x) => x.id === item.id && x.role === 'assistant');
						this.dataList.splice(idx - 1, 1);
						idx = this.dataList.findIndex((x) => x.id === item.id && x.role === 'assistant');
						this.dataList.splice(idx, 1);
						this.$refs.refChatList.hideShowBotNew();
					}
				}).finally(()=>{					
					uni.hideLoading()
				});
			});
		},
		// 发送新消息
		doSend(msg) {
			if (this.isAnswering) {
				// 如果在回答中，不允许发送新的消息，避免数据错乱
				return;
			}
			this.askMsg = msg;
			this.$refs.paging.addChatRecordData({
				time: '', icon: `${this.$staticPath}temp/imgs/daxiong.jpg`,
				name: '大雄', content: msg,
				isMe: true
			});
			// 在用户发送新消息之后，开始回复消息
			this.doAnswer();
		},
		renderChatList(conversation) {
			conversation.chatLogs.forEach((m) => {
				let ct = 'text';
				if (m.sendAttachment) ct = 'image';
				this.dataList.push({ role: 'user', content: m.sendMsg, chat_type: ct, isPlayingVoice: false, isContentComplete: true, isGenChat: false, ...m });
				this.dataList.push({ role: 'assistant', content: m.replyMsg == null || m.replyMsg === '' ? '被终止的消息' : m.replyMsg, chat_type: ct, isAbandon: false, isPlayingVoice: false, isContentComplete: true, isGenChat: false, ...m });
			});
			setTimeout(() => {
				this.$refs.refChatList.scrollBtn();
			}, 300);
		},
		// 回复消息
		doAnswer() {
			// 设置在回复中
			this.isAnswering = true;
			// 立刻添加一个思考中的回复
			this.$refs.paging.addChatRecordData({
				time: '', icon: `${this.$staticPath}temp/imgs/duola.jpg`,
				name: '小智', content: '思考中...',
				isMe: false
			});
			
			// 延迟500毫秒，模拟网络请求的情况
			setTimeout(() => {
				// 完整的回复字符串，这里直接重复用户提问的内容
				const totalAnswerStr = `你发送了：${this.askMsg}`;
				// 当前显示回复的字符串
				let currentAnswerStr = '';
				this.streamTextAsync(totalAnswerStr, (char) => {
					currentAnswerStr += char;
					// 获取最后一条数据，也就是上面思考中这条数据，然后更新这条数据
					this.dataList[0].content = currentAnswerStr;
					// 这里是判断当前显示回复的字符串长度等于完整的回复字符串长度，也就是回答结束了，将回答中状态设置为false
					if (currentAnswerStr.length === totalAnswerStr.length) {
						this.isAnswering = false;
					}
				})
				this.showChatList = true
			}, 800)
		},
		// 模拟生成流式数据，根据一个已知字符串每150毫秒返回一个字符
		async streamTextAsync(text, callback, interval = 150) {
			for (const char of text) {
				callback(char); // 逐个返回字符
				await new Promise(resolve => setTimeout(resolve, interval)); // 等待
			}
		}
	}
}
</script>

<style lang="scss" scoped>
	.header{
		background-color: red;
		font-size: 20rpx;
		padding: 20rpx;
		color: white;
	}
	.popup {
		position: absolute;
		top: -20px;
		height: 200rpx;
		width: 400rpx;
		background-color: red;
		z-index: 1000;
	}
	.container{
		margin: 32rpx;
	}
	
	.cardWarp {
		width: 686rpx;
		height: 240rpx;
		position: relative;
		border-radius: 20rpx;
		overflow: hidden;
		padding: 56rpx 284rpx 60rpx 32rpx;
		@include background-image('temp/imgs/report-bg.png');
		.cardInfo{
			.cardTitle {
				font-weight: bold;
				color: #222;
				font-size: 32rpx;
				line-height: 50rpx;
			}
			.cardSubTitle {
				font-weight: 400;
				font-size: 24rpx;
				line-height: 34rpx;
				color: #535873;
			}
		}
		.cardIcon {
			position: absolute;
			top: 0;
			right: 0;
			bottom: 0; 
			width: 240rpx;
			height: 240rpx;
			overflow: hidden;
			image {
				width: 100% !important;
				height: 100% !important;
			}
		}
	}

	.inWrap {
		padding: 20rpx;
		.helloGuid {
			.hello {
				padding: 30rpx 20rpx;
				.rPbtn {
					display: inline;
					float: right;
					.pbtn {
						width: 25px !important;
						height: 25px !important;
						background: transparent !important;
						padding: 0 !important;
					}
				}
				.txt {
					min-height: 40rpx;
					color: #13142a;
					font-size: 28rpx;
					line-height: 40rpx;
					margin-top: 10rpx;
				}
			}
			.guid {
				margin-top: 20rpx;
			}
		}
	}
</style>
