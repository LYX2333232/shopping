import request from "@/utils/request";

export const add_to_cart = (c_id, cont) => request.post('/commodity/add_shopping_cart', { c_id, cont })

export const get_cart_list = (page) => request.get('/commodity/shopping_cart', { page })

export const del_cart = (id) => request.post('/commodity/delete_shopping_cart', { keys: [id] })

export const get_coupon = (ids) => request.post('/coupon/available', { ids })