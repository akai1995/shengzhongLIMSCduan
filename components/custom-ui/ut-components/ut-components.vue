<template>
	<view>
		<!-- #ifdef APP-PLUS -->
		<u-no-network :tips="'网络信号丢失了'" />
		<!-- #endif -->
		<u-notify ref="uNotify" />
        <!-- <u-alert
            :type="alertConfirm.type" effect="dark"
            :title="alertConfirm.title"
            :closable="alertConfirm.closable"
            :description="alertConfirm.description"
        /> -->
		<u-modal
            ref="uModal"
            :show="confirmDialog.show" :title="confirmDialog.title"
            :showConfirmButton="confirmDialog.showCancelBtn"
            :confirmText="confirmDialog.confirmText"
            :confirmColor="confirmDialog.confirmColor"
            :cancelText="confirmDialog.cancelText"
            :cancelColor="confirmDialog.cancelColor"
            :closeOnClickOverlay="true" :buttonReverse="false"
            @confirm="confirmDialog.confirm()" @cancel="confirmDialog.cancel()"
        >
			<view class="confirm-dialog-content">
				<rich-text :nodes="confirmDialog.content" />
			</view>
		</u-modal>
	</view>
</template>

<script>
import UI from '@/providers/utilities/UI';
export default {
    props: {
        /**
         * 是否使用了自定义导航栏
         */
        cusNav: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            notify: {
                // 'primary' | 'success' | 'info' | 'warning' | 'error'
				type: 'primary',  message: '',
                fontSize: '24rpx', /* top: 10, */
                color: '#000', bgColor: '#e8e8e8',
                safeAreaInsetTop: true, duration: 3000
            },
            alertConfirm: {
                // 'primary' | 'success' | 'info' | 'warning' | 'error'
                type: 'warning', effect: 'dark', title: '', 
			    closable: false, description: ''
            },
            /**
             * 确认对话框参数
             */
            confirmDialog: {
                show: false, title: '', content: '',
                confirmText: '', confirmColor: '',
                showCancelBtn: true, cancelText: '',
                cancelColor: '',
                confirm: null, cancel: null
            }
        }
    },
    computed: {
        toolTipTop() {
            let sh = UI.statusBarHeight;
            if (sh === undefined) sh = 0;

            //#ifdef MP-WEIXIN
            if (!this.cusNav) return 0;
            return sh + UI.headerBarHeight;
            //#endif

            //#ifdef H5
            if (!this.cusNav) return 0;
            return sh + UI.headerBarHeight;
            //#endif

            //#ifdef APP-PLUS
            return (sh) + UI.headerBarHeight;
            //#endif
        }
    },
    methods: {
		/**
		 * 显示顶端提示
         * 'primary' | 'success' | 'info' | 'warning' | 'error'
		 */
		showUViewTips(type = 'primary', msg, duration) {
            if (this.$refs.uNotify) {
                this.$refs.uNotify.show({
                    type: type, message: msg,
                    fontSize: '24rpx',
                    // top: 10,
                    // color: '#000',
                    // bgColor: '#e8e8e8',
                    safeAreaInsetTop: true,
                    duration: duration
                });
            } else {
                uni.showToast({
                    title: msg,
                    icon: 'none'
                });
            }
        }
    }
}
</script>

<style scoped lang="scss">
	.confirm-dialog-content {
		padding: 48rpx;
		font-size: 30rpx;
		text-align: center;
		color: $u-content-color;
	}
</style>
