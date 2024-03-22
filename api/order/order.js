import request from "@/utils/request";

export const new_order = (data) => request.post('/order/set_pay_order', data)

export const get_order = (page, type, search) => {
    const params = { page, search }
    if (type) params.type = type
    return request.get('/order/get_order', params)
}