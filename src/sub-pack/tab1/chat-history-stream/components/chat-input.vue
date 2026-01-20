<template>
	<view class="chat-input-bar-container" @touchmove.stop.prevent>
		<!-- @touchmove.stop.prevent用于阻止touchmove冒泡，避免键盘弹出后触摸底部输入框区域还可以往上滚动的问题 -->
		<view class="chat-input-bar">
			<view class="chat-input-container">
				<!-- :adjust-position="false"必须设置，防止键盘弹窗自动上顶，交由z-paging内部处理 -->
				 <!-- <view class="fileBox">
					<view class="fileItem" v-for="item in fileList" :class="{
							waiting: item.status=='waiting',
							loading: item.status=='loading',
							success: item.status=='success',
							fail: item.status=='fail',
						}"
					>
					    /* jpg jpeg png webp 图； dox docx xls xlsx pdf ppt pptx 类型图标 */
						<view class="fileIcon"><image :src="item.status=='success'?item.path:''" /></view>
						<view class="fileName">{{item.name}}</view>
						<view class="fileStatus">{{statusMap[item.status]||item.name}}</view>
					</view>
				 </view> -->
				<u--textarea border="none" :focus="focus" class="chat-input" v-model="chatCentent" :adjust-position="false" confirm-type="send" placeholder="请输入内容" @confirm="sendClick" />
			</view>
			<!-- 表情图标（如果不需要切换表情面板则不用写） -->
			<!-- <view class="emoji-container"><image class="emoji-img" :src="`${$staticPath}temp/${emojiType || 'emoji'}.png`" @click="emojiChange" /></view> -->
			<view class="chat-input-history" @click.stop="onLogShow()"><u-icon :name="`${$staticPath}temp/imgs/icon-history.png`" size="45rpx" /></view>
			<view class="chat-input-plus" :class="{ 'rotate-45': showMenu }" @click.stop="onPlus()"><u-icon :name="`${$staticPath}temp/imgs/icon-plus.png`" size="45rpx" /></view>
			<view :class="{'chat-input-send': true, 'chat-input-send-disabled': !sendEnabled }" @click.stop="sendClick"><u-icon :name="`${$staticPath}temp/imgs/icon-send${sendEnabled?'2':''}.png`" size="45rpx" /></view>
		</view>
		<view class="menuBox" v-if="showMenu">			
			<u-grid :border="false" :col="4" @click="onMenuClick">
				<u-grid-item v-for="(menu,idx) in menuList" :key="idx">
					<u-icon :customStyle="{paddingTop:20+'rpx'}" :name="menu.icon" :size="22" />
					<text class="grid-text">{{menu.name}}</text>
				</u-grid-item>
			</u-grid>
		</view>
		<!--  表情面板，这里使用height控制隐藏显示是为了有高度变化的动画效果（如果不需要切换表情面板则不用写） -->
		<view class="emoji-panel-container" :style="[{height: emojiType === 'keyboard' ? '400rpx' : '0px'}]">
			<scroll-view scroll-y style="height: 100%;flex: 1;">
				<view class="emoji-panel">
					<text class="emoji-panel-text" v-for="(item, index) in emojisArr" :key="index" @click="emojiClick(item)">
						{{item}}
					</text>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
import { chooseFile } from '@/providers/uploadUtils'
import constant from '@/app/app.constant'
export default {
	name: "ut-chat-input-bar",
	props: {
		disabled: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			statusMap: {
				waiting: '等待中...',
				loading: '上传中...',
				success: '',
				fail: '上传失败',
			},
			// jpg jpeg png webp dox docx xls xlsx pdf ppt pptx
			// name size type path
			flieList: [],
			showMenu: true,
			menuList: [
				{
					icon: `${constant.staticPath}temp/imgs/icon-camera.png`,
					name: '拍照', type: 'camera'
				},
				{
					icon: `${constant.staticPath}temp/imgs/icon-album.png`,
					name: '相册', type: 'album'
				},
				{
					icon: `${constant.staticPath}temp/imgs/icon-file.png`,
					name: '本地文件', type: 'file'
				}
			],
			chatCentent: '',
			
			// 表情数组（如果不需要切换表情面板则不用写）
			emojisArr: ['😊','😁','😀','😃','😣','😞','😩','😫','😲','😟','😦','😜','😳','😋','😥','😰','🤠','😎','😇','😉','😭','😈','😕','😏','😘','😤','😡','😅','😬','😺','😻','😽','😼','🙈','🙉','🙊','🔥','👍','👎','👌','✌️','🙏','💪','👻'],
			// 当前input focus（如果不需要切换表情面板则不用写）
			focus: false,
			// 当前表情/键盘点击后的切换类型，为空字符串代表展示表情logo但是不展示不展示表情面板（如果不需要切换表情面板则不用写）
			emojiType: '',
		};
	},
	computed: {
		sendEnabled() {
			return !this.disabled && this.chatCentent.length;
		}
	},
	methods: {
		// 更新了键盘高度（如果不需要切换表情面板则不用写）
		updateKeyboardHeightChange(res) {
			if (res.height > 0) {
				// 键盘展开，将emojiType设置为emoji
				this.emojiType = 'emoji';
			}
		},
		// 用户尝试隐藏键盘，此时如果表情面板在展示中，应当隐藏表情面板，如果是键盘在展示中不用处理，z-paging内部已经处理（如果不需要切换表情面板则不用写）
		hidedKeyboard() {
			if (this.emojiType === 'keyboard') {
				this.emojiType = '';
			}
		},
		// 点击了切换表情面板/键盘（如果不需要切换表情面板则不用写）
		emojiChange() {
			this.$emit('emojiTypeChange', this.emojiType);
			if (this.emojiType === 'keyboard') {
				// 点击了键盘，展示键盘
				this.focus = true;
			} else {
				// 点击了切换表情面板
				this.focus = false;
				// 隐藏键盘
				uni.hideKeyboard();
			}
			this.emojiType = (!this.emojiType || this.emojiType === 'emoji') ? 'keyboard': 'emoji';
		},
		// 点击了某个表情，将其插入输入内容中（如果不需要切换表情面板则不用写）
		emojiClick(text) {
			this.chatCentent += text;
		},
		
		// 点击了发送按钮
		onLogShow() {
			this.$emit('show-log');
		},
			
		// 点击了选择文件
		onPlus() {
			// if (this.showMenu) return;
			this.showMenu = !this.showMenu
		},
		/**
		 * 
		 */
		onMenuClick(idx) {
			console.log('onMenuClick', idx)
			const menu = this.menuList[idx];
			console.log('menu', menu)
			let fileParams = {
				accept: 'media', multiple: true,
				capture: ['camera','album'],
				mediaType: 'image',
				compressed: true, maxDuration: 60,
				sizeType: uni.$u.props.upload.sizeType,
				camera: 'back', maxCount: 1
			}
			switch(menu.type) {
				case 'camera':
					fileParams = Object.assign(fileParams, 
					{
						capture: ['camera'],
						mediaType: ['image'],
						maxCount: 1
					})
					break;
				case 'album':
					fileParams = Object.assign(fileParams, 
					{
						capture: ['album'],
						mediaType: ['image'],
						maxCount: 3
					})
					break;
				case 'file':
					fileParams = Object.assign(fileParams, 
					{
						accept: 'file',
						maxCount: 3
					})
					break;
			}
            chooseFile(fileParams)
            .then((res) => {
                console.log('res[0]', res[0])
                this.fileList = res
                this.fileValue = res[0].tempFilePath || 'https://ask.dcloud.net.cn/uploads/avatar/001/67/43/81_avatar_max.jpg'
            })
            .catch((error) => {
                this.$emit('error', error);
            });
		},
		
		// 点击了发送按钮
		sendClick() {
			if (!this.sendEnabled) return;
			this.$emit('send', this.chatCentent);
			this.chatCentent = '';
		}
	}
}
</script>

<style lang="scss" scoped>
	.fileBox{

	}
	.fileItem{
		
	}
	.fileIcon{
		
	}
	.fileName{
		
	}
	.fileName{
		
	}

	.chat-input-bar {
		display: flex;
		flex-direction: row;
		align-items: center;
		border-top: solid 1px #f5f5f5;
		background-color: #f8f8f8;
		
		padding: 20rpx;
		/* box-shadow: 0 4rpx 15rpx rgba(0, 0, 0, 0.15); */
		position: relative;
	}
	.chat-input-container {
		flex: 1;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		padding: 15rpx;
		background-color: white;
		border-radius: 10rpx;
	}
	.chat-input {
		flex: 1;
		font-size: 28rpx;
	}
	.rotate-45 {
		transform: rotate(45deg);
		/* 如果需要调整旋转中心点 */
		transform-origin: center center;
	}
	.menuBox{
		padding: 0 24rpx 32rpx;
		@include x-padding-bottom('36rpx');
	}	
	.emoji-container {
		width: 54rpx;
		height: 54rpx;
		margin: 10rpx 0rpx 10rpx 20rpx;
	}
	.emoji-img {
		width: 54rpx;
		height: 54rpx;
	}

	.chat-input-history{
		position: absolute;
		left: 40rpx;
		bottom: 40rpx;
	}

	.chat-input-plus{
		position: absolute;
		right: 100rpx;
		bottom: 40rpx;
	}

	.chat-input-send {
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
	}
	.chat-input-send-disabled {
		/* background-color: #bbbbbb; */
	}
	.chat-input-send-text {
		color: white;
		font-size: 26rpx;
	}
	.emoji-panel-container {
		background-color: #f8f8f8;
		overflow: hidden;
		transition-property: height;
		transition-duration: 0.15s;
		/* #ifndef APP-NVUE */
		will-change: height;
		/* #endif */
	}
	.emoji-panel {
		font-size: 30rpx;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		flex-wrap: wrap;
		padding-right: 10rpx;
		padding-left: 15rpx;
		padding-bottom: 10rpx;
	}
	.emoji-panel-text {
		font-size: 50rpx;
		margin-left: 15rpx;
		margin-top: 20rpx;
	}
</style>