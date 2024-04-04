import request from "@/utils/request";

export const new_order = (data) => request.post('/order/set_pay_order', data)

export const get_order = (page, type) => {
    const params = { page }
    if (type) params.type = type
    return request.get('/order/get_order', params)
}

export const repay_order = (id) => request.post('/order/update_pay_order', { id })

export const post_refund = (id, reason) => request.post('/order/order_refund', { id, reason })

export const post_receive = (id) => request.post('/order/receiving_goods', { id })