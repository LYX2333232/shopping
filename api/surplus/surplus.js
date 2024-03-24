import request from '@/utils/request'

export const get_balance = () => request.get('/user/balance')

export const get_record = () => request.get('/user/withdrawal_history')