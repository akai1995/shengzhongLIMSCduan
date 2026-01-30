import { ocrUploadFile, parseDoc } from '@/app/api/index'
import { md, initMd } from '@/providers/utilities/chat'
import { onChooseFile } from '@/providers/upload'
import StoreConfigs from '@/app/app.store.config'
import AppConfig from '@/app/app.constant'
import { guid } from '@/providers/index'
import store from '@/store/index'

/** 先引入Recorder （ 需先 npm install recorder-core ）**/
import Recorder from 'recorder-core'

Recorder.DefaultDataType="arraybuffer"

// #ifdef H5 || MP-WEIXIN
//按需引入需要的录音格式编码器，用不到的不需要引入，减少程序体积；H5、renderjs中可以把编码器放到static文件夹里面用动态创建script来引入，免得这些文件太大
import 'recorder-core/src/engine/mp3.js'
import 'recorder-core/src/engine/mp3-engine.js'
import 'recorder-core/src/engine/wav.js'
import 'recorder-core/src/engine/pcm.js'
import 'recorder-core/src/engine/g711x'
// #endif

/** 引入RecordApp **/
import RecordApp from 'recorder-core/src/app-support/app.js'
//【所有平台必须引入】uni-app支持文件
import '@/uni_modules/Recorder-UniCore/app-uni-support.js'

var disableOgg=false
// #ifdef MP-WEIXIN
// 可选引入微信小程序支持文件
import 'recorder-core/src/app-support/app-miniProgram-wx-support.js'
disableOgg=true //小程序不测试ogg js文件太大
// #endif

// #ifdef H5 || MP-WEIXIN
// H5、renderjs中可以把编码器放到static文件夹里面用动态创建script来引入，免得这些文件太大
import 'recorder-core/src/engine/beta-amr'
import 'recorder-core/src/engine/beta-amr-engine'
// #endif

RecordApp.UniNativeUtsPlugin={nativePlugin:true}; //目前仅支持原生插件，uts插件不可用

export default {
    filters: { toFixdNum (value, num) { if (+value) { return +(+value.toFixed(num)) } return 0; } },
    data() {
        return {
            /* 控制器 */ ctrl: null,
            /* 是否需要刷新历史聊天 */ needRefreshHisChat: false,
            /* 是否长按删除显示mask */ showLongDel: false,

            /* 删除元素距离顶部的位置 */ delItemTop: 0,
            /* v-model绑定的这个变量不要在分页请求结束中自己赋值！！！ */ dataList: [],
            /* 聊天内容 */ chatContent: '', chatImageUrl: '', chatImageName: '', chatImageSize: '', chatFileUrl: '',

            /* 是否在生成结果 */ isGenChat: false,
            /* 用户发送的提问信息 */ askMsg: '',
            /* 是否在回答中，回答中不允许用户发言，避免数据错乱 */ isAnswering: false,
            /* 是否显示某个对话的聊天记录 */ showChatList: false,
            /* 是否显示查询聊天记录的loading */ showQueryHisLoading: false,
            /* 触摸开始位置 */ startY: 0,
            /* 滚动到聊天历史的Id */ scrollToChatHisId: '',
            /* 当前选中的聊天 */ currentSelectedHis: { id: '', conversationId: '', lastMsg: '' },
            /* 使用markdown的引用 */ useMarkdown: null, isDenyPrivacy: false, showPrivacy: false, privacyTitle: '微信隐私保护指引',		

            /* 长按聊天记录的项目 */ longPressHisChatItem: null, showVoiceRecord: false, cancelRecording: false,
            /* 是否显示语音输入 */ showVoice: false,
            // #ifndef MP-WEIXIN
            /* 音频元素 */ voice: document.getElementById('agentAudioVoice'),
            // #endif

            /* 音频上下文 */ audioContext: uni.createInnerAudioContext(),
            /* Recorder 实例 */ rec: null, wave: null,
            /* 是否检测到声音 true: 是 false:否 */ isVoiceDetected: false,
            /* 是否正在录音 true: 是 false:否 */ isHoldRecording: false,
            /* 用于存储录音数据 */ audioChunks: [],
            /* 当前音频对象 */ currentVoiceItem: null,

            /* 是否在请求语音转换 */ isRequestVoice: false,

            /* 发送聊天的类型 */ chatType: 'text', useAEC:false, useANotifySrv:true, appUseH5Rec:false, showUpload:false, reqOkCall: null,

            recwaveChoiceKey: 'WaveView', recpowerx: 0, recpowert: '', pageDeep: 0, pageNewPath: 'main_recTest', disableOgg: disableOgg, evalExecCode: '',
            recStart_setSpeaker: false, recStart_speakerOff: false, recStart_speakerHds: true, testNP_PcmPlayerShow: false,
            testMsgs:[], reclogs:[], reclogLast:'',

            audioQueue: [], /* 音频队列 */
            bufferThreshold: 1, /* 设置缓冲阈值，比如 2 个音频片段 */
            isPlayingAudioQueue: false,

            outputBuffer: '', /* 用于临时存储接收到的字符串 */
            outputBufferAll: '', /* 用于临时存储接收到的所有字符串 */
            isProcessingSSEData: false, /* 标记是否正在处理缓冲区 */
            outputSpeed: 30, /* 逐字输出速度 */
            isClickSpeak: false, sendTextOrVoiceChatLogId: '', realTimeSendTryTime: 0, realTimeSendTryEncBusy: 0,
            realTimeSendTryNumber: 0, transferUploadNumberMax: 0, realTimeSendTryChunk: null, realTimeAudioRequiredId: '',
            
            isOpenPermission: false,
        }
    },
    mounted() {
        const _self = this
        console.log('Recorder.SampleData', Recorder.SampleData);
        setTimeout(() => {
            _self.useMarkdown = initMd(md);
            /* 可选，立即显示出环境信息 */
            console.log('%c 正在执行Install，请勿操作...', 'color: #3c9cff; padding:5px 0; border-radius: 5px;');
            RecordApp.Install(()=>{
                console.log('Install成功，环境：' + _self.currentKeyTag(), 2);				
                uni.showLoading({ title:'初始化...', mask: true })
                /* 获取录音权限 */
                _self.openPermission(
                    () => {
                        console.log('%c openPermission success', 'color: #ff0;');
                        uni.hideLoading(); _self.isOpenPermission = true;
                    },
                    () => {
                        console.log('%c openPermission fail', 'color: #f00;');
                        uni.hideLoading(); _self.isOpenPermission = false;
                    }
                )
            },(err)=>{
                console.log('%c RecordApp.Install出错：'+err,1, 'color: #3c9cff; padding:5px 0; border-radius: 5px;');
            });
        }, 250);
    },
    destroyed() {
        RecordApp.Stop(); //清理资源，如果打开了录音没有关闭，这里将会进行关闭
    },
    methods: {
		currentKeyTag(){
			if(!RecordApp.Current) return '[?]';
			return RecordApp.Current.Key;
		},
		onVoicePopupClose() {
			this.cancelRecording = true;
			this.isRecording = false;
			this.showVoiceRecord = false;
			RecordApp.Stop(); //清理资源，如果打开了录音没有关闭，这里将会进行关闭
			// this.stopRecording();
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
		 * 按住时移动
		 */
		moveRecording(event) {
			if (!this.showVoice) { return }
			console.log(event)
			const moveY = event.touches[0].clientY;
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
			if (!this.showVoice) { return }
			this.isRecording = false; this.showVoiceRecord = false;
			if (this.cancelRecording) {
				console.log('取消录音');
				this.stopRecording(); this.isHoldRecording = false;
				if (AppConfig.useRealTimeSend) this.realTimeSendTry([], 0, true); //最后一次发送
			} else {
				console.log('结束录音并发送');
				if (!AppConfig.useRealTimeSend) this.stopRecording();
				else {
					this.isHoldRecording = false;
					this.stopRecording(); //直接close掉即可，不需要获得最终的音频文件
					this.realTimeSendTry([], 0, true); //最后一次发送
				}
			}
		},

		/****************************************************
		 * 录音权限
		 * @param success
		 * *************************************************/
		openPermission(success, fail = null) {			
			if(this.appUseH5Rec){ /* 测试时指定使用h5录音 */
				RecordApp.UniNativeUtsPlugin=null;
			} else {
				RecordApp.UniNativeUtsPlugin = { nativePlugin: true }; /* 恢复原生插件配置值 */
				RecordApp.UniCheckNativeUtsPluginConfig(); /* 可以检查一下原生插件配置是否有效 */
				RecordApp.UniNativeUtsPlugin_JsCall = (data) => { /* 可以绑定原生插件的jsCall回调 */
					if (data.action=='onLog') { /* 显示原生插件日志信息 */
						console.log('[Native.onLog]['+data.tag+']'+data.message, data.isError?1:"#bbb", {noLog:1});
					}
				}
			}
			
			/* RecordApp.UniAppUseLicense='我已获得UniAppID=*****的商用授权'; */
			if(this.useAEC){ /* 这个是Start中的audioTrackSet配置，在h5（H5、App+renderjs）中必须提前配置，因为h5中RequestPermission会直接打开录音 */
				RecordApp.RequestPermission_H5OpenSet={ audioTrackSet:{ noiseSuppression:true,echoCancellation:true,autoGainControl:true } };
			}
			
			console.log('正在请求录音权限...');
			RecordApp.UniWebViewActivate(this); /* App环境下必须先切换成当前页面WebView */
			RecordApp.RequestPermission(()=>{
				console.log(' 已获得录音权限，可以开始录音了',2);
				this.realTimeSendTryTime = 0; success && success();
				if(this.reqOkCall) this.reqOkCall(); this.reqOkCall=null; /*留别的组件内调用的回调 */
				/* 开启录音权限 */
				if (this.$refs.recwave) {
					/* this.wave = Recorder.WaveView({ elem: this.recwave }); */
					this.wave = Recorder.WaveView({ compatibleCanvas: this.$refs.recwave.$refs.canvas, width: 360, height: 'auto', lineWidth: 1 });
				}
			},
			(msg, isUserNotAllow) => {
				if(isUserNotAllow) { /* 用户拒绝了录音权限 */ /* 这里你应当编写代码进行引导用户给录音权限，不同平台分别进行编写 */ }
				console.error(`权限请求失败: ${msg}`, `用户拒绝: ${isUserNotAllow}`);
				this.showTips('录音权限未开启，请开启录音权限后再试', 'error');					
				this.isRecording = false; this.showVoiceRecord = false;
				const addMsg = ' ' + (isUserNotAllow ? 'isUserNotAllow,' : '' ) + '请求录音权限失败：' + msg
				console.log(addMsg);
				fail && fail(addMsg);
			});
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

			this.realTimeSendTryTime = t1; let number = ++this.realTimeSendTryNumber;
			let pcm = []; let pcmSampleRate = 0;
			if (buffers.length > 0) {
				// 借用SampleData函数进行数据的连续处理，采样率转换是顺带的，得到新的pcm数据
				const chunk = Recorder.SampleData(
					buffers, bufferSampleRate,
					AppConfig.audioSampleRate,
					this.realTimeSendTryChunk, {
						frameType: isClose ? '' : AppConfig.audioType
					}
				);

				// 清理已处理完的缓冲数据，释放内存以支持长时间录音，最后完成录音时不能调用stop，因为数据已经被清掉了
				for (var i = this.realTimeSendTryChunk ? this.realTimeSendTryChunk.index : 0; i < chunk.index; i++) {
					buffers[i] = null;
				}

				// 此时的chunk.data就是原始的音频16位pcm数据（小端LE），直接保存即为16位pcm文件、加个wav头即为wav文件、丢给mp3编码器转一下码即为mp3文件
				this.realTimeSendTryChunk = chunk; pcm = chunk.data; pcmSampleRate = chunk.sampleRate;
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
                const blob = blobOrNull; const encTime = blob.encTime;
                
                // 获取文件系统管理器
                const fs = wx.getFileSystemManager();
                
                // 生成临时文件路径
                const tempFilePath = `${wx.env.USER_DATA_PATH}/temp_audio_${number}.mp3`;
                
                // 将 ArrayBuffer 写入临时文件
                const arrayBuffer = blob.arrayBuffer ? blob.arrayBuffer() : blob;
                
                if (arrayBuffer.then) {
                    // 如果是 Promise，等待完成
                    arrayBuffer.then(buffer => {
                        fs.writeFile({
                            filePath: tempFilePath,
                            data: buffer,
                            encoding: 'binary',
                            success: () => {
                                // 读取文件为 Base64
                                fs.readFile({
                                    filePath: tempFilePath,
                                    encoding: 'base64',
                                    success: (res) => {
                                        const base64 = res.data;
                                        
                                        const audioMessage = {
                                            command: 2,
                                            taskId: this.currentConversationTaskId,
                                            data: {
                                                requireId: this.realTimeAudioRequiredId,
                                                chunkIndex: number - 1,
                                                chunkData: base64,
                                                end: false
                                            }
                                        };
                                        this.audioChunks.push(base64);
                                        store.commit(StoreConfigs.vuex.userModule.mutations.sendSocketMessage, JSON.stringify(audioMessage));
                                        console.log('发送录音实时数据给服务器', audioMessage);
                                        
                                        // 删除临时文件
                                        fs.unlink({
                                            filePath: tempFilePath,
                                            success: () => console.log('临时文件删除成功'),
                                            fail: (err) => console.log('临时文件删除失败:', err)
                                        });
                                    },
                                    fail: (err) => {
                                        console.error('读取文件失败:', err);
                                    }
                                });
                            },
                            fail: (err) => {
                                console.error('写入文件失败:', err);
                            }
                        });
                    });
                } else {
                    // 直接处理 ArrayBuffer
                    fs.writeFile({
                        filePath: tempFilePath,
                        data: arrayBuffer,
                        encoding: 'binary',
                        success: () => {
                            fs.readFile({
                                filePath: tempFilePath,
                                encoding: 'base64',
                                success: (res) => {
                                    const base64 = res.data;
                                    
                                    const audioMessage = {
                                        command: 2,
                                        taskId: this.currentConversationTaskId,
                                        data: {
                                            requireId: this.realTimeAudioRequiredId,
                                            chunkIndex: number - 1,
                                            chunkData: base64,
                                            end: false
                                        }
                                    };
                                    this.audioChunks.push(base64);
                                    store.commit(StoreConfigs.vuex.userModule.mutations.sendSocketMessage, JSON.stringify(audioMessage));
                                    console.log('发送录音实时数据给服务器', audioMessage);
                                    
                                    // 删除临时文件
                                    fs.unlink({
                                        filePath: tempFilePath,
                                        success: () => console.log('临时文件删除成功'),
                                        fail: (err) => console.log('临时文件删除失败:', err)
                                    });
                                },
                                fail: (err) => {
                                    console.error('读取文件失败:', err);
                                }
                            });
                        },
                        fail: (err) => {
                            console.error('写入文件失败:', err);
                        }
                    });
                }

                // 日志部分保持不变
                const numberFail = number < this.transferUploadNumberMax ? '<span style="color:red">顺序错乱的数据，如果要求不高可以直接丢弃，或者调大SendInterval试试</span>' : '';
                const logMsg = 'No.' + (number < 100 ? ('000' + number).substr(-3) : '') + numberFail;
                console.log(blob, duration, blobRec, logMsg + '花' + ('___' + encTime).substr(-3) + 'ms');
            }

            if (isClose) {
                console.log('No.' + (number < 100 ? ('000' + number).substr(-3) : '') + ':已停止传输，发送状态:' + (this.cancelRecording || this.audioChunks.length === 0 ? '取消发送' : '发送'));

                if (this.cancelRecording || this.audioChunks.length === 0) return;

                this.audioQueue.splice(0);
                if (!this.prepareSendMsg({ content: '发送语音消息', chatImage: '' })) {
                    this.audioChunks = [];
                    return;
                }
                this.outputSpeed = 30;
                this.outputBuffer = '';
                this.outputBufferAll = '';
                
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
                store.commit(StoreConfigs.vuex.userModule.mutations.sendSocketMessage, JSON.stringify(dt));

                this.audioChunks = [];
            }
        },

		/****************************************************
		 * 开始
		 * *************************************************/
		startRecording(event=null) {
			if (!this.showVoice) { return }
			if (this.isGenChat) {
				this.showTips('正在生成结果中，请稍后再进行操作!', 'info');
				return;
			}
			if (this.isProcessingSSEData) {
				this.showTips('正在输出结果中，请稍后再进行操作!', 'info');
				return;
			}
			if (event) this.startY = event.touches[0].clientY;
			this.showVoiceRecord = true;
			this.isRecording = true;
			this.cancelRecording = false;
			console.log('开始录音');
			if (!this.isHoldRecording) {
				this.audioChunks = []; /* 清空录音数据 */
				this.isHoldRecording = true; let processTime;
				this.openPermission(() => {
					if (AppConfig.useRealTimeSend) { this.realTimeAudioRequiredId = `${Date.now()}-${Math.random().toString(32)}`; this.currentConversationTaskId = guid(); }
					RecordApp.UniWebViewActivate(this); // App环境下必须先切换成当前页面WebView
					RecordApp.Start({
						type: AppConfig.audioType, sampleRate: AppConfig.audioSampleRate, bitRate: AppConfig.audioBitRate,
						audioTrackSet: !this.useAEC ? null : { // 配置回声消除，H5、App、小程序均可用，但并不一定会生效；注意：H5、App+renderjs中需要在请求录音权限前进行相同配置RecordApp.RequestPermission_H5OpenSet后此配置才会生效
							noiseSuppression:true,echoCancellation:true,autoGainControl:true
						},
						setSpeakerOff: !this.recStart_setSpeaker ? null : { // 使用原生录音插件时，可以提供一个扬声器外放和听筒播放的切换默认配置
							off: this.recStart_speakerOff, headset: this.recStart_speakerHds
						},
						onProcess: (buffers, powerLevel, duration, sampleRate, newBufferIdx, asyncEnd) => {
							console.log('buffers', buffers);
							console.log('powerLevel', powerLevel);
							console.log('duration', duration);
							console.log('sampleRate', sampleRate);
							console.log('newBufferIdx', newBufferIdx);
							console.log('asyncEnd', asyncEnd);
							if (AppConfig.useRealTimeSend) { this.realTimeSendTry(buffers, sampleRate, false); }
							this.recpowerx=powerLevel; this.recpowert=this.formatTime(duration,1)+' / '+powerLevel; processTime=Date.now();
							
							// #ifdef H5 || MP-WEIXIN
							this.wave = this.waveStore && this.waveStore[this.recwaveChoiceKey];
							if (this.wave) { this.wave.input(buffers[buffers.length - 1], powerLevel, sampleRate); }
							// #endif
							/* 实时语音通话对讲，实时处理录音数据 */
							if (this.wsVoiceProcess) this.wsVoiceProcess(buffers, powerLevel, duration, sampleRate, newBufferIdx);
							
							/* 实时释放清理内存，用于支持长时间录音；在指定了有效的type时，编码器内部可能还会有其他缓冲，必须同时提供takeoffEncodeChunk才能清理内存，否则type需要提供unknown格式来阻止编码器内部缓冲，App的onProcess_renderjs中需要进行相同操作 */
							if (this.takeEcChunks) {
								if(this.clearBufferIdx>newBufferIdx){ this.clearBufferIdx=0 } /* 重新录音了就重置 */
								for(var i = this.clearBufferIdx || 0; i < newBufferIdx; i++) buffers[i] = null; this.clearBufferIdx = newBufferIdx;
							}
						},
						takeoffEncodeChunk:!this.takeoffEncodeChunkSet?null:(chunkBytes)=>{
							/* 全平台通用：实时接收到编码器编码出来的音频片段数据，chunkBytes是Uint8Array二进制数据，可以实时上传（发送）出去 */
							/* App中如果未配置RecordApp.UniWithoutAppRenderjs时，建议提供此回调，因为录音结束后会将整个录音文件从renderjs传回逻辑层，由于uni-app的逻辑层和renderjs层数据交互性能实在太拉跨了，大点的文件传输会比较慢，提供此回调后可避免Stop时产生超大数据回传 */
							takeEcCount++; takeEcSize+=chunkBytes.byteLength; this.takeoffEncodeChunkMsg="已接收到"+takeEcCount+"块，共"+takeEcSize+"字节"; this.takeEcChunks.push(chunkBytes);
							
							/* App中使用原生插件时，可方便的将数据实时保存到同一文件，第一帧时append:false新建文件，后面的append:true追加到文件 */
							/* RecordApp.UniNativeUtsPluginCallAsync("writeFile",{path:"xxx.mp3",append:回调次数!=1, dataBase64:RecordApp.UniBtoa(chunkBytes.buffer)}).then(...).catch(...) */
						},
						onProcess_renderjs:`function(buffers, powerLevel, duration, sampleRate, newBufferIdx, asyncEnd) {
							// App中在这里修改buffers才会改变生成的音频文件
							// App中是在renderjs中进行的可视化图形绘制，因此需要写在这里，this是renderjs模块的this（也可以用This变量）；如果代码比较复杂，请直接在renderjs的methods里面放个方法xxxFunc，这里直接使用this.xxxFunc(args)进行调用
							var wave=this.waveStore&&this.waveStore[this.recwaveChoiceKey];
							if(wave) wave.input(buffers[buffers.length-1],powerLevel,sampleRate);
							
							// 和onProcess中一样进行释放清理内存，用于支持长时间录音
							if(${this.takeEcChunks?1:0}) {
								if(this.clearBufferIdx>newBufferIdx){ this.clearBufferIdx=0 } //重新录音了就重置
								for(var i=this.clearBufferIdx||0;i<newBufferIdx;i++) buffers[i]=null;
								this.clearBufferIdx=newBufferIdx;
							}
						}`,
						takeoffEncodeChunk_renderjs:!this.takeoffEncodeChunkSet?null:`function(chunkBytes) {
							// App中这里可以做一些仅在renderjs中才生效的事情，不提供也行，this是renderjs模块的this（也可以用This变量）
						}`,
						start_renderjs:`function(){
							// App中可以放一个函数，在Start成功时renderjs中会先调用这里的代码，this是renderjs模块的this（也可以用This变量）
							// 放一些仅在renderjs中才生效的事情，比如初始化，不提供也行
						}`,
						stop_renderjs:`function(aBuf,duration,mime) {
							// App中可以放一个函数，在Stop成功时renderjs中会先调用这里的代码，this是renderjs模块的this（也可以用This变量）
							this.audioData=aBuf; //留着给Stop时进行转码成wav播放
						}`
					},
					()=>{
						console.log(this.currentKeyTag()+' 录制中：'+this.recType+' '+this.recSampleRate+' '+this.recBitRate+'kbps'+(this.takeoffEncodeChunkSet?' takeoffEncodeChunk':'')+(this.useAEC?' useAEC':'')+(this.appUseH5Rec?' appUseH5Rec':''),2);
						/* 【稳如老狗WDT】可选的，监控是否在正常录音有onProcess回调，如果长时间没有回调就代表录音不正常 */
						if(RecordApp.Current.CanProcess()){
							var wdt = this.watchDogTimer = setInterval(()=>{
								if (wdt!=this.watchDogTimer) { clearInterval(wdt); return } /*sync */
								if (Date.now()<this.wdtPauseT) return; /* 如果暂停录音了就不检测：puase时赋值this.wdtPauseT=Date.now()*2（永不监控），resume时赋值this.wdtPauseT=Date.now()+1000（1秒后再监控） */
								if (Date.now()-(processTime || startTime)>1500) { clearInterval(wdt); console.log(processTime?"录音被中断":"录音未能正常开始",1); /* ... 错误处理，关闭录音，提醒用户 */ }
							},1000);
						}else{
							console.log("当前环境不支持onProcess回调，不启用watchDogTimer","#aaa"); /* 目前都支持回调 */
						}
						var startTime=Date.now();
					},(msg)=>{
						console.log(this.currentKeyTag()+" 开始录音失败："+msg,1);
					})
				})
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
			RecordApp.Stop((aBuf,duration,mime)=>{
				var recSet=(RecordApp.GetCurrentRecOrNull()||{set:{type:this.recType}}).set;
				console.log("已录制["+mime+"]："+this.formatTime(duration,1)+" "+aBuf.byteLength+"字节 " +recSet.sampleRate+"hz "+recSet.bitRate+"kbps",2);
				
				//如果使用了takeoffEncodeChunk，Stop的aBuf长度是0，数据早已存到了takeEcChunks数组里面，直接合并成完整音频文件
				if(this.takeEcChunks){
					console.log("启用takeoffEncodeChunk后Stop返回的blob长度为0不提供音频数据");
					var len=0; for(var i=0;i<this.takeEcChunks.length;i++)len+=this.takeEcChunks[i].length;
					var chunkData=new Uint8Array(len);
					for(var i=0,idx=0;i<this.takeEcChunks.length;i++){
						var itm=this.takeEcChunks[i]; chunkData.set(itm,idx); idx+=itm.length;
					}
					aBuf=chunkData.buffer;
					console.log("takeoffEncodeChunk接收到的音频片段，已合并成一个音频文件 "+aBuf.byteLength+"字节");
				}
				
				console.log(`录音结束，时长：${duration}ms`);
				if (duration < AppConfig.minSpeechDurationThreshold) {
					console.log('录音时长过短，已取消发送');
					this.showTips('录音时长过短，已取消发送', 'warning');
					return;
				}

				/* 1. 存储录音数据 */
				this.audioChunks.push(aBuf);

				/* 2. 处理录音数据 */
				this.processAudioData();
			},(msg)=>{
				console.error('停止录音失败:', msg);
			})
		},

		/****************************************************
		 * 处理录音数据
		 *  1.合并录音数据
		 *  2.音频以16KB的大小进行分片传输
		 *  3.清理录音数据
		 * *************************************************/
		processAudioData() {
			if (this.audioChunks.length <= 0) return;

			/* 1. 合并录音数据 */
			const audioBlob = new Blob(this.audioChunks, { type: `audio/${AppConfig.audioType}` });

			/* 分片大小 */
			const CHUNK_SIZE = 16 * 1024;
			/* 分片序号 */
			let chunkIndex = 0;

			const requiredId = `${Date.now()}-${Math.random().toString(32)}`;
			this.currentConversationTaskId = guid();

			/* 2. 音频分片传输 */
			const sendChunk = (offset) => {
				if (offset < audioBlob.size) {
					const chunk = audioBlob.slice(offset, offset + CHUNK_SIZE);
					const reader = new FileReader();
					reader.onload = () => {
						const chunkData = reader.result;
						const audioMessage = {
							command: 2, taskId: this.currentConversationTaskId,
							data: {
								requireId: requiredId, chunkIndex: chunkIndex,
								chunkData: chunkData?.split(',')[1], /* 将 audio 数据转换为 base64 并去掉前缀 */
								end: false
							}
						};
						store.commit(StoreConfigs.vuex.userModule.mutations.sendSocketMessage, JSON.stringify(audioMessage));
						sendChunk(offset + CHUNK_SIZE);
						chunkIndex++;
					};
					reader.readAsDataURL(chunk);
				} else {
					/* 判断如果当前是显示着聊天记录的情况,判断如果上一条记录不是语音，新建会话 */
					let cvid = this.currentConversationId;
					if (this.showChatList) {
						const mdc = this.choices[this.choices.length - 1];
						if (mdc.chat_type !== 'voice') { this.choices.splice(0); cvid = ''; }
					}
					this.audioQueue.splice(0);
					if (!this.prepareSendMsg({ content: '发送语音消息', chatImage: '' })) {
						/* 清理录音数据 */
						this.audioChunks = []; /* 清空录音数据数组 */
						return;
					}
					this.outputSpeed = 30; this.outputBuffer = ''; this.outputBufferAll = '';
					/* 所有块发送完毕后发送结束消息 */
					const dt = {
						command: 2, taskId: this.currentConversationTaskId,
						data: {
							requireId: requiredId,
							userTag: this.$store.getters.userId,
							conversationId: cvid, end: true
						}
					};
					console.log('发送录音结束信号给服务器', dt);
					store.commit(StoreConfigs.vuex.userModule.mutations.sendSocketMessage, JSON.stringify(dt));

					/* 3. 清理录音数据 */
					this.audioChunks = []; /* 清空录音数据数组 */
				}
			};
			sendChunk(0);
		},
		appUseH5RecClick(){
			this.appUseH5Rec=!this.appUseH5Rec;
			RecordApp.Current=null;
			this.reclog('切换了appUseH5Rec='+this.appUseH5Rec+'，重新请求录音权限后生效',"#f60");
		},
		recwaveChoice(e){
			var key=e.target.dataset.key;
			if(key){
				if(key!=this.recwaveChoiceKey){
					this.reclog("已切换波形显示为："+key);
					if(key=="SurferView"){
						// #ifdef MP-WEIXIN
						this.reclog("注意：iOS上微信小程序基础库存在bug，canvas.drawImage(canvas)可能无法绘制，可能会导致WaveSurferView在iOS小程序上不能正确显示，其它可视化插件无此兼容性问题","#fa0");
						// #endif
					}
				}
				this.recwaveChoiceKey=key;
				//App中传送给renderjs里面，同样赋值
				if(RecordApp.UniIsApp()){
					RecordApp.UniWebViewVueCall(this,'this.recwaveChoiceKey="'+key+'"');
				}
			}
		},
		//注入60秒数据，方便测试
		recEnvIn60(){
			var rec=RecordApp.GetCurrentRecOrNull();
			if(!rec){
				this.reclog("未开始录音，无法注入",1);
				return;
			}
			if(RecordApp.UniIsApp()){
				//App中到renderjs里面里面注入
				RecordApp.UniWebViewVueCall(this,`
					var rec=RecordApp.GetCurrentRecOrNull();
					var sampleRate=rec.srcSampleRate,t1=Date.now();
					var canon=Recorder.NMN2PCM.GetExamples().Canon.get(sampleRate).pcm;
					var len=sampleRate*60,offset=0;
					while(offset<len){
						rec.envIn(canon.subarray(0,Math.min(canon.length,len-offset)),0);
						offset+=canon.length;
					}
					this.$ownerInstance.callMethod("reclog","已注入60秒Canon简谱生成的音乐，耗时"+(Date.now()-t1)+"ms");
				`);
				return;
			}
			var sampleRate=rec.srcSampleRate,t1=Date.now();
			var canon=Recorder.NMN2PCM.GetExamples().Canon.get(sampleRate).pcm;
			var len=sampleRate*60,offset=0;
			while(offset<len){
				rec.envIn(canon.subarray(0,Math.min(canon.length,len-offset)),0);
				offset+=canon.length;
			}
			this.reclog("已注入60秒Canon简谱生成的音乐，耗时"+(Date.now()-t1)+"ms");
		},
		formatTime(ms,showSS){
			var ss=ms%1000;ms=(ms-ss)/1000;
			var s=ms%60;ms=(ms-s)/60;
			var m=ms%60;ms=(ms-m)/60;
			var h=ms, v="";
			if(h>0) v+=(h<10?"0":"")+h+":";
			v+=(m<10?"0":"")+m+":";
			v+=(s<10?"0":"")+s;
			if(showSS)v+="″"+("00"+ss).substr(-3);;
			return v;
		},
		/**
		 * 切换语音输入
		 */
		onToggleVoice() {
			if (!this.checkUserInfo()) { return; }
			if (this.isGenChat) { this.showTips('正在生成结果中，请稍后再进行操作!', 'info'); return; }
			if (this.isProcessingSSEData) { this.showTips('正在输出结果中，请稍后再进行操作!', 'info'); return; }
			this.showUpload = false;
			if (!this.showVoice) {
				// const ws = store.getters.socket;
				// console.log('ws', ws);
				// if (ws == null || !ws.is_open_socket) {
				// 	this.showTips('底层音频链路还未准备好，请稍后再试', 'info');
				// 	return;
				// }
				if (this.isOpenPermission) {
					this.chatType = 'voice'; this.showVoice = true; console.log('open permission');
				} else {
					uni.showLoading({title:'初始化...',mask: true}); /* 获取录音权限 */
					this.openPermission(
						() => { uni.hideLoading(); this.chatType = 'voice'; this.showVoice = true; console.log('open permission'); },
						() => { uni.hideLoading(); this.showVoice = false; this.showTips('录音权限未开启，请开启录音权限后再试', 'error') }
					)
				}
			} else {
				this.stopRecording(); this.showVoice = false;
				this.chatType = this.chatImageUrl === '' ? 'text' : 'image';
			}
		},
		onMenuClick(idx) {
			const _self = this; const menu = _self.menuList[idx];
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
			console.log('menu', idx, menu);
            onChooseFile(fileParams).then((res) => {
				_self.fileList = _self.fileList == 0 ? res.map((row)=>({ ...row, status: 'waiting', uiid: guid() })) : [ ...res.map((row)=>({ ...row, status: 'waiting', uiid: guid() })), ..._self.fileList ];				
				// console.log('onChooseFile ocrUploadFile _self.fileList', _self.fileList);
				_self.fileList.forEach((item) => { 
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
			const _self = this
			if (!_self.checkUserInfo()) { return; }
			// if (_self.showMenu) return;
			_self.showMenu = true
			uni.showActionSheet({ 
				itemList: [
					'选择相机拍照的图片',
					/* '选择会话中的图片', */
					'选择相册中的图片',
					'选择会话中的文档'
				], 
				success: (res) => {
					console.log('showActionSheet:', res)
					const { errMsg, tapIndex } = res
					if (errMsg == 'showActionSheet:ok') {
						const idxMap = { 0: 0, 1: 1, 2: 2, }
						_self.onMenuClick(idxMap[tapIndex])
					}
				},
				fail: (_err) => { },
                complete: () => { _self.showMenu = false }
			})
		},
		onDelFile(index) {
			console.log('onDelFile index', index)
			this.fileList.splice(index, 1)
		},
		// 点击了发送按钮
		onSendClick() {
			const _self = this
			console.log('this.showVoice', _self.showVoice)
			/* 文字对话 */
			if (!_self.showVoice) {
				if (!_self.sendEnabled) {
					_self.onToggleVoice()
				} else {
					if (_self.fileList.length>0) {
						const i = _self.fileList.findIndex((row)=>['uploading'].includes(row.status))
						if (i>-1) { _self.showTips('图片/文件还在上传中...', 'warning'); return;	}
						const index = _self.fileList.findIndex((row)=>['analysis'].includes(row.status))
						if (index>-1) { _self.showTips('图片/文件还在解析中...', 'warning'); return;	}
						const idx = _self.fileList.findIndex((row)=>['upload-fail','fail'].includes(row.status))
						if (idx>-1) { _self.showTips('请删除上传失败/异常文件', 'warning'); return;	}
					}
					if (!_self.sendEnabled) return;
					_self.doSend({ msg: _self.chatCentent, files: _self.fileList, });
					setTimeout(()=>{ _self.chatCentent = ''; _self.fileList = []; }, 350)
				}
			} else { /* 语音对话 */
				_self.onToggleVoice()
				// if (!_self.sendEnabled) {
				// 	if (_self.fileList.length>0) {
				// 		const i = _self.fileList.findIndex((row)=>['uploading'].includes(row.status))
				// 		if (i>-1) { _self.showTips('图片/文件还在上传中...', 'warning'); return;	}
				// 		const index = _self.fileList.findIndex((row)=>['analysis'].includes(row.status))
				// 		if (index>-1) { _self.showTips('图片/文件还在解析中...', 'warning'); return;	}
				// 		const idx = _self.fileList.findIndex((row)=>['upload-fail','fail'].includes(row.status))
				// 		if (idx>-1) { _self.showTips('请删除上传失败/异常文件', 'warning'); return;	}
				// 	}
				// 	if (!_self.sendEnabled) return;
				// 	_self.doSend({ msg: _self.chatCentent, files: _self.fileList, });
				// 	setTimeout(()=>{ _self.chatCentent = ''; _self.fileList = []; }, 350)
				// } else {
				// 	_self.showVoice = !_self.showVoice
				// }
			}
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
			if (this.isGenChat) { this.showTips('正在生成结果中，请稍后再进行操作!', 'info'); return; }
			if (this.isProcessingSSEData) { this.showTips('正在输出结果中，请稍后再进行操作!', 'info'); return; }
			this.showConfirm(
				`是否确定删除此条聊天记录？`,
				() => {
					uni.showLoading('正在删除...', true); uni.hideLoading(); let cleanCatIdx = -1;
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
			if (this.isDenyPrivacy) { this.showConfirm('您拒绝了微信隐私保护指引，是否重新同意隐私保护？', () => { this.showPrivacy = true; }); return; }
			if (this.isGenChat) { this.showTips('正在生成结果中，请稍后再进行操作!', 'info'); return; }
			if (this.isProcessingSSEData) { this.showTips('正在输出结果中，请稍后再进行操作!', 'info'); return; }
			this.showConfirm(`是否确定删除所有会话记录？`, () => { uni.showLoading('正在删除...', true); uni.hideLoading(); this.dataList.splice(0); this.newChat(); });
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
				if (data.taskId !== this.currentConversationTaskId) { this.isRequestVoice = false; return; }
				switch (data.command) {
					case 1: //文字消息
						const dt = JSON.parse(data.data); console.log('收到文字消息', dt);
						if (dt.event === 'tts_message_end' || dt.event === 'message_end' || dt.event.indexOf('message_end') !== -1) { this.onSSEMessageClose(mdc); return; }
						this.onSSEMessage(dt, true);
						break;
				}
			}
		},
		denyPrivacy() {
			this.showPrivacy = false;
			this.privacyTitle = '微信隐私保护指引'
		},
		/**
		 * 底部发送聊天
		 */
		async onAgentChat() {
			if (this.isDenyPrivacy) { this.showConfirm('您拒绝了微信隐私保护指引，是否重新同意隐私保护？', () => { this.showPrivacy = true; }); return; }
			if (Ruler.empty(this.chatContent)) { this.showTips('请输入您的问题', 'error'); return; }
			if (this.isGenChat) { this.showTips('正在生成结果中，请稍后再进行操作!', 'info'); return; }
			if (this.isProcessingSSEData) { this.showTips('正在输出结果中，请稍后再进行操作!', 'info'); return; }
			if (this.isUploading) { this.showTips('正在上传图片...,请稍后', 'info'); return; }

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
			store.commit(StoreConfigs.vuex.userModule.mutations.sendSocketMessage, JSON.stringify(dt));
		},

		/**
		 * 收到消息
		 */
		onSSEMessage(dt, isWebSocket = false) {
			if (!this.isGenChat) return;
			// if (this.hubApp().appPlatform === 2) {
			// 	/* coze */
			// 	if (dt.message && (dt.message.type === 'answer' || dt.message.type === 'follow_up' || dt.message.type === 'verbose')) {
			// 		console.log(dt.message.content);
			// 		if (dt.conversation_id) this.currentConversationId = dt.conversation_id;
			// 		if (!isWebSocket && dt.task_id) this.currentConversationTaskId = dt.task_id;
			// 		if (this.dataList[this.dataList.length - 1].messageId === '') this.dataList[this.dataList.length - 1].messageId = dt.message_id;
			// 		if (dt.message.type == 'answer') {
			// 			this.outputBuffer += dt.message.content; this.outputBufferAll += dt.message.content;
			// 			if (!this.isProcessingSSEData) { this.processBuffer(true); }
			// 		}
			// 	}
			// }
			// if (this.hubApp().appPlatform === 1) {
			// 	/* Dify */
			// 	if (dt.answer) {
			// 		if (dt.conversation_id) this.currentConversationId = dt.conversation_id;
			// 		if (!isWebSocket && dt.task_id) this.currentConversationTaskId = dt.task_id;
			// 		if (this.dataList[this.dataList.length - 1].messageId === '') this.dataList[this.dataList.length - 1].messageId = dt.message_id;

			// 		this.outputBuffer += dt.answer; this.outputBufferAll += dt.answer;
			// 		if (!this.isProcessingSSEData) { this.processBuffer(true); }
			// 	}
			// }
			/* Deepseek */
			if (dt.answer) {
				if (dt.conversation_id) this.currentConversationId = dt.conversation_id;
				if (!isWebSocket && dt.task_id) this.currentConversationTaskId = dt.task_id;
				if (this.dataList[this.dataList.length - 1].messageId === '') this.dataList[this.dataList.length - 1].messageId = dt.message_id;

				this.outputBuffer += dt.answer; this.outputBufferAll += dt.answer;
				if (!this.isProcessingSSEData) { this.processBuffer(true); }
			}
			setTimeout(() => { this.$refs.refChatList.scrollBtn(); }, 300);
		},

		/**
		 * 消息完结
		 */
		onSSEMessageClose(mdc) {
			this.outputSpeed = 10;
			if (Ruler.empty(mdc.content)) {
				this.isGenChat = false; mdc.isGenChat = false;
				mdc.content = '<strong>抱歉，[AI] 异常 无法回答您的问题</strong>';
				mdc.isAbandon = true; mdc.isContentComplete = true;
			} else {
				this.releaseVoice();
				this.speakContent(mdc, false, this.outputBufferAll, false, true);
				this.renderChatLog();
			}
			this.chatType = 'text'; this.clearChatAttachAttr();
			// this.currentConversationTaskId = '';
			setTimeout(() => { this.$refs.refChatList.scrollBtn(); }, 500);
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
						setTimeout(() => { this.$refs.refChatList.scrollBtn(); }, 500);
					}
					// 使用 setTimeout 分批处理数据，防止页面卡死
					setTimeout(() => {
						processChunk(words, needUpdateReplyMsg);
					}, this.outputSpeed);
				} else {
					this.isProcessingSSEData = false; words = 0;
					this.phoneCallWaitingAnswerBack = false;
					setTimeout(() => {
						// 这里只有发送的是文字消息，回复渲染完成时才会执行
						if (needUpdateReplyMsg && this.$refs.refChatList) { this.updateFormatedChatLog('processBuffer'); }
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
					/* mdc.content = txtRef.$el.innerHTML; */
					/* mdc.isContentComplete = true; */
					/* this.sendTextOrVoiceChatLogId = ''; */
						
				} else console.log(`${tip}中更新聊天记录内容是发现id为前端构造id或内容已经更新过，忽略更新`);
			} else console.log(`${tip}中更新聊天记录内容是发现内容是终止了, mdc.id=${mdc.id}, this.sendTextOrVoiceChatLogId=${this.sendTextOrVoiceChatLogId}`);
		},

		/**
		 * 发送消息前准备工作
		 */
		prepareSendMsg(customData) {
			this.dataList.push({
				id: guid(), role: 'user', content: customData.content,
				sendAttachment: customData.chatImage,
				isPlayingVoice: false, isContentComplete: false, isGenChat: false
			});
			this.sendTextOrVoiceChatLogId = guid();
			this.dataList.push({
				id: this.sendTextOrVoiceChatLogId,
				role: 'assistant', content: '',
				renderContent: '', isAbandon: false, messageId: '',
				replyAttachment: '', chat_type: this.chatType,
				isPlayingVoice: false, isContentComplete: false,
				isGenChat: false
			});
			if (this.chatType !== 'voice') { this.chatContent = ''; this.clearChatAttachAttr(); }
			this.showUpload = false;

			this.showChatList = true; this.isGenChat = true;
			setTimeout(() => { this.$refs.refChatList.scrollBtn(); }, 300);

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
			this.isGenChat = false; this.outputBuffer = '';
			this.outputBufferAll = ''; this.outputSpeed = 30;
			if (this.chatType !== 'voice') {
				if (this.ctrl != null) this.ctrl.abort();
				this.chatType = 'text'; this.clearChatAttachAttr();
				if (this.currentConversationTaskId !== '') { this.endWebsocket(); }
			} else { /* 语音消息 */ this.endWebsocket(); }

			if (this.dataList.length === 0) return;
			const mdc = this.dataList[this.dataList.length - 1];
			mdc.isGenChat = false; mdc.isAbandon = true; mdc.isContentComplete = false;
			if (Ruler.empty(mdc.content)) { mdc.content = '<strong>您终止了请求...</strong>'; }
			else {mdc.content += '<br><strong>您终止了请求...</strong>';}
		},

		/**
		 * 终止websocket
		 */
		endWebsocket() {
			if (this.currentConversationTaskId !== '') {
				const dt = { command: -1, taskId: this.currentConversationTaskId };
				console.log('发送消息终止 命令', dt); this.currentConversationTaskId = '';
				store.commit(StoreConfigs.vuex.userModule.mutations.sendSocketMessage, JSON.stringify(dt));
			}
		},

		againDialog(item) {
			if (this.isGenChat) { this.showTip+s('正在生成结果中，请稍后再进行操作!', 'info'); return; }
			if (this.isProcessingSSEData) { this.showTips('正在输出结果中，请稍后再进行操作!', 'info'); return; }
			console.log(item, '重新生成对话');
			if (item.sendAttachment != null && item.sendAttachment !== '') { this.chatType = 'image'; this.chatImageUrl = item.sendAttachment; }
			// 操作终止了请求的记录，这个时候messageId是空
			if (Ruler.empty(item.sendMsg)) { const md = this.dataList[this.dataList.length - 2]; if (md == null) return; this.chatContent = md.content; }
			else { this.chatContent = item.sendMsg; } this.sendChat(this.chatContent);
		},

		againDialog(item) {
			if (this.isGenChat) { this.showTips('正在生成结果中，请稍后再进行操作!', 'info'); return; }
			if (this.isProcessingSSEData) { this.showTips('正在输出结果中，请稍后再进行操作!', 'info'); return; }
			console.log(item, '重新生成对话');
			if (item.sendAttachment != null && item.sendAttachment !== '') { this.chatType = 'image'; this.chatImageUrl = item.sendAttachment; }
			// 操作终止了请求的记录，这个时候messageId是空
			if (Ruler.empty(item.sendMsg)) { const md = this.dataList[this.dataList.length - 2]; if (md == null) return; this.chatContent = md.content; }
			else { this.chatContent = item.sendMsg; } this.doSend(this.chatContent);
		},

		/**
		 * 删除聊天记录
		 */
		delDialog(item) {
            if (!this.checkUserInfo()){ return }
			if (this.isGenChat) { this.showTips('正在生成结果中，请稍后再进行操作!', 'info'); return; }
			if (this.isProcessingSSEData) { this.showTips('正在输出结果中，请稍后再进行操作!', 'info'); return; }
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
				uni.showLoading('删除中...', true);
				let idx = this.dataList.findIndex((x) => x.id === item.id && x.role === 'assistant');
				this.dataList.splice(idx - 1, 1);
				idx = this.dataList.findIndex((x) => x.id === item.id && x.role === 'assistant');
				this.dataList.splice(idx, 1);
				this.$refs.refChatList.hideShowBotNew();
				uni.hideLoading()
			});
		},
		renderChatList(conversation) {
			conversation.chatLogs.forEach((m) => {
				let ct = 'text'; if (m.sendAttachment) { ct = 'image'; }
				this.dataList.push({ role: 'user', content: m.sendMsg, chat_type: ct, isPlayingVoice: false, isContentComplete: true, isGenChat: false, ...m });
				this.dataList.push({ role: 'assistant', content: m.replyMsg == null || m.replyMsg === '' ? '被终止的消息' : m.replyMsg, chat_type: ct, isAbandon: false, isPlayingVoice: false, isContentComplete: true, isGenChat: false, ...m });
			});
			setTimeout(() => { this.$refs.refChatList.scrollBtn(); }, 300);
		},
    },
}