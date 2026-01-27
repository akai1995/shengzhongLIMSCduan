// providers/utilities/router.js

const homePath = '/pages/tabs/tab1/tab1'
const loginPath = '/sub-pack/project-pages/login/login'
export default {  
  homePath, loginPath,
  navTo(options = {}) {
    const { url, ...restOptions } = options;
    const pages = getCurrentPages();
    const maxDepth = 5; // 设置最大页面深度

    if (pages.length >= maxDepth) {
      console.warn('Page stack overflow prevented');
      if (restOptions.fail) {
        restOptions.fail({ errMsg: 'Page stack overflow prevented' });
      }
      return;
    }

    const fullUrl = this.buildUrlWithQueryAndParams(url, restOptions.query, restOptions.params);

    uni.navigateTo({
      url: fullUrl,
      success: restOptions.success,
      fail: restOptions.fail,
      complete: restOptions.complete
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
    } else { uni.reLaunch({ url: homePath }) }
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
};



