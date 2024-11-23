import { defineStore } from 'pinia'
import { ref } from 'vue'
import { get_default_address } from '@/api/address/address'

export const AddressStore = defineStore('cp-address', () => {
    const address = ref('')
    const name = ref('')
    const phone = ref('')
    const id = ref()

    const setAddress = (add, n, p, i) => {
        address.value = add
        name.value = n
        phone.value = p
        id.value = i
    }
    const getDefaultAddress = () => {
        // 获取默认地址
        get_default_address().then(res => {
            if (res.code === 200) {
                setAddress(res.data.address_name + res.data.detail, res.data.name, res.data.phone, res.data.id)
            }
        })
    }
    getDefaultAddress()

    return {
        address,
        name,
        phone,
        id,
        setAddress
    }
})