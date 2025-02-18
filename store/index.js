import Vue from 'vue'
import Vuex from 'vuex'
import user from '@/store/modules/user'
import equipment from '@/store/modules/equipment'
import getters from './getters'
import tips from '@/store/modules/tips.js'
import doctor from './modules/doctor'
import cancers from './modules/cancers'
import dict from './modules/dict'
Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    user,
	equipment,
	tips,
	cancers,
	dict
  },
  getters
})

export default store
