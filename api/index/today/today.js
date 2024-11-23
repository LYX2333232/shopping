import request from "@/utils/request"

export const get_today_list = (page) => request.get('/teamwork/teamwork_commodity', { page })

export const get_today_detail = (data) => request.get('/teamwork/teamwork_detail', data)