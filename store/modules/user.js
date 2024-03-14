import { defineStore } from 'pinia'
import { ref } from 'vue'
import request from '@/utils/request'

export const UserStore = defineStore('cp-user', () => {

    const auth = ref(uni.getStorageSync('autrh') ?? '')
    const userInfo = ref(uni.getStorageSync('userInfo') ?? '')

    const login = () => {
        uni.login({
            complete: (e) => {
                request.post('/login', {
                    code: e.code
                }).then(res => {
                    console.log(res)
                })
            }
        })
    }

    const set_user_info = (e) => {
        userInfo.value = e.user_info
        uni.setStorageSync('userInfo', e.user_info)
        auth.value = e.auth
        uni.setStorageSync('auth', e.auth)
    }

    return {
        auth,
        userInfo,
        login,
        set_user_info
    }
})