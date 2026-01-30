import StoreConfigs from '@/app/app.store.config';
import storage, { addCache, getCache, } from '@/providers/storage';
const cancers = {
	state: {
		pickerLabel: storage.get(StoreConfigs.cacheKeys.pickerLabel),
		cancerUser: storage.get(StoreConfigs.cacheKeys.cancerUser)
	},
	mutations: {
		SET_CANCER_USER: (state, info) => {
			state.cancerUser = info
			addCache(StoreConfigs.cacheKeys.cancerUser, info)
		},
		SET_pickerLabel: (state, info) => {
			state.pickerLabel = info
			addCache(StoreConfigs.cacheKeys.pickerLabel, info)
		},
	},
	actions: {

	}
}
export default cancers