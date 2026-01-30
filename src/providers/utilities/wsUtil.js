class wsUtil {
	is_open_socket = false; /* 避免重复连接 */
	url = ''; /* 地址 */
	data = null;
	timeout = 0; /* 多少秒执行检测 */
	heartbeatInterval = 0; /* 检测服务器端是否还活着 */
	reconnectTimeOut = 0; /* 重连之后多久再次重连 */
	socketTask = null;

	/**
	 *  构造函数
	 * @param url  地址
	 * @param time  多少秒执行检测
	 */
	constructor(url, time) {
		this.is_open_socket = false; /* 避免重复连接 */
		this.url = url; /* 地址 */
		this.data = null;
		/* 心跳检测 */
		this.timeout = time; /* 多少秒执行检测 */
		this.heartbeatInterval = 0; /* 检测服务器端是否还活着 */
		this.reconnectTimeOut = 0; /* 重连之后多久再次重连 */
		try {
			this.connectSocketInit();
		} catch (e) {
			console.log('catch');
			this.is_open_socket = false;
			this.reconnect();
		}
	}

	/* 进入这个页面的时候创建websocket连接【整个页面随时使用】 */
	connectSocketInit() {
		console.log(this.url, 'this.url');
		this.socketTask = uni.connectSocket({
			url: this.url,
			success: () => {
				console.log('正准备建立websocket中...');
				/* 返回实例 */
				return this.socketTask;
			}
		});
		console.log('this.socketTask:',this.socketTask);
		this.socketTask.onOpen((res) => {
			console.log('WebSocket连接正常！');
			clearTimeout(this.reconnectTimeOut);
			clearTimeout(this.heartbeatInterval);
			this.is_open_socket = true;
			/* this.start(); */
			/* 注：只有连接正常打开中 ，才能正常收到消息 */
			this.socketTask?.onMessage((res) => {
				if (res.data === 'SUCCESS') {
					console.log('收到websocket响应：', res.data);
					return;
				}
				let data = '';
				try {
					data = JSON.parse(res.data);
				} catch (error) {
					console.log('websocket JSON.parse回来的数据异常，推送原始数据');
					data = res.data;
				}
				uni.$emit('socketMessage', data);
				this.data = data;
			});
			uni.$emit('socketConnectSuccess', 'WebSocket连接正常！');
		});
		/* 监听连接失败，这里代码我注释掉的原因是因为如果服务器关闭后，和下面的onclose方法一起发起重连操作，这样会导致重复连接 */
		// uni.onSocketError((res) => {
		// 	console.log('WebSocket连接打开失败，请检查！');
		// 	this.is_open_socket = false;
		// 	this.reconnect();
		// });
		/* 这里仅是事件监听【如果socket关闭了会执行】*/
		this.socketTask.onClose(() => {
			console.log('已经被关闭了');
			this.is_open_socket = false;
			this.reconnect();
		});
		return this.socketTask;
	}

	/* 发送消息 */
	send(value) {
		/* 注：只有连接正常打开中 ，才能正常成功发送消息 */
		this.socketTask?.send({
			data: value,
			async success() {
				/* console.log('消息发送成功', JSON.parse(value)); */
			}
		});
	}

	/* 开启心跳检测 */
	// start() {
	//   let that = this;
	//   function sendHeartbeat() {
	//     let data = { type: 'ping' };
	//     console.log(data);
	//     that.send(JSON.stringify(data));

	//     /* 在发送完心跳后，再次设置超时以在指定时间间隔后再次发送心跳 */
	//     that.heartbeatInterval = setTimeout(sendHeartbeat, that.timeout, that);
	//   }

	//   /* 首次启动心跳发送 */
	//   this.heartbeatInterval = setTimeout(sendHeartbeat, this.timeout, this);
	// }
	/* 重新连接 */
	reconnect() {
		/* 停止发送心跳 */
		clearInterval(this.heartbeatInterval);
		/* 如果不是人为关闭的话，进行重连 */
		// if (!this.is_open_socket) {
		this.reconnectTimeOut = setTimeout(() => {
			this.connectSocketInit();
		}, 1000);
		// }
	}
	// /* 外部获取消息 */
	// getMessage(callback = () => {}) { this.socketTask?.onMessage((res) => { return callback(res) }) }
}

export default wsUtil;
