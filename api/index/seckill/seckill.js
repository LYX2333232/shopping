import request from "@/utils/request"

export const get_goods_list = (page) => request.get('/flash/flash_commodity', page)

export const get_goods_detail = (id) => request.get('/flash/flash_detail', { id })