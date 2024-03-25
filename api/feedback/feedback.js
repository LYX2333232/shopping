import request from "@/utils/request"

export const post_feedback = (data) => request.post('/feedback/set_feedback', data)