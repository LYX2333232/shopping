import request from "@/utils/request";

export const new_order = (data) => request.post('/order/set_pay_order', data)

export const get_order = (page, type) => {
    const params = { page }
    if (type >= 0) params.type = type
    return request.get('/order/get_order', params)
}

export const repay_order = (id) => request.post('/order/update_pay_order', { id })

export const post_refund = (id, reason) => request.post('/order/order_refund', { id, reason })

export const post_receive = (id) => request.post('/order/receiving_goods', { id })

export const close_teamwork = (activity_id) => request.post('/teamwork/close_teamwork', { activity_id })

export const get_order_count = () => request.get('/order/order_count')