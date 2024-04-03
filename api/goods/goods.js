import request from "@/utils/request";

export const get_type_list = (t_id) => {
    const data = {}
    if (t_id) data.t_id = t_id
    return request.get('/commodity/commodity_type_list', data)
}

export const get_goods_list = (data) => request.get('/commodity/list', data)

export const get_goods_detail = (data) => request.get('/commodity/detail', data)

export const set_favorite = (c_id) => request.post('/commodity/collection', { c_id })

export const get_evaluation_list = (c_id, page) => request.get('/commodity/evaluate', { c_id, page })

export const get_favorite_list = () => request.get('/commodity/commodity_collection',)