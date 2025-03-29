import { defineStore } from "pinia"
import { ref } from "vue"
import { get_default_address } from "@/api/address/address"

export const AddressStore = defineStore("cp-address", () => {
  const address = ref("")
  const name = ref("")
  const phone = ref("")
  const id = ref()
  const is_same = ref(0)

  const setAddress = (add) => {
    address.value = add
  }
  const getDefaultAddress = () => {
    // 获取默认地址
    get_default_address().then((res) => {
      if (res.code === 200) {
        setAddress(res.data)
      }
    })
  }
  getDefaultAddress()

  return {
    address,
    name,
    phone,
    id,
    is_same,
    setAddress,
  }
})
