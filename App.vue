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
		  // 注册网络请求拦截器
		  requestInterceptor()
	   },
	   computed: {
		   ...mapGetters(['token'])
	   },
	   methods: {
		   ...mapActions(['GetWxInfo'])
	   }
	}
/**
 * 网络请求拦截
 */
const requestInterceptor = () => {
  uni.addInterceptor('request', {
    invoke(args) {
      args.url = args?.url || ''
    },
    success(args) {
      // 请求成功后，统一处理返回值
      if (args.statusCode === 400) {
        // 显示z-paging网络请求错误图标
        uni.$emit('z-paging-error-emit', args.data)
        // 关闭loading
        uni.hideLoading()
        // 关闭navBarLoading
        uni.hideNavigationBarLoading()
      }
    },
    fail(err) {
      console.log('interceptor-fail', err)
      // 显示z-paging网络请求错误图标
      uni.$emit('z-paging-error-emit', err)
      // 关闭loading
      uni.hideLoading()
      // 关闭navBarLoading
      uni.hideNavigationBarLoading()
    },
  })
}
</script>

<style>
	/*每个页面公共css */
	page{
		background: #F9F9F9FF;
	}
</style>
