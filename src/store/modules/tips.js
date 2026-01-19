import storage from '@/providers/utilities/storage'
import constant from '@/app/app.constant'
const tips = {
	state:{
		isTips: storage.get(constant.vuex.tips),
		
	},
	getters:{
		isTips:(state) => state.isTips,
		
	},
	mutations:{
		SET_TIPS:(state,isTips)=>{
			state.isTips = isTips
			storage.set(constant.vuex.tips, isTips)
		},
	
	}
}
export default tips