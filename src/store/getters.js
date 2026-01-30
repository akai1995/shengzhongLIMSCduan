const getters = {
    cancerUser: (state) => state.cancers.cancerUser,
    pickerLabel: (state) => state.cancers.pickerLabel,
	dict: state => state.dict.dict,
	phoneType: (state) => state.user.phoneType,
	wxRegisterParams: (state) => state.user.wxRegisterParams,
	currentUser: (state) => state.user.currentUser,
	currentDoctor: (state) => state.user.currentDoctor,
	socket: (state) => state.user.socket,
	token: state => state.user.token,
}
export default getters