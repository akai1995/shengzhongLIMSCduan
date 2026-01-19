# Lyn4ever-gaodeRoutePlanning

## 一、说明
- 本插件的原理是利用高德地图API进行路线规划，然后利用官方的map组件进行展示。
- 本插件的key不需要配置密钥，如果你觉得需要配置密钥才显示，那就是其他问题。
- 官方map组件支持的平台，本插件完全支持，但除小程序外的其他平台，需要再manifest.json中进行配置，uniapp官方文档已经很清楚了，请自行查阅文档。
- 请原谅，非本插件问题（如：是小程序平台使用地图的问题），本人一律不予回复。
- 如有其他疑问，请发邮件或者评论，私信不一定能看到，谢谢理解。

## 二、高德KEY申请
<p style="color:red;font-weight:bolder">注意：本项目中使用的是高德地图微信小程序Key，是支持所有平台运行的，但其他平台需要单独配置，具体查看下文[各平台适配](#各平台适配)。</p>

### 2.1 官方文档

[https://lbs.amap.com/api/wx/summary/](https://lbs.amap.com/api/wx/summary/)或[https://developer.amap.com/api/wx/summary/](https://developer.amap.com/api/wx/summary/)
### 2.2 步骤


1. 填写应用信息
![](https://img.jhacker.cn/img/202306071329705.png)
2. 添加微信小程序Key
![](https://img.jhacker.cn/img/202306071332556.png)

## 三、使用步骤
### 3.1 从插件市场导入uni_modules
### 3.2 申请并配置自己的key
修改```/uni_modules/Lyn4ever-gaodeRoutePlanning\bin\config.js```文件中的key为自己的
### 3.3 在页面中引入组件并传参数
```html
<Lyn4ever-gaodeRoutePlanning 
		:longitude="longitude" 
		:latitude="latitude" 
		width="100vw" 
		heith="100vh"
		:Config="Config" 
		:startPoi="startPoi" 
		:wayPoi="wayPoi" 
		:endPoi="endPoi"/>
```
### 3.4 参数说明
| 参数名	|说明		|必填		|格式	| 默认	| 示例				|
|--			|--			|--			|--		|--		|--					|
|longitude	|中心点经度	|否			|Number	|为空时取自startPoi|108.921672			|
|latitude	|中心点纬度	|否			|Number	|为空时取自startPoi|34.250646
|width		|地图组件宽度			|否	|String	|100vw	|750rpx															|
|heith		|地图组件高度			|否	|String	|100vh	|100rpx															|
|Config		|地图上的点和路线配置	|否	|Object	|见下文	|见下文																|
|startPoi	|起始点坐标				|是	|String	|--		|108.921672,34.250646											|
|wayPoi		|途径点坐标				|否	|String	|--		|108.936799,34.245842;108.973306,34.244767;109.013335,34.249303	|
|endPoi		|终点坐标				|是	|String	|--		|109.033673,34.252884											|

- Config 配置详解
| 参数名	|说明						|必填	|格式	| 默认	|说明							|
|--			|--							|--		|--		|--		| --							|
|showMarks	|是否显示地图上的Marker点	|否		|Boolean|true	| --							|
|lineColor	|路径颜色					|否		|String	|#0606ff|颜色值							|
|lineWidth	|路径宽度					|否		|String	|4		|px单位							|
|startImage	|起点图片					|否		|String	|见页面	| 绝对路径/相对路径/base64/url	|
|wayImage	|途径点图片					|否		|Object	|见页面	|绝对路径/相对路径/base64/url	|
|endImage	|终点图片					|否		|String	|见页面	|绝对路径/相对路径/base64/url	|


## 四、各平台适配
> 各平台的适配能力主要取决于uniapp官方map组件，具体差异请参考[uniapp-组件-地图-map](https://uniapp.dcloud.net.cn/component/map.html#)

|App|H5	|微信小程序	|支付宝小程序	|百度小程序	|字节跳动小程序、飞书小程序	|QQ小程序	|快应用	|360小程序	|快手小程序	|京东小程序	|
|:-:|:-:|:-:		|:-:			|:-:		|:-:						|:-:		|:-:	|:-:		|:-:		|:-:		|
|需要配置manifest.json	|需要配置manifest.json	|√			|√				|√			|1.63+						|1.9.0+		|√		|x			|√			|√			|

- 小程序
	* 各家小程序平台一般都内置了地图SDK,无需单独配置，可直接使用
	* 小程序平台，请注意配置域名白名单 ```(https://restapi.amap.com) ```
- App
	* 需要配置manifest.json并配置对应的key(注意，这里的key与本项目无关，具体方法参看[App端地图模块配置](https://uniapp.dcloud.net.cn/tutorial/app-maps.html#))
	* 2021年起，使用uniapp开发的App。高德、百度、腾讯等地图服务商开始商业授权,具体参看[App地图商业授权相关说明](https://uniapp.dcloud.net.cn/tutorial/app-geolocation.html#lic)。
- H5
	* 在uniapp的H5中，要想使用地图，同时也需要配置对应的key(注意，这里的key并非本项目的key,具体方法请参见[H5中地图sdk配置](https://uniapp.dcloud.net.cn/collocation/manifest.html#h5sdkconfig))

## 四、相关问题
- [system] Map key not configured.
	* 这是由于你在使用h5进行调试的时候，没有在manifest.json中配置高德地图的key,请参考上文解决。与本项目无关
- 提示需要密钥与key搭配使用
	* 应该是你配置的问题，本插件的目前不需要密钥。因此这问题非本插件问题，不予回复（我猜应该是你在h5平台使用的吧，请自行查阅官方文档）。 