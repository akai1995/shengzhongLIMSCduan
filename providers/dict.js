import { getDictByType } from '@/app/api/dict'
import store from '@/store'
import Vue from 'vue'

function dictByKey(dict, key) {
  if (key == null && key == '') { return null }
  try { for (let i = 0; i < dict.length; i++) { if (dict[i].key == key) { return dict[i].value } } } catch (e) { return null }
}

const install = () => {
  Vue.use({ install(Vue, options) { Vue.prototype.$dict = { /* 这里可以添加字典相关的方法 */ } } }, 
  {
    metas: {
      '*': {
        labelField: 'dictLabel', valueField: 'dictValue',
        request(dictMeta) {
          const storeDict = dictByKey(store.getters.dict, dictMeta.type)
          if (storeDict) {
            return new Promise(resolve => { resolve(storeDict) })
          } else {
            return new Promise((resolve, reject) => { getDictByType(dictMeta.type).then(res => { store.dispatch('dict/setDict', { key: dictMeta.type, value: res.data }); resolve(res.data) }).catch(error => { reject(error) }) })
          }
        },
      },
    },
  })
}

export default { install }
