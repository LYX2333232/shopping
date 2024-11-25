import { createPinia } from 'pinia'




const pinia = createPinia()
export * from './modules/user'
export * from './modules/address'
export * from './modules/cart'

export default pinia