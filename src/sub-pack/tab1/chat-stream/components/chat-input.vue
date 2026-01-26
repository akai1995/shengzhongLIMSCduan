<template>
	<view class="write chat-input-bar-container" :class="{ speak: showVoice }" @touchmove.stop.prevent>
		<view class="lWrite chat-input-bar">
			<u-scroll-list :indicator="false" v-if="fileList.length>0">
				<view class="fileBox">
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
			<view class="chat-input-history" @click="onLogShow()"><u-icon :name="`${$staticPath}imgs/icon-history.png`" size="45rpx" /></view>
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
</template>

<script>
import { ocrUploadFile, parseDoc } from '@/app/api/common'
import { onChooseFile } from '@/providers/upload'
import AppConfig from '@/app/app.constant'
import { guid } from '@/providers/index'
import store from '@/store/index'
import Recorder from 'recorder-core';
//引入相应格式支持文件；如果需要多个格式支持，把这些格式的编码引擎js文件放到后面统统引入进来即可
import 'recorder-core/src/engine/wav';
export default {
	name: 'chat-input',
	props: {
		disabled: {
			type: Boolean,
			default: false
		},
		isGenChat: {
			type: Boolean,
			default: false
		},
	},
	data() {
		return {

			/**
			 * 是否显示语音输入
			 */
			showVoice: true,
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
				loading: '上传中...',
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
					icon: `${constant.staticPath}imgs/icon-camera.png`,
					name: '拍照', type: 'camera'
				},
				{
					icon: `${constant.staticPath}imgs/icon-album.png`,
					name: '相册', type: 'album'
				},
				{
					icon: `${constant.staticPath}imgs/icon-file.png`,
					name: '本地文件', type: 'file'
				},
				{
					icon: `${constant.staticPath}imgs/icon-file.png`,
					name: '会话图片', type: 'message-image'
				},
				{
					icon: `${constant.staticPath}imgs/icon-file.png`,
					name: '会话文档', type: 'message-file'
				},
				// { icon: ``, name: '', type: '' }
			],
			chatCentent: '',
			focus: false,
		};
	},
	computed: {
		sendEnabled() {
			return !this.disabled && this.chatCentent.length;
		}
	},
	methods: {
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
		onLogShow() {
			this.$emit('show-log');
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
					if (item.status == 'waiting') _self.$set(item, 'status', 'loading');
					if (item.status == 'loading') {
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
					this.$emit('send-fail', '图片/文件还在上传中...')
					return
				}
				const index = this.fileList.findIndex((row)=>['analysis'].includes(row.status))
				if (index>-1) {
					this.$emit('send-fail', '图片/文件还在解析中...')
					return
				}
				const idx = this.fileList.findIndex((row)=>['upload-fail','fail'].includes(row.status))
				if (idx>-1) {
					this.$emit('send-fail', '请删除上传失败/异常文件')
					return
				}
			}
			if (!this.sendEnabled) return;
			this.$emit('send', {
				centent: this.chatCentent,
				files: this.fileList,
			});
			setTimeout(()=>{
				this.chatCentent = '';
				this.fileList = [];
			}, 350)
		}
	}
}
</script>
<style lang="scss" scoped>
	.chat-input-bar {
		// display: flex;
		// flex-direction: row;
		// align-items: center;
		border-top: solid 1px #f5f5f5;
		background-color: #f8f8f8;		
		padding: 20rpx;
		/* box-shadow: 0 4rpx 15rpx rgba(0, 0, 0, 0.15); */
		position: relative;
		.fileBox{
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