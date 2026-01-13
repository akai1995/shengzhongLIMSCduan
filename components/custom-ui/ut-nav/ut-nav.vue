<!--
 * @Description: 
 * @Version: 
 * @Author: 孙子呷约
 * @Date: 2023-10-24 12:36:14
-->
<template>
	<view>
		<u-navbar :title="title" @leftClick="leftClick" :leftIcon="iconName" :bgColor="bgColor" :leftIconColor="leftIconColor"  :placeholder="true" border>
			
		</u-navbar>
	</view>
</template>

<script>
	export default {
		name:"ut-nav",
		props:{
			title:{
				type:String,
				default:'基因派'
			},
			
			border:{
				type:Boolean,
				default:false
			},
			url:{
				type:String,
				default:''
			},
			bgColor:{
				type:String,
				default:'#ffffff'
			},
			leftIconColor:{
				type:String,
				default:'#303133'
			},
			back:{
				type:Boolean,
				default:false
			},
			iconName: {
				type: String,
				default: 'arrow-left'
			}
		},
		data() {
			return {
				leftClick(){
					if(this.back){
						this.$emit('onBack')
						return
					}
					if(this.url =='' ){
						this.$eUni.navBack()
						
					}else{
						console.log('url',this.url)
						this.$eUni.reLaunch({
							url: this.url
						})
					}
				}
			};
		}
	}
</script>

<style lang="less">
	.u-nav-slot{
		display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    border-width: 1rpx;
    border-radius: 200rpx;
    border-color: #dadbde;
    padding:6rpx 14rpx;
    opacity: .8;
	}
</style>