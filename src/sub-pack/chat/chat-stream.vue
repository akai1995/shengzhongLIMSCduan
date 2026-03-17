<style lang="scss" scoped>
	@import './styles/chat-stream.scss';
</style>

<!-- 聊天记录模式流式输出-类似chatGPT对话演示(vue)，加载更多聊天记录无闪动 -->
<!-- nvue的聊天记录模式中需要写@cellStyleChange="cellStyleChange"，如果需要兼容nvue和vue，请以nvue中写法为准，会自动兼容vue -->
<!-- 注意，此写法由于将列表倒置了，在iOS15以下和部分较低版本安卓中可能出现列表无法滚动的问题，此时建议使用z-paging 2.7.0以下的版本及写法 -->
<template>
	<view>		
        <chat-log v-if="showChatLog" @close="onChatLogClose" />
		<!-- use-chat-record-mode：开启聊天记录模式 --><!-- safe-area-inset-bottom：开启底部安全区域适配 -->
		<!-- bottom-bg-color：设置slot="bottom"容器的背景色，这里设置为和chat-input-bar的背景色一致 -->
		<!-- use-chat-record-mode -->
		<z-paging 
			ref="paging" v-show="!showChatLog" v-model="dataList" use-chat-record-mode safe-area-inset-bottom
			bottom-bg-color="#f8f8f8" empty-view-text="有什么可以帮忙的？" @query="queryList"
			@keyboardHeightChange="keyboardHeightChange" @hidedKeyboard="hidedKeyboard"
		>
			<view slot="top" class="">
				<u-navbar
					title="报告分析" background="transparent"
					color="#000" left-icon-color="#000" :fixed="false"
				>					
					<view class="u-nav-slot" slot="left" style="display: flex;">
						<u-icon :name="$leftIcon" size="18" @click="onBack" />
						<u-line direction="column" :hairline="false" length="15" margin="0 8px" />
						<u-icon :name="`${$staticPath}imgs/icon-add-msg.png`" size="18" @click="newChat" />
					</view>
				</u-navbar>
				<view class="cardWarp container" v-if="!showChatList">
					<view class="cardInfo">
						<view class="cardTitle">Hi~我是您的报告分析助手</view>
						<view class="cardSubTitle">您身边的智能健康伙伴，帮您读懂报告，答疑解惑，快来体验吧~</view>
					</view>
					<view class="cardIcon"><image :src="`${$staticPath}imgs/report-icon.png`" /></view>
				</view>
			</view>
			<ut-components ref="utComponents" />
			<view class="container" v-if="showChatList">
				<!-- for循环渲染聊天记录列表 -->
				<view v-for="(item,index) in dataList" :key="index" style="position: relative;">
					<!-- 如果要给聊天item添加长按的popup，请在popup标签上写style="transform: scaleY(-1);"，注意style="transform: scaleY(-1);"不要写在最外层，否则可能导致popup被其他聊天item盖住 -->
					<!-- <view class="popup" style="transform: scaleY(-1);">popUp</view> -->
					<!-- style="transform: scaleY(-1)"必须写，否则会导致列表倒置 -->
					<!-- 注意不要直接在chat-item组件标签上设置style，因为在微信小程序中是无效的，请包一层view -->
					<view style="transform: scaleY(-1);"><chat-item :item="item" /></view>
				</view>
			</view>
			<view class="inWrap" v-if="false">
				<!-- 未有聊天问题时显示 --> <!-- 聊天内容显示 -->
				<!-- <project-chat-list
					ref="refChatList" :chatLogs="dataList" :currentSelectedHis="currentSelectedHis"
					:useMarkdown="useMarkdown" @again="againDialog($event)" @del="delDialog($event)"
				 /> -->
			</view>
			<!-- 底部聊天输入框 -->
			<view slot="bottom" class="pubBotHandleFooter">
				<view class="wrap">
					<!-- <chat-input
					 	:disabled="isAnswering" ref="chatInputBar"
						@send-fail="showTips($event, 'warning')" @show-log="onChatLogShow"
						@send="doSend"
					/> -->					
					<view
						class="write chat-input-bar-container"
						:class="{ speak: showVoice }" @touchmove.stop.prevent
					>
						<view class="lWrite chat-input-bar">
							<u-scroll-list :indicator="false" v-if="fileList.length > 0">
								<view class="fileWarp">
									<project-file-card
										v-for="file,idx in fileList" :key="idx"
										border mode="small" closable :file="file"
										@del="onDelFile(idx)"
									/>
								</view>
							</u-scroll-list>
							<view
								class="writeArea pubBoxAI" @touchstart="startRecording"
								@touchmove="moveRecording" @touchend="endRecording"
							>
								<!-- :adjust-position="false"必须设置，防止键盘弹窗自动上顶，交由z-paging内部处理 -->
								<view class="writeBox">
									<u--textarea
										v-if="!showVoice" border="none" :focus="focus"
										class="chat-input" v-model="chatCentent"
										:adjust-position="false" confirm-type="send"
										:placeholder="isGenChat ? '正在回答中...' : '请输入您的问题'"
										@confirm="onSendClick()"
									/>
									<view class="voiceBox" v-else>
										<text class="fTip" v-if="!isRecording">按住 说话</text>
										<template v-else>
											<text class="fTip">
												{{ cancelRecording ? '松开手指，取消发送' : '向上滑动，取消发送' }}
											</text>
										</template>
									</view>
								</view>
							</view>
							<view class="chat-input-history" @click.stop="onChatLogShow()">
								<u-icon :name="`${$staticPath}imgs/icon-history.png`" size="45rpx" />
							</view>
							<view class="chat-input-plus" :class="{ 'rotate-45': showMenu }" @click.stop="onTogglePlus()">
								<u-icon :name="`${$staticPath}imgs/icon-plus.png`" size="45rpx" />
							</view>
							<view
								class="chat-input-send"
								:class="{'chat-input-send-disabled': !sendEnabled }"
								@click.stop="onSendClick()"
							>
								<u-icon v-if="showVoice" :name="`${$staticPath}imgs/icon-voice.png`" size="46rpx" />
								<u-icon v-else :name="`${$staticPath}imgs/icon-${sendEnabled?'send2':'keyboard'}.png`" size="48rpx" />
							</view>
						</view>
						<!-- <view class="menuBox" v-show="showMenu">
							<u-grid :border="false" :col="4" @click="onMenuClick">
								<u-grid-item v-for="(menu,idx) in menuList" :key="idx">
									<u-icon :customStyle="{paddingTop:20+'rpx'}" :name="menu.icon" :size="22" />
									<text class="grid-text">{{menu.name}}</text>
								</u-grid-item>
							</u-grid>
						</view> -->
						<view class="botTip">AI生成内容仅供参考，重要信息请务必核查</view>
					</view>
				</view>
			</view>
		</z-paging>

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
		<u-modal :show="showPrivacy" width="90%" :show-cancel-button="true" :title="privacyTitle" cancel-text="拒绝" @cancel="denyPrivacy()">
			<view class="privacyContent">
				在您使用之前，请仔细阅读<u-button class="txtBtn" @click="handleOpenPrivacyContract()">{{ privacyTitle }}</u-button>。如您同意{{ privacyTitle }}，请点击“同意”开始使用。
			</view>
			<button id="agree-btn" open-type="agreePrivacyAuthorization" class="u-reset-button" slot="confirm-button" @agreeprivacyauthorization="handleAgreePrivacyAuthorization">同意</button>
		</u-modal>			

		<!-- 语音输入对话弹层 -->
		<u-popup
			:show="showVoiceRecord" mode="bottom"
			:mask-close-able="false" :safe-area-inset-bottom="true"
			@close="onVoicePopupClose()" @click="onVoicePopupClose()"
		>
			<view class="voiceInputMark">
				<view class="voiceInputPopup">
					<view class="pWrap">
						<!-- <view class="recordBox">
							<view class="inBox recording" v-if="!cancelRecording">
								<view class="tip"><text class="dot"></text>正在听...</view>
								<view class="status"> -->
									<!-- <u-icon :name="`${$staticPath}imgs/speak1.png`" size="280" /> --> <!-- <canvas ref="recwave" style="margin-left: 120px"></canvas> -->
									<!-- <view class="recwave" :style="{display:recwaveChoiceKey!='WaveView'?'none':''}"><canvas type="2d" class="recwave-WaveView"></canvas></view> -->
								<!-- </view>
							</view>
							<view class="inBox cancelRecord" v-else>
								<view class="tip">松手取消发送</view>
								<view class="status"><u-icon :name="`${$staticPath}imgs/speak2.png`" size="280" /></view>
							</view>
						</view> -->
						<view class="botTip">
							<view class="tip">{{ cancelRecording ? '松开手指，取消发送' : '向上滑动，取消发送' }}</view>
							<view class="botImg">
								<!-- <u-icon name="speak" custom-prefix="custom-icon" color="#242424" size="44" /> -->
								<!-- <view class="recwave" :style="{display:recwaveChoiceKey!='WaveView'?'none':''}"><canvas type="2d" class="recwave-WaveView"></canvas></view> -->
								<u-icon :name="!cancelRecording?`${$staticPath}imgs/speak2.png`:`${$staticPath}imgs/speak2.png`" size="99" />
								<view class="layer" v-if="cancelRecording"></view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
// import chatInput from './components/chat-input.vue'
import chatItem from './components/chat-item.vue'
import AppConfig from '@/app/app.constant'
import chatLog from './chat-log.vue'

import mixins from './js/chat-stream-mixins'
export default {
	components: { /* 'chat-input': chatInput, */ 'chat-item': chatItem, 'chat-log': chatLog },
	mixins: [mixins],
	data() {
		return {
			showChatLog: false,
			statusMap: { waiting: '等待中...', uploading: '上传中...', analysis: '解析中...', success: '', uploaded: '', 'upload-fail': '上传失败', fail: '系统服务异常' },
			// tif pjp jfif ico tiff gif svg xbm jxl jpeg svgz jpg webp png bmp pjpeg avif doc docx txt pdf csv tsv xls xlsx xlsm ppt pptx
			// name size type path
			fileList: [], showMenu: false,
			menuList: [
				{ icon: `${AppConfig.staticPath}imgs/icon-camera.png`, name: '拍照', type: 'camera' },
				{ icon: `${AppConfig.staticPath}imgs/icon-album.png`, name: '相册', type: 'album' },
				{ icon: `${AppConfig.staticPath}imgs/icon-file.png`, name: '本地文件', type: 'file' },
				{ icon: `${AppConfig.staticPath}imgs/icon-file.png`, name: '会话图片', type: 'message-image' },
				{ icon: `${AppConfig.staticPath}imgs/icon-file.png`, name: '会话文档', type: 'message-file' },
				/* { icon: ``, name: '', type: '' } */
			],
			chatCentent: '', focus: false,
		}
	},
	computed: {
		sendEnabled() {
			return !this.isAnswering && this.chatCentent.length;
		}
	},
	methods: {
		onChatLogShow() {
			if (!this.checkUserInfo()) { return; }
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
			// this.$refs.chatInputBar.updateKeyboardHeightChange(res);
		}, 
		// 用户尝试隐藏键盘，此时如果表情面板在展示中，应当通知chatInputBar隐藏表情面板（如果不需要切换表情面板则不用写）
		hidedKeyboard() {
			// this.$refs.chatInputBar.hidedKeyboard();
		},
		
		/**
		 * 新建聊天
		 */
		newChat(showTip = true, hideMenu = true, clearSelect = true) {
			if (!this.checkUserInfo()) { return; }
			if (this.isDenyPrivacy) { this.showConfirm('您拒绝了微信隐私保护指引，是否重新同意隐私保护？', () => { this.showPrivacy = true; }); return; }
			if (this.isGenChat) { this.showTips('正在生成结果中，请稍后再进行操作!', 'info'); return; }
			if (this.isProcessingSSEData) { this.showTips('正在输出结果中，请稍后再进行操作!', 'info'); return; }
			this.currentConversationId = ''; this.currentConversationTaskId = '';
			if (clearSelect) { this.dataList.splice(0); }
			this.releaseVoice(); if (showTip) { this.showTips('已开启新的话题'); }
		},

		/**
		 * 发现
		 */
		discovery() {
			this.showMenu = false;
			if (this.isDenyPrivacy) { this.showConfirm('您拒绝了微信隐私保护指引，是否重新同意隐私保护？', () => { this.showPrivacy = true; }); return; }
			if (this.isGenChat) { this.showTips('正在生成结果中，请稍后再进行操作!', 'info'); return; }
			if (this.isProcessingSSEData) { this.showTips('正在输出结果中，请稍后再进行操作!', 'info'); return; }
			this.releaseVoice(); this.navToPage('discovery');
		},
		// 发送新消息
		doSend({msg, files }) {
			if (this.isAnswering) {
				// 如果在回答中，不允许发送新的消息，避免数据错乱
				return;
			}
			this.askMsg = msg;
			this.$refs.paging.addChatRecordData({
				time: '', icon: `${this.$staticPath}imgs/daxiong.jpg`,
				name: '大雄', content: msg, files: files, isMe: true
			});
			// 在用户发送新消息之后，开始回复消息
			this.doAnswer();
		},
		// 回复消息
		doAnswer() {
			// 设置在回复中
			this.isAnswering = true;
			// 立刻添加一个思考中的回复
			this.$refs.paging.addChatRecordData({
				time: '', icon: `${this.$staticPath}imgs/duola.jpg`,
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
