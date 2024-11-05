import request from "@/utils/request"

export const get_home = () => request.get('/home/get_home')

export const get_commodity = (data) => request.post('/home/get_commodity', data)