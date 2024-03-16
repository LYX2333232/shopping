import request from "@/utils/request";

export const add_address = (data) => request.post('/address/add_address', data)

export const get_address_list = (page) => request.get('/address/get_address', { page })

export const get_default_address = () => request.get('/address/default_address')

export const get_address_detail = (id) => request.get('/address/address_detail', { id })

export const delete_address = (id) => request.post('/address/delete_address', { id })