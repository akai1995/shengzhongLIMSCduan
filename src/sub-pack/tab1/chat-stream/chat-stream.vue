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
			<view slot="top" class="">
				<u-navbar title="报告分析" :fixed="false" background="transparent" color="#000" left-icon-color="#000">					
					<view class="u-nav-slot" slot="left" style="display: flex;">
						<u-icon name="arrow-left" size="19" @click="onBack" />
						<u-line direction="column" :hairline="false" length="16" margin="0 8px" />
						<u-icon name="plus" size="20" />
					</view>
				</u-navbar>
				<view class="cardWarp container" v-if="!showChatList">
					<view class="cardInfo"><view class="cardTitle">Hi~我是您的报告分析助手</view><view class="cardSubTitle">您身边的智能健康伙伴，帮您读懂报告，答疑解惑，快来体验吧~</view></view>
					<view class="cardIcon"><image :src="`${$staticPath}imgs/report-icon.png`" /></view>
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
				<!-- 未有聊天问题时显示 --> <!-- 聊天内容显示 -->
				<!-- <project-chat-list  ref="refChatList" :chatLogs="dataList" :currentSelectedHis="currentSelectedHis" :useMarkdown="useMarkdown" @again="againDialog($event)" @del="delDialog($event)" /> -->
			</view>

			<!-- 删除历史记录弹出层 -->
			<u-mask class="delPopupMark" :show="showLongDel" z-index="10100" :custom-style="{ background: 'rgba(0, 0, 0, 0)' }" @click="showLongDel = false">
				<view class="delPopup"><view class="inBtn" :style="{ top: delItemTop + 'px' }"><u-button class="delBtn" @click="delHis()"><u-icon name="delete" custom-prefix="custom-icon" color="#0F0F0F" size="48" />删除</u-button></view></view>
			</u-mask>

			<!-- 微信隐私保护指引 -->
			<u-modal :show="showPrivacy" width="90%" :show-cancel-button="true" :title="privacyTitle" :title-style="{ color: '#000', fontWeight: 'bold' }" cancel-text="拒绝" @cancel="denyPrivacy()">
				<view class="privacyContent">在您使用之前，请仔细阅读<u-button class="txtBtn" @click="handleOpenPrivacyContract()">{{ privacyTitle }}</u-button>。如您同意{{ privacyTitle }}，请点击“同意”开始使用。</view>
				<button id="agree-btn" open-type="agreePrivacyAuthorization" class="u-reset-button" slot="confirm-button" @agreeprivacyauthorization="handleAgreePrivacyAuthorization">同意</button>
			</u-modal>
			

			<!-- 语音输入对话弹层 -->
			<u-popup class="voiceInputMark" v-model="showVoiceRecord" mode="bottom" :mask-close-able="false" :safe-area-inset-bottom="false">
				<view class="voiceInputPopup">
					<view class="pWrap">
						<view class="recordBox">
							<!-- 录音 -->
							<view class="inBox recording" v-if="!cancelRecording">
								<view class="tip">
									<text class="dot"></text>
									正在听...
								</view>
								<view class="status">
									<u-icon :name="`${ossBaseUrl}speak1.png`" size="440" />
									<!-- <canvas ref="recwave" style="margin-left: 120px"></canvas> -->
								</view>
							</view>
							<!-- 取消 -->
							<view class="inBox cancelRecord" v-else>
								<view class="tip">松手取消发送</view>
								<view class="status">
									<u-icon :name="`${ossBaseUrl}speak2.png`" size="440" />
								</view>
							</view>
						</view>
						<view class="botTip">
							<view class="tip">{{ cancelRecording ? '松开手指，取消发送' : '向上滑动，取消发送' }}</view>
							<view class="botImg">
								<u-icon name="speak" custom-prefix="custom-icon" color="#242424" size="44" />
								<!-- 取消时显示 -->
								<view class="layer" v-if="cancelRecording"></view>
							</view>
						</view>
					</view>
				</view>
			</u-popup>
			<!-- 底部聊天输入框 -->
			<view slot="bottom" class="pubBotHandleFooter">
				<view class="wrap">
					<!-- <chat-input
						:disabled="isAnswering" ref="chatInputBar"
						@send-fail="showTips($event, 'warning')"
						@show-log="onChatLogShow" @send="doSend"
					/> -->					
					<view class="write chat-input-bar-container" :class="{ speak: showVoice }" @touchmove.stop.prevent>
						<view class="lWrite chat-input-bar">
							<u-scroll-list :indicator="false" v-if="fileList.length>0">
								<view class="fileWarp">
									<project-file-card v-for="file,idx in fileList" :key="idx" border mode="small" closable :file="file" @del="onDelFile(idx)" />
								</view>
							</u-scroll-list>
							<view class="writeArea pubBoxAI">
								<!-- :adjust-position="false"必须设置，防止键盘弹窗自动上顶，交由z-paging内部处理 -->
								<u--textarea
									v-if="!showVoice" 
									border="none" :focus="focus" class="chat-input" 
									v-model="chatCentent" 
									:adjust-position="false" 
									confirm-type="send" :placeholder="isGenChat ? '正在回答中...' : '请输入您的问题'"
									@confirm="onSendClick"
								/>
								<view class="voiceBox" v-else @touchstart="startRecording" @touchmove="moveRecording" @touchend="endRecording">
									<text class="fTip" v-if="!isRecording">按住 说话</text>
									<template v-else><text class="fTip">{{ cancelRecording ? '松开手指，取消发送' : '向上滑动，取消发送' }}</text></template>
								</view>
							</view>
							<view class="chat-input-history" @click="onChatLogShow()"><u-icon :name="`${$staticPath}imgs/icon-history.png`" size="45rpx" /></view>
							<view class="chat-input-plus" :class="{ 'rotate-45': showMenu }" @click="onTogglePlus()"><u-icon :name="`${$staticPath}imgs/icon-plus.png`" size="45rpx" /></view>
							<view class="chat-input-send" :class="{'chat-input-send-disabled': !sendEnabled }" @click="onSendClick"><u-icon :name="`${$staticPath}imgs/icon-send${sendEnabled?'2':''}.png`" size="46rpx" /></view>
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
	</view>
</template>

<script>
import { ocrUploadFile, parseDoc } from '@/app/api/common'
import { md, initMd } from '@/providers/utilities/chat';
import chatInput from './components/chat-input.vue'
import chatItem from './components/chat-item.vue'
import { onChooseFile } from '@/providers/upload'
import AppConfig from '@/app/app.constant'
import { guid } from '@/providers/index';
import chatLog from './chat-log.vue'
import store from '@/store/index'
import Recorder from 'recorder-core';
//引入相应格式支持文件；如果需要多个格式支持，把这些格式的编码引擎js文件放到后面统统引入进来即可
import 'recorder-core/src/engine/wav';
export default {
	components: { 'chat-input': chatInput, 'chat-item': chatItem, 'chat-log': chatLog },
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
			chatImageUrl: '',
			chatImageName: '',
			chatImageSize: '',
			chatFileUrl: '',

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

			/**
			 * 长按聊天记录的项目
			 */
			longPressHisChatItem: null,
			/**
			 * 是否显示语音输入
			 */
			showVoice: false,
			// #ifndef MP-WEIXIN
			/**
			 * 音频元素
			 */
			voice: document.getElementById('agentAudioVoice'),
			// #endif

			/**
			 * 音频上下文
			 */
			audioContext: uni.createInnerAudioContext(),

			/**
			 * Recorder 实例
			 */
			rec: null,
			wave: null,

			/**
			 * 是否检测到声音
			 *  true: 是
			 *  false:否
			 */
			isVoiceDetected: false,

			/**
			 * 是否正在录音
			 *  true: 是
			 *  false:否
			 */
			isHoldRecording: false,

			/**
			 * 用于存储录音数据
			 */
			audioChunks: [],

			/**
			 * 当前音频对象
			 */
			currentVoiceItem: null,

			/**
			 * 是否在请求语音转换
			 */
			isRequestVoice: false,

			/**
			 * 发送聊天的类型
			 */
			chatType: 'text',
			audioQueue: [], // 音频队列
			bufferThreshold: 1, // 设置缓冲阈值，比如 2 个音频片段
			isPlayingAudioQueue: false,

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
			statusMap: {
				waiting: '等待中...',
				uploading: '上传中...',
				analysis: '解析中...',
				success: '',
				uploaded: '',
				'upload-fail': '上传失败',
				fail: '系统服务异常',
			},
			// jpg jpeg png webp dox docx xls xlsx pdf ppt pptx
			// name size type path
			fileList: [], showMenu: false,
			menuList: [
				{
					icon: `${AppConfig.staticPath}imgs/icon-camera.png`,
					name: '拍照', type: 'camera'
				},
				{
					icon: `${AppConfig.staticPath}imgs/icon-album.png`,
					name: '相册', type: 'album'
				},
				{
					icon: `${AppConfig.staticPath}imgs/icon-file.png`,
					name: '本地文件', type: 'file'
				},
				{
					icon: `${AppConfig.staticPath}imgs/icon-file.png`,
					name: '会话图片', type: 'message-image'
				},
				{
					icon: `${AppConfig.staticPath}imgs/icon-file.png`,
					name: '会话文档', type: 'message-file'
				},
				// { icon: ``, name: '', type: '' }
			],
			chatCentent: '',
			focus: false,
		}
	},
	computed: {
		sendEnabled() {
			return !this.isAnswering && this.chatCentent.length;
		}
	},
	mounted() {
		setTimeout(() => { this.useMarkdown = initMd(md);this.onToggleVoice() }, 250);
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
			// this.$refs.chatInputBar.updateKeyboardHeightChange(res);
		}, 
		// 用户尝试隐藏键盘，此时如果表情面板在展示中，应当通知chatInputBar隐藏表情面板（如果不需要切换表情面板则不用写）
		hidedKeyboard() {
			// this.$refs.chatInputBar.hidedKeyboard();
		},
		/**
		 * 播放音频
		 */
		async playAudio(res, isAutoPlay = false) {
			const audioUrl = `data:audio/${AppConfig.audioType};base64,${res.data.audioData}`;
			if (this.playVoiceType === 1) {
				if (isAutoPlay) {
					if (this.isWechat) {
						this.audioContext.src = audioUrl;
						this.audioContext.play();
					} else {
						this.showConfirm('是否确定播放开场白', () => {
							this.audioContext.src = audioUrl;
							this.audioContext.play();
						});
					}
					return;
				}
				this.audioContext.src = audioUrl;
				this.audioContext.play();
			} else {
				if (this.voice) {
					this.voice.src = audioUrl;
					if (isAutoPlay) {
						const btn = document.getElementById('autoPlayButton');
						if (btn) btn.click();
						return;
					}
					try {
						this.voice
							.play()
							.then(() => {
								this.currentVoiceItem.isPlayingVoice = true;
								console.log('开始播放音频');
							})
							.catch((err) => {
								this.releaseVoice();
								console.log('播放音频失败', err);
								this.showTips(`无法播放此段内容的声音`, 'info');
							});
					} catch (e) {}
				}
			}
		},

		/**
		 * 释放音频
		 */
		releaseVoice() {
			this.isPlayingAudioQueue = false;
			this.audioQueue.splice(0);
			if (this.audioContext) {
				this.audioContext.stop();
				this.audioContext.src = '';
			}
			if (this.voice) this.voice.src = '';
			if (this.currentVoiceItem) {
				this.currentVoiceItem.isPlayingVoice = false;
				this.currentVoiceItem = null;
			}
		},

		/**
		 * 开始录音
		 */
		startRecording(e) {
			if (this.isGenChat) {
				this.showTips('正在生成结果中，请稍后再进行操作!', 'info');
				return;
			}
			if (this.isProcessingSSEData) {
				this.showTips('正在输出结果中，请稍后再进行操作!', 'info');
				return;
			}
			this.startY = e.touches[0].clientY;
			this.showVoiceRecord = true;
			this.isRecording = true;
			this.cancelRecording = false;
			console.log('开始录音');
			this.startH5Recording();
		},

		/**
		 * 按住时移动
		 */
		moveRecording(e) {
			const moveY = e.touches[0].clientY;
			if (this.startY - moveY > 55) {
				this.cancelRecording = true;
			} else {
				this.cancelRecording = false;
			}
		},

		/**
		 * 松开手
		 */
		endRecording() {
			this.isRecording = false;
			this.showVoiceRecord = false;
			if (this.cancelRecording) {
				console.log('取消录音');
				if (this.rec) {
					this.rec.close();
					this.isHoldRecording = false;
					if (AppConfig.useRealTimeSend) this.realTimeSendTry([], 0, true); //最后一次发送
				}
			} else {
				console.log('结束录音并发送');
				if (!AppConfig.useRealTimeSend) this.stopRecording();
				else {
					this.isHoldRecording = false;
					this.rec.close(); //直接close掉即可，不需要获得最终的音频文件
					this.realTimeSendTry([], 0, true); //最后一次发送
				}
			}
		},

		/****************************************************
		 * 录音权限
		 * @param success
		 * *************************************************/
		openPermission(success, fail = null) {
			if (this.rec) this.rec.close();
			let silenceStartTime = null; // 静音开始时间
			let isPaused = false; // 用于记录是否已经暂停录音
			this.rec = Recorder({
				type: AppConfig.audioType, // 输出类型
				sampleRate: AppConfig.audioSampleRate, // 采样率
				bitRate: AppConfig.audioBitRate, // 比特率
				logLevel: 0, // 关闭日志
				onProcess: (buffers, powerLevel, bufferDuration, bufferSampleRate, newBufferIdx, asyncEnd) => {
					// 接收到录音数据时的回调函数
					// - buffers: 缓冲的PCM数据块(16位小端LE)
					// - bufferSampleRate: buffers数据采样率,它和sampleRate不一定相同
					// - powerLevel: s当前缓冲的音量级别0-100
					// - bufferDuration: 已缓冲时长
					// - bufferSampleRate: buffers缓存数据的采样率 (当type支持边录边转码(Worker)时，此采样率和设置的采样率相同，否则不一定相同)
					// - newBufferIdx: 本次回调新增的buffer起始索引
					// - asyncEnd: fn()如果onProcess是异步的(返回值为true时)，处理完成时需要调用此回调，如果不是异步的请忽略此参数，此方法回调时必须是真异步(不能真异步时需用setTimeout包裹)
					// console.log(buffers[buffers.length - 1], powerLevel, bufferSampleRate)

					if (this.wave) {
						this.wave.input(buffers[buffers.length - 1], powerLevel, bufferSampleRate);
					}
					console.log('powerLevel', powerLevel);
					if (AppConfig.useRealTimeSend) {
						this.realTimeSendTry(buffers, bufferSampleRate, false);
						// if (powerLevel > AppConfig.VOICE_THRESHOLD) {
						// 	silenceStartTime = null;
						// 	isPaused = false; //重置暂停状态
						// 	if (!this.isVoiceDetected) {
						// 		this.realTimeSendTry(buffers, bufferSampleRate, false);
						// 	}
						// } else {
						// 	if (this.isVoiceDetected && silenceStartTime == null) {
						// 		silenceStartTime = Date.now();
						// 	}
						// 	if (this.isVoiceDetected && silenceStartTime != null) {
						// 		const silenceDuration = Date.now() - silenceStartTime;
						// 		if (silenceDuration > AppConfig.minSpeechDurationThreshold && !isPaused) {
						// 			console.log('检测到静音');
						// 			this.isVoiceDetected = false;
						// 			isPaused = true;
						// 			silenceStartTime = null;
						// 		}
						// 	}
						// }
					}
				},
				// RealTimeWorker: true, // 是否启用实时转码
				audioTrackSet: {
					noiseSuppression: true, // 降噪（ANS）开关(不设置时由浏览器控制[一般为默认打开],设为true明确打开,设为false明确关闭)
					echoCancellation: true, // 回声消除（AEC）开关，取值和降噪开关一样
					autoGainControl: true // 自动增益（AGC）开关，取值和降噪开关一样
				},
				ConnectEnableWorklet: false
			});

			this.rec.open(
				() => {
					//开启录音权限
					if (this.$refs.recwave) {
						// this.wave = Recorder.WaveView({ elem: this.recwave });
						this.wave = Recorder.WaveView({ compatibleCanvas: this.$refs.recwave.$refs.canvas, width: 90, height: 90, lineWidth: 1 });
					}
					this.realTimeSendTryTime = 0;
					success && success();
				},
				(msg, isUserNotAllow) => {
					//用户拒绝未授权或不支持
					console.error(`权限请求失败: ${msg}`, `用户拒绝: ${isUserNotAllow}`);
					this.showAlert('录音权限未开启，请开启录音权限后再试', () => {
						this.isRecording = false;
						this.showVoiceRecord = false;
					});
					fail && fail();
				}
			);
		},

		/**
		 * 录音且实时发送
		 */
		realTimeSendTry(buffers, bufferSampleRate, isClose) {
			const t1 = Date.now();
			if (this.realTimeSendTryTime == 0) {
				this.realTimeSendTryTime = t1;
				this.realTimeSendTryEncBusy = 0;
				this.realTimeSendTryNumber = 0;
				this.transferUploadNumberMax = 0;
				this.realTimeSendTryChunk = null;
			}

			if (!isClose && t1 - this.realTimeSendTryTime < AppConfig.audioSendServerInterval) return; // 控制缓冲达到指定间隔才进行传输

			this.realTimeSendTryTime = t1;
			let number = ++this.realTimeSendTryNumber;

			let pcm = [];
			let pcmSampleRate = 0;
			if (buffers.length > 0) {
				// 借用SampleData函数进行数据的连续处理，采样率转换是顺带的，得到新的pcm数据
				const chunk = Recorder.SampleData(buffers, bufferSampleRate, AppConfig.audioSampleRate, this.realTimeSendTryChunk, { frameType: isClose ? '' : AppConfig.audioType });

				// 清理已处理完的缓冲数据，释放内存以支持长时间录音，最后完成录音时不能调用stop，因为数据已经被清掉了
				for (var i = this.realTimeSendTryChunk ? this.realTimeSendTryChunk.index : 0; i < chunk.index; i++) {
					buffers[i] = null;
				}

				// 此时的chunk.data就是原始的音频16位pcm数据（小端LE），直接保存即为16位pcm文件、加个wav头即为wav文件、丢给mp3编码器转一下码即为mp3文件
				this.realTimeSendTryChunk = chunk;

				pcm = chunk.data;
				pcmSampleRate = chunk.sampleRate;
			}

			//没有新数据，或结束时的数据量太小，不能进行mock转码
			if (pcm.length === 0 || (isClose && pcm.length < 2000)) {
				this.transferUpload(number, null, 0, null, isClose);
				return;
			}

			// 实时编码队列阻塞处理
			if (!isClose) {
				if (this.realTimeSendTryEncBusy >= 2) {
					console.log('编码队列阻塞，已丢弃一帧', 1);
					return;
				}
			}
			this.realTimeSendTryEncBusy++;

			// 通过mock方法实时转码成mp3、wav；16位pcm格式可以不经过此操作，直接发送new Blob([pcm.buffer],{type:"audio/pcm"}) 要8位的就必须转码
			let encStartTime = Date.now();
			const recMock = Recorder({
				type: AppConfig.audioType,
				sampleRate: AppConfig.audioSampleRate, //采样率
				bitRate: AppConfig.audioBitRate //比特率
			});
			recMock.mock(pcm, pcmSampleRate);
			recMock.stop(
				(blob, duration) => {
					this.realTimeSendTryEncBusy && this.realTimeSendTryEncBusy--;
					blob.encTime = Date.now() - encStartTime;

					//转码好就推入传输
					this.transferUpload(number, blob, duration, recMock, isClose);
				},
				(msg) => {
					this.realTimeSendTryEncBusy && this.realTimeSendTryEncBusy--;

					//转码错误？没想到什么时候会产生错误！
					console.log('不应该出现的错误:' + msg, 1);
				}
			);
		},

		/**
		 * 实时上传数据
		 */
		transferUpload(number, blobOrNull, duration, blobRec, isClose) {
			this.transferUploadNumberMax = Math.max(this.transferUploadNumberMax, number);
			if (blobOrNull) {
				const blob = blobOrNull;
				const encTime = blob.encTime;

				//*********发送方式一：Base64文本发送***************
				const reader = new FileReader();
				reader.onloadend = () => {
					if (reader.result != null) {
						const base64 = (/.+;\s*base64\s*,\s*(.+)$/i.exec(reader.result.toString()) || [])[1];

						//可以实现
						//WebSocket send(base64) ...
						//WebRTC send(base64) ...
						//XMLHttpRequest send(base64) ...
						const audioMessage = {
							command: 2,
							taskId: this.currentConversationTaskId,
							data: {
								requireId: this.realTimeAudioRequiredId,
								chunkIndex: number - 1,
								chunkData: base64, // 将 audio 数据转换为 base64 并去掉前缀
								end: false
							}
						};
						this.audioChunks.push(base64);
						store.commit('sendSocketMessage', JSON.stringify(audioMessage));
						console.log('发送录音实时数据给服务器', audioMessage);
					}
				};
				reader.readAsDataURL(blob);

				//*********发送方式二：Blob二进制发送***************
				//可以实现
				//WebSocket send(blob) ...
				//WebRTC send(blob) ...
				//XMLHttpRequest send(blob) ...

				//****这里仅 console.log一下 意思意思****
				const numberFail = number < this.transferUploadNumberMax ? '<span style="color:red">顺序错乱的数据，如果要求不高可以直接丢弃，或者调大SendInterval试试</span>' : '';
				const logMsg = 'No.' + (number < 100 ? ('000' + number).substr(-3) : '') + numberFail;

				console.log(blob, duration, blobRec, logMsg + '花' + ('___' + encTime).substr(-3) + 'ms');
			}

			if (isClose) {
				console.log('No.' + (number < 100 ? ('000' + number).substr(-3) : '') + ':已停止传输，发送状态:' + (this.cancelRecording || this.audioChunks.length === 0 ? '取消发送' : '发送'));

				if (this.cancelRecording || this.audioChunks.length === 0) return;

				this.audioQueue.splice(0);
				if (!this.prepareSendMsg({ content: '发送语音消息', chatImage: '' })) {
					// 清理录音数据
					this.audioChunks = []; //清空录音数据数组
					return;
				}
				this.outputSpeed = 30;
				this.outputBuffer = '';
				this.outputBufferAll = '';
				//所有块发送完毕后发送结束消息
				const dt = {
					command: 2,
					taskId: this.currentConversationTaskId,
					data: {
						requireId: this.realTimeAudioRequiredId,
						userTag: this.$store.getters.userId,
						conversationId: this.currentConversationId,
						end: true
					}
				};
				console.log('发送录音结束信号给服务器', dt);
				store.commit('sendSocketMessage', JSON.stringify(dt));

				// 3. 清理录音数据
				this.audioChunks = []; //清空录音数据数组
			}
		},

		/****************************************************
		 * 开始
		 * *************************************************/
		startH5Recording() {
			if (this.rec && !this.isHoldRecording) {
				this.audioChunks = []; // 清空录音数据
				this.isHoldRecording = true;
				this.openPermission(() => {
					if (AppConfig.useRealTimeSend) {
						this.realTimeAudioRequiredId = `${Date.now()}-${Math.random().toString(32)}`;
						this.currentConversationTaskId = MathUnitl.guid;
					}
					this.rec.start();
				});
			}
		},

		/****************************************************
		 * 停止
		 *   1.停止录音后获取录音音频信息
		 *   2.处理音频数据
		 *   3.重新开启录音权限
		 * *************************************************/
		stopRecording() {
			if (!this.isHoldRecording) return;
			this.isHoldRecording = false;
			this.rec.stop(
				(blob, duration) => {
					console.log(`录音结束，时长：${duration}ms`);
					if (duration < AppConfig.minSpeechDurationThreshold) {
						console.log('录音时长过短，已取消发送');
						this.showTips('录音时长过短，已取消发送', 'warning');
						return;
					}

					//1. 存储录音数据
					this.audioChunks.push(blob);

					//2. 处理录音数据
					this.processAudioData();
				},
				(msg) => {
					console.error('停止录音失败:', msg);
				}
			);
		},

		/****************************************************
		 * 处理录音数据
		 *  1.合并录音数据
		 *  2.音频以16KB的大小进行分片传输
		 *  3.清理录音数据
		 * *************************************************/
		processAudioData() {
			if (this.audioChunks.length <= 0) return;

			// 1. 合并录音数据
			const audioBlob = new Blob(this.audioChunks, { type: `audio/${AppConfig.audioType}` });

			// 分片大小
			const CHUNK_SIZE = 16 * 1024;
			// 分片序号
			let chunkIndex = 0;

			const requiredId = `${Date.now()}-${Math.random().toString(32)}`;
			this.currentConversationTaskId = MathUnitl.guid;

			// 2. 音频分片传输
			const sendChunk = (offset) => {
				if (offset < audioBlob.size) {
					const chunk = audioBlob.slice(offset, offset + CHUNK_SIZE);
					const reader = new FileReader();
					reader.onload = () => {
						const chunkData = reader.result;
						const audioMessage = {
							command: 2,
							taskId: this.currentConversationTaskId,
							data: {
								requireId: requiredId,
								chunkIndex: chunkIndex,
								chunkData: chunkData?.split(',')[1], // 将 audio 数据转换为 base64 并去掉前缀
								end: false
							}
						};
						store.commit('sendSocketMessage', JSON.stringify(audioMessage));
						sendChunk(offset + CHUNK_SIZE);
						chunkIndex++;
					};
					reader.readAsDataURL(chunk);
				} else {
					// 判断如果当前是显示着聊天记录的情况,判断如果上一条记录不是语音，新建会话
					let cvid = this.currentConversationId;
					// if (this.showChatList) {
					// 	const mdc = this.choices[this.choices.length - 1];
					// 	if (mdc.chat_type !== 'voice') {
					// 		this.choices.splice(0);
					// 		cvid = '';
					// 	}
					// }
					this.audioQueue.splice(0);
					if (!this.prepareSendMsg({ content: '发送语音消息', chatImage: '' })) {
						// 清理录音数据
						this.audioChunks = []; //清空录音数据数组
						return;
					}
					this.outputSpeed = 30;
					this.outputBuffer = '';
					this.outputBufferAll = '';
					//所有块发送完毕后发送结束消息
					const dt = {
						command: 2,
						taskId: this.currentConversationTaskId,
						data: {
							requireId: requiredId,
							userTag: this.$store.getters.userId,
							conversationId: cvid,
							end: true
						}
					};
					console.log('发送录音结束信号给服务器', dt);
					store.commit('sendSocketMessage', JSON.stringify(dt));

					// 3. 清理录音数据
					this.audioChunks = []; //清空录音数据数组
				}
			};
			sendChunk(0);
		},
		/**
		 * 切换语音输入
		 */
		onToggleVoice() {
			if (!this.checkUserInfo()) {
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
			this.showUpload = false;
			if (!this.showVoice) {
				const ws = store.getters.socket;
				if (ws == null || !ws.is_open_socket) {
					this.showTips('底层音频链路还未准备好，请稍后再试', 'info');
					return;
				}
				if (this.rec == null) {
					this.showLoading('初始化...', true);
					/**
					 * 获取录音权限
					 */
					this.openPermission(
						() => {
							uni.hideLoading();
							this.chatType = 'voice';
							this.showVoice = true;
							console.log('open permission');
						},
						() => {
							uni.hideLoading();
							this.showVoice = false;
							this.rec = null;
							this.showTips('录音权限未开启，请开启录音权限后再试', 'info');
						}
					);
				} else {
					this.chatType = 'voice';
					this.showVoice = true;
					console.log('rec实例存在');
				}
			} else {
				if (this.rec) this.rec.close();
				this.showVoice = false;
				this.chatType = this.chatImageUrl === '' ? 'text' : 'image';
			}
		},
		onMenuClick(idx) {
			const _self = this
			const menu = _self.menuList[idx];
			let fileParams = {
				accept: 'media', multiple: true, capture: ['camera','album'], mediaType: 'image',
				compressed: true, maxDuration: 60, sizeType: uni.$u.props.upload.sizeType,
				camera: 'back', maxCount: 1
			}
			switch(menu.type) {
				case 'camera': fileParams = Object.assign(fileParams, { capture: ['camera'], mediaType: ['image'] }); break;
				case 'album': fileParams = Object.assign(fileParams, { capture: ['album'], mediaType: ['image'], maxCount: 3 }); break;
				case 'file': fileParams = Object.assign(fileParams, { accept: 'file', maxCount: 9 }); break;
				case 'message-image': case 'message-file': fileParams = Object.assign(fileParams, { accept: menu.type, maxCount: 9 }); break;
			}
            onChooseFile(fileParams).then((res) => {
				_self.fileList = _self.fileList == 0 ? res.map((row)=>({ ...row, status: 'waiting', uiid: guid() })) : [ ...res.map((row)=>({ ...row, status: 'waiting', uiid: guid() })), ..._self.fileList ];				
				console.log('onChooseFile ocrUploadFile _self.fileList', _self.fileList);
				_self.fileList.forEach((item)=>{ 
					if (item.status == 'waiting') _self.$set(item, 'status', 'uploading');
					if (item.status == 'uploading') {
						ocrUploadFile({ filePath: item.thumb, formData: { /* biz: 'temp', file: res[0] */ }}).then((resp)=>{
							if (resp.success) {
								const filePath = `${_self.$onlineFilePath}${resp.message}`;
								_self.$set(item, 'imgPath', filePath); _self.$set(item, 'status', 'analysis');
								console.log('onChooseFile ocrUploadFile _self.fileList', _self.fileList);
            					_self.$forceUpdate()
								parseDoc(resp.message).then((response)=>{
									if (response.success) {
										const { title, filePath, content } = response.data
										_self.$set(item, 'title', title); _self.$set(item, 'filePath', filePath)
										_self.$set(item, 'content', content); _self.$set(item, 'status', 'success')
									} else { _self.$set(item, 'status', 'fail') }
            						_self.$forceUpdate()
									console.log('onChooseFile parseDoc _self.fileList', _self.fileList);
								}).catch((error)=>{ console.error('parseDoc error', error); _self.$set(item, 'status', 'fail'); _self.$forceUpdate()
								}).finally(()=>{ setTimeout(()=>{ uni.hideLoading() }, 300) })
							} else { _self.$set(item, 'status', 'upload-fail'); _self.$forceUpdate() }
						}).catch((error)=>{ console.error('ocrUploadFile error', error); _self.$set(item, 'status', 'upload-fail'); _self.$forceUpdate() })
					}
				})
            }).catch((error) => { console.error('onChooseFile error', error); });
		},
		// 点击了选择文件
		onTogglePlus() {
			// if (this.showMenu) return;
			this.showMenu = !this.showMenu
			uni.showActionSheet({ 
				itemList: [
					'选择相机拍照的图片',
					// '选择会话中的图片',
					'选择相册中的图片',
					'选择会话中的文档'
				], 
				success: (res) => {
					console.log('showActionSheet:', res)
					const { errMsg, tapIndex } = res
					if (errMsg == 'showActionSheet:ok') {
						const idxMap = {
							0: 0,
							1: 1,
							2: 2,
						}
						this.onMenuClick(idxMap[tapIndex])
					}
					this.showMenu = false
				},
				fail: () => {
					this.showMenu = false
				}
			})
		},
		onDelFile(index) {
			console.log('onDelFile index', index)
			this.fileList.splice(index, 1)
		},
		// 点击了发送按钮
		onSendClick() {
			if (this.fileList.length>0) {
				const i = this.fileList.findIndex((row)=>['uploading'].includes(row.status))
				if (i>-1) {
					this.showTips('图片/文件还在上传中...', 'warning')
					return
				}
				const index = this.fileList.findIndex((row)=>['analysis'].includes(row.status))
				if (index>-1) {
					this.showTips('图片/文件还在解析中...', 'warning')
					return
				}
				const idx = this.fileList.findIndex((row)=>['upload-fail','fail'].includes(row.status))
				if (idx>-1) {
					this.showTips('请删除上传失败/异常文件', 'warning')
					return
				}
			}
			if (!this.sendEnabled) return;
			this.doSend({
				msg: this.chatCentent,
				files: this.fileList,
			});
			setTimeout(()=>{
				this.chatCentent = '';
				this.fileList = [];
			}, 350)
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
					this.showLoading('正在删除...', true); uni.hideLoading(); let cleanCatIdx = -1;
					for (let i = 0; i < this.dataList.length; i++) {
						const idx = this.dataList[i].datas.findIndex((x) => x.id === this.longPressHisChatItem.id);
						if (idx !== -1) { this.dataList[i].datas.splice(idx, 1); if (this.dataList[i].datas.length === 0) {cleanCatIdx = i; break;} }
					}
					if (cleanCatIdx !== -1) this.dataList.splice(cleanCatIdx, 1);
					this.newChat(false, false, this.currentSelectedHis != null && this.currentSelectedHis.id === this.longPressHisChatItem.id);
				}, () => { this.longPressHisChatItem = null }
			);
		},

		/**
		 * 删除所有会话
		 */
		delAllHis() {
			if (this.isDenyPrivacy) {
				this.showConfirm('您拒绝了微信隐私保护指引，是否重新同意隐私保护？', () => { this.showPrivacy = true; });
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

			this.currentConversationTaskId = guid();
			const dt = {
				command: 1,
				taskId: this.currentConversationTaskId,
				data: {
					userTag: this.$store.getters.userId,
					conversationId: this.currentConversationId,
					query: customData.content
				}
			};
			console.log('发送消息提问命令', dt);
			store.commit('sendSocketMessage', JSON.stringify(dt));
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
				id: guid(),
				role: 'user',
				content: customData.content,
				sendAttachment: customData.chatImage,
				isPlayingVoice: false,
				isContentComplete: false,
				isGenChat: false
			});
			this.sendTextOrVoiceChatLogId = guid();
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
					if (resp.code == 200) {
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
				store.commit('sendSocketMessage', JSON.stringify(dt));
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
				let idx = this.dataList.findIndex((x) => x.id === item.id && x.role === 'assistant');
				this.dataList.splice(idx - 1, 1);
				idx = this.dataList.findIndex((x) => x.id === item.id && x.role === 'assistant');
				this.dataList.splice(idx, 1);
				this.$refs.refChatList.hideShowBotNew();
				uni.hideLoading()
			});
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
		@include background-image('imgs/report-bg.png');
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
	
	.chat-input-bar {
		// display: flex;
		// flex-direction: row;
		// align-items: center;
		border-top: solid 1px #f5f5f5;
		background-color: #f8f8f8;		
		padding: 20rpx;
		/* box-shadow: 0 4rpx 15rpx rgba(0, 0, 0, 0.15); */
		position: relative;
		.fileWarp{
			display: flex;
			align-items: center;
			gap: 24rpx;
		}
		.chat-input-container {
			flex: 1;
			/* #ifndef APP-NVUE */
			display: flex;
			/* #endif */
			padding: 15rpx;
			background-color: white;
			border-radius: 10rpx;
			.chat-input {
				flex: 1;
				font-size: 28rpx;
			}
		}
		.chat-input-history{
			z-index: 99999;
			position: absolute;
			left: 40rpx;
			bottom: 40rpx;
		}

		.chat-input-plus{
			z-index: 99999;
			position: absolute;
			right: 100rpx;
			bottom: 40rpx;
			
			&.rotate-45 {
				transform: rotate(45deg);
				/* 如果需要调整旋转中心点 */
				transform-origin: center center;
			}
		}
		.chat-input-send {
			z-index: 99999;
			position: absolute;
			right: 40rpx;
			bottom: 40rpx;
			/* background-color: #007AFF; */
			/* margin: 10rpx 10rpx 10rpx 20rpx; */
			/* border-radius: 10rpx; */
			width: 45rpx;
			height: 45rpx;
			/* #ifndef APP-NVUE */
			display: flex;
			/* #endif */
			justify-content: center;
			align-items: center;
			&.chat-input-send-disabled {
				/* background-color: #bbbbbb; */
			}
			.chat-input-send-text {
				color: white;
				font-size: 26rpx;
			}
		}
	}
	.menuBox{
		padding: 0 24rpx 32rpx;
		@include x-padding-bottom('36rpx');
	}
	.grid-text{
		font-size: 24rpx;
		color: #5e6d82;
	}
</style>
