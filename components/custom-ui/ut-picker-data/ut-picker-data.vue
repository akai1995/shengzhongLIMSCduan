<template>
	<u-popup :show="show" @close="close" closeable :round="10" zIndex="100000" @open="open">
		<view class="picker-mian">
			<view class="h1 text-cneter pd-32">{{ title }}</view>
			<view class="d-flex wrap name-box">
				<template v-for="(item, index) in valueList">
					<view v-if="item.code" :key="item.code" class="li" :class="{ active: index + 1 === zLevel, disabled: item.disabled }" @click="selectTit(item)">
						{{ item.name }}<u-icon name="arrow-right" v-if="index + 1 !== zLevel" />
					</view>
				</template>
			</view>
			<scroll-view scroll-y="true" class="mian" scroll-with-animation :scroll-into-view="intoview">
				<view style="padding: 20rpx;">
					<template>
						<view class="item d-flex js-b-c" hover-class="item-hover" v-for="item in options" :key="item.code" :id="'xxxx_' + item.code" @click="selectItem(item)">
							<view class="">{{ item.name }}</view><u-icon v-if="item.code === curValue" name="checkmark" color="#3B7EFF" ize="36rpx" />
						</view>
					</template>
				</view>
			</scroll-view>
			<view class="d-flex js-b-c" style="padding: 20rpx">
				<view class="btn-btm btn-qs" @click="close">取消</view>
				<view class="btn-btm btn-ss" @click="submit">确定</view>
			</view>
		</view>
	</u-popup>
</template>

<script>
	import { areaList } from '@/providers/area'
	const { street_list, county_list, city_list, province_list } = areaList
	const mapLevelDt = [province_list, city_list, county_list, street_list]
	export default {
		name: "ut-picker-data",
		props: {
			show: { type: Boolean, default: false },
			title: { type: String, default: '选择地区' },
			value: { type: String, default: '530000' },
			zLevel: { type: Number, default: 4 },
			rangeCode: { type: String, default: '' },
			isRange: { type: Boolean, default: false }
		},
		watch: {
			value: {
				immediate: true,
				handler(value) {
					let code = value || '530000'; code = code + ''
					if (code.length < 6) { return }; this.setCurValue(code)
				}
			}
		},
		data() {
			return {
				valueList: [],
				options: [],
				intoview: '',
				curValue: '',
				curLevel: 1
			};
		},
		methods: {
			open() {

			},
			selectTit(item) {
				const { code, name, disabled } = item
				if (disabled) { return }
				this.curValue = code
				const level = this.getLevel(code)
				this.curLevel = level
				this.setCurOptions(code, level)
			},
			selectItem(item) {
				const { code, name } = item
				this.setCurValue(code)
			},
			setCurValue(code) {
				this.curValue = code
				const level = this.getLevel(code)
				this.curLevel = level
				if (+this.zLevel === level) {
					this.setCurOptions(code, level)
				} else {
					this.setSubOptions(code, level)
				}
			},
			setSubOptions(code, level) {
				this.setCurValueList(code, level)
				const strCode = [code.slice(0, 2) + '0000', code.slice(0, 4) + '00', code.slice(0, 6), code]
				let arr = []
				if (!mapLevelDt[level]) { return [] }
				Object.entries(mapLevelDt[level]).forEach(([value, label]) => {
					const valueCode = [value.slice(0, 2) + '0000', value.slice(0, 4) + '00', value.slice(0, 6), value]
					if (strCode[level - 1] === valueCode[level - 1]) { arr.push({ code: value, name: label }) }
				})
				this.options = [...arr]
			},
			getAreaByCode(code, splitStr = '-') {
				const pC = code.slice(0, 2) + '0000'
				const cC = code.slice(0, 4) + '00'
				const qC = code.slice(0, 6)
				return province_list[pC] + (city_list[cC] ? splitStr + city_list[cC] : '') + (county_list[qC] ? splitStr +
					county_list[qC] : '') + (code.length >= 9 ? splitStr + this.getCurName(code) : '')
			},
			close() { this.$emit('update:show', false) },
			submit() {
                this.$emit('change', { value: this.curValue, label: this.getAreaByCode(this.curValue, '') })
				this.close()
			},
			setCurOptions(code, level) {
				this.setCurValueList(code, level)
				this.options = [...this.getCurLevelArr(code, level)]
				this.intoview = 'xxxx_' + code
			},
			setCurValueList(code, level) {
				let { zLevel } = this
				const strCode = [code.slice(0, 2) + '0000', code.slice(0, 4) + '00', code.slice(0, 6), code]
				for (let i = 0; i < zLevel; i++) {
					if (level <= zLevel) {
						if (i < level) {
							this.valueList[i] = { name: this.getCurName(strCode[i]), code: strCode[i], disabled: false }
						} else {
							this.valueList[i] = { name: '', code: '', disabled: false }
						}
						if (this.isRange && this.getLevel(this.rangeCode) > i) {
							this.valueList[i].disabled = true
						}
					}
				}
			},
			getCurName(code) {
				const codeArr = code.split(',')
				const mapArea = {
					...province_list,
					...city_list,
					...county_list,
					...street_list
				}
				return codeArr.map(item => mapArea[item]).toString()
			},
			mapOptionsByArr(obj) {
				let arr = []
				Object.entries(obj).forEach(([key, value]) => {
					arr.push({
						code: key,
						name: value
					})
				})
				return arr
			},
			getLevel(code) {
				const aa = code.slice(2, 6)
				const bb = code.slice(4, 6)
				if (aa == '0000') {
					return 1
				}
				if (bb == '00') {
					return 2
				}
				if (bb != '00' && code.length == 6) {
					return 3
				}
				if (code.length > 6) {
					return 4
				}
			},
			getCurLevelArr(code, level) {
				const objAll = mapLevelDt[level - 1]
				let obj = {}
				for (let key in objAll) {
					if (this.getCommon(code, key, level)) {
						obj[key] = objAll[key]
					}
				}
				return this.mapOptionsByArr(obj)
			},
			getCommon(code, key, level) {
				if (level === 1) {
					return true
				} else if (level === 2) {
					return code.slice(0, 2) == key.slice(0, 2)
				} else if (level === 3) {
					return code.slice(0, 4) == key.slice(0, 4)
				} else if (level === 4) {
					return code.slice(0, 6) == key.slice(0, 6)
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.text-cneter {
		text-align: center;
	}

	.pd-32 {
		padding: 32rpx;
	}

	.picker-mian {
		height: 70vh;
		display: flex;
		flex-direction: column;
	}

	.mian {
		flex: 1;
		overflow: hidden;
	}

	.btn-btm {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 45%;
		height: 80rpx;
		font-size: 36rpx;
		font-weight: 500;
		border-radius: 80rpx;
	}

	.btn-qs {
		color: #5178FF;
		background: rgba(81, 120, 255, 0.1);
	}

	.btn-ss {
		color: #fff;
		background-color: #5178FF;
	}

	.name-box {
		padding: 0 10rpx;
	}

	.li {
		padding: 10rpx;
		font-size: 30rpx;
		display: flex;
		color: #333;
		align-items: center;
        &.disabled {
			color: #999;
		}
		&.active {
			color: #5178FF;
		}
	}

	.item {
		margin: 4rpx 0;
		padding: 20rpx;
		font-size: 30rpx;
		color: #666;
		background-color: #f7f7f7;
	}

	.item-hover {
		background-color: #f4f4f4;
	}
</style>