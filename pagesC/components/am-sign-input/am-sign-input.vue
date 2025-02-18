<template>
	<view class="sign">
		<view class="imgBox">
			<view class="nom_img" v-if="!showImg" @click="signModShow=true">

			</view>
			<view class="across_img" v-if="showImg">
				<view v-if="showImg" class="delete_icon" @click.stop="deleteImg">
					x
				</view>
				<image v-if="showImg" :src="showImg" style="width: 140px;height: 80px;" @click="previewImg(showImg)">
				</image>
			</view>
		</view>

		<umask :show="signModShow" @click="signModShow=false" :duration="0">
			<view class="warp">
				<view class="signBox" @tap.stop>
					<view class="wrapper">
						<view class="handBtn">
							<!-- #ifdef MP-WEIXIN -->
							<!-- <image @click="selectColorEvent('black','#1A1A1A')"
								:src="selectColor === 'black' ? '/static/other/color_black_selected.png' : '/static/other/color_black.png'"
								class="black-select"></image> -->
							<!-- <image @click="selectColorEvent('red','#ca262a')"
								:src="selectColor === 'red' ? '/static/other/color_red_selected.png' : '/static/other/color_red.png'"
								class="red-select"></image> -->
							<!-- #endif -->
							<!-- #ifndef MP-WEIXIN -->
							<!-- <view class="color_pic" :style="{background:lineColor}" @click="showPickerColor=true">
							</view> -->
							<!-- #endif -->
							<button @click="clear" class="delBtn">清空</button>
							<!-- <button @click="saveCanvasAsImg" class="saveBtn">保存</button> -->
							<!-- <button @click="previewCanvasImg" class="previewBtn">预览</button> -->
							<button @click="subCanvas" class="subBtn">完成</button>
							<button @click="undo" class="undoBtn">撤销</button>
							<span class="emptyInfo" style="color: red;" v-if="emptyShow">你还没有绘制任何东西哦</span>
						</view>
						<view class="handCenter" :style="{left:canvasLeft+'px'}">
							<canvas :disable-scroll="true" @touchstart="uploadScaleStart" @touchmove="uploadScaleMove"
								@touchend="uploadScaleEnd" :style="{width:'100%',height:'calc(85vh - 8rpx)'}"
								:canvas-id="canvasId"></canvas>
						</view>

						<view class="handCenters">
							<canvas :canvas-id="canvasIds"
								:style="{width:outSignWidth+'px',height:outSignHeight+'px'}"></canvas>
						</view>
						<view class="handRight">
							<view class="handTitle">请签名
							</view>
						</view>
					</view>
				</view>
			</view>
		</umask>
	</view>
</template>

<script>
	import umask from "../../components/u-mask/u-mask.vue"
	export default {
		components: {
			umask,
		},
		data() {
			return {
				canvasLeft: 10000,
				emptyShow: false,
				signModShow: false,
				showImg: "",
				showPickerColor: false,
				ctx: '',
				ctxs: '',
				canvasWidth: 0,
				canvasHeight: 0,
				selectColor: 'black',
				lineColor: '#1A1A1A',
				points: [],
				historyList: [],
				canAddHistory: true,
				getImagePath: () => {
					let that = this
					return new Promise((resolve) => {
						uni.canvasToTempFilePath({
							canvasId: that.canvasId,
							fileType: 'png',
							quality: 1, //图片质量
							success: res => resolve(res.tempFilePath)
						}, this)
					})
				},
				requestAnimationFrame: void 0,
			};
		},
		watch: {
			signModShow(newValue, oldValue) {
				newValue ? this.canvasLeft = 74 : this.canvasLeft = 10000
			}
		},
		props: { //可用于修改的参数放在props里   也可单独放在外面做成组件调用  传值
			action: {
				type: String,
				default: ''
			},
			canvasId: {
				type: String,
				default: 'canvasDr'
			},
			canvasIds: {
				type: String,
				default: 'canvasRo'
			},
			// header: {
			// 	type: Object,
			// 	default: {}
			// },
			outSignWidth: {
				type: Number,
				default: 200
			},
			outSignHeight: {
				type: Number,
				default: 100
			},
			minSpeed: { //画笔最小速度
				type: Number,
				default: 1.5
			},
			minWidth: { //线条最小粗度
				type: Number,
				default: 1,
			},
			maxWidth: { //线条最大粗度
				type: Number,
				default: 5
			},
			openSmooth: { //开启平滑线条（笔锋）
				type: Boolean,
				default: true
			},
			maxHistoryLength: { //历史最大长度
				type: Number,
				default: 20
			},
			maxWidthDiffRate: { //最大差异率
				type: Number,
				default: 20
			},
			undoScan: { //撤销重新渲染偏移缩放校准
				type: Number,
				default: 0.83
			},
			bgColor: { //背景色
				type: String,
				default: ''
			},
		},
		mounted() {
			if (!this.ctx) {
				this.ctx = uni.createCanvasContext(this.canvasId, this);
			}
			if (!this.ctxs) {
				this.ctxs = uni.createCanvasContext(this.canvasIds, this);
			}
			let that = this
			this.$nextTick(() => {
				uni.createSelectorQuery().in(this).select('.handCenter').boundingClientRect(rect => {
						that.canvasWidth = rect.width;
						that.canvasHeight = rect.height;
						that.drawBgColor()
					})
					.exec();
			})
		},
		methods: {
			getPickerColor(color) {
				this.showPickerColor = false;
				if (color) {
					this.lineColor = color;
				}
			},
			// 笔迹开始
			uploadScaleStart(e) {
				this.canAddHistory = true
				this.ctx.setStrokeStyle(this.lineColor)
				this.ctx.setLineCap("round") //'butt'、'round'、'square'
			},
			// 笔迹移动
			uploadScaleMove(e) {
				let temX = e.changedTouches[0].x
				let temY = e.changedTouches[0].y
				this.initPoint(temX, temY)
				this.onDraw()
			},
			/**
			 * 触摸结束
			 */
			uploadScaleEnd() {
				this.canAddHistory = true;
				this.points = [];
			},
			/**
			 * 记录点属性
			 */
			initPoint(x, y) {
				var point = {
					x: x,
					y: y,
					t: Date.now()
				};
				var prePoint = this.points.slice(-1)[0];
				if (prePoint && (prePoint.t === point.t || prePoint.x === x && prePoint.y === y)) {
					return;
				}
				if (prePoint && this.openSmooth) {
					var prePoint2 = this.points.slice(-2, -1)[0];
					point.distance = Math.sqrt(Math.pow(point.x - prePoint.x, 2) + Math.pow(point.y - prePoint.y, 2));
					point.speed = point.distance / (point.t - prePoint.t || 0.1);
					point.lineWidth = this.getLineWidth(point.speed);
					if (prePoint2 && prePoint2.lineWidth && prePoint.lineWidth) {
						var rate = (point.lineWidth - prePoint.lineWidth) / prePoint.lineWidth;
						var maxRate = this.maxWidthDiffRate / 100;
						maxRate = maxRate > 1 ? 1 : maxRate < 0.01 ? 0.01 : maxRate;
						if (Math.abs(rate) > maxRate) {
							var per = rate > 0 ? maxRate : -maxRate;
							point.lineWidth = prePoint.lineWidth * (1 + per);
						}
					}
				}
				this.points.push(point);
				this.points = this.points.slice(-3);
			},
			/**
			 * @param {Object} 
			 * 线宽
			 */
			getLineWidth(speed) {
				var minSpeed = this.minSpeed > 10 ? 10 : this.minSpeed < 1 ? 1 : this.minSpeed; //1.5
				var addWidth = (this.maxWidth - this.minWidth) * speed / minSpeed;
				var lineWidth = Math.max(this.maxWidth - addWidth, this.minWidth);
				return Math.min(lineWidth, this.maxWidth);
			},
			/**
			 * 绘画逻辑
			 */
			onDraw() {
				if (this.points.length < 2) return;
				this.addHistory();
				var point = this.points.slice(-1)[0];
				var prePoint = this.points.slice(-2, -1)[0];
				let that = this
				var onDraw = function onDraw() {
					if (that.openSmooth) {
						that.drawSmoothLine(prePoint, point);
					} else {
						that.drawNoSmoothLine(prePoint, point);
					}
				};
				if (typeof this.requestAnimationFrame === 'function') {
					this.requestAnimationFrame(function() {
						return onDraw();
					});
				} else {
					onDraw();
				}
			},
			//添加历史图片地址
			addHistory() {
				if (!this.maxHistoryLength || !this.canAddHistory) return;
				this.canAddHistory = false;
				if (!this.getImagePath) {
					this.historyList.length++;
					return;
				}
				//历史地址 (暂时无用)
				let that = this
				that.getImagePath().then(function(url) {
					if (url) {
						that.historyList.push(url)
						that.historyList = that.historyList.slice(-that.maxHistoryLength);
					}
				});
			},
			//画平滑线
			drawSmoothLine(prePoint, point) {
				var dis_x = point.x - prePoint.x;
				var dis_y = point.y - prePoint.y;

				if (Math.abs(dis_x) + Math.abs(dis_y) <= 2) {
					point.lastX1 = point.lastX2 = prePoint.x + dis_x * 0.5;
					point.lastY1 = point.lastY2 = prePoint.y + dis_y * 0.5;
				} else {
					point.lastX1 = prePoint.x + dis_x * 0.3;
					point.lastY1 = prePoint.y + dis_y * 0.3;
					point.lastX2 = prePoint.x + dis_x * 0.7;
					point.lastY2 = prePoint.y + dis_y * 0.7;
				}
				point.perLineWidth = (prePoint.lineWidth + point.lineWidth) / 2;
				if (typeof prePoint.lastX1 === 'number') {
					this.drawCurveLine(prePoint.lastX2, prePoint.lastY2, prePoint.x, prePoint.y, point.lastX1, point
						.lastY1, point.perLineWidth);
					if (prePoint.isFirstPoint) return;
					if (prePoint.lastX1 === prePoint.lastX2 && prePoint.lastY1 === prePoint.lastY2) return;
					var data = this.getRadianData(prePoint.lastX1, prePoint.lastY1, prePoint.lastX2, prePoint.lastY2);
					var points1 = this.getRadianPoints(data, prePoint.lastX1, prePoint.lastY1, prePoint.perLineWidth / 2);
					var points2 = this.getRadianPoints(data, prePoint.lastX2, prePoint.lastY2, point.perLineWidth / 2);
					this.drawTrapezoid(points1[0], points2[0], points2[1], points1[1]);
				} else {
					point.isFirstPoint = true;
				}
			},
			//画不平滑线
			drawNoSmoothLine(prePoint, point) {
				point.lastX = prePoint.x + (point.x - prePoint.x) * 0.5;
				point.lastY = prePoint.y + (point.y - prePoint.y) * 0.5;
				if (typeof prePoint.lastX === 'number') {
					this.drawCurveLine(prePoint.lastX, prePoint.lastY, prePoint.x, prePoint.y, point.lastX, point.lastY,
						this.maxWidth);
				}
			},
			//画线
			drawCurveLine(x1, y1, x2, y2, x3, y3, lineWidth) {
				lineWidth = Number(lineWidth.toFixed(1));
				this.ctx.setLineWidth && this.ctx.setLineWidth(lineWidth);
				this.ctx.lineWidth = lineWidth;
				this.ctx.beginPath();
				this.ctx.moveTo(Number(x1.toFixed(1)), Number(y1.toFixed(1)));
				this.ctx.quadraticCurveTo(Number(x2.toFixed(1)), Number(y2.toFixed(1)), Number(x3.toFixed(1)), Number(y3
					.toFixed(1)));
				this.ctx.stroke();
				this.ctx.draw && this.ctx.draw(true);
			},
			//画梯形
			drawTrapezoid(point1, point2, point3, point4) {
				this.ctx.beginPath();
				this.ctx.moveTo(Number(point1.x.toFixed(1)), Number(point1.y.toFixed(1)));
				this.ctx.lineTo(Number(point2.x.toFixed(1)), Number(point2.y.toFixed(1)));
				this.ctx.lineTo(Number(point3.x.toFixed(1)), Number(point3.y.toFixed(1)));
				this.ctx.lineTo(Number(point4.x.toFixed(1)), Number(point4.y.toFixed(1)));
				this.ctx.setFillStyle && this.ctx.setFillStyle(this.lineColor);
				this.ctx.fillStyle = this.lineColor;
				this.ctx.fill();
				this.ctx.draw && this.ctx.draw(true);
			},
			//获取弧度
			getRadianData(x1, y1, x2, y2) {
				var dis_x = x2 - x1;
				var dis_y = y2 - y1;
				if (dis_x === 0) {
					return {
						val: 0,
						pos: -1
					};
				}
				if (dis_y === 0) {
					return {
						val: 0,
						pos: 1
					};
				}
				var val = Math.abs(Math.atan(dis_y / dis_x));
				if (x2 > x1 && y2 < y1 || x2 < x1 && y2 > y1) {
					return {
						val: val,
						pos: 1
					};
				}
				return {
					val: val,
					pos: -1
				};
			},
			//获取弧度点
			getRadianPoints(radianData, x, y, halfLineWidth) {
				if (radianData.val === 0) {
					if (radianData.pos === 1) {
						return [{
							x: x,
							y: y + halfLineWidth
						}, {
							x: x,
							y: y - halfLineWidth
						}];
					}
					return [{
						y: y,
						x: x + halfLineWidth
					}, {
						y: y,
						x: x - halfLineWidth
					}];
				}
				var dis_x = Math.sin(radianData.val) * halfLineWidth;
				var dis_y = Math.cos(radianData.val) * halfLineWidth;
				if (radianData.pos === 1) {
					return [{
						x: x + dis_x,
						y: y + dis_y
					}, {
						x: x - dis_x,
						y: y - dis_y
					}];
				}
				return [{
					x: x + dis_x,
					y: y - dis_y
				}, {
					x: x - dis_x,
					y: y + dis_y
				}];
			},
			/**
			 * 背景色
			 */
			drawBgColor() {
				if (!this.bgColor) return;
				this.ctx.setFillStyle && this.ctx.setFillStyle(this.bgColor);
				this.ctx.fillStyle = this.bgColor;
				this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
				this.ctx.draw && this.ctx.draw(true);
			},
			//图片绘制
			drawByImage(url) {
				this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
				try {
					this.ctx.drawImage(url, 0, 0, this.canvasWidth * this.undoScan, this.canvasHeight * this.undoScan);
					this.ctx.draw && this.ctx.draw(true);
				} catch (e) {
					this.historyList.length = 0;
				}
			},
			/**
			 * 清空
			 */
			clear() {
				this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
				this.ctx.draw && this.ctx.draw();
				this.drawBgColor();
				this.historyList.length = 0;
			},
			//撤消
			undo() {
				if (!this.getImagePath || !this.historyList.length) return;
				var pngURL = this.historyList.splice(-1)[0];
				this.drawByImage(pngURL);
				if (this.historyList.length === 0) {
					this.clear();
				}
			},
			//是否为空
			isEmpty() {
				return this.historyList.length === 0;
			},
			/**
			 * @param {Object} str
			 * @param {Object} color
			 * 选择颜色
			 */
			selectColorEvent(str, color) {
				this.selectColor = str;
				this.lineColor = color;
				this.ctx.setStrokeStyle(this.lineColor)
			},

			//完成
			subCanvas() {
				let that = this
				if (that.isEmpty()) {
					that.emptyShow = true
					setTimeout(function() {
						that.emptyShow = false
					}, 1000)
					return
				}
				// that.$emit('signToUrl',	that.canvasId)
				// return
				uni.canvasToTempFilePath({
					canvasId: that.canvasId,
					fileType: 'png',
					quality: 1, //图片质量
					success(res) {
						that.ctxs.translate(0, that.outSignHeight);
						that.ctxs.rotate(270 * Math.PI / 180)
						that.ctxs.drawImage(res.tempFilePath, 0, 0, that.outSignHeight, that.outSignWidth)
						that.ctxs.draw()
						// console.log('res', res.tempFilePath )
						setTimeout(() => {
							uni.canvasToTempFilePath({
								canvasId: that.canvasIds,
								fileType: 'png',
								quality: 1, //图片质量
								success: function(res1) {
									that.showImg = res1.tempFilePath
									that.clear()
									that.signModShow = false

									uni.getFileSystemManager().readFile({
										filePath: res1.tempFilePath,
										encoding: 'base64',
										success: ress1 => {
											console.log("base64数据：",'data:image/png;base64,'+ress1.data)
											that.$emit('signToUrl',
												'data:image/png;base64,' + ress1
												.data)
										}
									})
								},
								fail: (err) => {}
							}, that)
						}, 200);
					}
				}, this);
			},
			//保存到相册
			saveCanvasAsImg() {
				uni.canvasToTempFilePath({
					canvasId: this.canvasId,
					fileType: 'png',
					quality: 1, //图片质量
					success(res) {
						uni.saveImageToPhotosAlbum({
							filePath: res.tempFilePath,
							success(res) {
								uni.showToast({
									title: '已保存到相册',
									duration: 2000
								});
							}
						});
					}
				}, this);
			},
			//预览
			previewCanvasImg() {
				uni.canvasToTempFilePath({
					canvasId: this.canvasId,
					fileType: 'jpg',
					quality: 1, //图片质量
					success(res) {
						uni.previewImage({
							urls: [res.tempFilePath] //预览图片 数组
						});
					}
				}, this);
			},
			deleteImg() {
				this.showImg = ""
			},

			previewImg(img) {
				uni.previewImage({
					urls: [img] //预览图片 数组
				});
			},

		}
	};
</script>

<style lang="scss">
	page {
		background: #d9d9d9;
		height: auto;
		overflow: hidden;
	}

	.imgBox {
		width: 140px;
		height: 80px;
		position: relative;

		.nom_img {
			border-radius: 8px;
			border: 1px dashed;
			border-color: #a3a3a3;
			overflow: hidden;
			display: flex;
			justify-content: center;
			align-items: center;
			height: 80px;
			width: 140px;
		}

		.nom_img:hover {
			border-color: #008ef6 !important;
		}

		.across_img {
			border: 1px dashed #a3a3a3;
			border-radius: 8px;
			height: 80px;
			width: 140px;

			.delete_icon {
				position: absolute;
				top: -12px;
				right: -12px;
				width: 24px;
				height: 24px;
				overflow: hidden;
				color: #ffffff;
				font-size: 24px;
				text-align: center;
				line-height: 20px;
				background: #ff3c0c;
				border-radius: 25px;
				z-index: 1;
			}
		}
	}

	.warp {
		width: 100%;
		height: 100vh;
		display: flex;
		justify-content: center;
		align-items: center;

		.signBox {
			width: 85vw;
			height: 85vh;
			background: #ffffff;
			border-radius: 8px;
		}
	}

	.wrapper {
		width: 85vw;
		height: 85vh;
		overflow: hidden;
		display: flex;
		align-content: center;
		flex-direction: row;
		justify-content: center;
		font-size: 28rpx;
	}

	.handRight {
		display: inline-flex;
		align-items: center;
	}

	.handCenter {
		position: fixed;
		border: 4rpx dashed #e9e9e9;
		flex: 5;
		margin-top: 4rpx;
		overflow: hidden;
		box-sizing: border-box;
		width: calc(100% - 84rpx - 200rpx);
		height: calc(85vh - 8rpx)
	}

	.handCenters {
		position: fixed;
		top: 0;
		left: 10000rpx;
		flex: 5;
		overflow: hidden;
		box-sizing: border-box;
	}


	.handTitle {
		transform: rotate(90deg);
		flex: 1;
		color: #666;
	}

	.handBtn button {
		font-size: 28rpx;
	}

	.handBtn {
		height: 85vh;
		display: inline-flex;
		flex-direction: column;
		justify-content: space-between;
		align-content: space-between;
		flex: 1;
	}

	.delBtn {
		position: absolute;
		top: 180rpx;
		left: 46rpx;
		transform: rotate(90deg);
		color: #666;
	}

	.subBtn {
		position: absolute;
		top: 460rpx;
		left: 46rpx;
		display: inline-flex;
		transform: rotate(90deg);
		background: #008ef6;
		color: #fff;
		text-align: center;
		justify-content: center;
	}

	/*Peach - 新增 - 保存*/

	.saveBtn {
		position: absolute;
		top: 650rpx;
		left: 46rpx;
		transform: rotate(90deg);
		color: #666;
	}

	.previewBtn {
		position: absolute;
		top: 516rpx;
		left: 46rpx;
		transform: rotate(90deg);
		color: #666;
	}

	.undoBtn {
		position: absolute;
		top: 320rpx;
		left: 46rpx;
		transform: rotate(90deg);
		color: #666;
	}

	.emptyInfo {
		position: absolute;
		bottom: 418rpx;
		left: -56rpx;
		transform: rotate(90deg);
		color: #666;
	}

	.color_pic {
		width: 70rpx;
		height: 70rpx;
		border-radius: 25px;
		position: absolute;
		top: 200rpx;
		left: 62rpx;
		border: 1px solid #ddd;
	}

	/*Peach - 新增 - 保存*/

	.black-select {
		width: 60rpx;
		height: 60rpx;
		position: absolute;
		top: 150rpx;
		left: 70rpx;
	}

	.red-select {
		width: 60rpx;
		height: 60rpx;
		position: absolute;
		top: 260rpx;
		left: 70rpx;
	}
</style>