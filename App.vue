<style lang="scss">
	/* 注意要写在第一行，同时给style标签加入lang="scss"属性 */
	@import "@/uni_modules/uview-ui/index.scss";
	@import "public.css"
</style>
<script>
    import { mapActions, mapGetters } from 'vuex';
	export default {
	   onLaunch() {
		   if (this.token) {
			   this.GetWxInfo() 
		   }
	   },
	   computed: {
		   ...mapGetters(['token'])
	   },
	   methods: {
		   ...mapActions(['GetWxInfo'])
	   }
	}
</script>

<style>
	/*每个页面公共css */
	page{
		background: #F9F9F9FF;
	}
</style>
