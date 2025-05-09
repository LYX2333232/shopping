import request from "@/utils/request"

export const add_to_cart = (data) =>
  request.post("/commodity/add_shopping_cart", data)

export const get_cart_list = (page) =>
  request.get("/commodity/shopping_cart", { page })

export const del_cart = (id) =>
  request.post("/commodity/delete_shopping_cart", {
    keys: Array.isArray(id) ? id : [id],
  })

export const get_coupon = (ids) => request.post("/coupon/available", { ids })

export const get_cart_number = () =>
  request.get("/commodity/query_shopping_cart_cont")
