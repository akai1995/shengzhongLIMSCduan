<template>
	<view>
		<ut-nav title="医疗机构" border></ut-nav>
		
		<view class="content">
			<u-search  :showAction='false' bgColor="#fff" v-model="keyword" placeholder="搜索" @change="List"></u-search>
			
			<view class="ut-view m-t3">
				<ut-hospital-list :list="listData"></ut-hospital-list>
			</view>
		</view>
	</view>
</template>


<script>
	import {getList,List} from "@/api/medicalInstitution/hospital.js";
	export default {
		data() {
			return {
				keyword:'',
				listData:[],
			};
			
		},
		created() {
		    this.List();
		  },
		methods: {
			List(){
				/** 查询医院信息 */
				
				  List(this.keyword).then(res => {
				    this.listData = res.data;
				  });
			}
		    
		}
	}
</script>

<style lang="less">
	.view{
		
	}
</style>
