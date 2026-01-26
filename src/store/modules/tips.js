import storage from '@/providers/utilities/storage'
import AppConfig from '@/app/app.constant'
const tips = {
	state:{
		isTips: storage.get(AppConfig.vuex.tips),		
	},
	getters:{
		isTips:(state) => state.isTips,		
	},
	mutations:{
		SET_TIPS:(state,isTips)=>{
			state.isTips = isTips
			storage.set(AppConfig.vuex.tips, isTips)
		}	
	}
}
export default tips