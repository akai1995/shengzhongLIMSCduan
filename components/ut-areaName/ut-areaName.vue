<template>
	<text>{{ name }}</text>
</template>

<script>
	import {
		getAddressByCode
	} from '@/utils/common';
	export default {
		name: "ut-areaName",
		props: {
			value: {
				type: String,
				default: ''
			}
		},
		watch: {
			value: {
				handler(ov) {
					if (ov && ov.length >=6) {
						this.name = getAddressByCode(ov, '')
					}
				},
				immediate: true
			}
		},
		data() {
			return {
				name: ''
			};
		},
		methods: {

		}
	}
</script>


<style>
</style>