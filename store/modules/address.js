import { defineStore } from 'pinia'
import { ref } from 'vue'

export const AddressStore = defineStore('cp-address', () => {
    const address = ref('')
    const name = ref('')
    const phone = ref('')
    const address_id = ref()

    const setAddress = (add, n, p, id) => {
        address.value = add
        name.value = n
        phone.value = p
        address_id.value = id
    }

    return {
        address,
        name,
        phone,
        address_id,
        setAddress
    }
})