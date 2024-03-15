import request from "@/utils/request";

export const get_type_list = () => request.get('/commodity/commodity_type_list')

export const get_goods_list = (data) => request.get('/commodity/list', data)

export const get_goods_detail = (data) => request.get('/commodity/detail', data)

export const setFavorite = (id, set) => request.post('/commodity/collection', { id, set })

export const addToCart = (c_id, cont) => request.post('/commodity/add_shopping_cart', { c_id, cont })

export const getCartList = () => request.get('/commodity/shopping_cart')

export const delCart = (id) => request.post('/commodity/delete_shopping_cart', { id })