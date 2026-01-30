// router.js
import { RouterMount, createRouter } from 'uni-simple-router';

const router = createRouter({
    platform: process.env.VUE_APP_PLATFORM,
	keepUniOriginNav: false, debugger: true,
    // routerBeforeEach:(to, from, next) => { next() },    
    // routerAfterEach: (to, from) => {},
    // routerErrorEach: (error, router) => { err(error, router, true) },
    // detectBeforeLock: (router, to, navType) => {},
    // resolveQuery:(jsonQuery)=>jsonQuery,
    // parseQuery:(jsonQuery)=>jsonQuery,
	h5: {
        paramsToQuery: true, vueRouterDev: false,
        vueNext: false, mode: 'history', base: '/',
        linkActiveClass: 'router-link-active',
        linkExactActiveClass: 'router-link-exact-active',
        scrollBehavior: (to, from, savedPostion) => ({ x: 0, y: 0 }),
        fallback: true, rewriteFun: false,
    },
    // APP: {
    //     registerLoadingPage: true,  /* v2.0.6+ */
    //     loadingPageStyle: () => JSON.parse('{"backgroundColor":"#FFF"}'),
    //     loadingPageHook: (view) => { view.show(); },
    //     launchedHook: () => { plus.navigator.closeSplashscreen(); },
    //     animation: {}
    // },
    applet: { /* v2.0.6+ */ animationDuration: 300 },
    // beforeProxyHooks: { /* v2.0.8+ */ onLoad: ([options], next, router) => { next([parseQuery({query: options}, router)]) } },
	routes: [ ...ROUTES, { path: '*', redirect: (to) => { return { name: '404' } } } ]
})

/* 全局路由前置守卫 */
router.beforeEach((to, from, next) => { next() });

/* 全局路由后置守卫 */
router.afterEach((to, from) => { console.log('跳转结束') })

export { router, RouterMount }