<template>
  <view>
    <!-- 其他内容 -->
    
    <!-- 录音按钮 -->
    <button @touchstart="startRecord">按住说话</button>
    
    <!-- 录音效果组件 -->
    <ut-recording-effect
      ref="recordingEffect"
      :visible="showEffect"
      :is-recording="isRecording"
      :status-text="'正在录音...'"
      @cancel-start="handleCancelStart"
      @cancel-end="handleCancelEnd"
    />
  </view>
</template>

<script>
export default {
  data() {
    return {
      showEffect: false,
      isRecording: false
    }
  },
  
  methods: {
    // 开始录音
    startRecord() {
      this.showEffect = true
      this.isRecording = true
      
      // 开始录音逻辑...
    },
    
    // 取消开始
    handleCancelStart() {
      console.log('用户进入取消区域')
    },
    
    // 取消结束
    handleCancelEnd() {
      console.log('用户离开取消区域')
      this.isRecording = false
      this.showEffect = false
    }
  }
}
</script>