<template>
  <view class="voice-recorder-page">
    <!-- 标题 -->
    <view class="page-header">
      <text class="title">语音转文字</text>
      <text class="subtitle">长按录音，松开发送</text>
    </view>
    
    <!-- 录音按钮 -->
    <view
      class="record-button-container"
      :class="{ 'recording': isRecording }"
      @touchstart="handleTouchStart"
      @touchend="handleTouchEnd"
      @touchcancel="handleTouchCancel"
      @longpress="startRecording"
    >
      <view class="record-button">
        <text class="button-icon">{{ isRecording ? '●' : '🎤' }}</text>
        <text class="button-text">{{ isRecording ? '松开发送' : '长按录音' }}</text>
      </view>
    </view>
    
    <!-- 录音效果组件 -->
    <RecordingEffect
      :visible="showEffect"
      :is-recording="isRecording"
      :status-text="effectStatusText"
      :countdown="recordingCountdown"
      :show-countdown="true"
      :duration="recordingDuration"
      :volume="currentVolume"
      :is-cancel-active="isCancelActive"
      :cancel-text="cancelHintText"
      @cancel-start="onCancelStart"
      @cancel-end="onCancelEnd"
      ref="recordingEffect"
    />
    
    <!-- 识别结果 -->
    <view v-if="recognizedText" class="recognition-result">
      <view class="result-header">
        <text class="result-title">识别结果</text>
        <button class="clear-btn" @tap="clearResult">清空</button>
      </view>
      <view class="result-content">
        <text class="result-text">{{ recognizedText }}</text>
      </view>
      <view class="result-actions">
        <button class="action-btn copy-btn" @tap="copyText">复制文本</button>
        <button class="action-btn share-btn" @tap="shareText">分享</button>
      </view>
    </view>
    
    <!-- 使用说明 -->
    <view class="usage-tips">
      <view class="tip-item">
        <text class="tip-icon">🎯</text>
        <text class="tip-text">长按按钮开始录音</text>
      </view>
      <view class="tip-item">
        <text class="tip-icon">📊</text>
        <text class="tip-text">波形随音量实时变化</text>
      </view>
      <view class="tip-item">
        <text class="tip-icon">⬆️</text>
        <text class="tip-text">上滑到红色区域取消</text>
      </view>
      <view class="tip-item">
        <text class="tip-icon">💬</text>
        <text class="tip-text">松开自动转为文字</text>
      </view>
    </view>
  </view>
</template>

<script>
import RecordingEffect from '@/components/RecordingEffect.vue'

export default {
  components: {
    RecordingEffect
  },
  
  data() {
    return {
      // 录音状态
      isRecording: false,
      showEffect: false,
      isCancelActive: false,
      
      // 录音计时
      recordingCountdown: 60,
      recordingDuration: 0,
      recordingTimer: null,
      
      // 效果文本
      effectStatusText: '正在录音...',
      cancelHintText: '上滑取消发送',
      
      // 音量模拟
      currentVolume: 50,
      volumeTimer: null,
      
      // 识别结果
      recognizedText: '',
      
      // 录音管理器
      recorderManager: null,
      audioFilePath: '',
      
      // 触摸计时
      touchStartTime: 0,
      isLongPressTriggered: false
    }
  },
  
  mounted() {
    this.initRecorder()
  },
  
  beforeDestroy() {
    this.clearTimers()
  },
  
  methods: {
    // 初始化录音管理器
    initRecorder() {
      this.recorderManager = uni.getRecorderManager()
      
      this.recorderManager.onStart(() => {
        console.log('录音开始')
        this.startRecordingEffects()
      })
      
      this.recorderManager.onStop((res) => {
        console.log('录音停止', res)
        this.audioFilePath = res.tempFilePath
        this.stopRecordingEffects()
        
        if (!this.isCancelActive && this.recordingDuration > 1) {
          this.processSpeechRecognition()
        }
      })
      
      this.recorderManager.onError((err) => {
        console.error('录音错误:', err)
        this.showError('录音失败，请重试')
        this.resetRecordingState()
      })
    },
    
    // 触摸开始
    async handleTouchStart() {
      if (this.isRecording) return
      
      this.touchStartTime = Date.now()
      this.isLongPressTriggered = false
      
      // 检查录音权限
      const hasPermission = await this.checkPermission()
      if (!hasPermission) return
    },
    
    // 长按触发录音
    startRecording() {
      if (this.isRecording || this.isLongPressTriggered) return
      
      this.isLongPressTriggered = true
      this.isRecording = true
      this.showEffect = true
      this.isCancelActive = false
      this.recordingCountdown = 60
      this.recordingDuration = 0
      this.effectStatusText = '正在录音...'
      this.cancelHintText = '上滑取消发送'
      
      // 开始倒计时
      this.startCountdown()
      
      // 开始录音
      this.recorderManager.start({
        duration: 60000,
        sampleRate: 16000,
        numberOfChannels: 1,
        encodeBitRate: 48000,
        format: 'mp3',
        audioSource: 'auto'
      })
    },
    
    // 触摸结束
    handleTouchEnd() {
      const pressDuration = Date.now() - this.touchStartTime
      
      // 长按触发录音
      if (!this.isRecording && pressDuration > 500 && !this.isLongPressTriggered) {
        this.startRecording()
        return
      }
      
      // 短按提示
      if (!this.isRecording && pressDuration < 500) {
        this.showToast('请长按录音')
        return
      }
      
      // 停止录音
      if (this.isRecording) {
        this.recorderManager.stop()
      }
    },
    
    // 触摸取消
    handleTouchCancel() {
      if (this.isRecording) {
        this.recorderManager.stop()
      }
    },
    
    // 开始录音效果
    startRecordingEffects() {
      // 开始音量模拟
      this.startVolumeSimulation()
      
      // 重置波形效果
      if (this.$refs.recordingEffect) {
        this.$refs.recordingEffect.resetWave()
      }
    },
    
    // 停止录音效果
    stopRecordingEffects() {
      this.clearTimers()
      this.resetRecordingState()
    },
    
    // 开始音量模拟
    startVolumeSimulation() {
      this.clearTimers()
      
      this.volumeTimer = setInterval(() => {
        if (!this.isRecording) return
        
        // 模拟真实录音时的音量变化
        const baseVolume = 50
        const randomChange = (Math.random() - 0.5) * 40
        const timeFactor = Math.sin(Date.now() / 2000) * 20
        
        this.currentVolume = Math.max(20, Math.min(90, baseVolume + randomChange + timeFactor))
      }, 300)
    },
    
    // 开始倒计时
    startCountdown() {
      this.recordingTimer = setInterval(() => {
        if (!this.isRecording) return
        
        this.recordingCountdown--
        this.recordingDuration++
        
        // 最后10秒提示
        if (this.recordingCountdown <= 10) {
          this.effectStatusText = `剩余${this.recordingCountdown}秒`
        }
        
        // 时间到自动停止
        if (this.recordingCountdown <= 0) {
          this.recorderManager.stop()
        }
      }, 1000)
    },
    
    // 取消区域开始
    onCancelStart() {
      this.isCancelActive = true
      this.cancelHintText = '松开手指取消'
      this.effectStatusText = '准备取消...'
    },
    
    // 取消区域结束
    onCancelEnd() {
      if (this.isCancelActive) {
        this.isCancelActive = false
        this.recorderManager.stop()
        this.showToast('已取消发送')
      }
    },
    
    // 处理语音识别
    async processSpeechRecognition() {
      this.showLoading('识别中...')
      
      try {
        // 模拟识别过程
        await this.simulateRecognition()
        
        // 这里可以替换为真实的语音识别API调用
        // const text = await this.callSpeechAPI(this.audioFilePath)
        
        this.showToast('识别成功')
        
        // 触发识别完成事件
        this.$emit('recognition-complete', {
          text: this.recognizedText,
          audioPath: this.audioFilePath,
          duration: this.recordingDuration
        })
        
      } catch (error) {
        console.error('语音识别失败:', error)
        this.showError('识别失败，请重试')
      } finally {
        uni.hideLoading()
      }
    },
    
    // 模拟语音识别
    simulateRecognition() {
      return new Promise(resolve => {
        setTimeout(() => {
          const sampleTexts = [
            '今天天气真不错，适合出门散步',
            '请帮我记录下午三点开会',
            '人工智能正在改变我们的生活',
            '这个产品的用户体验很好',
            '语音识别技术越来越精准了',
            '明天记得带雨伞，可能有雨',
            '我想订一个明天晚上的餐厅',
            '这个想法很有创意，值得尝试'
          ]
          
          const randomIndex = Math.floor(Math.random() * sampleTexts.length)
          this.recognizedText = sampleTexts[randomIndex]
          resolve()
        }, 2000)
      })
    },
    
    // 检查录音权限
    async checkPermission() {
      try {
        const res = await uni.getSetting()
        if (!res.authSetting['scope.record']) {
          const authRes = await uni.authorize({
            scope: 'scope.record'
          })
          return true
        }
        return true
      } catch (error) {
        this.showError('需要录音权限才能使用此功能')
        return false
      }
    },
    
    // 清空结果
    clearResult() {
      this.recognizedText = ''
      this.showToast('已清空')
    },
    
    // 复制文本
    copyText() {
      uni.setClipboardData({
        data: this.recognizedText,
        success: () => {
          this.showToast('已复制到剪贴板')
        }
      })
    },
    
    // 分享文本
    shareText() {
      uni.share({
        provider: 'weixin',
        type: 0,
        title: '语音识别结果',
        summary: this.recognizedText,
        success: () => {
          this.showToast('分享成功')
        }
      })
    },
    
    // 清除所有计时器
    clearTimers() {
      if (this.recordingTimer) {
        clearInterval(this.recordingTimer)
        this.recordingTimer = null
      }
      
      if (this.volumeTimer) {
        clearInterval(this.volumeTimer)
        this.volumeTimer = null
      }
    },
    
    // 重置录音状态
    resetRecordingState() {
      this.isRecording = false
      this.showEffect = false
      this.isCancelActive = false
      this.currentVolume = 50
      this.effectStatusText = '正在录音...'
      this.cancelHintText = '上滑取消发送'
      this.clearTimers()
    },
    
    // 显示加载
    showLoading(title = '加载中') {
      uni.showLoading({
        title,
        mask: true
      })
    },
    
    // 显示提示
    showToast(title) {
      uni.showToast({
        title,
        icon: 'none',
        duration: 2000
      })
    },
    
    // 显示错误
    showError(message) {
      uni.showToast({
        title: message,
        icon: 'error',
        duration: 2000
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.voice-recorder-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 40rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.page-header {
  text-align: center;
  margin-bottom: 80rpx;
}

.title {
  display: block;
  font-size: 52rpx;
  color: white;
  font-weight: bold;
  margin-bottom: 20rpx;
}

.subtitle {
  display: block;
  font-size: 30rpx;
  color: rgba(255, 255, 255, 0.9);
}

/* 录音按钮容器 */
.record-button-container {
  margin-bottom: 60rpx;
  transition: transform 0.3s ease;
  
  &.recording {
    transform: scale(1.05);
  }
}

.record-button {
  width: 280rpx;
  height: 280rpx;
  background: linear-gradient(135deg, #4CAF50, #2E7D32);
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-shadow: 0 20rpx 50rpx rgba(76, 175, 80, 0.4);
  transition: all 0.3s ease;
  
  .recording & {
    background: linear-gradient(135deg, #FF4444, #C62828);
    box-shadow: 0 20rpx 50rpx rgba(255, 68, 68, 0.4);
    animation: button-pulse 1.5s infinite;
  }
  
  &:active {
    transform: scale(0.95);
  }
}

@keyframes button-pulse {
  0%, 100% {
    box-shadow: 0 20rpx 50rpx rgba(255, 68, 68, 0.4);
  }
  50% {
    box-shadow: 0 25rpx 60rpx rgba(255, 68, 68, 0.6);
  }
}

.button-icon {
  font-size: 90rpx;
  color: white;
  margin-bottom: 25rpx;
}

.button-text {
  font-size: 36rpx;
  color: white;
  font-weight: 500;
}

/* 识别结果区域 */
.recognition-result {
  width: 100%;
  max-width: 700rpx;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 30rpx;
  padding: 40rpx;
  margin-top: 40rpx;
  box-shadow: 0 10rpx 40rpx rgba(0, 0, 0, 0.15);
  animation: fade-in 0.5s ease;
}

@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(30rpx);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30rpx;
}

.result-title {
  font-size: 36rpx;
  color: #333;
  font-weight: 600;
}

.clear-btn {
  background: #FF4444;
  color: white;
  border: none;
  border-radius: 10rpx;
  padding: 15rpx 30rpx;
  font-size: 26rpx;
  
  &:active {
    background: #D32F2F;
  }
}

.result-content {
  background: #f8f9fa;
  border-radius: 20rpx;
  padding: 35rpx;
  margin-bottom: 30rpx;
}

.result-text {
  font-size: 34rpx;
  color: #333;
  line-height: 1.6;
}

.result-actions {
  display: flex;
  gap: 30rpx;
}

.action-btn {
  flex: 1;
  border: none;
  border-radius: 15rpx;
  padding: 25rpx;
  font-size: 30rpx;
  font-weight: 500;
  transition: all 0.3s ease;
  
  &.copy-btn {
    background: #667eea;
    color: white;
    
    &:active {
      background: #5a6fd8;
    }
  }
  
  &.share-btn {
    background: #4CAF50;
    color: white;
    
    &:active {
      background: #43A047;
    }
  }
}

/* 使用说明 */
.usage-tips {
  margin-top: 60rpx;
  width: 100%;
  max-width: 700rpx;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 25rpx;
  padding: 40rpx;
  backdrop-filter: blur(20rpx);
}

.tip-item {
  display: flex;
  align-items: center;
  padding: 25rpx 0;
  border-bottom: 1rpx solid rgba(255, 255, 255, 0.1);
  
  &:last-child {
    border-bottom: none;
  }
}

.tip-icon {
  font-size: 40rpx;
  margin-right: 25rpx;
  width: 60rpx;
  text-align: center;
}

.tip-text {
  font-size: 30rpx;
  color: white;
  flex: 1;
}
</style>