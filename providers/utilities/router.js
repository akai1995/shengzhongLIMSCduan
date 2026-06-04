// providers/utilities/router.js

const _404Path = '/pages/404/404'
const homePath = '/pages/tabs/tab1/tab1'
const loginPath = '/sub-pack/project-pages/login/login'

// 新增：用于标记是否正在跳转，防止快速连续点击
let isNavigating = false;

export default {  
  _404Path, homePath, loginPath,  
  navTo(options = {}) {
    const { url, ...restOptions } = options;
    const pages = getCurrentPages();
    const maxDepth = 5; // 设置最大页面深度

    // 1. 拦截正在跳转中的请求
    if (isNavigating) {
      console.warn('Prevented duplicate navigation: navigation in progress');
      if (restOptions.fail) {
        restOptions.fail({ errMsg: 'Prevented duplicate navigation: navigation in progress' });
      }
      return;
    }

    // 2. 页面栈深度限制（原有逻辑）
    if (pages.length >= maxDepth) {
      console.warn('Page stack overflow prevented');
      if (restOptions.fail) {
        restOptions.fail({ errMsg: 'Page stack overflow prevented' });
      }
      return;
    }

    // 3. 拦截跳转到当前栈顶的相同地址
    const fullUrl = this.buildUrlWithQueryAndParams(url, restOptions.query, restOptions.params);
    // 解析目标路径（去掉参数，只保留页面路径）
    const targetPath = fullUrl.split('?')[0];
    // 获取当前栈顶页面的路径
    const currentPage = pages[pages.length - 1];
    const currentPath = currentPage.route; // 格式如：pages/tabs/tab1/tab1

    // 统一路径格式（去掉开头的/，保证对比一致）
    const normalizePath = (path) => path.replace(/^\//, '');
    if (normalizePath(targetPath) === normalizePath(currentPath)) {
      console.warn(`Prevented duplicate navigation: already on ${targetPath}`);
      if (restOptions.fail) {
        restOptions.fail({ errMsg: `Prevented duplicate navigation: already on ${targetPath}` });
      }
      return;
    }

    // 4. 执行跳转（原有逻辑）
    isNavigating = true;
    uni.navigateTo({
      url: fullUrl,
      success: restOptions.success,
      fail: restOptions.fail,
      complete: (res) => {
        // 跳转完成后重置标记（加小延迟，防止快速连续点击）
        setTimeout(() => {
          isNavigating = false;
        }, 300);
        if (restOptions.complete) {
          restOptions.complete(res);
        }
      }
    });
  },

  redirectTo(options = {}) {
    const { url, ...restOptions } = options;
    const fullUrl = this.buildUrlWithQueryAndParams(url, restOptions.query, restOptions.params);
    uni.redirectTo({
      url: fullUrl,
      success: restOptions.success,
      fail: restOptions.fail,
      complete: restOptions.complete
    });
  },

  reLaunch(options = {}) {
    const { url, ...restOptions } = options;
    const fullUrl = this.buildUrlWithQueryAndParams(url, restOptions.query, restOptions.params);

    uni.reLaunch({
      url: fullUrl,
      success: restOptions.success,
      fail: restOptions.fail,
      complete: restOptions.complete
    });
  },

  switchTab(options = {}) {
    const { url, ...restOptions } = options;
    const fullUrl = this.buildUrlWithQueryAndParams(url, restOptions.query, restOptions.params);
    uni.switchTab({
      url: fullUrl,
      success: restOptions.success,
      fail: restOptions.fail,
      complete: restOptions.complete
    });
  },

  navBack(options = {}) {
    const pages = getCurrentPages();
    if (pages.length > 1) {
      uni.navigateBack({
        delta: options.delta || 1,
        success: options.success,
        fail: options.fail,
        complete: options.complete
      });
    } else { 
      uni.reLaunch({ url: homePath }) 
    }
  },

  buildUrlWithQueryAndParams(basePath, query, params) {
    let path = basePath;
    if (params) {
      Object.keys(params).forEach(key => {
        path = path.replace(`:${key}`, encodeURIComponent(params[key]));
      });
    }
    if (query) {
      const queryString = Object.entries(query)
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
        .join('&');
      if (queryString) {
        path += `?${queryString}`;
      }
    }
    return path;
  }
}