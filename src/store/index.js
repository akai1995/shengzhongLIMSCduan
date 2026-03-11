import Vue from 'vue'
import Vuex from 'vuex'
import getters from '@/store/getters'
import cancers from '@/store/modules/cancers'
import dict from '@/store/modules/dict'
import equipment from '@/store/modules/equipment'
import user from '@/store/modules/user'

Vue.use(Vuex)
const store = new Vuex.Store({
  modules: { cancers, dict, equipment, user },
  getters
})

export default store
