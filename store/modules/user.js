import { defineStore } from 'pinia'
import { ref } from 'vue'

export const UserStore = defineStore('cp-user', () => {

    const auth = ref(uni.getStorageSync('auth') ?? '')
    const userInfo = ref(uni.getStorageSync('userInfo') ?? '')

    const login = () => {
        uni.login({
            complete(e) {
                request.post('/auth/query_login', {
                    code: e.code
                }).then(res => {
                    if (res.code == 200 && res.data !== 0) {
                        set_user_info(res.data)
                    }
                })
            }
        })
    }

    const set_user_info = (e) => {
        userInfo.value = e.userInfo
        uni.setStorageSync('userInfo', e.userInfo)
        auth.value = e.auth
        uni.setStorageSync('auth', e.auth)
    }

    return {
        auth,
        userInfo,
        set_user_info,
        login
    }
})