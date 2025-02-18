<template>
	<view class="flex1">
		<template v-if="info.type == '3'">
			<!-- <u-form-item :label="info.content" :prop="info.id"> -->
			<u-radio-group v-model="curValue" @change="changeRadio" placement="row">
				<template v-for="(item,index) in info.options">
					<u-radio :customStyle="{marginRight: '40rpx', padding: '24rpx 0'}" :key="index" :label="item.label"
						:name="item.value"></u-radio>
				</template>
			</u-radio-group>
			<!-- </u-form-item> -->
		</template>
		<template v-if="info.type == '1'">
			<!-- <u-form-item :label="info.content"> -->
			<u-radio-group v-model="curValue" @change="changeRadio" placement="column">
				<template v-for="(item,index) in info.options">
					<u-radio :customStyle="{padding: '24rpx 0'}" :key="index" :label="item.label"
						:name="item.value"></u-radio>
				</template>
			</u-radio-group>
			<!-- </u-form-item> -->
		</template>
		<template v-if="info.type == '2'">
			<!-- <u-form-item :label="info.content"> -->
			<u-checkbox-group v-model="curValue" @change="changeCheckbox" placement="column">
				<template v-for="(item,index) in info.options">
					<u-checkbox :customStyle="{padding: '24rpx 0'}" :key="index" :label="item.label"
						:name="item.value"></u-checkbox>
				</template>
			</u-checkbox-group>
			<!-- </u-form-item> -->
		</template>
		<template v-if="info.type == 'date'">
			<picker mode="date" @change="changeTime">
				<u-input v-model="curValue" readonly :placeholder="info.placeholder" border="none"/>
			</picker>
		</template>	
		<template v-if="info.type == 'field'">
			<picker :range="info.range" range-key="label" @change="changeField($event, info.range)">
				<template v-if="info.input === 'textarea'">
					<u-textarea v-model="curValue" disabled  :placeholder="info.placeholder" autoHeight border="none"></u-textarea>
				</template>
				<template v-else>
					<u-input v-model="curValue" readonly :placeholder="info.placeholder" border="none"/>
				</template>
			</picker>
		</template>
		<template v-if="info.type == 'input'">
			<template v-if="info.input === 'textarea'">
				<u-textarea v-model="curValue" @change="changeInput" :placeholder="info.placeholder" autoHeight border="none"></u-textarea>
			</template>
			<template v-else>
				<u-input v-model="curValue" @change="changeInput" :type="info.inputType || 'text'" :placeholder="info.placeholder" border="none"/>
			</template>
		</template>
	</view>
</template>

<script>
	export default {
		props: {
			value: {
				type: String | Number,
				default: ''
			},
			info: {
				type: Object
			}
		},
		watch: {
			value: {
				handler(ov) {
					if (ov) {
						if (this.info.type !== '2') {
							this.curValue = ov
						} else {
							this.curValue = ov.split('|')
						}

					}
				},
				immediate: true
			}
		},
		data() {
			return {
				curValue: ''
			};
		},
		methods: {
			changeRadio(event) {
				this.$emit('change', event)
			},
			changeCheckbox(event) {
				this.$emit('change', event.join('|'))
			},
			changeTime (event) {
				const { value } = event.detail
				this.curValue = value
				this.$emit('change', value)
			},
			changeField (event, list) {
				const { value } = event.detail
				const curValue = list[value].value
				this.curValue = curValue
				this.$emit('change', curValue)
			},
			changeInput (event) {
				this.$emit('change', event)
			}
		}
	}
</script>

<style lang="scss" scoped>

    /deep/.u-textarea--disabled {
		background-color: #fff !important;
	}
	
</style>