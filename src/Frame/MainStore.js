import store from "@/Store";
import {Base64} from 'js-base64'
export default {
  state: {
    currentTabIndex: 'home',              // 当前显示的 tab

    openedTabs: [                         // 当前打开的 tab 列表
      {
        title: '首页',                    //  tab 显示标题
        menuId: 'home',                   //  tab 内部名称(用来识别当前打开的tab)
        components: [{ path: 'home' }],   //  tab 对应的组件
      }
    ],
  },
  getters: {
    // 获取 当前显示的 tab name
    GetCurrentTabIndex (state) {
      return state.currentTabIndex
    },
    // 获取 当前打开的 tab 列表
    GetOpenedTabs (state) {
      return state.openedTabs
    },
    // 获取查询参数
    GetQuery (state) {
      let res = Object.create(null)
      state.openedTabs.map(i => {
        if(i.menuId === state.currentTabIndex) {
          let end = i.components.length - 1
          res =  i.components[end].query || {}
          return
        }
      })
      return res
    }
  },
  mutations: {
    // 设置 hash
    SetHash (state) {
      let cur = state.openedTabs.find(i => i.menuId === state.currentTabIndex)
      location.hash = '#' +  Base64.encode(JSON.stringify(cur))
	    // location.hash = '#' +  JSON.stringify(cur)
    },
    // 回显 tab
    reShowHash (state) {
	      let url = location.href
	      let indexOfSharp = url.indexOf('#')
	      let hash = url.substr(indexOfSharp + 1)
	      let tab = JSON.parse(Base64.decode(hash))
	      // let tab = JSON.parse(hash)
        if(tab.menuId === 'home') {
	        state.openedTabs = state.openedTabs.filter(i => i.menuId !== 'home')
        }
	      state.openedTabs.push(tab)
	      state.currentTabIndex = tab.menuId
    },
    // 设置 当前显示的 tab name
    SetCurrentTabIndex (state,data) {
      state.currentTabIndex = data
	    store.commit('SetHash')
    },
    // 添加 tab 到 tab 列表
    OpenedTabsPush (state,item) {
      // 设置当前要显示的 tab name
      state.currentTabIndex =  item.menuId

      // 判断 tab 项是否已存在
      let tabExsit = state.openedTabs.find(i => i.menuId === item.menuId)
      if (!tabExsit) {
        state.openedTabs.push({
          title: item.title,                      // 显示标题
          menuId: item.menuId,                    // 用于标记当前打开 tab 的 name
          components: [{path: item.component}],   //  tab 对应的组件
        })
      }

      if(!item.fromHash) store.commit('SetHash')
    },
    // 当前 tab 内部的跳转
    OpenedSubTabsPush (state,item) {
      state.openedTabs.map(i => {
        if(i.menuId === state.currentTabIndex) {
          i.components.push(item)
        }
      })
	    store.commit('SetHash')
    },
    // 返回
    OpenedSubTabsBack (state,num = 0) {
      if (num < 1) num = 1
      let end = state.openedTabs.length - num
      state.openedTabs.map(i => {
        if(i.menuId === state.currentTabIndex && end > 0) {
          i.components = i.components.slice(0,end)
        }
      })
	    store.commit('SetHash')
    },
    // 替换当前组件
    OpenedSubTabsReplace (state,item) {
      let index = state.openedTabs.length - 2
      state.openedTabs.map(i => {
        if(i.menuId === state.currentTabIndex) {
         i.components.splice(index,1,item)
        }
      })
	    store.commit('SetHash')
    },
    // 从 tab 列表 移除 tab
    OpenedTabsRemove (state,menuId) {
      state.openedTabs = state.openedTabs.filter(item => {
        return item.menuId === 'home' || item.menuId !== menuId
      })

      // 查询当前标签是否被关闭，如果被关闭，则打开主页标签
      let tab =  state.openedTabs.find(item => item.menuId === menuId)
      if(!tab)   state.currentTabIndex = 'home'

      store.commit('SetHash')
    },
    // 关闭 其他的 tab
    CloseOthersTabs (state) {
      state.openedTabs = state.openedTabs.filter(item => {
        return item.menuId === 'home' || item.menuId === state.currentTabIndex
      })
      store.commit('SetHash')
    },
    // 关闭所有 tab
    CloseAllTabs (state) {
      state.openedTabs.length = 1
      state.currentTabIndex = 'home'
      store.commit('SetHash')
    },
  },
  actions: {

  },
}