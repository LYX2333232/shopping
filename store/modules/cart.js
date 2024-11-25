import { defineStore } from 'pinia'
import { ref } from 'vue'
import { get_cart_number } from '@/api/cart/cart'

export const CartStore = defineStore('cp-cart', () => {
    const cart = ref(0)

    const update = () => {
        get_cart_number().then(res => {
            cart.value = res.data
        })
    }
    // 如果登陆过，自动获取
    if (uni.getStorageSync('userInfo'))
        update()

    return {
        cart,
        update
    }
})