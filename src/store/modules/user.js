import api from '@/api'
import { loginIn } from '@/api/login'
import { ElMessage } from 'element-plus'
const state = () => ({
    account: localStorage.account || '',
    token: localStorage.token || '',
    failure_time: localStorage.failure_time || '',
    permissions: localStorage.permissions || []
})

const getters = {
    isLogin: state => {
        let retn = false
        if (state.token) {
            let unix = Date.parse(new Date())
            if (unix < state.failure_time * 1000) {
                retn = true
            }
        }
        return retn
    }
}

const actions = {
    login({ commit }, data) {
        return new Promise((resolve, reject) => {
            // 通过 mock 进行登录
            loginIn(data).then(res => {
                if (res.code === 200) {
                    let data = {
                        account: res.data.name,
                        token: res.data.authInfo.accessToken,
                        permissions: res.data.roles,
                        failure_time: Date.parse(new Date()) / 1000 + 24 * 60 * 60
                    }
                    console.log('data', data)
                    commit('setUserData', data)
                    resolve()
                } else {
                    ElMessage({
                        message: res.msg,
                        type: 'error'
                    })
                    commit('setUserData', res.data)
                    resolve()
                }
            }).catch(error => {
                reject(error)
            })
            // api.post('member/login', data, {
            //     baseURL: '/mock/'
            // }).then(res => {
            //     commit('setUserData', res.data)
            //     resolve()
            // }).catch(error => {
            //     reject(error)
            // })
        })
    },
    logout({ commit }) {
        commit('removeUserData')
        commit('menu/invalidRoutes', null, { root: true })
        commit('tabbar/clean', null, { root: true })
        commit('menu/removeRoutes', null, { root: true })
    },
    // 获取我的权限
    getPermissions({ state, commit }) {
        return new Promise(resolve => {
            // 通过 mock 获取权限
            // console.log(state)
            if (typeof state.permissions === 'string') {
                let per = []
                per.push(state.permissions)
                console.log(per)
                commit('setPermissions', per)
                resolve(state.permissions)
            } else {
                commit('setPermissions', state.permissions)
                resolve(state.permissions)
            }
        })
    }
}

const mutations = {
    setUserData(state, data) {
        localStorage.setItem('account', data.account)
        localStorage.setItem('token', data.token)
        localStorage.setItem('failure_time', data.failure_time)
        localStorage.setItem('permissions', data.permissions)
        state.account = data.account
        state.token = data.token
        state.failure_time = data.failure_time
        state.permissions = data.permissions
    },
    removeUserData(state) {
        localStorage.removeItem('account')
        localStorage.removeItem('token')
        localStorage.removeItem('failure_time')
        localStorage.removeItem('permissions')
        state.account = ''
        state.token = ''
        state.failure_time = ''
        state.permissions = ''
    },
    setPermissions(state, permissions) {
        state.permissions = permissions
    }
}

export default {
    namespaced: true,
    state,
    actions,
    getters,
    mutations
}
