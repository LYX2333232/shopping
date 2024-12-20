import request from "@/utils/request";
import { formItemValidateStates } from "../../uni_modules/tuniaoui-vue3";

export const new_order = (data, setParams = false) => {
	if (setParams) {
		return request.post_by_params('/order/new_order', data)
	}
	return request.post('/order/set_pay_order', data)
}

export const get_order = (page, type) => {
	const params = {
		page
	}
	if (type >= 0) params.type = type
	return request.get('/order/get_order', params)
}

export const repay_order = (id) => request.post('/order/update_pay_order', {
	id
})

export const post_refund = (id, reason) => request.post('/order/order_refund', {
	id,
	reason
})

export const post_receive = (id) => request.post('/order/receiving_goods', {
	id
})

export const close_teamwork = (activity_id) => request.post('/teamwork/close_teamwork', {
	activity_id
})

export const get_order_count = () => request.get('/order/order_count')

// 获取运费和商品价格
export const get_order_price = (data) => request.post('/order/price_inquiry', data)

export const post_delete_order = (id) => request.post('/order/delete_order', {
	id
})

export const get_order_detail = (id) => request.get('/order/detail', { id })

// 获取退款协议
export const get_refund_agreement = origin_id => request.get('/order/order_redund_price', { origin_id })