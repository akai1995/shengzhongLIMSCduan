import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import cancers from './modules/cancers'
import dict from './modules/dict'
import doctor from './modules/doctor'
import equipment from '@/store/modules/equipment'
import tips from '@/store/modules/tips'
import user from '@/store/modules/user'

Vue.use(Vuex)
const store = new Vuex.Store({
  modules: {
    cancers, dict,
    equipment,
    tips, user,
  },
  getters
})

export default store
