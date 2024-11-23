import request from "@/utils/request"

export const get_time_list = () => request.get('/flash/flash_time')

export const get_goods_list = (id) => request.get('/flash/flash_commodity', { id })

export const get_goods_detail = (id) => request.get('/flash/flash_detail', id)