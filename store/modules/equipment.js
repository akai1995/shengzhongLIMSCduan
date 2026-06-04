const equipment = {
	state:{
		platform: '', deviceId: '',
		writeCharaterId: '',    
		writeServiceId: '',
		notifyCharaterId: '',
		notifyServiceId: '',
		readCharaterId: '',
		readServiceId: '',
	},
	getters:{
		getPlatform:(state) => state.platform,
		getDeviceId:(state) => state.deviceId,
		getWriteCharaterId:(state) => state.writeCharaterId,
		getWriteServiceId:(state) => state.writeServiceId,
		getNotifyCharaterId:(state) => state.notifyCharaterId,
		getNotifyServiceId:(state) => state.notifyServiceId,
		getReadCharaterId:(state) => state.readCharaterId,
		getReadServiceId:(state) => state.readServiceId
	},
	mutations:{
		SET_PLATFORM:(state,platform)=>{
			state.platform = platform
		},
		SET_DEVICEID:(state,deviceId)=>{
			state.deviceId = deviceId
		},
		SET_WRITECHARATERID:(state,writeCharaterId)=>{
			state.writeCharaterId = writeCharaterId
		},
		SET_WRITESERVICEID:(state,writeServiceId)=>{
			state.writeServiceId = writeServiceId
		},
		SET_NOTIFYCHARATERID:(state,notifyCharaterId)=>{
			state.notifyCharaterId = notifyCharaterId
		},
		SET_NOTIFYSERVICEID:(state,notifyServiceId)=>{
			state.notifyServiceId = notifyServiceId
		},
		SET_READCHARATERID:(state,readCharaterId)=>{
			state.readCharaterId = readCharaterId
		},
		SET_READSERVICEID:(state,readServiceId)=>{
			state.readServiceId = readServiceId
		},
	}
}
export default equipment