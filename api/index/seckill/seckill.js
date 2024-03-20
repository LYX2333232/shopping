import request from "@/utils/request"

export const get_goods_list = () => request.get('/flash/flash_commodity')

export const get_goods_detail = (id) => request.get('/flash/flash_detail', { id })