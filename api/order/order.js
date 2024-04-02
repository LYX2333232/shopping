import request from "@/utils/request";

export const new_order = (data) => request.post('/order/set_pay_order', data)

export const get_order = (page, type) => {
    const params = { page }
    if (type) params.type = type
    return request.get('/order/get_order', params)
}

export const repay_order = (id) => request.post('/order/update_pay_order', { id })