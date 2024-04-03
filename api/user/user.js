import request from "@/utils/request"

export const Login = (data) => request.post('/auth/login', data)

export const uploadImage = (file) => request.post('/file/upload', { img: file })

export const get_up_list = () => request.get('/user/up_list')

export const add_us = (phone) => request.post('/user/set_distribution', { phone })