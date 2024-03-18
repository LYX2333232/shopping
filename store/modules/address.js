import { defineStore } from 'pinia'
import { ref } from 'vue'

export const AddressStore = defineStore('cp-address', () => {
    const address = ref('')
    const address_id = ref()

    const setAddress = (add, id) => {
        address.value = add
        address_id.value = id
    }

    return {
        address,
        address_id,
        setAddress
    }
})