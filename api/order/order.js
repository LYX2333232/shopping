import request from "@/utils/request"
/**
 * 创建订单
 * @param {*} data  订单数据
 * @param {*} setParams 判断是否需要设置参数
 * @returns
 */
export const new_order = (data, setParams = false) => {
  if (setParams) {
    return request.post_by_params("/order/new_order", data)
  }
  return request.post("/order/set_pay_order", data)
}
/**
 * 获取订单列表
 * @param {*} page 页码
 * @param {*} type 订单类型
 * @returns
 */
export const get_order = (page, type) => {
  const params = {
    page,
  }
  if (type >= 0) params.type = type
  return request.get("/order/get_order", params)
}

/**
 * 重新支付订单
 * @param {*} id 订单id
 * @returns
 */
export const repay_order = (id) =>
  request.post("/order/update_pay_order", {
    id,
  })

/**
 * 退款
 * @param {*} id 订单id
 * @param {*} reason 退款原因
 * @returns
 */
export const post_refund = (id, reason) =>
  request.post("/order/order_refund", {
    id,
    reason,
  })

/**
 * 确认收货
 * @param {*} id 订单id
 * @returns
 */
export const post_receive = (id) =>
  request.post("/order/receiving_goods", {
    id,
  })

/**
 * 取消拼团
 * @param {*} activity_id  活动id
 * @returns
 */
export const close_teamwork = (activity_id) =>
  request.post("/teamwork/close_teamwork", {
    activity_id,
  })

/**
 * 获取订单数量
 * @returns
 */
export const get_order_count = () => request.get("/order/order_count")

// 获取运费和商品价格
export const get_order_price = (data) =>
  request.post("/order/price_inquiry", data)

/**
 * 删除订单
 * @param {*} id 订单id
 * @returns
 */
export const post_delete_order = (id) =>
  request.post("/order/delete_order", {
    id,
  })

export const get_order_detail = (id) => request.get("/order/detail", { id })

// 获取退款协议
export const get_refund_agreement = (origin_id) =>
  request.get("/order/order_redund_price", { origin_id })
