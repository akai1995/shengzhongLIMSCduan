import storage from '@/providers/utilities/storage'
import constant from '@/providers/constant'
const cancers = {
	state: {
		pickerLabel: storage.get(constant.pickerLabel),
		cancerUser: storage.get(constant.cancerUser)
	},
	getters: {
		cancerUser: (state) => state.cancerUser,
		pickerLabel: (state) => state.pickerLabel,
	},
	mutations: {
		SET_CANCER_USER: (state, info) => {
			state.cancerUser = info
			storage.set(constant.cancerUser, info)
		},
		SET_pickerLabel: (state, info) => {
			state.pickerLabel = info
			storage.set(constant.pickerLabel, info)
		},
	},
	actions: {

	}
}
export default cancers