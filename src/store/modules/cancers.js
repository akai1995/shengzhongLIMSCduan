import storage from '@/providers/utilities/storage'
import AppConfig from '@/app/app.constant'
const cancers = {
	state: {
		pickerLabel: storage.get(AppConfig.vuex.pickerLabel),
		cancerUser: storage.get(AppConfig.vuex.cancerUser)
	},
	getters: {
		cancerUser: (state) => state.cancerUser,
		pickerLabel: (state) => state.pickerLabel,
	},
	mutations: {
		SET_CANCER_USER: (state, info) => {
			state.cancerUser = info
			storage.set(AppConfig.vuex.cancerUser, info)
		},
		SET_pickerLabel: (state, info) => {
			state.pickerLabel = info
			storage.set(AppConfig.vuex.pickerLabel, info)
		},
	},
	actions: {

	}
}
export default cancers