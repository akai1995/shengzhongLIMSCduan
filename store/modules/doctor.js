const doctor = {
	state: {
		doctorInfo: {}
	},
	getters: {
		doctorInfo: (state) => state.doctorInfo,
	},
	mutations: {
		SET_DOCTOR_INFO: (state, info) => {
			console.log(info);
			state.doctorInfo = info
		}
	},
	actions: {

	}
}
export default doctor