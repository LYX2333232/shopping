import request from "@/utils/request";

export const get_type_list = () => request.get('/commodity/commodity_type_list')

export const get_goods_list = (data) => request.get('/commodity/list', data)

export const get_goods_detail = (data) => request.get('/commodity/detail', data)

export const setFavorite = (id, set) => request.post('/commodity/collection', { id, set })

export const get_evaluation_list = (c_id, page) => request.get('/commodity/evaluate', { c_id, page })