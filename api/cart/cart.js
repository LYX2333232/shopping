import request from "@/utils/request";

export const addToCart = (c_id, cont) => request.post('/commodity/add_shopping_cart', { c_id, cont })

export const getCartList = (page) => request.get('/commodity/shopping_cart', { page })

export const delCart = (id) => request.post('/commodity/delete_shopping_cart', { id })