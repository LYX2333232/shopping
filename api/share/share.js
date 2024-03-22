import request from '@/utils/request'

export const get_share = () => request.get('/share/qrcode')