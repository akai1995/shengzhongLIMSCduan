import storage from '@/utils/storage'
import constant from '@/utils/constant'
const tips = {
	state:{
		isTips: storage.get(constant.tips),
		
	},
	getters:{
		isTips:(state) => state.isTips,
		
	},
	mutations:{
		SET_TIPS:(state,isTips)=>{
			state.isTips = isTips
			storage.set(constant.tips, isTips)
		},
	
	}
}
export default tips