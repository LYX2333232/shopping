import request from "@/utils/request"

export const get_today_list = () => request.get('/teamwork/teamwork_commodity')

export const get_today_detail = (id) => request.get('/teamwork/teamwork_detail', { id })