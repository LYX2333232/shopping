import request from '@/utils/request'

export const get_coupon_list = (page) => request.get('/coupon/list', { page })

export const receive_coupon = (id) => request.post('/coupon/receive', { id })

export const get_my_coupon = (page) => request.get('/coupon/my_coupon', { page })