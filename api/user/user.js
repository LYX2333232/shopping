import request from "@/utils/request"

export const Login = (data) => request.post('/auth/login', data)

export const uploadImage = (file) => request.post('/file/upload', { img: file })